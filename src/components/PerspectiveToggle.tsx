import { Perspective } from '@/types/blog';
import { BookOpen, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface PerspectiveToggleProps {
  value: Perspective;
  onChange: (value: Perspective) => void;
  hasDiary?: boolean;
  hasScientific?: boolean;
}

export function PerspectiveToggle({ value, onChange, hasDiary = true, hasScientific = true }: PerspectiveToggleProps) {
  const { t } = useLanguage();

  // If only one perspective has content, don't render the toggle at all.
  if (!hasDiary || !hasScientific) return null;

  return (
    <div className="inline-flex p-1 rounded-lg bg-secondary/50 border border-border/50">
      <button
        onClick={() => onChange('diary')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
          value === 'diary'
            ? "bg-background text-foreground "
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <BookOpen className="h-4 w-4" />
        <span className="hidden sm:inline">{t('diary')}</span>
      </button>
      <button
        onClick={() => onChange('scientific')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
          value === 'scientific'
            ? "bg-background text-foreground "
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <GraduationCap className="h-4 w-4" />
        <span className="hidden sm:inline">{t('scientific')}</span>
      </button>
    </div>
  );
}
