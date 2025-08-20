import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, Library } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdWizardModal from "@/components/AdWizardModal";

const Dashboard = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-bg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="relative z-10 space-y-12 pt-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-primary rounded-2xl shadow-neon">
              <Wand2 className="h-8 w-8 text-white animate-glow" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Apex AI Studio
            </h1>
          </div>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            Transform your marketing with cutting-edge AI technology. Create stunning campaigns, 
            analyze performance, and scale your success.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-gradient-card border border-primary/20 backdrop-blur-sm hover:shadow-blue transition-all duration-300 hover:scale-105">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">99%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border border-accent/20 backdrop-blur-sm hover:shadow-light-blue transition-all duration-300 hover:scale-105">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-accent mb-2">10x</div>
              <div className="text-sm text-muted-foreground">Faster Creation</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border border-primary/20 backdrop-blur-sm hover:shadow-neon transition-all duration-300 hover:scale-105">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">AI Support</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="flex justify-center">
          <Card className="w-full max-w-4xl bg-gradient-card border border-primary/20 backdrop-blur-sm shadow-neon">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent">
                Choose Your Path
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Start creating powerful marketing content with our AI-powered tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Button 
                  size="lg" 
                  className="h-32 flex-col space-y-4 bg-gradient-primary hover:shadow-neon transition-all duration-300 hover:scale-105 text-lg"
                  onClick={() => setIsWizardOpen(true)}
                >
                  <Wand2 className="h-12 w-12 animate-glow" />
                  <div className="space-y-1">
                    <div className="font-semibold">Create Campaign</div>
                    <div className="text-sm opacity-80">AI-powered ad generation</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-32 flex-col space-y-4 border-accent/50 hover:bg-accent/10 hover:border-accent hover:shadow-light-blue transition-all duration-300 hover:scale-105 text-lg"
                  onClick={() => navigate('/app/library')}
                >
                  <Library className="h-12 w-12 text-accent animate-float" />
                  <div className="space-y-1">
                    <div className="font-semibold">Library</div>
                    <div className="text-sm opacity-80">Browse saved campaigns</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AdWizardModal 
        open={isWizardOpen} 
        onOpenChange={setIsWizardOpen}
      />
    </div>
  );
};

export default Dashboard;