import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount(prev => (prev % 3) + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-secondary/20 flex flex-col items-center justify-center min-h-screen">
      {/* Ancient Rome themed decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-24 h-24 border-2 border-primary/10 rotate-45 opacity-50"></div>
        <div className="absolute bottom-32 right-1/4 w-32 h-32 border-2 border-primary/5 rounded-full opacity-30"></div>
        <div className="absolute top-1/3 right-20 w-40 h-40 border-4 border-primary/5 opacity-20"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        {/* Latin motto with animation */}
        <div className="text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2 text-primary">
            Meum Diarium
          </h1>
          <p className="text-sm md:text-base text-muted-foreground italic">
            Temporis momenta colliguntur
            <span className="inline-block ml-1">
              {'.'.repeat(dotCount)}
            </span>
          </p>
        </div>

        {/* Animated scroll/parchment loading indicator */}
        <div className="relative w-24 h-32 md:w-32 md:h-40">
          {/* Outer scroll */}
          <div className="absolute inset-0 border-4 border-primary/30 rounded-sm bg-gradient-to-b from-secondary to-secondary/50 opacity-70"></div>

          {/* Animated line scrolling */}
          <div className="absolute inset-2 overflow-hidden">
            <div className="animate-pulse flex flex-col gap-2 h-full justify-center">
              <div className="h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full"></div>
              <div className="h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-full"></div>
              <div className="h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full"></div>
              <div className="h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-full"></div>
            </div>
          </div>

          {/* Scroll handles */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-primary/40 rounded-full"></div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-primary/40 rounded-full"></div>
        </div>

        {/* Loading text */}
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Die Geschichte wird geladen
            <span className="inline-block ml-1 w-3">
              {'.'.repeat(dotCount)}
            </span>
          </p>
        </div>

        {/* Progress bar with ancient aesthetic */}
        <div className="w-48 md:w-64 mt-6">
          <div className="h-1 bg-secondary rounded-full overflow-hidden border border-primary/20">
            <div 
              className="h-full bg-gradient-to-r from-primary/40 via-primary to-primary/40 rounded-full"
              style={{
                width: '40%',
                animation: 'slideRight 1.5s ease-in-out infinite'
              }}
            ></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideRight {
          0%, 100% { width: 20%; }
          50% { width: 70%; }
        }
      `}</style>
    </div>
  );
}
