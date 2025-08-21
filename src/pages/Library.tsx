import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdWizardModal from "@/components/AdWizardModal";
import { Plus, Play, Download, RotateCcw, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";

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

const Library = () => {
  const [videoJobs, setVideoJobs] = useState<VideoJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const { toast } = useToast();

  const loadVideoJobs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('video_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading video jobs:', error);
        toast({
          title: "Error",
          description: "Failed to load videos. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setVideoJobs(data?.map(job => ({
        ...job,
        status: job.status as 'queued' | 'processing' | 'ready' | 'failed'
      })) || []);
    } catch (error) {
      console.error('Error in loadVideoJobs:', error);
      toast({
        title: "Error",
        description: "Failed to load videos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const checkPendingJobs = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-pending-jobs');
      
      if (error) {
        console.error('Error checking pending jobs:', error);
        return;
      }

      console.log('Checked pending jobs:', data);
      
      // Reload the list after checking
      await loadVideoJobs();
    } catch (error) {
      console.error('Error in checkPendingJobs:', error);
    }
  }, [loadVideoJobs]);

  // Load video jobs on component mount and check pending jobs
  useEffect(() => {
    const initializeLibrary = async () => {
      await checkPendingJobs();
      await loadVideoJobs();
    };
    
    initializeLibrary();
  }, [loadVideoJobs, checkPendingJobs]);

  // Auto-poll pending jobs every 5 seconds
  useEffect(() => {
    const hasPendingJobs = videoJobs.some(job => 
      job.status === 'queued' || job.status === 'processing'
    );

    if (!hasPendingJobs) return;

    const interval = setInterval(() => {
      checkPendingJobs();
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [videoJobs, checkPendingJobs]);

  // Retry failed job
  const retryJob = async (job: VideoJob) => {
    try {
      // Use the stored captions_payload for retry
      const captionsPayload = job.captions_payload || {
        script: "No script available",
        duration_sec: 30,
        aspect_ratio: "1:1"
      };
      
      const { data, error } = await supabase.functions.invoke('create-video-job', {
        body: {
          captionsPayload,
          title: job.title
        }
      });

      if (error) {
        // Try to get more detailed error from the response
        const errorMessage = data?.error || error.message || "Failed to retry video creation";
        throw new Error(errorMessage);
      }

      toast({
        title: "Retry started",
        description: "Your video is being recreated."
      });

      // Refresh the library
      await loadVideoJobs();
    } catch (error) {
      console.error('Retry error:', error);
      toast({
        title: "Retry failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'ready':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
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
        return 'outline'; // Using outline for success since there's no success variant
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Videos</h1>
            <div className="text-muted-foreground">Loading...</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-40 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Videos</h1>
            <p className="text-muted-foreground mt-1">
              {videoJobs.length} items
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={checkPendingJobs}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button 
              onClick={() => setIsWizardOpen(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Ad
            </Button>
          </div>
        </div>

        {videoJobs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first video using the Ad Wizard
            </p>
            <Button onClick={() => setIsWizardOpen(true)}>
              Create Ad
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {videoJobs.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  {job.status === 'ready' && job.video_url ? (
                    <video 
                      src={job.video_url} 
                      className="w-full h-full object-contain bg-black"
                      controls
                      preload="metadata"
                      poster={job.thumbnail_url}
                      style={{ minHeight: '300px' }}
                    />
                  ) : job.thumbnail_url ? (
                    <img 
                      src={job.thumbnail_url} 
                      alt={job.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-muted flex items-center justify-center">
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
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm line-clamp-2">{job.title}</h3>
                    <Badge variant={getStatusVariant(job.status)} className="ml-2 shrink-0">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(job.status)}
                        <span className="capitalize">{job.status}</span>
                      </div>
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mb-3">
                    Created {new Date(job.created_at).toLocaleDateString()}
                    {job.duration && (
                      <span className="ml-2">• {job.duration}s</span>
                    )}
                  </div>

                  {job.error_message && (
                    <div className="text-xs text-destructive mb-3 p-2 bg-destructive/10 rounded">
                      {job.error_message}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {job.status === 'ready' && job.video_url && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            if (job.video_url?.includes('mock-video') || job.video_url?.includes('example.com')) {
                              toast({
                                title: "Demo Video Ready",
                                description: "This is a demo video. In production, this would be your generated video."
                              });
                            } else {
                              window.open(job.video_url, '_blank');
                            }
                          }}
                          className="flex-1"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          {job.video_url?.includes('mock-video') || job.video_url?.includes('example.com') ? 'View Demo' : 'Play'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            if (job.video_url?.includes('mock-video') || job.video_url?.includes('example.com')) {
                              toast({
                                title: "Demo Mode",
                                description: "This is a demo. In production, the video would be downloaded."
                              });
                            } else {
                              const a = document.createElement('a');
                              a.href = job.video_url!;
                              a.download = `${job.title}.mp4`;
                              a.click();
                            }
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    
                    {job.status === 'failed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => retryJob(job)}
                        className="flex-1"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
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
                        <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        {job.status === 'queued' ? 'Queued' : 'Processing'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AdWizardModal 
        open={isWizardOpen} 
        onOpenChange={setIsWizardOpen} 
      />
    </div>
  );
};

export default Library;