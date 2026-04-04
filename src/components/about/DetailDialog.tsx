import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, ExternalLink, BookOpen, Clock, MapPin } from 'lucide-react';
import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

export interface DetailDialogProps {
  trigger?: ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children: ReactNode;
  icon?: ReactNode;
  footer?: ReactNode;
}

/**
 * Reusable dialog component for showing detailed information on about pages
 * Usage: Wrap content in DetailDialog with a trigger button
 */
export function DetailDialog({
  trigger,
  title,
  subtitle,
  badge,
  badgeVariant = 'secondary',
  children,
  icon,
  footer,
}: DetailDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Info className="h-4 w-4" />
            Mehr erfahren
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            {icon && (
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <DialogTitle className="text-2xl">{title}</DialogTitle>
                {badge && (
                  <Badge variant={badgeVariant} className="text-xs">
                    {badge}
                  </Badge>
                )}
              </div>
              {subtitle && (
                <DialogDescription className="text-base">
                  {subtitle}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {children}
        </div>
        {footer && (
          <div className="mt-6 pt-4 border-t border-border">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Pre-styled card for timeline events in dialogs
 */
export function TimelineCard({
  date,
  title,
  description,
  location,
}: {
  date: string;
  title: string;
  description: string;
  location?: string;
}) {
  return (
    <Card className="p-4 border-l-4 border-l-primary/40">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
          <Clock className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">{date}</p>
          <h4 className="font-semibold text-base mb-2">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          {location && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {location}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

/**
 * Pre-styled card for works/literature in dialogs
 */
export function WorkCard({
  title,
  subtitle,
  description,
  link,
}: {
  title: string;
  subtitle?: string;
  description: string;
  link?: string;
}) {
  return (
    <Card className="p-4 hover:border-primary/40 transition-colors">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
          <BookOpen className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-base mb-1">{title}</h4>
          {subtitle && (
            <p className="text-xs text-muted-foreground mb-2">{subtitle}</p>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          {link && (
            <Button variant="link" size="sm" className="px-0 mt-2 h-auto" asChild>
              <a href={link} target="_blank" rel="noopener noreferrer">
                Weiterlesen <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
