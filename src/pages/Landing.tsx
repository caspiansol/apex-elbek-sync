import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight, Sparkles, MessageSquare, Settings, Download, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdWizardModal from "@/components/AdWizardModal";

const Landing = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adWizardOpen, setAdWizardOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleCreateAd = () => {
    if (isAuthenticated) {
      setAdWizardOpen(true);
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-xl">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Apex AI Studio
            </span>
          </div>
          <div className="flex space-x-3">
            <Link to="/login">
              <Button variant="outline">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <Card className="bg-card border border-border p-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              Create Video Ads in Minutes
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-prose mx-auto">
              Answer 7 quick questions. We write the script and generate your video with Captions.ai. No editing required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Button size="lg" onClick={handleCreateAd} className="text-lg px-8 py-4">
                Create Your Ad <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => setDemoModalOpen(true)}
                className="text-lg px-8 py-4"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch 30-sec Demo
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Powered by Captions.ai + ElevenLabs • Exports for Reels, Facebook, YouTube
            </p>
          </Card>
        </motion.div>

        {/* How it works */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto"
        >
          <Card className="text-center p-6">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-primary rounded-xl w-fit">
                <MessageSquare className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Tell us your goal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Pick your CTA and platform (Reels, Feed, YouTube).
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-primary rounded-xl w-fit">
                <Settings className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Answer 7 questions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Brand, audience, pain, benefit, visuals.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-primary rounded-xl w-fit">
                <Download className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Get your video</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We generate the script & render the ad. Download from your Library.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Card className="bg-card border border-border max-w-3xl mx-auto p-12">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Ready to make your first video ad?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={handleCreateAd} className="text-lg px-8 py-4">
                Create Your Ad <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Sign In
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 flex justify-between items-center text-sm text-muted-foreground">
          <p>© Apex AI Studio</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      {/* Ad Wizard Modal */}
      <AdWizardModal open={adWizardOpen} onOpenChange={setAdWizardOpen} />

      {/* Demo Modal */}
      <Dialog open={demoModalOpen} onOpenChange={setDemoModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>30-Second Demo</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Demo video placeholder</p>
              <p className="text-sm text-muted-foreground mt-2">https://demo.example</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Landing;