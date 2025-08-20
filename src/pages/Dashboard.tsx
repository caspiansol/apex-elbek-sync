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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to Apex Sales Marketing Hub
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Create powerful marketing campaigns with AI-powered tools designed for sales success.
        </p>
      </div>

      {/* Main Actions */}
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Choose an option to begin creating your marketing materials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                size="lg" 
                className="h-24 flex-col space-y-2"
                onClick={() => setIsWizardOpen(true)}
              >
                <Wand2 className="h-8 w-8" />
                <span>Create Ad</span>
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                className="h-24 flex-col space-y-2"
                onClick={() => navigate('/app/library')}
              >
                <Library className="h-8 w-8" />
                <span>Library</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AdWizardModal 
        open={isWizardOpen} 
        onOpenChange={setIsWizardOpen}
      />
    </div>
  );
};

export default Dashboard;