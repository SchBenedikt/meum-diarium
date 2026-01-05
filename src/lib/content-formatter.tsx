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

function LexiconTerm({ term, definition, slug, t }: { term: string, definition: string, slug: string, t: (key: TranslationKey) => string }) {
  const location = useLocation();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={`/lexicon/${slug}`}
          state={{ from: location.pathname + location.search }}
          className="inline text-primary border-b border-primary/50 border-dashed cursor-pointer"
        >
          {term}
        </Link>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="p-2">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {t('navLexicon')}
          </h4>
          <p className="text-sm">{definition}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function formatContent(content: string, t: (key: TranslationKey) => string, language: Language, currentSlug?: string): React.ReactNode[] {
  // 1. Get all relevant terms for the CURRENT language
  const termsMap = new Map<string, { slug: string, definition: string, type: 'lexicon' | 'author' }>();

  // Add lexicon terms
  lexicon.forEach(originalEntry => {
    if (originalEntry.slug === currentSlug) return;

    const translatedEntry = getTranslatedLexiconEntry(originalEntry, language);

    // Add main term
    if (translatedEntry.term) {
      termsMap.set(translatedEntry.term.toLowerCase(), { slug: originalEntry.slug, definition: translatedEntry.definition, type: 'lexicon' });
    }

    // Add variants (now including language-specific ones)
    translatedEntry.variants?.forEach(variant => {
      if (variant) {
        termsMap.set(variant.toLowerCase(), { slug: originalEntry.slug, definition: translatedEntry.definition, type: 'lexicon' });
      }
    });
  });

  // Add author names
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

  const linkableTerms = Array.from(termsMap.keys()).sort((a, b) => b.length - a.length);

  if (linkableTerms.length === 0) {
    return [<p key="line-0">{content}</p>];
  }

  // Escape special characters in terms for regex
  const escapedTerms = linkableTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');

  // Pre-process content to separate lists from text
  const processedContent = content.replace(/\n([-\d])/g, '\n\n$1');

  return processedContent.split(/(\n\n)/).map((paragraph, pIndex) => {
    let parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;

    if (paragraph.trim() === '') return null;

    // Handle horizontal rule FIRST (before any other HTML processing)
    if (paragraph.match(/^\s*-{3,}\s*$/) || paragraph.match(/^\s*\*{3,}\s*$/) || paragraph.match(/^\s*_{3,}\s*$/)) {
      return <hr key={pIndex} className="my-8 border-border/40" />;
    }

    let htmlParagraph = paragraph
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Handle headings
    if (htmlParagraph.match(/^#{2,3}\s/)) {
      const level = htmlParagraph.startsWith('###') ? 3 : 2;
      const text = htmlParagraph.replace(/^#{2,3}\s/, '');
      const id = slugify(text);
      return React.createElement(`h${level}`, { 
        key: pIndex, 
        'data-heading-id': id,
        dangerouslySetInnerHTML: { __html: text } 
      });
    }
    
    // Handle headings with ####
    if (htmlParagraph.match(/^#{4}\s/)) {
      const text = htmlParagraph.replace(/^#{4}\s/, '');
      const id = slugify(text);
      return <h4 key={pIndex} data-heading-id={id} dangerouslySetInnerHTML={{ __html: text }} />;
    }
    
    // Handle blockquotes
    if (htmlParagraph.match(/^>\s/)) {
      const text = htmlParagraph.replace(/^>\s/, '');
      return <blockquote key={pIndex}><p dangerouslySetInnerHTML={{ __html: text }} /></blockquote>;
    }

    // Handle unordered lists (lines starting with -)
    if (htmlParagraph.match(/^-\s/) || htmlParagraph.includes('\n-')) {
      const lines = htmlParagraph.split('\n');
      const listItems: React.ReactNode[] = [];
      
      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('-')) {
          const itemText = trimmed.replace(/^-\s*/, '');
          listItems.push(<li key={`${pIndex}-${idx}`} dangerouslySetInnerHTML={{ __html: itemText }} />);
        }
      });
      
      if (listItems.length > 0) {
        return <ul key={pIndex} className="list-disc pl-6 space-y-2 my-4">{listItems}</ul>;
      }
    }

    // Handle ordered lists (lines starting with numbers)
    if (htmlParagraph.match(/^\d+\.\s/) || htmlParagraph.includes('\n1.') || htmlParagraph.includes('\n2.')) {
      const lines = htmlParagraph.split('\n');
      const listItems: React.ReactNode[] = [];
      
      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.match(/^\d+\.\s/)) {
          const itemText = trimmed.replace(/^\d+\.\s*/, '');
          listItems.push(<li key={`${pIndex}-${idx}`} dangerouslySetInnerHTML={{ __html: itemText }} />);
        }
      });
      
      if (listItems.length > 0) {
        return <ol key={pIndex} className="list-decimal pl-6 space-y-2 my-4">{listItems}</ol>;
      }
    }

    // Handle markdown tables
    if (htmlParagraph.includes('|')) {
      const lines = htmlParagraph.split('\n').map(l => l.trim()).filter(l => l);
      
      // Check if this looks like a table (has | separators)
      if (lines.length >= 2 && lines[0].includes('|') && lines[1].includes('---')) {
        const rows: string[][] = [];
        let headerFound = false;
        
        lines.forEach((line, idx) => {
          // Skip separator line
          if (line.match(/^\|?\s*[-:\s|]+\s*\|?\s*$/)) {
            return;
          }
          
          const cells = line
            .split('|')
            .map(cell => cell.trim())
            .filter(cell => cell !== '');
          
          if (cells.length > 0) {
            rows.push(cells);
          }
        });

        if (rows.length >= 1) {
          const headerRow = rows[0];
          const bodyRows = rows.slice(1);

          return (
            <div key={pIndex} className="overflow-x-auto my-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {headerRow.map((cell, idx) => (
                      <th 
                        key={idx}
                        className="px-4 py-3 text-left font-semibold bg-secondary/50 border border-border text-sm"
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-secondary/20 transition-colors">
                      {row.map((cell, cellIdx) => (
                        <td 
                          key={cellIdx}
                          className="px-4 py-3 border border-border text-sm"
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
        }
      }
    }

    let tempParagraph = htmlParagraph;
    let result;
    while ((result = regex.exec(tempParagraph)) !== null) {
      if (result.index > lastIndex) {
        parts.push(<span key={lastIndex} dangerouslySetInnerHTML={{ __html: tempParagraph.substring(lastIndex, result.index) }} />);
      }

      const term = result[0];
      const match = termsMap.get(term.toLowerCase());

      if (match) {
        const linkPath = match.type === 'author' ? `/${match.slug}` : `/lexicon/${match.slug}`;
        parts.push(
          <TermPopover key={result.index} term={term} type={match.type}>
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
        parts.push(<span key={result.index} dangerouslySetInnerHTML={{ __html: term }} />);
      }

      lastIndex = result.index + term.length;
    }

    if (lastIndex < tempParagraph.length) {
      parts.push(<span key={lastIndex} dangerouslySetInnerHTML={{ __html: tempParagraph.substring(lastIndex) }} />);
    }

    return <p key={pIndex}>{parts}</p>;
  }).filter(Boolean);
}