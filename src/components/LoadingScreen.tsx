import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 450);
    return () => clearInterval(interval);
  }, []);

  const dots = '.'.repeat(dotCount);

  return (
    <div className="fixed inset-0 flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="mx-4 flex max-w-md flex-col items-center gap-6 rounded-2xl border border-border/60 bg-muted/40 px-6 py-8 backdrop-blur-sm">
        {/* Titel */}
        <div className="space-y-1 text-center">
          <h1 className="font-display text-3xl md:text-4xl tracking-[0.18em] uppercase">
            Meum Diarium
          </h1>
          <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-muted-foreground">
            Memoriam temporis
          </p>
        </div>

        {/* Kreis-Spinner */}
        <div className="flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>

        {/* Status-Text */}
        <div className="space-y-1 text-center">
          <p className="text-sm md:text-base text-muted-foreground">
            Einträge werden vorbereitet{dots}
          </p>
          <p className="text-xs text-muted-foreground/80">
            Bitte einen Moment Geduld, dein Diarium startet gleich.
          </p>
        </div>
      </div>
    </div>
  );
}
