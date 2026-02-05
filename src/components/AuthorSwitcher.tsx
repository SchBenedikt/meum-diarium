import { useAuthor } from '@/context/AuthorContext';
import { useAuthors } from '@/hooks/use-authors';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './ui/ImageWithFallback';
export function AuthorSwitcher() {
  const { currentAuthor, setCurrentAuthor, authorInfo } = useAuthor();
  const { authors, isLoading } = useAuthors();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 h-10 px-3 border-border/50">
          {currentAuthor && authorInfo ? (
            <>
              <ImageWithFallback src={authorInfo.heroImage} alt={authorInfo.name} className="h-6 w-6 rounded-md object-cover" />
              <span className="hidden sm:inline text-sm font-medium">
                {authorInfo.name.split(' ').pop()}
              </span>
            </>
          ) : (
            <span className="hidden sm:inline text-sm">Autor wählen</span>
          )}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          Object.values(authors).map((author) => (
          <DropdownMenuItem
            key={author.id}
            onClick={() => setCurrentAuthor(author.id)}
            asChild
          >
            <Link to={`/${author.id}`} className="flex items-center gap-3 py-2.5">
              <ImageWithFallback src={author.heroImage} alt={author.name} className="h-8 w-8 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{author.name}</p>
                <p className="text-xs text-muted-foreground">{author.title}</p>
              </div>
              {currentAuthor === author.id && (
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
              )}
            </Link>
          </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
