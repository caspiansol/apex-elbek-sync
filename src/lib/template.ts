// src/lib/template.ts
import { AdTemplatePayload } from "@/types/adTemplate";

export function extractTemplateFromState(state: any): AdTemplatePayload {
  return {
    brand: state.brand || "",
    brandVoice: state.brandVoice || "friendly-empathetic",
    offer: state.offer || "",
    primaryBenefit: state.primaryBenefit || "",
    audience: state.audience || "",
    customAudience: state.customAudience,
    painPoint: state.painPoint || "",
    outcome: state.outcome || "",
    proof: state.proof,
    cta: state.cta || "call-for-quote",
    length: state.length || "30s",
    geoTargeting: state.geoTargeting,
    keywords: state.keywords,
  };
}

export function applyTemplateToState(s: any, t: AdTemplatePayload, templateName: string) {
  return {
    ...s,
    // fill steps 1–6 exactly
    brand: t.brand,
    brandVoice: t.brandVoice,
    offer: t.offer,
    primaryBenefit: t.primaryBenefit,
    audience: t.audience,
    customAudience: t.customAudience,
    painPoint: t.painPoint,
    outcome: t.outcome,
    proof: t.proof,
    cta: t.cta,
    length: t.length,
    geoTargeting: t.geoTargeting,
    keywords: t.keywords,
    // DO NOT touch Step 7
    selectedCreator: s.selectedCreator,
    noAvatar: s.noAvatar,
    // lock
    templateLocked: true,
    templateName: templateName,
  };
}