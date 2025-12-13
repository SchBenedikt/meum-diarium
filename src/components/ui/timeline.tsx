import * as React from 'react';
import { cn } from '@/lib/utils';

export function Timeline({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <ol className={cn('relative space-y-8', className)}>
      {children}
    </ol>
  );
}

export function TimelineItem({ className, children, as: Component = 'li', to }: React.PropsWithChildren<{ className?: string; as?: any; to?: string }>) {
  const Comp: any = Component;
  const props: any = to ? { to } : {};
  return (
    <Comp className={cn('relative pl-8', className)} {...props}>
      {children}
    </Comp>
  );
}

export function TimelineConnector({ className }: { className?: string }) {
  return (
    <span className={cn('absolute left-3 top-0 bottom-0 w-px bg-border', className)} aria-hidden />
  );
}

export function TimelineHeader({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn('flex items-start gap-2 mb-2', className)}>{children}</div>;
}

export function TimelineIcon({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <span className={cn('flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground border border-border', className)}>
      {children}
    </span>
  );
}

export function TimelineBadge({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <span className={cn('inline-flex items-center rounded-full bg-secondary/50 text-xs font-medium px-2 py-1', className)}>
      {children}
    </span>
  );
}

export function TimelineTitle({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <h3 className={cn('font-display text-lg', className)}>{children}</h3>;
}

export function TimelineDescription({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>;
}

export function TimelineContent({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn('mt-2', className)}>{children}</div>;
}
