import { useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Download, RefreshCw, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoJob {
  id: string;
  job_id: string;
  title: string;
  status: 'queued' | 'processing' | 'ready' | 'failed';
  video_url?: string;
  thumbnail_url?: string;
  duration?: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
  wizard_data: any;
  captions_payload?: any;
}

interface VideoCardProps {
  job: VideoJob;
  onRetry: (job: VideoJob) => void;
}

const VideoCard = ({ job, onRetry }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const handleDownload = async () => {
    if (!job.video_url) return;

    if (job.video_url.includes('mock-video') || job.video_url.includes('example.com')) {
      toast({
        title: "Demo Mode",
        description: "This is a demo. In production, the video would be downloaded."
      });
      return;
    }

    try {
      toast({
        title: "Downloading...",
        description: "Your video download is starting."
      });

      // Fetch the video as blob to ensure it downloads directly
      const response = await fetch(job.video_url);
      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Create download link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `${job.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up the blob URL
      URL.revokeObjectURL(url);

      toast({
        title: "Download complete",
        description: "Video has been downloaded successfully."
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Unable to download the video. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-3 w-3" />;
      case 'processing':
        return <RefreshCw className="h-3 w-3 animate-spin" />;
      case 'ready':
        return <CheckCircle className="h-3 w-3" />;
      case 'failed':
        return <XCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'queued':
        return 'secondary';
      case 'processing':
        return 'default';
      case 'ready':
        return 'outline';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="overflow-hidden h-fit">
      <CardHeader className="p-0">
        <div className="relative aspect-[9/16] bg-muted">
          {job.status === 'ready' && job.video_url ? (
            <>
              <video 
                ref={videoRef}
                src={job.video_url}
                className="w-full h-full object-cover"
                preload="metadata"
                poster={job.thumbnail_url}
                onEnded={handleVideoEnded}
                playsInline
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full w-12 h-12 p-0"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
              </div>
            </>
          ) : job.thumbnail_url ? (
            <img 
              src={job.thumbnail_url} 
              alt={job.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {job.status === 'processing' ? (
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <div className="text-muted-foreground text-center">
                  <div className="text-sm font-medium">{job.title}</div>
                  <div className="text-xs mt-1 capitalize">{job.status}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-sm line-clamp-1 flex-1">{job.title}</h3>
          <Badge variant={getStatusVariant(job.status)} className="ml-2 shrink-0 text-xs">
            <div className="flex items-center gap-1">
              {getStatusIcon(job.status)}
              <span className="capitalize">{job.status}</span>
            </div>
          </Badge>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {new Date(job.created_at).toLocaleDateString()}
          {job.duration && (
            <span className="ml-2">• {job.duration}s</span>
          )}
        </div>

        {job.error_message && (
          <div className="text-xs text-destructive p-2 bg-destructive/10 rounded">
            {job.error_message}
          </div>
        )}

        <div className="flex gap-2">
          {job.status === 'ready' && job.video_url && (
            <>
              <Button 
                size="sm" 
                onClick={togglePlay}
                className="flex-1"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-3 w-3 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    Play
                  </>
                )}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleDownload}
                className="px-2"
              >
                <Download className="h-3 w-3" />
              </Button>
            </>
          )}
          
          {job.status === 'failed' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onRetry(job)}
              className="flex-1"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}

          {(job.status === 'queued' || job.status === 'processing') && (
            <Button 
              size="sm" 
              variant="outline"
              disabled
              className="flex-1"
            >
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              {job.status === 'queued' ? 'Queued' : 'Processing'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;