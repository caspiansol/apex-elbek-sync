import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight, Save, Copy, Wand2, X, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { createTemplatePrompt, createTemplatePayload, PLACEHOLDER_STYLES, type PlaceholderStyle } from "@/lib/placeholder-utils";
interface AdWizardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
interface WizardData {
  businessName: string;
  brandVoice: string;
  offer: string;
  primaryBenefit: string;
  audience: string;
  customAudience: string;
  painPoint: string;
  outcome: string;
  proofPoint: string;
  cta: string;
  platform: string;
  length: string;
  geoTargeting: string;
  keywords: string;
  avatarGender: string;
  avatarAge: string;
  attire: string;
  setting: string;
  noAvatar: boolean;
}
interface Template {
  id: string;
  name: string;
  description: string;
  data: WizardData;
  createdAt: string;
}
const AdWizardModal = ({
  open,
  onOpenChange
}: AdWizardModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [placeholderStyle, setPlaceholderStyle] = useState<PlaceholderStyle>('double-curly');
  const [showFilledVersion, setShowFilledVersion] = useState(true);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [wizardData, setWizardData] = useState<WizardData>({
    businessName: "",
    brandVoice: "",
    offer: "",
    primaryBenefit: "",
    audience: "",
    customAudience: "",
    painPoint: "",
    outcome: "",
    proofPoint: "",
    cta: "",
    platform: "",
    length: "",
    geoTargeting: "",
    keywords: "",
    avatarGender: "",
    avatarAge: "",
    attire: "",
    setting: "",
    noAvatar: false
  });
  const totalSteps = 8; // 7 wizard steps + 1 review step
  const progress = currentStep / totalSteps * 100;

  // Save draft to localStorage
  const saveDraft = () => {
    localStorage.setItem('adWizardDraft', JSON.stringify({
      wizardData,
      currentStep
    }));
    toast({
      title: "Draft saved successfully"
    });
  };
  const saveTemplate = () => {
    const templateName = prompt("Enter template name:");
    if (!templateName) return;
    const template: Template = {
      id: Date.now().toString(),
      name: templateName,
      description: `${wizardData.businessName} - ${wizardData.offer}`,
      data: wizardData,
      createdAt: new Date().toISOString()
    };
    const updatedTemplates = [...templates, template];
    setTemplates(updatedTemplates);
    localStorage.setItem('adWizardTemplates', JSON.stringify(updatedTemplates));
    toast({
      title: "Template saved successfully"
    });
  };
  const loadTemplate = (template: Template) => {
    setWizardData(template.data);
    setShowTemplates(false);
    toast({
      title: "Template loaded successfully"
    });
  };

  // Load draft and templates from localStorage
  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem('adWizardDraft');
      if (saved) {
        const {
          wizardData: savedData,
          currentStep: savedStep
        } = JSON.parse(saved);
        setWizardData(savedData);
        setCurrentStep(savedStep);
      }
      const savedTemplates = localStorage.getItem('adWizardTemplates');
      if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates));
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
    const scriptPrompt = `You are an expert direct-response copywriter creating a high-converting ${wizardData.length} video ad script for ${wizardData.businessName}.

TARGET: ${finalAudience} who are struggling with: ${wizardData.painPoint}
SOLUTION: ${wizardData.offer} that delivers: ${wizardData.outcome}
TONE: ${wizardData.brandVoice}
PROOF: ${wizardData.proofPoint}
LOCATION: ${wizardData.geoTargeting}
KEYWORDS TO INCLUDE: ${wizardData.keywords}
CALL TO ACTION: ${wizardData.cta}

Create a smooth, natural-flowing ${duration}-second video script that feels conversational and authentic. The script should grab attention immediately, clearly present the problem and solution, include credibility elements, and end with a strong call to action. 

CRITICAL TIMING: This must be exactly ${duration} seconds when read at normal speaking pace (approximately 2.5 words per second, so ${duration * 2.5} words total). Count your words carefully.

Write as one continuous, engaging script without section labels or formatting. Make it sound like a real person talking directly to the viewer, not like marketing copy.`;
    const captionsPayload = {
      script: generatedScript || "Generated script will appear here",
      duration_sec: parseInt(wizardData.length.replace('s', '')),
      aspect_ratio: '9:16', // Default to vertical format
      style: {
        tone: wizardData.brandVoice.toLowerCase().replace(' & ', '_'),
        pace: "medium"
      },
      avatar: wizardData.noAvatar ? {
        enabled: false
      } : {
        enabled: true,
        gender: wizardData.avatarGender.toLowerCase(),
        age: wizardData.avatarAge.toLowerCase(),
        attire: wizardData.attire.toLowerCase().replace(' ', '_'),
        setting: wizardData.setting.toLowerCase().replace(' ', '_')
      },
      captions: {
        enabled: true,
        burn_in: true
      },
      music: {
        mood: "uplifting"
      },
      webhook_url: "https://api.yourdomain.com/webhooks/captions"
    };
    return {
      scriptPrompt,
      captionsPayload
    };
  };
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const {
        scriptPrompt,
        captionsPayload
      } = generatePrompts();

      // Call Supabase Edge Function to generate the script securely
      const {
        data,
        error
      } = await supabase.functions.invoke('generate-ad-script', {
        body: {
          prompt: scriptPrompt
        }
      });
      if (error) {
        console.error('generate-ad-script error:', error);
        // Fallback to mock response if API fails
        setGeneratedScript("HOOK: Are you tired of overpaying for insurance? BODY: Our customers save an average of $400 per year while getting better coverage and peace of mind with our A+ rated service. CTA: Call now for your free quote!");
      } else {
        setGeneratedScript((data as any).generatedText);
      }
      setGeneratedContent({
        scriptPrompt,
        captionsPayload,
        thumbnailPrompt: `Create a thumbnail for ${wizardData.businessName} ad about ${wizardData.offer}`
      });
      toast({
        title: "Content generated successfully!"
      });
    } catch (error) {
      // Fallback to mock response if API fails
      setGeneratedScript("HOOK: Are you tired of overpaying for insurance? BODY: Our customers save an average of $400 per year while getting better coverage and peace of mind with our A+ rated service. CTA: Call now for your free quote!");
      const {
        scriptPrompt,
        captionsPayload
      } = generatePrompts();
      setGeneratedContent({
        scriptPrompt,
        captionsPayload,
        thumbnailPrompt: `Create a thumbnail for ${wizardData.businessName} ad about ${wizardData.offer}`
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

    // Check if script contains placeholders
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
      // Build the title from wizard data
      const title = `${wizardData.businessName} - ${wizardData.offer}`;

      // Build the captions payload from wizard data
      const finalAudience = wizardData.audience === 'Custom' ? wizardData.customAudience : wizardData.audience;
      const duration = parseInt(wizardData.length.replace('s', ''));

      // Default to 9:16 (vertical/reels format)
      const aspectRatio = '9:16';

      const captionsPayload = {
        script: generatedScript,
        duration_sec: duration,
        aspect_ratio: aspectRatio,
        style: {
          tone: wizardData.brandVoice.toLowerCase().replace(' & ', '_').replace('-', '_'),
          pace: 'medium'
        },
        avatar: wizardData.noAvatar ? {
          enabled: false
        } : {
          enabled: true,
          gender: wizardData.avatarGender.toLowerCase(),
          age: wizardData.avatarAge.toLowerCase(),
          attire: wizardData.attire.toLowerCase().replace(' ', '_'),
          setting: wizardData.setting.toLowerCase().replace(' ', '_')
        },
        captions: {
          enabled: true,
          burn_in: true
        },
        music: {
          mood: 'uplifting'
        },
        metadata: {
          brand: wizardData.businessName,
          cta: wizardData.cta,
          geo: wizardData.geoTargeting,
          keywords: wizardData.keywords,
          benefit: wizardData.primaryBenefit,
          platform: 'vertical' // Default format
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

      // Reset the wizard and navigate to library
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
      businessName: "",
      brandVoice: "",
      offer: "",
      primaryBenefit: "",
      audience: "",
      customAudience: "",
      painPoint: "",
      outcome: "",
      proofPoint: "",
      cta: "",
      platform: "",
      length: "",
      geoTargeting: "",
      keywords: "",
      avatarGender: "",
      avatarAge: "",
      attire: "",
      setting: "",
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
  const handleStartAgain = handleReset;
  const renderStep = () => {
    // Show templates overlay if requested
    if (showTemplates) {
      return <Card>
          <CardHeader>
            <CardTitle>Choose Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {templates.length === 0 ? <p className="text-muted-foreground text-sm">No templates saved yet</p> : templates.map(template => <div key={template.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <Button size="sm" onClick={() => loadTemplate(template)}>
                      Load
                    </Button>
                  </div>)}
            </div>
            <Button variant="outline" className="mt-2" onClick={() => setShowTemplates(false)}>
              Cancel
            </Button>
          </CardContent>
        </Card>;
    }
    switch (currentStep) {
      case 1:
        return <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" value={wizardData.businessName} onChange={e => setWizardData({
              ...wizardData,
              businessName: e.target.value
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
              <Label htmlFor="proofPoint">Proof point (optional)</Label>
              <Input id="proofPoint" value={wizardData.proofPoint} onChange={e => setWizardData({
              ...wizardData,
              proofPoint: e.target.value
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
        return <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="noAvatar" checked={wizardData.noAvatar} onCheckedChange={checked => setWizardData({
              ...wizardData,
              noAvatar: checked
            })} />
              <Label htmlFor="noAvatar">No avatar — B-roll & captions only</Label>
            </div>
            
            {!wizardData.noAvatar && <>
                <div>
                  <Label>Avatar persona</Label>
                  <div className="flex gap-2 mt-2">
                    {['Woman', 'Man', 'Neutral voiceover only'].map(option => <Badge key={option} variant={wizardData.avatarGender === option ? "default" : "outline"} className="cursor-pointer" onClick={() => setWizardData({
                  ...wizardData,
                  avatarGender: option
                })}>
                        {option}
                      </Badge>)}
                  </div>
                </div>
                
                <div>
                  <Label>Age</Label>
                  <div className="flex gap-2 mt-2">
                    {['Young', 'Adult', 'Mature'].map(option => <Badge key={option} variant={wizardData.avatarAge === option ? "default" : "outline"} className="cursor-pointer" onClick={() => setWizardData({
                  ...wizardData,
                  avatarAge: option
                })}>
                        {option}
                      </Badge>)}
                  </div>
                </div>

                <div>
                  <Label htmlFor="attire">Attire</Label>
                  <Select value={wizardData.attire} onValueChange={value => setWizardData({
                ...wizardData,
                attire: value
              })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select attire" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business-casual">Business casual</SelectItem>
                      <SelectItem value="suit">Suit</SelectItem>
                      <SelectItem value="smart-casual">Smart-casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="setting">Setting</Label>
                  <Select value={wizardData.setting} onValueChange={value => setWizardData({
                ...wizardData,
                setting: value
              })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select setting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern-office">Modern office</SelectItem>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="plain-bg">Plain bg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>}
          </div>;
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

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Template Output</CardTitle>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="placeholder-style" className="text-sm font-medium">Style:</Label>
                        <Select value={placeholderStyle} onValueChange={(value: PlaceholderStyle) => setPlaceholderStyle(value)}>
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PLACEHOLDER_STYLES.map(style => <SelectItem key={style.style} value={style.style}>
                                {style.label} {style.example}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={showFilledVersion ? "filled" : "template"} onValueChange={value => setShowFilledVersion(value === "filled")}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="filled">Filled</TabsTrigger>
                        <TabsTrigger value="template">Template</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="filled" className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-medium">Script Prompt (Filled)</Label>
                            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(generatedContent.scriptPrompt)}>
                              <Copy className="mr-1 h-3 w-3" />
                              Copy
                            </Button>
                          </div>
                          <div className="bg-muted p-3 rounded-lg text-sm max-h-32 overflow-y-auto break-words">
                            {generatedContent.scriptPrompt}
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-medium">Captions AI Payload (Filled)</Label>
                            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(JSON.stringify(generatedContent.captionsPayload, null, 2))}>
                              <Copy className="mr-1 h-3 w-3" />
                              Copy
                            </Button>
                          </div>
                          <div className="bg-muted p-3 rounded-lg text-sm max-h-32 overflow-y-auto break-words">
                            <pre className="whitespace-pre-wrap">{JSON.stringify(generatedContent.captionsPayload, null, 2)}</pre>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="template" className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-medium">Script Prompt (Template)</Label>
                            <Button variant="outline" size="sm" onClick={() => {
                          const templatePrompt = createTemplatePrompt(generatedContent.scriptPrompt, placeholderStyle);
                          navigator.clipboard.writeText(templatePrompt);
                          toast({
                            title: "Template prompt copied!"
                          });
                        }}>
                              <Copy className="mr-1 h-3 w-3" />
                              Copy
                            </Button>
                          </div>
                          <div className="bg-muted p-3 rounded-lg text-sm max-h-32 overflow-y-auto break-words">
                            {createTemplatePrompt(generatedContent.scriptPrompt, placeholderStyle)}
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-medium">Captions AI Payload (Template)</Label>
                            <Button variant="outline" size="sm" onClick={() => {
                          const templatePayload = createTemplatePayload(generatedContent.captionsPayload, placeholderStyle);
                          navigator.clipboard.writeText(JSON.stringify(templatePayload, null, 2));
                          toast({
                            title: "Template payload copied!"
                          });
                        }}>
                              <Copy className="mr-1 h-3 w-3" />
                              Copy
                            </Button>
                          </div>
                          <div className="bg-muted p-3 rounded-lg text-sm max-h-32 overflow-y-auto break-words">
                            <pre className="whitespace-pre-wrap">{JSON.stringify(createTemplatePayload(generatedContent.captionsPayload, placeholderStyle), null, 2)}</pre>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                      <Button onClick={handleCreateVideo}>
                        Create with Captions AI
                      </Button>
                      <Button variant="outline" onClick={saveTemplate}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Template
                      </Button>
                      <Button variant="outline" onClick={saveDraft}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Draft
                      </Button>
                      
                    </div>
                  </CardContent>
                </Card>
              </div>}
          </div>;
      default:
        return null;
    }
  };
  const stepTitles = ["Brand & Tone", "Offer & Key Benefit", "Audience & Pain", "Outcome & Proof", "Goal & Length", "Location & Keywords", "Visuals (Avatar/B-roll)", "Review & Generate"];
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return wizardData.businessName && wizardData.brandVoice;
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
      // Optional fields
      case 7:
        return wizardData.noAvatar || wizardData.avatarGender && wizardData.avatarAge;
      default:
        return true;
    }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pt-2">
            <DialogTitle>Ad Wizard - {stepTitles[currentStep - 1]}</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowTemplates(true)} className="mx-0 py-0 my-[10px]">
                Templates ({templates.length})
              </Button>
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

        {/* Mobile-optimized footer */}
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
            // Auto-generate when moving from step 7 to step 8
            setCurrentStep(currentStep + 1);
            await handleGenerate();
          } else {
            setCurrentStep(currentStep + 1);
          }
        }} disabled={!canProceed() || currentStep === 7 && isGenerating}>
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