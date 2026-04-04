import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface InfoCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

/**
 * Enhanced info card component for about pages
 * Features: icon, badge, hover effects, optional interactivity
 */
export function InfoCard({
  title,
  description,
  icon: Icon,
  iconColor,
  badge,
  badgeVariant = 'secondary',
  children,
  footer,
  className,
  interactive = false,
  onClick,
}: InfoCardProps) {
  return (
    <Card
      className={cn(
        'border-border/60 transition-all duration-200',
        interactive && 'cursor-pointer hover:border-primary/40 hover:shadow-lg hover:scale-[1.02]',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {Icon && (
            <div
              className="p-2.5 rounded-xl border shrink-0"
              style={{
                backgroundColor: iconColor ? `${iconColor}15` : 'hsl(var(--primary) / 0.1)',
                borderColor: iconColor ? `${iconColor}30` : 'hsl(var(--primary) / 0.2)',
              }}
            >
              <Icon
                className="h-5 w-5"
                style={{ color: iconColor || 'hsl(var(--primary))' }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <CardTitle className="text-lg">{title}</CardTitle>
              {badge && (
                <Badge variant={badgeVariant} className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            {description && (
              <CardDescription className="text-sm leading-relaxed">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      {children && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
      {footer && (
        <div className="px-6 pb-4 pt-2 border-t border-border/40">
          {footer}
        </div>
      )}
    </Card>
  );
}

/**
 * Stat card variant - displays a key metric
 */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}) {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-muted-foreground',
  };

  return (
    <Card className={cn('border-border/60 hover:border-primary/40 transition-colors', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              {label}
            </p>
            <p className={cn('text-2xl font-bold', trend && trendColors[trend])}>
              {value}
            </p>
            {hint && (
              <p className="text-xs text-muted-foreground mt-1">{hint}</p>
            )}
          </div>
          {Icon && (
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <Icon className="h-4 w-4 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
