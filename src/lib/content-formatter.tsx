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

  // Pre-process content to normalize line breaks and separate lists
  let processedContent = content
    // Protect code blocks from processing
    .replace(/(```[\s\S]*?```)/g, '\n\n$1\n\n')
    // Ensure markdown headings are on their own line
    .replace(/([^\n])(#{2,4}\s)/g, '$1\n\n$2')
    // Ensure horizontal rules are on their own line
    .replace(/([^\n])(-{3,}|\*{3,}|_{3,})/g, '$1\n\n$2')
    // Ensure blockquotes are on their own line
    .replace(/([^\n])(>\s)/g, '$1\n\n$2')
    // Ensure lists are separated
    .replace(/([^\n])([-•]\s|\d+\.\s)/g, '$1\n\n$2')
    // Normalize multiple newlines to double newlines
    .replace(/\n{3,}/g, '\n\n')
    // Trim
    .trim();

  return processedContent.split(/\n\n+/).map((paragraph, pIndex) => {
    let parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;

    // Skip empty paragraphs
    const trimmedParagraph = paragraph.trim();
    if (!trimmedParagraph) return null;

    // Handle horizontal rule FIRST (before any other HTML processing)
    if (trimmedParagraph.match(/^-{3,}$/) || trimmedParagraph.match(/^\*{3,}$/) || trimmedParagraph.match(/^_{3,}$/)) {
      return <hr key={pIndex} className="my-8 border-border/40" />;
    }

    // Handle headings BEFORE markdown replacement
    if (trimmedParagraph.match(/^#{2,3}\s/)) {
      const level = trimmedParagraph.startsWith('###') ? 3 : 2;
      const text = trimmedParagraph.replace(/^#{2,3}\s+/, '').trim();
      // Process markdown in heading
      const processedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      const id = slugify(text);
      
      const className = level === 2 
        ? 'font-display text-2xl sm:text-3xl font-bold leading-tight tracking-tight mt-8 mb-4 scroll-mt-24'
        : 'font-display text-xl sm:text-2xl font-bold leading-tight tracking-tight mt-6 mb-3 scroll-mt-24';
      
      return React.createElement(`h${level}`, { 
        key: pIndex, 
        className,
        'data-heading-id': id,
        dangerouslySetInnerHTML: { __html: processedText } 
      });
    }
    
    // Handle headings with ####
    if (trimmedParagraph.match(/^#{4}\s/)) {
      const text = trimmedParagraph.replace(/^#{4}\s+/, '').trim();
      const processedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      const id = slugify(text);
      return <h4 
        key={pIndex} 
        className="font-display text-lg sm:text-xl font-bold leading-tight tracking-tight mt-5 mb-2 scroll-mt-24"
        data-heading-id={id} 
        dangerouslySetInnerHTML={{ __html: processedText }} 
      />;
    }
    
    // Handle blockquotes
    if (trimmedParagraph.match(/^>\s/)) {
      const text = trimmedParagraph.replace(/^>\s+/, '').trim();
      const processedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      return (
        <blockquote key={pIndex} className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground my-4">
          <p dangerouslySetInnerHTML={{ __html: processedText }} />
        </blockquote>
      );
    }

    let htmlParagraph = trimmedParagraph
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-secondary/50 text-sm font-mono">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br />'); // Convert single line breaks to <br />

    // Handle code blocks (triple backticks)
    if (trimmedParagraph.startsWith('```')) {
      const lines = trimmedParagraph.split('\n');
      const language = lines[0].replace(/```/, '').trim();
      const codeContent = lines.slice(1, -1).join('\n');
      
      return (
        <pre key={pIndex} className="bg-secondary/50 rounded-lg p-4 overflow-x-auto my-4">
          <code className="text-sm font-mono">{codeContent}</code>
        </pre>
      );
    }

    // Handle unordered lists (lines starting with - or •)
    if (htmlParagraph.match(/^[-•]\s/) || htmlParagraph.includes('\n-') || htmlParagraph.includes('\n•')) {
      const lines = htmlParagraph.split('\n');
      const listItems: React.ReactNode[] = [];
      
      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
          const itemText = trimmed.replace(/^[-•]\s*/, '');
          listItems.push(<li key={`${pIndex}-${idx}`} dangerouslySetInnerHTML={{ __html: itemText }} />);
        }
      });
      
      if (listItems.length > 0) {
        return <ul key={pIndex} className="list-disc pl-6 space-y-2 my-4 marker:text-primary">{listItems}</ul>;
      }
    }

    // Handle ordered lists (lines starting with numbers)
    if (htmlParagraph.match(/^\d+\.\s/)) {
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
        return <ol key={pIndex} className="list-decimal pl-6 space-y-2 my-4 marker:text-primary">{listItems}</ol>;
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
          const separatorClass = "[" + "-:" + "\\s" + "|" + "]+";
          const separatorRegex = new RegExp(`^\\|?\\s*${separatorClass}\\s*\\|?\\s*$`);
          if (separatorRegex.test(line)) {
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

    return <p key={pIndex} className="text-base leading-relaxed mb-4">{parts}</p>;
  }).filter(Boolean);
}