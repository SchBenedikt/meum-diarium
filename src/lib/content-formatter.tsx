import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { BookOpen } from 'lucide-react';
import { lexicon } from '@/data/lexicon';
import { authors } from '@/data/authors';
import { TranslationKey } from '@/locales/translations';
import { Language } from '@/types/blog';
import { getTranslatedLexiconEntry } from '@/lib/content-translator';
import { extractHeadingIds } from '@/lib/toc-generator';
import { TermPopover } from '@/components/TermPopover';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

interface TextNode {
  type: 'text' | 'link' | 'term' | 'code' | 'bold' | 'italic';
  content: string;
  href?: string;
  termType?: 'lexicon' | 'author';
  definition?: string;
  slug?: string;
  children?: TextNode[];
}

type Block = 
  | { type: 'heading'; level: number; text: string; id: string }
  | { type: 'paragraph'; content: TextNode[] }
  | { type: 'list'; ordered: boolean; items: TextNode[][] }
  | { type: 'blockquote'; content: TextNode[] }
  | { type: 'code'; language: string; content: string }
  | { type: 'hr' };

// Parse inline formatting (bold, italic, code, links)
function parseInlineFormatting(text: string): TextNode[] {
  const nodes: TextNode[] = [];
  let currentIndex = 0;
  
  // Regex patterns for various inline elements
  const patterns = [
    { pattern: /\*\*([^\*]+)\*\*/, type: 'bold' },
    { pattern: /\*([^\*]+)\*/, type: 'italic' },
    { pattern: /`([^`]+)`/, type: 'code' },
    { pattern: /\[([^\]]+)\]\(([^)]+)\)/, type: 'link' },
  ];

  let lastIndex = 0;
  let html = text;

  // Process patterns in order: links first, then formatting
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  const links = [];
  while ((match = linkRegex.exec(text)) !== null) {
    links.push({ start: match.index, end: match.index + match[0].length, text: match[1], url: match[2] });
  }

  // Remove links from text parts that will be processed
  let processedText = text;
  const boldRegex = /\*\*([^\*]+)\*\*/g;
  const italicRegex = /\*([^\*]+)\*/g;
  const codeRegex = /`([^`]+)`/g;

  const segments: Array<{ text: string; type: string; value?: string }> = [];
  lastIndex = 0;

  // Simple approach: split on patterns and identify them
  const combined = [
    ...Array.from(text.matchAll(/\*\*([^\*]+)\*\*/g)).map(m => ({ index: m.index!, end: m.index! + m[0].length, type: 'bold', value: m[1] })),
    ...Array.from(text.matchAll(/\*([^\*]+)\*/g)).map(m => ({ index: m.index!, end: m.index! + m[0].length, type: 'italic', value: m[1] })),
    ...Array.from(text.matchAll(/`([^`]+)`/g)).map(m => ({ index: m.index!, end: m.index! + m[0].length, type: 'code', value: m[1] })),
    ...Array.from(text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)).map(m => ({ index: m.index!, end: m.index! + m[0].length, type: 'link', value: m[1], url: m[2] })),
  ].sort((a, b) => a.index - b.index);

  lastIndex = 0;
  for (const match of combined) {
    // Add text before this match
    if (lastIndex < match.index) {
      nodes.push({ type: 'text', content: text.substring(lastIndex, match.index) });
    }

    if (match.type === 'bold') {
      nodes.push({ type: 'bold', content: match.value! });
    } else if (match.type === 'italic') {
      nodes.push({ type: 'italic', content: match.value! });
    } else if (match.type === 'code') {
      nodes.push({ type: 'code', content: match.value! });
    } else if (match.type === 'link') {
      nodes.push({ type: 'link', content: match.value!, href: match.url });
    }

    lastIndex = match.end;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    nodes.push({ type: 'text', content: text.substring(lastIndex) });
  }

  return nodes.length > 0 ? nodes : [{ type: 'text', content: text }];
}

// Parse blocks (headings, paragraphs, lists, etc.)
function parseMarkdown(content: string): Block[] {
  const lines = content.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{2,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      blocks.push({
        type: 'heading',
        level,
        text,
        id: slugify(text),
      });
      i++;
      continue;
    }

    // Horizontal rules
    if (trimmed.match(/^(-{3,}|\*{3,}|_{3,})$/)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Code blocks
    if (trimmed.startsWith('```')) {
      const language = trimmed.substring(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({
        type: 'code',
        language,
        content: codeLines.join('\n'),
      });
      i++; // Skip closing ```
      continue;
    }

    // Blockquotes
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().substring(1).trim());
        i++;
      }
      blocks.push({
        type: 'blockquote',
        content: parseInlineFormatting(quoteLines.join(' ')),
      });
      continue;
    }

    // Unordered lists
    if (trimmed.match(/^[-•]\s+/)) {
      const listItems: TextNode[][] = [];
      while (i < lines.length && lines[i].trim().match(/^[-•]\s+/)) {
        const itemText = lines[i].trim().substring(1).trim();
        listItems.push(parseInlineFormatting(itemText));
        i++;
      }
      blocks.push({
        type: 'list',
        ordered: false,
        items: listItems,
      });
      continue;
    }

    // Ordered lists
    if (trimmed.match(/^\d+\.\s+/)) {
      const listItems: TextNode[][] = [];
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s+/)) {
        const itemText = lines[i].trim().replace(/^\d+\.\s+/, '');
        listItems.push(parseInlineFormatting(itemText));
        i++;
      }
      blocks.push({
        type: 'list',
        ordered: true,
        items: listItems,
      });
      continue;
    }

    // Paragraphs (consume consecutive non-empty lines)
    const paragraphLines: string[] = [];
    while (i < lines.length && lines[i].trim() && 
           !lines[i].trim().match(/^#{2,4}\s/) &&
           !lines[i].trim().match(/^[-•]\s+/) &&
           !lines[i].trim().match(/^\d+\.\s+/) &&
           !lines[i].trim().match(/^>/) &&
           !lines[i].trim().match(/^```/) &&
           !lines[i].trim().match(/^(-{3,}|\*{3,}|_{3,})$/)) {
      paragraphLines.push(lines[i]);
      i++;
    }

    if (paragraphLines.length > 0) {
      blocks.push({
        type: 'paragraph',
        content: parseInlineFormatting(paragraphLines.join(' ')),
      });
    }
  }

  return blocks;
}

// Render a text node with lexicon linking
function renderTextNode(node: TextNode, termsMap: Map<string, { slug: string; definition: string; type: 'lexicon' | 'author' }>, location: ReturnType<typeof useLocation>): React.ReactNode {
  switch (node.type) {
    case 'text':
      // Check if text contains any terms
      const terms = Array.from(termsMap.keys()).sort((a, b) => b.length - a.length);
      if (terms.length === 0) return node.content;

      const escapedTerms = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      const regex = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');

      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(node.content)) !== null) {
        // Add text before match
        if (lastIndex < match.index) {
          parts.push(node.content.substring(lastIndex, match.index));
        }

        const term = match[0];
        const termInfo = termsMap.get(term.toLowerCase());

        if (termInfo) {
          const linkPath = termInfo.type === 'author' ? `/${termInfo.slug}` : `/lexicon/${termInfo.slug}`;
          parts.push(
            <TermPopover key={match.index} term={term} type={termInfo.type}>
              <Link
                to={linkPath}
                state={{ from: location.pathname + location.search }}
                className="inline text-primary border-b border-primary/50 border-dashed cursor-pointer hover:border-primary transition-colors"
              >
                {term}
              </Link>
            </TermPopover>
          );
        } else {
          parts.push(term);
        }

        lastIndex = match.index + term.length;
      }

      if (lastIndex < node.content.length) {
        parts.push(node.content.substring(lastIndex));
      }

      return <>{parts}</>;

    case 'bold':
      return <strong>{node.content}</strong>;
    case 'italic':
      return <em>{node.content}</em>;
    case 'code':
      return <code className="px-1.5 py-0.5 rounded bg-secondary/50 text-sm font-mono">{node.content}</code>;
    case 'link':
      return (
        <a href={node.href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          {node.content}
        </a>
      );
    default:
      return node.content;
  }
}

function renderTextNodes(nodes: TextNode[], termsMap: Map<string, { slug: string; definition: string; type: 'lexicon' | 'author' }>, location: ReturnType<typeof useLocation>): React.ReactNode[] {
  return nodes.map((node, idx) => (
    <React.Fragment key={idx}>{renderTextNode(node, termsMap, location)}</React.Fragment>
  ));
}

export function formatContent(content: string, t: (key: TranslationKey) => string, language: Language, currentSlug?: string): React.ReactNode[] {
  const location = useLocation();
  
  // Build terms map
  const termsMap = new Map<string, { slug: string; definition: string; type: 'lexicon' | 'author' }>();

  lexicon.forEach(originalEntry => {
    if (originalEntry.slug === currentSlug) return;
    const translatedEntry = getTranslatedLexiconEntry(originalEntry, language);
    if (translatedEntry.term) {
      termsMap.set(translatedEntry.term.toLowerCase(), { slug: originalEntry.slug, definition: translatedEntry.definition, type: 'lexicon' });
    }
    translatedEntry.variants?.forEach(variant => {
      if (variant) {
        termsMap.set(variant.toLowerCase(), { slug: originalEntry.slug, definition: translatedEntry.definition, type: 'lexicon' });
      }
    });
  });

  Object.values(authors).forEach(author => {
    const shortName = author.name.split(' ').pop() || '';
    if (shortName) {
      termsMap.set(author.name.toLowerCase(), { slug: author.id, definition: author.description, type: 'author' });
      termsMap.set(shortName.toLowerCase(), { slug: author.id, definition: author.description, type: 'author' });
    }
    if (author.latinName && author.latinName !== author.name) {
      termsMap.set(author.latinName.toLowerCase(), { slug: author.id, definition: author.description, type: 'author' });
    }
  });

  // Parse markdown
  const blocks = parseMarkdown(content);

  // Render blocks
  return blocks.map((block, idx) => {
    switch (block.type) {
      case 'heading':
        const HeadingTag = `h${block.level}` as any;
        const headingClass = block.level === 2
          ? 'font-display text-2xl sm:text-3xl font-bold leading-tight tracking-tight mt-8 mb-4 scroll-mt-24'
          : block.level === 3
          ? 'font-display text-xl sm:text-2xl font-bold leading-tight tracking-tight mt-6 mb-3 scroll-mt-24'
          : 'font-display text-lg sm:text-xl font-bold leading-tight tracking-tight mt-5 mb-2 scroll-mt-24';
        
        return (
          <HeadingTag key={idx} className={headingClass} data-heading-id={block.id}>
            {block.text}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p key={idx} className="text-base leading-relaxed mb-4">
            {renderTextNodes(block.content, termsMap, location)}
          </p>
        );

      case 'list':
        const ListTag = block.ordered ? 'ol' : 'ul';
        return (
          <ListTag key={idx} className={block.ordered ? 'list-decimal' : 'list-disc'} style={{ paddingLeft: '1.5rem', marginBottom: '1rem', marginTop: '1rem', lineHeight: '1.75' }}>
            {block.items.map((item, itemIdx) => (
              <li key={itemIdx}>
                {renderTextNodes(item, termsMap, location)}
              </li>
            ))}
          </ListTag>
        );

      case 'blockquote':
        return (
          <blockquote key={idx} className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground my-4">
            <p>{renderTextNodes(block.content, termsMap, location)}</p>
          </blockquote>
        );

      case 'code':
        return (
          <pre key={idx} className="bg-secondary/50 rounded-lg p-4 overflow-x-auto my-4">
            <code className="text-sm font-mono">{block.content}</code>
          </pre>
        );

      case 'hr':
        return <hr key={idx} className="my-8 border-border/40" />;

      default:
        return null;
    }
  }).filter(Boolean);
}
