import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { BookOpen } from 'lucide-react';
import { lexicon } from '@/data/lexicon';
import { TranslationKey } from '@/locales/translations';
import { Language } from '@/types/blog';
import { getTranslatedLexiconEntry } from '@/lib/content-translator';

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
  const termsMap = new Map<string, { slug: string, definition: string }>();

  lexicon.forEach(originalEntry => {
    if (originalEntry.slug === currentSlug) return;

    const translatedEntry = getTranslatedLexiconEntry(originalEntry, language);

    // Add main term
    if (translatedEntry.term) {
      termsMap.set(translatedEntry.term.toLowerCase(), { slug: originalEntry.slug, definition: translatedEntry.definition });
    }

    // Add variants (now including language-specific ones)
    translatedEntry.variants?.forEach(variant => {
      if (variant) {
        termsMap.set(variant.toLowerCase(), { slug: originalEntry.slug, definition: translatedEntry.definition });
      }
    });
  });

  const linkableTerms = Array.from(termsMap.keys()).sort((a, b) => b.length - a.length);

  if (linkableTerms.length === 0) {
    return [<p key="line-0">{content}</p>];
  }

  // Escape special characters in terms for regex
  const escapedTerms = linkableTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');

  return content.split(/(\n\n)/).map((paragraph, pIndex) => {
    let parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;

    if (paragraph.trim() === '') return null;

    let htmlParagraph = paragraph
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Handle headings
    if (htmlParagraph.match(/^#{2,3}\s/)) {
      const level = htmlParagraph.startsWith('###') ? 3 : 2;
      const text = htmlParagraph.replace(/^#{2,3}\s/, '');
      return React.createElement(`h${level}`, { key: pIndex, dangerouslySetInnerHTML: { __html: text } });
    }
    
    // Handle headings with ####
    if (htmlParagraph.match(/^#{4}\s/)) {
      const text = htmlParagraph.replace(/^#{4}\s/, '');
      return <h4 key={pIndex} dangerouslySetInnerHTML={{ __html: text }} />;
    }
    
    // Handle blockquotes
    if (htmlParagraph.match(/^>\s/)) {
      const text = htmlParagraph.replace(/^>\s/, '');
      return <blockquote key={pIndex}><p dangerouslySetInnerHTML={{ __html: text }} /></blockquote>;
    }

    // Handle unordered lists (lines starting with -)
    if (htmlParagraph.match(/^-\s/)) {
      const lines = htmlParagraph.split('\n').filter(line => line.trim());
      const listItems = lines.map((line, idx) => {
        const itemText = line.replace(/^-\s*/, '');
        return <li key={`${pIndex}-${idx}`} dangerouslySetInnerHTML={{ __html: itemText }} />;
      });
      return <ul key={pIndex} className="list-disc pl-6 space-y-2">{listItems}</ul>;
    }

    // Handle ordered lists (lines starting with numbers)
    if (htmlParagraph.match(/^\d+\.\s/)) {
      const lines = htmlParagraph.split('\n').filter(line => line.trim());
      const listItems = lines.map((line, idx) => {
        const itemText = line.replace(/^\d+\.\s*/, '');
        return <li key={`${pIndex}-${idx}`} dangerouslySetInnerHTML={{ __html: itemText }} />;
      });
      return <ol key={pIndex} className="list-decimal pl-6 space-y-2">{listItems}</ol>;
    }

    // Handle horizontal rule
    if (htmlParagraph.match(/^---+$/)) {
      return <hr key={pIndex} className="my-8 border-border/40" />;
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
        parts.push(<LexiconTerm key={result.index} term={term} definition={match.definition} slug={match.slug} t={t} />);
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
