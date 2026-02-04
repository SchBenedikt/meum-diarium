import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLexicon } from '@/hooks/use-lexicon';
import { authors } from '@/data/authors';
import { TranslationKey } from '@/locales/translations';
import { Language } from '@/types/blog';
import { getTranslatedLexiconEntry } from '@/lib/content-translator';
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
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'hr' };

// Parse inline formatting (bold, italic, code, links)
function parseInlineFormatting(text: string): TextNode[] {
  const nodes: TextNode[] = [];

  // Collect all matches with their positions
  const matches: Array<{ 
    index: number; 
    end: number; 
    type: 'bold' | 'italic' | 'code' | 'link'; 
    value: string;
    url?: string;
  }> = [];

  // Bold must be checked BEFORE italic to avoid overlaps
  const boldMatches = Array.from(text.matchAll(/\*\*([^\*]+)\*\*/g));
  const boldRanges = new Set<number>();
  boldMatches.forEach(m => {
    matches.push({ 
      index: m.index!, 
      end: m.index! + m[0].length, 
      type: 'bold', 
      value: m[1] 
    });
    for (let i = m.index!; i < m.index! + m[0].length; i++) {
      boldRanges.add(i);
    }
  });

  // Italic - only match if NOT inside bold markers
  const italicMatches = Array.from(text.matchAll(/\*([^\*]+)\*/g));
  italicMatches.forEach(m => {
    let isInBold = false;
    for (let i = m.index!; i < m.index! + m[0].length; i++) {
      if (boldRanges.has(i)) {
        isInBold = true;
        break;
      }
    }
    if (!isInBold && m[1].length > 0) {
      matches.push({ 
        index: m.index!, 
        end: m.index! + m[0].length, 
        type: 'italic', 
        value: m[1] 
      });
    }
  });

  // Code
  const codeMatches = Array.from(text.matchAll(/`([^`]+)`/g));
  codeMatches.forEach(m => {
    matches.push({ 
      index: m.index!, 
      end: m.index! + m[0].length, 
      type: 'code', 
      value: m[1] 
    });
  });

  // Links
  const linkMatches = Array.from(text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g));
  linkMatches.forEach(m => {
    matches.push({ 
      index: m.index!, 
      end: m.index! + m[0].length, 
      type: 'link', 
      value: m[1],
      url: m[2]
    });
  });

  matches.sort((a, b) => a.index - b.index);

  const finalMatches: typeof matches = [];
  let lastEnd = 0;
  for (const match of matches) {
    if (match.index >= lastEnd) {
      finalMatches.push(match);
      lastEnd = match.end;
    }
  }

  let lastIndex = 0;
  for (const match of finalMatches) {
    if (lastIndex < match.index) {
      nodes.push({ type: 'text', content: text.substring(lastIndex, match.index) });
    }

    if (match.type === 'bold') {
      nodes.push({ type: 'bold', content: match.value });
    } else if (match.type === 'italic') {
      nodes.push({ type: 'italic', content: match.value });
    } else if (match.type === 'code') {
      nodes.push({ type: 'code', content: match.value });
    } else if (match.type === 'link') {
      nodes.push({ type: 'link', content: match.value, href: match.url });
    }

    lastIndex = match.end;
  }

  if (lastIndex < text.length) {
    nodes.push({ type: 'text', content: text.substring(lastIndex) });
  }

  return nodes.length > 0 ? nodes : [{ type: 'text', content: text }];
}

// Parse blocks
function parseMarkdown(content: string): Block[] {
  const lines = content.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

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

    if (trimmed.match(/^(-{3,}|\*{3,}|_{3,})$/)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

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
      i++;
      continue;
    }

    if (trimmed.includes('|') && i + 1 < lines.length) {
      const nextLine = lines[i + 1].trim();
      if (nextLine.includes('|') && nextLine.match(/[|-]/g)) {
        const isSeparator = nextLine.split('|')
          .filter(cell => cell.trim())
          .every(cell => cell.trim().match(/^[-:\s]+$/));

        if (isSeparator) {
          const headerCells = trimmed.split('|')
            .map(cell => cell.trim())
            .filter(cell => cell);

          const tableRows: string[][] = [];
          i += 2;

          while (i < lines.length && lines[i].trim().includes('|')) {
            const rowLine = lines[i].trim();
            const rowCells = rowLine.split('|')
              .map(cell => cell.trim())
              .filter(cell => cell);
            
            if (rowCells.length > 0) {
              tableRows.push(rowCells);
            }
            i++;
          }

          if (headerCells.length > 0) {
            blocks.push({
              type: 'table',
              headers: headerCells,
              rows: tableRows,
            });
            continue;
          }
        }
      }
    }

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

    const paragraphLines: string[] = [];
    while (i < lines.length && lines[i].trim() && 
           !lines[i].trim().match(/^#{2,4}\s/) &&
           !lines[i].trim().match(/^[-•]\s+/) &&
           !lines[i].trim().match(/^\d+\.\s+/) &&
           !lines[i].trim().match(/^>/) &&
           !lines[i].trim().match(/^```/) &&
           !lines[i].trim().match(/^(-{3,}|\*{3,}|_{3,})$/) &&
           !(i + 1 < lines.length && lines[i].includes('|') && lines[i + 1].trim().match(/\|.*-+/))) {
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

interface FormattedContentProps {
  content: string;
  language: Language;
  currentSlug?: string;
}

export function FormattedContent({ content, language, currentSlug }: FormattedContentProps) {
  const location = useLocation();
  const { lexicon } = useLexicon();

  // Build terms map from actual lexicon data
  const termsMap = new Map<string, { slug: string; definition: string; type: 'lexicon' | 'author' }>();

  lexicon.forEach((originalEntry: any) => {
    if (originalEntry.slug === currentSlug) return;
    
    const translatedEntry = getTranslatedLexiconEntry(originalEntry, language);
    
    if (translatedEntry.term) {
      termsMap.set(translatedEntry.term.toLowerCase(), { 
        slug: originalEntry.slug, 
        definition: translatedEntry.definition, 
        type: 'lexicon' 
      });
    }
    
    translatedEntry.variants?.forEach((variant: string) => {
      if (variant) {
        termsMap.set(variant.toLowerCase(), { 
          slug: originalEntry.slug, 
          definition: translatedEntry.definition, 
          type: 'lexicon' 
        });
      }
    });
  });

  Object.values(authors).forEach((author: any) => {
    const shortName = author.name.split(' ').pop() || '';
    if (shortName) {
      termsMap.set(author.name.toLowerCase(), { slug: author.id, definition: author.description, type: 'author' });
      termsMap.set(shortName.toLowerCase(), { slug: author.id, definition: author.description, type: 'author' });
    }
    if (author.latinName && author.latinName !== author.name) {
      termsMap.set(author.latinName.toLowerCase(), { slug: author.id, definition: author.description, type: 'author' });
    }
  });

  const renderWithTerms = (text: string): React.ReactNode[] => {
    const terms = Array.from(termsMap.keys()).sort((a, b) => b.length - a.length);
    if (terms.length === 0) return [text];

    const escapedTerms = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let keyCounter = 0;

    while ((match = regex.exec(text)) !== null) {
      if (lastIndex < match.index) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const term = match[0];
      const termInfo = termsMap.get(term.toLowerCase());

      if (termInfo) {
        const linkPath = termInfo.type === 'author' ? `/${termInfo.slug}` : `/lexicon/${termInfo.slug}`;
        parts.push(
          <TermPopover key={`term-${keyCounter++}`} term={term} type={termInfo.type}>
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

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  const renderTextNode = (node: TextNode): React.ReactNode => {
    switch (node.type) {
      case 'text':
        return <>{renderWithTerms(node.content)}</>;

      case 'bold':
        return <strong>{renderWithTerms(node.content)}</strong>;
      
      case 'italic':
        return <em>{renderWithTerms(node.content)}</em>;
      
      case 'code':
        return <code className="px-1.5 py-0.5 rounded bg-secondary/50 text-sm font-mono">{node.content}</code>;
      
      case 'link':
        return (
          <a href={node.href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            {renderWithTerms(node.content)}
          </a>
        );
      
      default:
        return node.content;
    }
  };

  const renderTextNodes = (nodes: TextNode[]): React.ReactNode[] => {
    return nodes.map((node, idx) => (
      <React.Fragment key={idx}>{renderTextNode(node)}</React.Fragment>
    ));
  };

  // Parse markdown
  const blocks = parseMarkdown(content);

  // Render blocks
  return (
    <>
      {blocks.map((block, idx) => {
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
                {renderTextNodes(block.content)}
              </p>
            );

          case 'list':
            const ListTag = block.ordered ? 'ol' : 'ul';
            return (
              <ListTag key={idx} className={block.ordered ? 'list-decimal' : 'list-disc'} style={{ paddingLeft: '1.5rem', marginBottom: '1rem', marginTop: '1rem', lineHeight: '1.75' }}>
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    {renderTextNodes(item)}
                  </li>
                ))}
              </ListTag>
            );

          case 'blockquote':
            return (
              <blockquote key={idx} className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground my-4">
                <p>{renderTextNodes(block.content)}</p>
              </blockquote>
            );

          case 'code':
            return (
              <pre key={idx} className="bg-secondary/50 rounded-lg p-4 overflow-x-auto my-4">
                <code className="text-sm font-mono">{block.content}</code>
              </pre>
            );

          case 'table':
            return (
              <div key={idx} className="overflow-x-auto my-6">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-secondary/60">
                      {block.headers.map((header, hIdx) => (
                        <th 
                          key={hIdx}
                          className="px-4 py-3 text-left font-semibold border border-border text-sm"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-secondary/30 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td 
                            key={cIdx}
                            className="px-4 py-2 border border-border text-sm"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'hr':
            return <hr key={idx} className="my-8 border-border/40" />;

          default:
            return null;
        }
      }).filter(Boolean)}
    </>
  );
}
