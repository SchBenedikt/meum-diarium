import React, { useMemo, useState, useEffect } from 'react';
import { ChevronDown, BookOpen, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isContentExpanded, setIsContentExpanded] = useState(true);
  const [activeId, setActiveId] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState(0);

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

  // Track scroll progress and active heading
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);

      // Find active heading
      for (const item of flatToc) {
        const element = document.querySelector(`[data-heading-id="${item.id}"]`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveId(item.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [flatToc]);

  const handleLinkClick = (id: string) => {
    const element = document.querySelector(`[data-heading-id="${id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const TocItemComponent = ({ item, depth = 0 }: { item: TocItemWithExpanded; depth?: number }) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeId === item.id;
    const isTopLevel = depth === 0;

    return (
      <div key={item.id} className={isTopLevel ? 'mb-2' : 'mb-1'}>
        <button
          onClick={() => handleLinkClick(item.id)}
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
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="flex-shrink-0"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          )}
        </button>

        <AnimatePresence>
          {hasChildren && (isExpanded || isTopLevel) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="pl-2 mt-1 space-y-0.5 border-l-2 border-primary/20 ml-6">
                {item.children?.map(child => (
                  <TocItemComponent key={child.id} item={child} depth={depth + 1} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mb-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/40 overflow-hidden shadow-lg shadow-primary/5 backdrop-blur-sm relative"
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-primary via-primary/80 to-primary/60 transition-all duration-300" style={{ width: `${scrollProgress}%` }} />

      {/* Header */}
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
            onClick={() => setIsContentExpanded(!isContentExpanded)}
            className="p-2 hover:bg-primary/15 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 shrink-0"
            aria-label={isContentExpanded ? 'Collapse' : 'Expand'}
          >
            <motion.div
              animate={{ rotate: isContentExpanded ? 0 : -180 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <ChevronDown className="h-5 w-5 text-primary" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isContentExpanded && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3 py-4 space-y-1 max-h-96 overflow-y-auto scroll-smooth">
              {hierarchy.map((item) => (
                <TocItemComponent key={item.id} item={item} />
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Footer */}
      {isContentExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.1 }}
          className="px-5 py-3 border-t border-border/30 bg-card/40 backdrop-blur-sm flex items-center gap-2 text-xs text-muted-foreground/60"
        >
          <Navigation className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
          <span>Klicke auf eine Überschrift, um zu dieser Stelle zu springen</span>
        </motion.div>
      )}
    </motion.div>
  );
}
