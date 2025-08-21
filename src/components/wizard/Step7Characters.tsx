import { FEATURED_CREATORS, getPosterFor, getPreviewFor } from "@/data/featured_creators";
import { Check } from "lucide-react";

export function Step7Characters({ state, setState }: { state: any; setState: Function }) {
  const selected = state.selectedCreator as string | undefined;
  const noAvatar = !!state.noAvatar;

  const select = (name: string) =>
    setState((s: any) => ({ ...s, noAvatar: false, selectedCreator: name }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">No avatar — B-roll & captions only</span>
        <button
          type="button"
          onClick={() => setState((s: any) => ({ ...s, noAvatar: !s.noAvatar, selectedCreator: undefined }))}
          className={`h-6 w-11 rounded-full transition ${noAvatar ? "bg-primary/80" : "bg-muted"}`}
          aria-pressed={noAvatar}
        >
          <span className={`block h-5 w-5 bg-background rounded-full translate-x-0.5 transition ${noAvatar ? "translate-x-5" : ""}`} />
        </button>
      </div>

      {!noAvatar && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {FEATURED_CREATORS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => select(name)}
              className={`relative rounded-xl border overflow-hidden text-left bg-card transition-all hover:scale-105
                          ${selected === name ? "ring-2 ring-primary border-primary" : "border-border"}`}
            >
              <div className="aspect-video bg-muted">
                <iframe
                  src={getPreviewFor(name)}
                  className="h-full w-full object-cover"
                  allow="autoplay"
                  frameBorder="0"
                />
              </div>
              <div className="p-3 text-sm font-medium">{name}</div>
              {selected === name && (
                <div className="absolute top-2 right-2 rounded-full bg-primary text-primary-foreground p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}