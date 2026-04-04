import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionSection {
  id: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  content: React.ReactNode;
}

export interface AboutAccordionProps {
  sections: AccordionSection[];
  defaultValue?: string;
  type?: 'single' | 'multiple';
  className?: string;
}

/**
 * Enhanced accordion component for about pages
 * Displays collapsible sections with icons, badges, and rich content
 */
export function AboutAccordion({
  sections,
  defaultValue,
  type = 'single',
  className,
}: AboutAccordionProps) {
  return (
    <Accordion
      type={type as any}
      defaultValue={defaultValue}
      className={cn('space-y-2', className)}
    >
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <AccordionItem
            key={section.id}
            value={section.id}
            className="border border-border/60 rounded-xl px-4 hover:border-primary/40 transition-colors"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 flex-1 text-left">
                {Icon && (
                  <div
                    className="p-2 rounded-lg border shrink-0"
                    style={{
                      backgroundColor: section.iconColor ? `${section.iconColor}15` : 'hsl(var(--primary) / 0.1)',
                      borderColor: section.iconColor ? `${section.iconColor}30` : 'hsl(var(--primary) / 0.2)',
                    }}
                  >
                    <Icon
                      className="h-4 w-4"
                      style={{ color: section.iconColor || 'hsl(var(--primary))' }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{section.title}</span>
                    {section.badge && (
                      <Badge variant={section.badgeVariant || 'secondary'} className="text-xs">
                        {section.badge}
                      </Badge>
                    )}
                  </div>
                  {section.subtitle && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {section.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-2">
              {section.content}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
