import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Play, Calendar } from "lucide-react";

const Library = () => {
  // Mock video data - in real app this would come from API
  const videos = [
    {
      id: 1,
      title: "Summer Sale Promo",
      duration: "30s",
      created: "2 days ago",
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "Product Launch Video",
      duration: "45s", 
      created: "1 week ago",
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Customer Testimonial",
      duration: "60s",
      created: "2 weeks ago", 
      thumbnail: "/api/placeholder/300/200"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Videos</h1>
          <p className="text-muted-foreground mt-1">{videos.length} items</p>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative group">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Play className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {video.duration}
              </div>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{video.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{video.created}</span>
              </div>
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Library;