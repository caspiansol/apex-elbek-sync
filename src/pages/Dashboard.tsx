import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Zap, 
  Plus,
  Sparkles,
  Target,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const stats = [
    {
      title: "Active Campaigns",
      value: "12",
      change: "+2.5%",
      icon: Target,
      color: "text-primary",
    },
    {
      title: "Total Reach",
      value: "1.2M",
      change: "+12.3%",
      icon: Users,
      color: "text-accent",
    },
    {
      title: "Conversion Rate",
      value: "4.8%",
      change: "+0.8%",
      icon: TrendingUp,
      color: "text-success",
    },
    {
      title: "AI Generations",
      value: "847",
      change: "+156",
      icon: Sparkles,
      color: "text-primary",
    },
  ];

  const recentProjects = [
    {
      name: "Summer Sale Campaign",
      status: "Active",
      performance: 85,
      created: "2 hours ago",
    },
    {
      name: "Product Launch Ads",
      status: "Draft",
      performance: 0,
      created: "1 day ago",
    },
    {
      name: "Holiday Promotion",
      status: "Completed",
      performance: 92,
      created: "3 days ago",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Welcome to your AI Studio
          </h1>
          <p className="text-muted-foreground mt-2">
            Create, analyze, and optimize your campaigns with the power of AI
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
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <Card key={stat.title} className="bg-gradient-card border-border/20 hover:shadow-neon transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-success flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="bg-gradient-card border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Recent Projects
              </CardTitle>
              <CardDescription>
                Your latest AI-generated campaigns and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <div
                    key={project.name}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border/10"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{project.name}</h3>
                        <Badge
                          variant={
                            project.status === "Active"
                              ? "default"
                              : project.status === "Draft"
                              ? "secondary"
                              : "outline"
                          }
                          className={
                            project.status === "Active"
                              ? "bg-success/20 text-success border-success/20"
                              : ""
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {project.created}
                        </div>
                        {project.performance > 0 && (
                          <div className="flex items-center gap-2">
                            <span>Performance:</span>
                            <Progress value={project.performance} className="w-20 h-2" />
                            <span>{project.performance}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <Card className="bg-gradient-card border-border/20">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/app/ad-wizard">
                <Button className="w-full justify-start bg-gradient-primary hover:shadow-neon">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Ad Generator
                </Button>
              </Link>
              <Link to="/app/library">
                <Button variant="outline" className="w-full justify-start border-border/50">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Library
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start border-border/50">
                <TrendingUp className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/20">
            <CardHeader>
              <CardTitle className="text-lg">AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm">
                    <strong className="text-primary">Tip:</strong> Your campaigns 
                    perform 23% better on weekends. Consider scheduling more content then.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-sm">
                    <strong className="text-accent">Insight:</strong> Video content 
                    generates 4x more engagement than static images.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;