import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight, Save, Copy, Wand2, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PLACEHOLDER_STYLES, PlaceholderStyle } from "@/lib/placeholder-utils";
import { Step7Characters } from "@/components/wizard/Step7Characters";

interface AdWizardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdWizardModal = ({ open, onOpenChange }: AdWizardModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [placeholderStyle, setPlaceholderStyle] = useState<PlaceholderStyle>('double-curly');
  const [showFilledVersion, setShowFilledVersion] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [wizardData, setWizardData] = useState({
    brand: '',
    industry: '',
    brandVoice: '',
    offer: '',
    offerType: '',
    primaryBenefit: '',
    audience: '',
    customAudience: '',
    painPoint: '',
    outcome: '',
    proof: '',
    proofType: '',
    cta: '',
    length: '',
    geoTargeting: '',
    keywords: '',
    selectedCreator: '',
    noAvatar: false
  });

  const totalSteps = 8;
  const progress = currentStep / totalSteps * 100;

  const saveDraft = () => {
    localStorage.setItem('adWizardDraft', JSON.stringify({
      wizardData,
      currentStep
    }));
    toast({
      title: "Draft saved successfully"
    });
  };

  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem('adWizardDraft');
      if (saved) {
        const { wizardData: savedData, currentStep: savedStep } = JSON.parse(saved);
        setWizardData(savedData);
        setCurrentStep(savedStep);
      }
    }
  }, [open]);

  const handleClose = () => {
    const hasData = Object.values(wizardData).some(value => value !== "" && value !== false);
    if (hasData && !confirm("You have unsaved changes. Are you sure you want to close?")) {
      return;
    }
    onOpenChange(false);
    setCurrentStep(1);
    setGeneratedContent(null);
  };

  const generatePrompts = () => {
    const finalAudience = wizardData.audience === 'Custom' ? wizardData.customAudience : wizardData.audience;
    const duration = parseInt(wizardData.length.replace('s', ''));
    
    const scriptPrompt = `You are an expert direct-response copywriter creating a high-converting ${wizardData.length} video ad script for ${wizardData.brand}.

TARGET: ${finalAudience} who are struggling with: ${wizardData.painPoint}
SOLUTION: ${wizardData.offer} that delivers: ${wizardData.outcome}
TONE: ${wizardData.brandVoice}
PROOF: ${wizardData.proof}
LOCATION: ${wizardData.geoTargeting}
KEYWORDS TO INCLUDE: ${wizardData.keywords}
CALL TO ACTION: ${wizardData.cta}

Create a smooth, natural-flowing ${duration}-second video script that feels conversational and authentic. The script should grab attention immediately, clearly present the problem and solution, include credibility elements, and end with a strong call to action. 

CRITICAL TIMING: This must be exactly ${duration} seconds when read at normal speaking pace (approximately 2.5 words per second, so ${duration * 2.5} words total). Count your words carefully.

Write as one continuous, engaging script without section labels or formatting. Make it sound like a real person talking directly to the viewer, not like marketing copy.`;

    const captionsPayload = {
      script: generatedScript || "Generated script will appear here",
      duration_sec: parseInt(wizardData.length.replace('s', '')),
      aspect_ratio: '9:16',
      captions: { enabled: true, burn_in: true },
      style: {
        tone: wizardData.brandVoice.toLowerCase().replace(' & ', '_'),
        pace: "medium"
      },
      music: {
        mood: "uplifting"
      },
      ...(wizardData.noAvatar
        ? { avatar: { enabled: false } }
        : { avatar: { enabled: true, creator: wizardData.selectedCreator } }),
      metadata: {
        brand: wizardData.brand,
        cta: wizardData.cta,
        geo: wizardData.geoTargeting,
        keywords: wizardData.keywords,
        benefit: wizardData.primaryBenefit,
        selectedCreator: wizardData.selectedCreator || "no-avatar"
      }
    };

    return { scriptPrompt, captionsPayload };
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { scriptPrompt, captionsPayload } = generatePrompts();

      const { data, error } = await supabase.functions.invoke('generate-ad-script', {
        body: { prompt: scriptPrompt }
      });

      if (error) {
        console.error('generate-ad-script error:', error);
        setGeneratedScript("HOOK: Are you tired of overpaying for insurance? BODY: Our customers save an average of $400 per year while getting better coverage and peace of mind with our A+ rated service. CTA: Call now for your free quote!");
      } else {
        setGeneratedScript((data as any).generatedText);
      }

      setGeneratedContent({
        scriptPrompt,
        captionsPayload,
        thumbnailPrompt: `Create a thumbnail for ${wizardData.brand} ad about ${wizardData.offer}`
      });

      toast({
        title: "Content generated successfully!"
      });
    } catch (error) {
      setGeneratedScript("HOOK: Are you tired of overpaying for insurance? BODY: Our customers save an average of $400 per year while getting better coverage and peace of mind with our A+ rated service. CTA: Call now for your free quote!");
      const { scriptPrompt, captionsPayload } = generatePrompts();
      setGeneratedContent({
        scriptPrompt,
        captionsPayload,
        thumbnailPrompt: `Create a thumbnail for ${wizardData.brand} ad about ${wizardData.offer}`
      });
      toast({
        title: "Content generated successfully!"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateVideo = async () => {
    if (!generatedScript) {
      toast({
        title: "Error",
        description: "Please generate a script first.",
        variant: "destructive",
      });
      return;
    }

    const looksLikeTemplate = /(\{\{.*\}\}|\{.*\}|<<.*>>|\[.*\])/.test(generatedScript);
    if (looksLikeTemplate) {
      toast({
        title: "Template Detected",
        description: "Switch to Filled Script to create your video. Templates cannot be used directly.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const title = `${wizardData.brand} - ${wizardData.offer}`;
      const duration = parseInt(wizardData.length.replace('s', ''));

      const captionsPayload = {
        script: generatedScript,
        duration_sec: duration,
        aspect_ratio: '9:16',
        captions: { enabled: true, burn_in: true },
        style: {
          tone: wizardData.brandVoice.toLowerCase().replace(' & ', '_'),
          pace: "medium"
        },
        music: {
          mood: "uplifting"
        },
        ...(wizardData.noAvatar
          ? { avatar: { enabled: false } }
          : { avatar: { enabled: true, creator: wizardData.selectedCreator } }),
        metadata: {
          brand: wizardData.brand,
          cta: wizardData.cta,
          geo: wizardData.geoTargeting,
          keywords: wizardData.keywords,
          benefit: wizardData.primaryBenefit,
          selectedCreator: wizardData.selectedCreator || "no-avatar"
        }
      };

      const { data, error } = await supabase.functions.invoke('create-video-job', {
        body: {
          captionsPayload,
          title,
        }
      });

      if (error) throw error;

      toast({
        title: "Rendering Started!",
        description: "Your video is being created. It'll appear in your Library.",
      });

      handleReset();
      onOpenChange(false);
      navigate('/app/library');
      
    } catch (error) {
      console.error('Error creating video:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setWizardData({
      brand: '',
      industry: '',
      brandVoice: '',
      offer: '',
      offerType: '',
      primaryBenefit: '',
      audience: '',
      customAudience: '',
      painPoint: '',
      outcome: '',
      proof: '',
      proofType: '',
      cta: '',
      length: '',
      geoTargeting: '',
      keywords: '',
      selectedCreator: '',
      noAvatar: false
    });
    setCurrentStep(1);
    setGeneratedContent(null);
    setGeneratedScript("");
    setPlaceholderStyle('double-curly');
    setShowFilledVersion(true);
    localStorage.removeItem('adWizardDraft');
    toast({
      title: "Wizard reset successfully"
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <div className="space-y-4">
            <div>
              <Label htmlFor="brand">Business Name</Label>
              <Input id="brand" value={wizardData.brand} onChange={e => setWizardData({
              ...wizardData,
              brand: e.target.value
            })} placeholder="e.g., Acme Insurance" />
            </div>
            <div>
              <Label htmlFor="brandVoice">Brand Voice</Label>
              <Select value={wizardData.brandVoice} onValueChange={value => setWizardData({
              ...wizardData,
              brandVoice: value
            })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly-empathetic">Friendly & empathetic</SelectItem>
                  <SelectItem value="professional-authoritative">Professional & authoritative</SelectItem>
                  <SelectItem value="casual-relatable">Casual & relatable</SelectItem>
                  <SelectItem value="energetic-upbeat">Energetic & upbeat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>;
      case 2:
        return <div className="space-y-4">
            <div>
              <Label htmlFor="offer">What are you promoting?</Label>
              <Input id="offer" value={wizardData.offer} onChange={e => setWizardData({
              ...wizardData,
              offer: e.target.value
            })} placeholder="e.g., Auto insurance quotes" />
            </div>
            <div>
              <Label htmlFor="primaryBenefit">Primary Benefit</Label>
              <Select value={wizardData.primaryBenefit} onValueChange={value => setWizardData({
              ...wizardData,
              primaryBenefit: value
            })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary benefit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="save-money">Save money</SelectItem>
                  <SelectItem value="best-coverage">Best coverage or quality</SelectItem>
                  <SelectItem value="fast-easy">Fast & easy</SelectItem>
                  <SelectItem value="great-support">Great support</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>;
      case 3:
        return <div className="space-y-4">
            <div>
              <Label htmlFor="audience">Who is this for?</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Families', 'Self-employed', 'SMB owners', 'Seniors', 'Local residents', 'Custom'].map(option => <Badge key={option} variant={wizardData.audience === option ? "default" : "outline"} className="cursor-pointer" onClick={() => setWizardData({
                ...wizardData,
                audience: option
              })}>
                    {option}
                  </Badge>)}
              </div>
              {wizardData.audience === 'Custom' && <div className="mt-4">
                  <Label htmlFor="customAudience">Describe your custom audience</Label>
                  <Input id="customAudience" value={wizardData.customAudience} onChange={e => setWizardData({
                ...wizardData,
                customAudience: e.target.value
              })} placeholder="e.g., Young professionals aged 25-35 in urban areas" />
                </div>}
            </div>
            <div>
              <Label htmlFor="painPoint">Biggest pain or worry (one sentence)</Label>
              <Textarea id="painPoint" value={wizardData.painPoint} onChange={e => setWizardData({
              ...wizardData,
              painPoint: e.target.value
            })} placeholder="e.g., Paying too much for car insurance with poor coverage" />
            </div>
          </div>;
      case 4:
        return <div className="space-y-4">
            <div>
              <Label htmlFor="outcome">After state (one sentence)</Label>
              <Textarea id="outcome" value={wizardData.outcome} onChange={e => setWizardData({
              ...wizardData,
              outcome: e.target.value
            })} placeholder="e.g., Save hundreds while getting better coverage and peace of mind" />
            </div>
            <div>
              <Label htmlFor="proof">Proof point (optional)</Label>
              <Input id="proof" value={wizardData.proof} onChange={e => setWizardData({
              ...wizardData,
              proof: e.target.value
            })} placeholder="e.g., 25 years in business, A+ rating, licensed in all 50 states" />
            </div>
          </div>;
      case 5:
        return <div className="space-y-4">
            <div>
              <Label htmlFor="cta">Single CTA</Label>
              <Select value={wizardData.cta} onValueChange={value => setWizardData({
              ...wizardData,
              cta: value
            })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select call to action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call-for-quote">Call for quote</SelectItem>
                  <SelectItem value="visit-page">Visit page</SelectItem>
                  <SelectItem value="sign-up">Sign up</SelectItem>
                  <SelectItem value="book-call">Book call</SelectItem>
                  <SelectItem value="message-us">Message us</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="length">Length</Label>
              <Select value={wizardData.length} onValueChange={value => setWizardData({
              ...wizardData,
              length: value
            })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15s">15s</SelectItem>
                  <SelectItem value="30s">30s</SelectItem>
                  <SelectItem value="60s">60s</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>;
      case 6:
        return <div className="space-y-4">
            <div>
              <Label htmlFor="geoTargeting">Geo targeting</Label>
              <Input id="geoTargeting" value={wizardData.geoTargeting} onChange={e => setWizardData({
              ...wizardData,
              geoTargeting: e.target.value
            })} placeholder="e.g., California, Texas, New York" />
            </div>
            <div>
              <Label htmlFor="keywords">Must-include words/phrases</Label>
              <Input id="keywords" value={wizardData.keywords} onChange={e => setWizardData({
              ...wizardData,
              keywords: e.target.value
            })} placeholder="e.g., licensed, insured, certified" />
            </div>
          </div>;
      case 7:
        return <Step7Characters state={wizardData} setState={setWizardData} />;
      case 8:
        return <div className="space-y-6">
            {!generatedContent && <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-4">Ready to Generate</h3>
                <p className="text-muted-foreground mb-6">
                  Click the button below to generate your marketing content
                </p>
                <Button onClick={handleGenerate} disabled={isGenerating} size="lg">
                  {isGenerating ? <>Generating...</> : <>
                      <Wand2 className="mr-2 h-5 w-5" />
                      Generate Content
                    </>}
                </Button>
              </div>}

            {generatedContent && <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Script (Editable)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea value={generatedScript} onChange={e => setGeneratedScript(e.target.value)} className="min-h-32 text-sm" placeholder="Generated script will appear here..." />
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => navigator.clipboard.writeText(generatedScript)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Script
                    </Button>
                  </CardContent>
                </Card>

                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button onClick={handleCreateVideo} disabled={isGenerating}>
                    {isGenerating ? "Creating..." : "Create with Captions AI"}
                  </Button>
                  <Button variant="outline" onClick={saveDraft}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>
                </div>
              </div>}
          </div>;
      default:
        return null;
    }
  };

  const stepTitles = ["Brand & Tone", "Offer & Key Benefit", "Audience & Pain", "Outcome & Proof", "Goal & Length", "Location & Keywords", "Creator Selection", "Review & Generate"];
  
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return wizardData.brand && wizardData.brandVoice;
      case 2:
        return wizardData.offer && wizardData.primaryBenefit;
      case 3:
        return wizardData.audience && wizardData.painPoint && (wizardData.audience !== 'Custom' || wizardData.customAudience);
      case 4:
        return wizardData.outcome;
      case 5:
        return wizardData.cta && wizardData.length;
      case 6:
        return true;
      case 7:
        return wizardData.noAvatar || !!wizardData.selectedCreator;
      default:
        return true;
    }
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pt-2">
            <DialogTitle>Ad Wizard - {stepTitles[currentStep - 1]}</DialogTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="mx-0 py-0 my-[10px]" aria-label="Reset wizard">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset all answers and start over?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear all your answers and saved drafts. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} />
          </div>
        </DialogHeader>

        <div className="py-4">
          {renderStep()}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button variant="ghost" onClick={saveDraft}>
              <Save className="h-4 w-4 mr-1" />
              Save Draft
            </Button>
          </div>
          
          {currentStep < totalSteps && <Button onClick={async () => {
          if (currentStep === 7) {
            setCurrentStep(currentStep + 1);
            await handleGenerate();
          } else {
            setCurrentStep(currentStep + 1);
          }
        }} disabled={!canProceed() || (currentStep === 7 && isGenerating)}>
              {currentStep === 7 && isGenerating ? <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Generating...
                </> : <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>}
            </Button>}
        </div>
      </DialogContent>
    </Dialog>;
};

export default AdWizardModal;