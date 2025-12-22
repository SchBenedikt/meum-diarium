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

    return (
      <div key={item.id}>
        <div className="flex items-center gap-1">
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.id)}
              className="p-1 hover:bg-primary/15 rounded transition-colors ml-0"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-primary/70 hover:text-primary" />
              </motion.div>
            </button>
          ) : (
            <div className="w-6" />
          )}

          <button
            onClick={() => handleLinkClick(item.id)}
            className="flex-1 text-left group px-2 py-2 rounded-md text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all duration-200"
          >
            <span className="text-foreground/80 group-hover:text-primary transition-colors">
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
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pl-2 space-y-0 border-l-2 border-primary/30 ml-3">
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
      className="mb-8 rounded-lg bg-secondary/20 border border-primary/20 backdrop-blur-sm shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-2 bg-secondary/30 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
            <h3 className="font-display text-base font-semibold text-foreground">{title || t('tableOfContents')}</h3>
          </div>
          <button
            onClick={() => setIsContentExpanded(!isContentExpanded)}
            className="p-1.5 hover:bg-primary/15 rounded transition-colors"
            aria-label={isContentExpanded ? 'Collapse' : 'Expand'}
          >
            <motion.div
              animate={{ rotate: isContentExpanded ? 0 : -180 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-5 w-5 text-primary/70 hover:text-primary" />
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
            transition={{ duration: 0.2 }}
            className="space-y-0 text-sm p-4 overflow-hidden"
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
