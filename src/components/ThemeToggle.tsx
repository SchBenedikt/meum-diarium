import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    // Set initial theme
    setIsDark(mediaQuery.matches);
    if (mediaQuery.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // The button is no longer needed for manual toggling, but we can keep it as a visual indicator or for future use.
  // For now, let's just show an icon representing the current theme without toggle functionality.
  return (
    <div
      className="h-10 w-10 rounded-lg flex items-center justify-center text-muted-foreground bg-secondary/50"
      aria-label={isDark ? 'Dunkles Design aktiv' : 'Helles Design aktiv'}
    >
      {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </div>
  );
}
