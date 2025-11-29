import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { BookOpen } from 'lucide-react';
import { lexicon } from '@/data/lexicon';
import { TranslationKey } from '@/locales/translations';

const allLinkableTerms = lexicon
  .flatMap(entry => [entry.term, ...(entry.variants || [])])
  .sort((a, b) => b.length - a.length);

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

export function formatContent(content: string, t: (key: TranslationKey) => string, currentSlug?: string): React.ReactNode[] {
    const linkableTerms = allLinkableTerms.filter(term => {
      const entry = lexicon.find(e => e.term.toLowerCase() === term.toLowerCase() || e.variants?.map(v => v.toLowerCase()).includes(term.toLowerCase()));
      return entry?.slug !== currentSlug;
    });

    if (linkableTerms.length === 0) {
      return [<p key="line-0">{content}</p>];
    }
      
    const regex = new RegExp(`\\b(${linkableTerms.join('|')})\\b`, 'gi');

    return content.split(/(\n\n)/).map((paragraph, pIndex) => {
      let parts: (string | React.ReactNode)[] = [];
      let lastIndex = 0;

      if (paragraph.trim() === '') return null;

      let htmlParagraph = paragraph
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      if (htmlParagraph.match(/^#{2,3}\s/)) {
        const level = htmlParagraph.startsWith('###') ? 3 : 2;
        const text = htmlParagraph.replace(/^#{2,3}\s/, '');
        return React.createElement(`h${level}`, { key: pIndex, dangerouslySetInnerHTML: { __html: text } });
      }
      if (htmlParagraph.match(/^>\s/)) {
        const text = htmlParagraph.replace(/^>\s/, '');
        return <blockquote key={pIndex}><p dangerouslySetInnerHTML={{ __html: text }} /></blockquote>;
      }
      
      let tempParagraph = htmlParagraph;
      let result;
      while ((result = regex.exec(tempParagraph)) !== null) {
        if (result.index > lastIndex) {
          parts.push(<span key={lastIndex} dangerouslySetInnerHTML={{ __html: tempParagraph.substring(lastIndex, result.index) }}/>);
        }

        const term = result[0];
        const lexiconEntry = lexicon.find(entry => 
            entry.term.toLowerCase() === term.toLowerCase() ||
            (entry.variants && entry.variants.map(v => v.toLowerCase()).includes(term.toLowerCase()))
        );
        
        if (lexiconEntry) {
          parts.push(<LexiconTerm key={result.index} term={term} definition={lexiconEntry.definition} slug={lexiconEntry.slug} t={t} />);
        } else {
          parts.push(<span key={result.index} dangerouslySetInnerHTML={{ __html: term }} />);
        }
        
        lastIndex = result.index + term.length;
      }

      if (lastIndex < tempParagraph.length) {
        parts.push(<span key={lastIndex} dangerouslySetInnerHTML={{ __html: tempParagraph.substring(lastIndex) }}/>);
      }

      return <p key={pIndex}>{parts}</p>;
    }).filter(Boolean);
}
