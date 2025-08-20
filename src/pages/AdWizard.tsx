import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Wand2, 
  Sparkles, 
  Target, 
  Palette, 
  Type, 
  Image,
  Save,
  Download,
  RefreshCw,
  Lightbulb
} from "lucide-react";
import { motion } from "framer-motion";

const AdWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    campaignName: "",
    product: "",
    targetAudience: "",
    tone: "",
    platform: "",
    description: "",
  });

  const steps = [
    { id: 1, name: "Campaign Setup", icon: Target },
    { id: 2, name: "Content Brief", icon: Type },
    { id: 3, name: "AI Generation", icon: Sparkles },
    { id: 4, name: "Review & Export", icon: Download },
  ];

  const platforms = [
    "Facebook Ads",
    "Instagram Ads", 
    "Google Ads",
    "LinkedIn Ads",
    "Twitter Ads",
    "TikTok Ads"
  ];

  const tones = [
    "Professional",
    "Casual",
    "Playful",
    "Urgent",
    "Inspirational",
    "Informative"
  ];

  const handleGenerate = async () => {
    setGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setGenerating(false);
    setCurrentStep(4);
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          AI Ad Wizard
        </h1>
        <p className="text-muted-foreground">
          Create powerful ad campaigns with the help of artificial intelligence
        </p>
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-card border-border/20">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="mb-4" />
            <div className="flex justify-between">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 ${
                    step.id <= currentStep ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <step.icon className="h-4 w-4" />
                  <span className="text-xs hidden sm:inline">{step.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={currentStep.toString()} className="space-y-6">
          {/* Step 1: Campaign Setup */}
          <TabsContent value="1" className="space-y-6">
            <Card className="bg-gradient-card border-border/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Campaign Setup
                </CardTitle>
                <CardDescription>
                  Let's start by setting up the basics of your campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="campaignName">Campaign Name</Label>
                    <Input
                      id="campaignName"
                      placeholder="Summer Sale 2024"
                      value={formData.campaignName}
                      onChange={(e) => setFormData({...formData, campaignName: e.target.value})}
                      className="bg-secondary/50 border-border/50 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product">Product/Service</Label>
                    <Input
                      id="product"
                      placeholder="AI-powered analytics tool"
                      value={formData.product}
                      onChange={(e) => setFormData({...formData, product: e.target.value})}
                      className="bg-secondary/50 border-border/50 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select value={formData.platform} onValueChange={(value) => setFormData({...formData, platform: value})}>
                      <SelectTrigger className="bg-secondary/50 border-border/50">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((platform) => (
                          <SelectItem key={platform} value={platform}>
                            {platform}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone of Voice</Label>
                    <Select value={formData.tone} onValueChange={(value) => setFormData({...formData, tone: value})}>
                      <SelectTrigger className="bg-secondary/50 border-border/50">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {tones.map((tone) => (
                          <SelectItem key={tone} value={tone}>
                            {tone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    placeholder="Tech-savvy professionals aged 25-45"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                    className="bg-secondary/50 border-border/50 focus:border-primary"
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentStep(2)}
                    className="bg-gradient-primary hover:shadow-neon"
                  >
                    Continue to Content Brief
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 2: Content Brief */}
          <TabsContent value="2" className="space-y-6">
            <Card className="bg-gradient-card border-border/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-primary" />
                  Content Brief
                </CardTitle>
                <CardDescription>
                  Provide details about your campaign content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description">Campaign Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your campaign goals, key messages, and any specific requirements..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="min-h-32 bg-secondary/50 border-border/50 focus:border-primary"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-secondary/20 border-border/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-accent" />
                        AI Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/20">
                        Limited time offer
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/20">
                        Free trial
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/20">
                        Money-back guarantee
                      </Badge>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-secondary/20 border-border/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Image className="h-4 w-4 text-success" />
                        Visual Style
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-success/20">
                        Modern & Clean
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-success/20">
                        Bold & Dynamic
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-success/20">
                        Minimalist
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(1)}
                    className="border-border/50"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(3)}
                    className="bg-gradient-primary hover:shadow-neon"
                  >
                    Generate with AI
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 3: AI Generation */}
          <TabsContent value="3" className="space-y-6">
            <Card className="bg-gradient-card border-border/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse-neon" />
                  AI Generation
                </CardTitle>
                <CardDescription>
                  Our AI is creating your campaign content
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                {!generating ? (
                  <div className="space-y-6">
                    <Wand2 className="h-16 w-16 mx-auto text-primary animate-float" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Ready to Generate</h3>
                      <p className="text-muted-foreground mb-6">
                        Click the button below to let AI create your campaign
                      </p>
                      <Button 
                        onClick={handleGenerate}
                        className="bg-gradient-primary hover:shadow-neon"
                        size="lg"
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate Campaign
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative">
                      <Sparkles className="h-16 w-16 mx-auto text-primary animate-spin" />
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">AI is Working...</h3>
                      <p className="text-muted-foreground">
                        Analyzing your brief and generating optimized content
                      </p>
                      <div className="mt-4 max-w-md mx-auto">
                        <Progress value={75} className="h-2" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 4: Review & Export */}
          <TabsContent value="4" className="space-y-6">
            <Card className="bg-gradient-card border-border/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  Generated Campaign
                </CardTitle>
                <CardDescription>
                  Review and export your AI-generated campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-secondary/20 border-border/10">
                    <CardHeader>
                      <CardTitle className="text-lg">Ad Copy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-card/50 border border-border/20">
                          <h4 className="font-semibold mb-2">Headline</h4>
                          <p>Transform Your Business with AI-Powered Analytics</p>
                        </div>
                        <div className="p-4 rounded-lg bg-card/50 border border-border/20">
                          <h4 className="font-semibold mb-2">Description</h4>
                          <p>Unlock powerful insights and make data-driven decisions with our cutting-edge AI analytics platform. Start your free trial today!</p>
                        </div>
                        <div className="p-4 rounded-lg bg-card/50 border border-border/20">
                          <h4 className="font-semibold mb-2">Call to Action</h4>
                          <p>Start Free Trial</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary/20 border-border/10">
                    <CardHeader>
                      <CardTitle className="text-lg">Campaign Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-square bg-gradient-primary/10 rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center">
                        <div className="text-center">
                          <Image className="h-12 w-12 mx-auto mb-4 text-primary" />
                          <p className="text-sm text-muted-foreground">Visual preview will appear here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <Button variant="outline" className="border-border/50">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                    <Button variant="outline" className="border-border/50">
                      <Save className="mr-2 h-4 w-4" />
                      Save Template
                    </Button>
                  </div>
                  <Button className="bg-gradient-primary hover:shadow-neon">
                    <Download className="mr-2 h-4 w-4" />
                    Export Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AdWizard;