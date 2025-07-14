"use client";

import { cn } from "@/lib/utils";

export function Waveform({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-1 w-10 h-6", className)}>
      <span className="w-1 h-full bg-primary/70 rounded-full animate-[waveform_1s_ease-in-out_infinite_alternate]" style={{ animationDelay: "0s" }}></span>
      <span className="w-1 h-full bg-primary/70 rounded-full animate-[waveform_1s_ease-in-out_infinite_alternate]" style={{ animationDelay: "0.2s" }}></span>
      <span className="w-1 h-full bg-primary/70 rounded-full animate-[waveform_1s_ease-in-out_infinite_alternate]" style={{ animationDelay: "0.4s" }}></span>
      <span className="w-1 h-full bg-primary/70 rounded-full animate-[waveform_1s_ease-in-out_infinite_alternate]" style={{ animationDelay: "0.6s" }}></span>
      <style jsx>{`
        @keyframes waveform {
          from {
            transform: scaleY(0.3);
          }
          to {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}
