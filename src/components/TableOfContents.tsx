import React, { useMemo, useState } from 'react';
import { ChevronDown, FileText } from 'lucide-react';
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
  
  const flatToc = useMemo(() => generateTableOfContents(content), [content]);
  const hierarchy = useMemo(() => {
    const buildHierarchy = (items: TocItem[]): TocItemWithExpanded[] => {
      const result: TocItemWithExpanded[] = [];
      const stack: TocItemWithExpanded[] = [];

      items.forEach(item => {
        const newItem: TocItemWithExpanded = { ...item, children: [], isExpanded: false };

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

  const handleLinkClick = (id: string) => {
    const element = document.querySelector(`[data-heading-id="${id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    const isTopLevel = depth === 0;

    return (
      <div key={item.id} className={isTopLevel ? 'mb-1' : 'mb-0'}>
        <div className="flex items-center gap-2 group/item">
          {hasChildren && (
            <button
              onClick={() => toggleExpanded(item.id)}
              className="p-1.5 hover:bg-primary/20 rounded-md transition-all duration-200 flex-shrink-0"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                <ChevronDown className="h-3.5 w-3.5 text-primary" />
              </motion.div>
            </button>
          )}

          <button
            onClick={() => handleLinkClick(item.id)}
            className={`flex-1 text-left px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isTopLevel 
                ? 'font-semibold text-[15px] hover:bg-primary/10 hover:pl-4 hover:shadow-sm' 
                : 'font-normal text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 hover:pl-4'
            }`}
          >
            <span className={`transition-colors duration-200 ${
              isTopLevel 
                ? 'text-foreground group-hover/item:text-primary' 
                : 'group-hover/item:text-primary'
            }`}>
              {isTopLevel && <span className="text-primary/40 mr-2 font-normal">▸</span>}
              {item.text}
            </span>
          </button>
        </div>

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="pl-7 mt-1 mb-2 space-y-0.5 border-l-2 border-primary/20 ml-2">
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
      className="mb-8 rounded-[1.25rem] bg-card border border-border/50 overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-secondary/40 to-secondary/20 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-primary/15 rounded-lg">
              <FileText className="h-4 w-4 text-primary flex-shrink-0" />
            </div>
            <h3 className="font-display text-base font-bold text-foreground tracking-tight">
              {title || t('tableOfContents')}
            </h3>
          </div>
          <button
            onClick={() => setIsContentExpanded(!isContentExpanded)}
            className="p-2 hover:bg-primary/15 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
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
            className="space-y-0 text-sm px-4 py-4 overflow-hidden"
          >
            {hierarchy.map((item) => (
              <TocItemComponent key={item.id} item={item} />
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
