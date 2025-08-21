-- Create storage bucket for creator videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('creator-videos', 'creator-videos', true);

-- Create storage policies for creator videos
CREATE POLICY "Public read access for creator videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'creator-videos');

CREATE POLICY "Authenticated users can upload creator videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'creator-videos' AND auth.role() = 'authenticated');