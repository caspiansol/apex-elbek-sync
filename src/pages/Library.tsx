import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Heart, 
  Download, 
  Edit, 
  Trash2,
  Eye,
  Calendar,
  Target,
  BarChart3,
  Star,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const templates = [
    {
      id: 1,
      name: "Summer Sale Campaign",
      description: "High-converting summer promotion template",
      platform: "Facebook Ads",
      performance: 92,
      created: "2 days ago",
      status: "Active",
      isFavorite: true,
      category: "E-commerce"
    },
    {
      id: 2,
      name: "Product Launch Sequence",
      description: "Complete product launch campaign flow",
      platform: "Instagram Ads",
      performance: 87,
      created: "1 week ago",
      status: "Draft",
      isFavorite: false,
      category: "Product Launch"
    },
    {
      id: 3,
      name: "Lead Generation Template",
      description: "B2B lead generation optimized template",
      platform: "LinkedIn Ads",
      performance: 94,
      created: "2 weeks ago",
      status: "Completed",
      isFavorite: true,
      category: "Lead Generation"
    },
    {
      id: 4,
      name: "Holiday Promotion",
      description: "Seasonal holiday marketing campaign",
      platform: "Google Ads",
      performance: 89,
      created: "1 month ago",
      status: "Archived",
      isFavorite: false,
      category: "Seasonal"
    },
  ];

  const campaigns = [
    {
      id: 1,
      name: "Q4 Sales Push",
      budget: "$5,000",
      reach: "125K",
      conversions: "1,247",
      roi: "340%",
      status: "Active",
      created: "3 days ago"
    },
    {
      id: 2,
      name: "Brand Awareness Drive",
      budget: "$3,200",
      reach: "89K",
      conversions: "892",
      roi: "280%",
      status: "Paused",
      created: "1 week ago"
    },
    {
      id: 3,
      name: "Customer Retention",
      budget: "$2,800",
      reach: "45K",  
      conversions: "567",
      roi: "420%",
      status: "Completed",
      created: "2 weeks ago"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/20 text-success border-success/20";
      case "Draft":
        return "bg-muted/20 text-muted-foreground border-muted/20";
      case "Completed":
        return "bg-primary/20 text-primary border-primary/20";
      case "Paused":
        return "bg-accent/20 text-accent border-accent/20";
      default:
        return "bg-secondary/20 text-secondary-foreground border-secondary/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Campaign Library
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your templates, campaigns, and creative assets
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/app/ad-wizard">
            <Button className="bg-gradient-primary hover:shadow-neon">
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </Link>
          <Button variant="outline" className="border-border/50">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates and campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-primary/20">
            All Platforms
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary/20">
            Favorites
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary/20">
            High Performance
          </Badge>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="bg-secondary/20">
            <TabsTrigger value="templates" className="data-[state=active]:bg-primary/20">
              Templates
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-primary/20">
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary/20">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-card border-border/20 hover:shadow-neon transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {template.name}
                            {template.isFavorite && (
                              <Heart className="h-4 w-4 text-destructive fill-destructive" />
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {template.description}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(template.status)}>
                          {template.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Platform:</span>
                        <span>{template.platform}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Performance:</span>
                        <div className="flex items-center gap-2">
                          <Star className="h-3 w-3 text-success fill-success" />
                          <span>{template.performance}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Created:</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{template.created}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="outline" className="flex-1 border-border/50">
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 border-border/50">
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="border-border/50">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-destructive/50 text-destructive hover:text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="space-y-4">
              {campaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-card border-border/20 hover:shadow-purple transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{campaign.name}</h3>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Created {campaign.created}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                          <div>
                            <div className="text-sm text-muted-foreground">Budget</div>
                            <div className="font-semibold text-primary">{campaign.budget}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Reach</div>
                            <div className="font-semibold">{campaign.reach}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Conversions</div>
                            <div className="font-semibold text-success">{campaign.conversions}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">ROI</div>
                            <div className="font-semibold text-accent">{campaign.roi}</div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-border/50">
                            <BarChart3 className="mr-1 h-3 w-3" />
                            Analytics
                          </Button>
                          <Button size="sm" variant="outline" className="border-border/50">
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-card border-border/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Templates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-success">+3 this month</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card border-border/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-primary">2 launching soon</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card border-border/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg. Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">91%</div>
                  <p className="text-xs text-success">+5% improvement</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card border-border/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total ROI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">347%</div>
                  <p className="text-xs text-accent">Best in class</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-card border-border/20">
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>
                  Campaign performance metrics over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-border/30 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Analytics chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Library;