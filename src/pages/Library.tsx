import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Play, RefreshCw, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [pollingJobs, setPollingJobs] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Load video jobs
  const loadVideoJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('video_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading video jobs:', error);
        toast({
          title: "Error loading library",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setVideoJobs(data?.map(job => ({
        ...job,
        status: job.status as 'queued' | 'processing' | 'ready' | 'failed'
      })) || []);
    } catch (error) {
      console.error('Error loading video jobs:', error);
      toast({
        title: "Error loading library",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Poll jobs that are in progress
  useEffect(() => {
    const activeJobs = videoJobs.filter(job => 
      job.status === 'queued' || job.status === 'processing'
    );

    if (activeJobs.length === 0) return;

    const interval = setInterval(async () => {
      for (const job of activeJobs) {
        if (pollingJobs.has(job.job_id)) continue;
        
        setPollingJobs(prev => new Set(prev).add(job.job_id));
        
        try {
          const response = await fetch(
            `https://wcrdnljoxscotvuxsczd.supabase.co/functions/v1/check-video-status?job_id=${job.job_id}`,
            {
              headers: {
                'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
              }
            }
          );

          if (response.ok) {
            const statusData = await response.json();
            
            setVideoJobs(prev => prev.map(j => 
              j.job_id === job.job_id 
                ? { 
                    ...j, 
                    status: statusData.status,
                    video_url: statusData.video_url,
                    thumbnail_url: statusData.thumbnail_url,
                    duration: statusData.duration,
                    error_message: statusData.error_message
                  }
                : j
            ));

            // If job is completed, show toast
            if (statusData.status === 'ready') {
              toast({
                title: "Video ready!",
                description: `${job.title} has finished rendering.`
              });
            } else if (statusData.status === 'failed') {
              toast({
                title: "Video failed",
                description: `${job.title} failed to render.`,
                variant: "destructive"
              });
            }
          }
        } catch (error) {
          console.error('Polling error:', error);
        } finally {
          setPollingJobs(prev => {
            const newSet = new Set(prev);
            newSet.delete(job.job_id);
            return newSet;
          });
        }
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [videoJobs, pollingJobs, toast]);

  // Load jobs on mount
  useEffect(() => {
    loadVideoJobs();
  }, []);

  // Retry failed job
  const retryJob = async (job: VideoJob) => {
    try {
      // Extract script from the stored captions_payload
      const script = job.captions_payload?.script || "No script available";
      
      const { data, error } = await supabase.functions.invoke('create-video-job', {
        body: {
          wizardData: job.wizard_data,
          script: script,
          title: job.title
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Retry started",
        description: "Your video is being recreated."
      });

      // Refresh the library
      loadVideoJobs();
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Videos</h1>
          <div className="text-muted-foreground">{videoJobs.length} items</div>
        </div>

        {videoJobs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first video using the Ad Wizard
            </p>
            <Button onClick={() => window.location.href = '/app'}>
              Create Ad
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoJobs.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  {job.thumbnail_url ? (
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
    </div>
  );
};

export default Library;