// src/types/adTemplate.ts
export type AdTemplatePayload = {
  // Step 1
  brand: string;
  brandVoice: "friendly-empathetic" | "professional-authoritative" | "casual-relatable" | "energetic-upbeat";
  // Step 2
  offer: string;
  primaryBenefit: string;
  // Step 3
  audience: string;
  customAudience?: string;
  painPoint: string;
  // Step 4
  outcome: string;
  proof?: string;
  // Step 5
  cta: "call-for-quote" | "visit-page" | "sign-up" | "book-call" | "message-us";
  length: "15s" | "30s" | "60s";
  // Step 6
  geoTargeting?: string;
  keywords?: string;
};

export type AdTemplate = {
  id: string;
  user_id: string;
  name: string;
  payload: AdTemplatePayload;
  created_at: string;
  updated_at: string;
};