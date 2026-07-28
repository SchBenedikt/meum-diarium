import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { ChevronDown, BookOpen, Navigation } from 'lucide-react';
import { generateTableOfContents, TocItem } from '@/lib/toc-generator';
import { useLanguage } from '@/context/LanguageContext';

interface TableOfContentsProps {
  content: string;
  title?: string;
}

interface TocItemWithExpanded extends TocItem {
  children?: TocItemWithExpanded[];
  isExpanded?: boolean;
}

export function TableOfContents({ content, title }: TableOfContentsProps) {
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  if (!content || typeof content !== 'string') {
    return null;
  }

  const flatToc = useMemo(() => generateTableOfContents(content || ''), [content]);
  const hierarchy = useMemo(() => {
    const buildHierarchy = (items: TocItem[]): TocItemWithExpanded[] => {
      const result: TocItemWithExpanded[] = [];
      const stack: TocItemWithExpanded[] = [];

      items.forEach(item => {
        const newItem: TocItemWithExpanded = { ...item, children: [], isExpanded: true };
        while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
          stack.pop();
        }
        if (stack.length > 0) {
          stack[stack.length - 1].children?.push(newItem);
        } else {
          result.push(newItem);
        }
        stack.push(newItem);
      });

      return result;
    };
    return buildHierarchy(flatToc);
  }, [flatToc]);

  if (flatToc.length === 0) return null;

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-heading-id');
            if (id) setActiveId(id);
          }
        }
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    const headings = document.querySelectorAll('[data-heading-id]');
    headings.forEach(h => observer.observe(h));

    return () => {
      observer.disconnect();
    };
  }, [flatToc]);

  const handleLinkClick = useCallback((id: string) => {
    const element = document.querySelector(`[data-heading-id="${id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  }, []);

  return (
    <div className="mb-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/40 overflow-hidden shadow-lg shadow-primary/5 backdrop-blur-sm">
      <div className="px-5 py-4 border-b border-border/30 bg-card/60 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-primary/15 rounded-xl shrink-0">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-base font-bold text-foreground tracking-tight truncate">
                {title || t('tableOfContents')}
              </h3>
              <p className="text-xs text-muted-foreground/60">
                {flatToc.length} {flatToc.length === 1 ? 'Abschnitt' : 'Abschnitte'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-primary/15 rounded-lg transition-all duration-200 shrink-0"
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <ChevronDown className={`h-5 w-5 text-primary transition-transform duration-200 ${isCollapsed ? '-rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="px-3 py-4 space-y-1 max-h-96 overflow-y-auto scroll-smooth">
          {hierarchy.map((item) => (
            <TocItemComponent key={item.id} item={item} activeId={activeId} onLinkClick={handleLinkClick} />
          ))}
        </div>
      )}

      {!isCollapsed && (
        <div className="px-5 py-3 border-t border-border/30 bg-card/40 backdrop-blur-sm flex items-center gap-2 text-xs text-muted-foreground/60">
          <Navigation className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
          <span>Klicke auf eine Überschrift, um zu dieser Stelle zu springen</span>
        </div>
      )}
    </div>
  );
}

function TocItemComponent({ item, activeId, onLinkClick, depth = 0 }: { item: TocItemWithExpanded; activeId: string; onLinkClick: (id: string) => void; depth?: number }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeId === item.id;
  const isTopLevel = depth === 0;

  return (
    <div className={isTopLevel ? 'mb-2' : 'mb-1'}>
      <button
        onClick={() => onLinkClick(item.id)}
        className={`w-full text-left group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-primary/15 text-primary font-semibold'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
        }`}
      >
        {isTopLevel && (
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-200 ${
            isActive ? 'bg-primary w-2' : 'bg-border/40 group-hover:bg-primary/60'
          }`} />
        )}
        {!isTopLevel && (
          <div className="w-1 h-1 rounded-full bg-border/40 flex-shrink-0 group-hover:bg-primary/60" />
        )}
        <span className={`flex-1 text-sm transition-colors duration-200 ${
          isTopLevel ? 'font-semibold' : 'font-normal text-xs'
        }`}>
          {item.text}
        </span>
        {hasChildren && isTopLevel && (
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="flex-shrink-0 p-0.5"
          >
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </button>

      {hasChildren && isExpanded && (
        <div className="pl-2 mt-1 border-l-2 border-primary/20 ml-6 space-y-0.5">
          {item.children?.map(child => (
            <TocItemComponent key={child.id} item={child} activeId={activeId} onLinkClick={onLinkClick} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
