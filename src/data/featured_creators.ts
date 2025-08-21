// src/data/featured_creators.ts
import { SUPPORTED_CREATORS, THUMBNAILS } from "@/data/captions_characters";
import { CREATOR_VIDEO_URLS } from "@/data/creator_videos";

const BASE_CHOICES = [
  "alan","cam","carter","douglas","jason","leah","madison","monica","violet"
] as const;

/** Pick canonical creator name from SUPPORTED_CREATORS.
 *  Preference: "<Name>-1" if present, else the first variant, else exact match.
 */
function resolveCreator(base: string): string | null {
  const cap = base.charAt(0).toUpperCase() + base.slice(1).toLowerCase(); // "alan" -> "Alan"
  const exact = SUPPORTED_CREATORS.find(c => c.toLowerCase() === cap.toLowerCase());
  if (exact) return exact;
  const dash1 = SUPPORTED_CREATORS.find(c => c.toLowerCase() === `${cap.toLowerCase()}-1`);
  if (dash1) return dash1;
  const anyVariant = SUPPORTED_CREATORS.find(c => c.toLowerCase().startsWith(`${cap.toLowerCase()}-`));
  return anyVariant ?? null;
}

export const FEATURED_CREATORS: string[] =
  BASE_CHOICES.map(resolveCreator).filter(Boolean) as string[];

// Preview helpers with explicit override mapping
export const getPosterFor  = (name: string) => THUMBNAILS[name]?.imageUrl ?? "";
export const getPreviewFor = (name: string) => CREATOR_VIDEO_URLS[name] || THUMBNAILS[name]?.videoUrl || "";