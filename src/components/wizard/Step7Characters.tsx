import { FEATURED_CREATORS, getPosterFor, getPreviewFor } from "@/data/featured_creators";
import { Check } from "lucide-react";
import VideoPreview from "@/components/wizard/VideoPreview";

export function Step7Characters({ state, setState }: { state: any; setState: Function }) {
  const selected = state.selectedCreator as string | undefined;
  const noAvatar = !!state.noAvatar;

  const select = (name: string) =>
    setState((s: any) => ({ ...s, noAvatar: false, selectedCreator: name }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {FEATURED_CREATORS.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => select(name)}
            className={`relative rounded-xl border bg-card text-left overflow-hidden transition-all hover:scale-105
                        ${selected === name ? "border-primary ring-2 ring-primary" : "border-border"}`}
          >
            <VideoPreview
              previewUrl={getPreviewFor(name)}
              posterUrl={getPosterFor(name)}
              selected={selected === name}
            />
            <div className="p-3 text-sm font-medium">{name}</div>
            {selected === name && (
              <div className="absolute top-2 right-2 rounded-full bg-primary text-primary-foreground p-1">
                <Check className="h-4 w-4" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}