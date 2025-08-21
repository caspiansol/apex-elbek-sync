import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdWizardModal from "@/components/AdWizardModal";
import VideoCard from "@/components/VideoCard";
import { Plus, RefreshCw } from "lucide-react";

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


  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Videos</h1>
            <div className="text-muted-foreground">Loading...</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-[9/16] bg-muted">
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="p-3">
                  <Skeleton className="h-3 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {videoJobs.map((job) => (
              <VideoCard 
                key={job.id} 
                job={job} 
                onRetry={retryJob}
              />
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