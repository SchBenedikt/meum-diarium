import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  label?: string | ReactNode;
  labelIcon?: React.ComponentType<{ className?: string }>;
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  align?: 'left' | 'center';
  className?: string;
  subtitleClassName?: string;
}

export function SectionHeader({
  label,
  labelIcon: LabelIcon,
  title,
  subtitle,
  align = 'center',
  className,
  subtitleClassName,
}: SectionHeaderProps) {
  const alignment = align === 'left' ? 'items-start text-left' : 'items-center text-center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={cn('flex flex-col gap-4', alignment, className)}
    >
      {label && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold tracking-[0.2em] uppercase backdrop-blur-md border border-primary/20">
          {LabelIcon && <LabelIcon className="h-4 w-4" />}
          <span>{label}</span>
        </div>
      )}

      <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
        {title}
      </h1>

      {subtitle && (
        <p
          className={cn(
            'text-muted-foreground text-lg sm:text-xl max-w-3xl leading-relaxed font-light',
            subtitleClassName,
            align === 'center' ? 'mx-auto' : ''
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
