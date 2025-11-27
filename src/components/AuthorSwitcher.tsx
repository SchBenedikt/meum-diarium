import { useAuthor } from '@/context/AuthorContext';
import { authors } from '@/data/authors';
import { Check, ChevronDown, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const authorColorClasses: Record<string, string> = {
  caesar: 'bg-author-caesar',
  cicero: 'bg-author-cicero',
  augustus: 'bg-author-augustus',
  seneca: 'bg-author-seneca',
};

export function AuthorSwitcher() {
  const { currentAuthor, setCurrentAuthor, authorInfo } = useAuthor();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 h-10 px-3 border-border/50">
          {currentAuthor && authorInfo ? (
            <>
              <div className={`h-5 w-5 rounded-md ${authorColorClasses[currentAuthor]} flex items-center justify-center`}>
                <span className="text-white text-xs font-semibold">
                  {authorInfo.name.charAt(0)}
                </span>
              </div>
              <span className="hidden sm:inline text-sm font-medium">
                {authorInfo.name.split(' ').pop()}
              </span>
            </>
          ) : (
            <>
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">Autor wählen</span>
            </>
          )}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {currentAuthor && (
          <>
            <DropdownMenuItem 
              onClick={() => setCurrentAuthor(null)}
              className="text-muted-foreground"
            >
              <span className="text-sm">Zur Startseite</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {Object.values(authors).map((author) => (
          <DropdownMenuItem
            key={author.id}
            onClick={() => setCurrentAuthor(author.id)}
            className="flex items-center gap-3 py-2.5"
          >
            <div className={`h-8 w-8 rounded-lg ${authorColorClasses[author.id]} flex items-center justify-center flex-shrink-0`}>
              <span className="text-white text-sm font-semibold">
                {author.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{author.name}</p>
              <p className="text-xs text-muted-foreground">{author.title}</p>
            </div>
            {currentAuthor === author.id && (
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
