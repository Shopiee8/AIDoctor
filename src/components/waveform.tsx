
"use client";

import { cn } from "@/lib/utils";

export function Waveform({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-0.5 w-10 h-4", className)}>
      <span className="w-0.5 h-full bg-primary/70 rounded-full animate-waveform" style={{ animationDelay: "0s" }}></span>
      <span className="w-0.5 h-full bg-primary/70 rounded-full animate-waveform" style={{ animationDelay: "0.2s" }}></span>
      <span className="w-0.5 h-full bg-primary/70 rounded-full animate-waveform" style={{ animationDelay: "0.4s" }}></span>
      <span className="w-0.5 h-full bg-primary/70 rounded-full animate-waveform" style={{ animationDelay: "0.6s" }}></span>
      <span className="w-0.5 h-full bg-primary/70 rounded-full animate-waveform" style={{ animationDelay: "0.8s" }}></span>
    </div>
  );
}
