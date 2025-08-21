import { useRef, useState, useEffect } from "react";

type Props = {
  previewUrl: string;   // mp4 from THUMBNAILS[name].videoUrl (or Drive override)
  posterUrl?: string;   // THUMBNAILS[name].imageUrl (hi-res)
  selected?: boolean;
};

export default function VideoPreview({ previewUrl, posterUrl, selected }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  // Pause & reset when unmounting or src changes
  useEffect(() => () => {
    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0;
    }
  }, [previewUrl]);

  const play = async () => {
    try {
      if (!ref.current) return;
      await ref.current.play();
      setPlaying(true);
    } catch { /* autoplay may be blocked on some devices */ }
  };
  
  const stop = () => {
    if (!ref.current) return;
    ref.current.pause();
    ref.current.currentTime = 0;
    setPlaying(false);
  };
  
  const toggle = () => (playing ? stop() : play());

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-lg
                  aspect-[9/16] bg-muted ${selected ? "ring-2 ring-primary" : ""}`}
      onMouseEnter={play}
      onMouseLeave={stop}
      onTouchStart={(e) => { e.preventDefault(); toggle(); }} // tap to preview on mobile
    >
      <video
        ref={ref}
        src={previewUrl}
        poster={posterUrl}
        muted
        loop
        playsInline
        preload="metadata"
        controls={false}
        className="h-full w-full object-cover"
      />
      {/* subtle overlay that fades when playing */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity
                    ${playing ? "opacity-0" : "opacity-100"}`}
        style={{ background: "linear-gradient(to top, rgba(0,0,0,.20), rgba(0,0,0,.05))" }}
      />
    </div>
  );
}