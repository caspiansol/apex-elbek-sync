export type PlaceholderStyle = 'curly' | 'double-curly' | 'square' | 'angle';

export interface PlaceholderConfig {
  style: PlaceholderStyle;
  label: string;
  example: string;
}

export const PLACEHOLDER_STYLES: PlaceholderConfig[] = [
  { style: 'curly', label: 'Curly', example: '{variable}' },
  { style: 'double-curly', label: 'Double Curly', example: '{{variable}}' },
  { style: 'square', label: 'Square', example: '[variable]' },
  { style: 'angle', label: 'Angle', example: '<<variable>>' },
];

export const PLACEHOLDER_VARIABLES = [
  'brand', 'tone', 'offer', 'benefit', 'audience', 'pain', 'outcome', 
  'proof', 'cta', 'platform', 'aspect_ratio', 'seconds', 'geo', 
  'keywords', 'avatar_gender', 'avatar_age', 'avatar_attire', 
  'avatar_setting', 'no_avatar'
];

function getPlaceholderFormat(style: PlaceholderStyle): (variable: string) => string {
  switch (style) {
    case 'curly':
      return (variable: string) => `{${variable}}`;
    case 'double-curly':
      return (variable: string) => `{{${variable}}}`;
    case 'square':
      return (variable: string) => `[${variable}]`;
    case 'angle':
      return (variable: string) => `<<${variable}>>`;
    default:
      return (variable: string) => `{{${variable}}}`;
  }
}

export function createTemplatePrompt(
  scriptPrompt: string, 
  style: PlaceholderStyle = 'double-curly'
): string {
  const format = getPlaceholderFormat(style);
  
  // Create a template version by replacing actual values with placeholders
  let templatePrompt = scriptPrompt;
  
  // These are the dynamic patterns we need to replace in the generated prompt
  // We'll look for common patterns and replace them with placeholders
  
  // Replace duration patterns like "15-second", "30-second", "60-second"
  templatePrompt = templatePrompt.replace(/\b(15|30|60)(-second|s|-second)/g, format('seconds'));
  
  // Replace specific business names, offers, etc. with placeholders
  // This is a simplified approach - in a real implementation, you'd want to store
  // the original template structure and fill it dynamically
  
  return `You are an expert direct-response copywriter creating a high-converting ${format('seconds')} video ad script for ${format('brand')}.

TARGET: ${format('audience')} who are struggling with: ${format('pain')}
SOLUTION: ${format('offer')} that delivers: ${format('outcome')}
TONE: ${format('tone')}
PROOF: ${format('proof')}
LOCATION: ${format('geo')}
KEYWORDS TO INCLUDE: ${format('keywords')}
CALL TO ACTION: ${format('cta')}

Create a smooth, natural-flowing ${format('seconds')}-second video script that feels conversational and authentic. The script should grab attention immediately, clearly present the problem and solution, include credibility elements, and end with a strong call to action. 

CRITICAL TIMING: This must be exactly ${format('seconds')} seconds when read at normal speaking pace (approximately 2.5 words per second, so ${format('seconds')} * 2.5 words total). Count your words carefully.

Write as one continuous, engaging script without section labels or formatting. Make it sound like a real person talking directly to the viewer, not like marketing copy.`;
}

export function createTemplatePayload(
  captionsPayload: any,
  style: PlaceholderStyle = 'double-curly'
): any {
  const format = getPlaceholderFormat(style);
  
  const templatePayload = JSON.parse(JSON.stringify(captionsPayload));
  
  // Replace script with placeholder
  templatePayload.script = format('script');
  
  // Replace duration with placeholder
  templatePayload.duration_sec = format('seconds');
  
  // Replace aspect ratio with placeholder
  templatePayload.aspect_ratio = format('aspect_ratio');
  
  // Replace avatar properties with placeholders
  if (templatePayload.avatar && templatePayload.avatar.enabled) {
    templatePayload.avatar.gender = format('avatar_gender');
    templatePayload.avatar.age = format('avatar_age');
    templatePayload.avatar.attire = format('avatar_attire');
    templatePayload.avatar.setting = format('avatar_setting');
  } else {
    templatePayload.avatar = {
      enabled: format('no_avatar')
    };
  }
  
  // Replace style tone with placeholder
  if (templatePayload.style) {
    templatePayload.style.tone = format('tone');
  }
  
  // Replace metadata with placeholders
  if (templatePayload.metadata) {
    templatePayload.metadata.brand = format('brand');
    templatePayload.metadata.cta = format('cta');
    templatePayload.metadata.geo = format('geo');
    templatePayload.metadata.keywords = format('keywords');
    templatePayload.metadata.benefit = format('benefit');
    templatePayload.metadata.platform = format('platform');
  }
  
  return templatePayload;
}