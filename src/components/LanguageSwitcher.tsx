
import { useLanguage } from '@/context/LanguageContext';
import { Check, Languages, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Language } from '@/types/blog';

const languages: { code: Language, name: string, flag: string }[] = [
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'de-la', name: 'Deutsch (Latein)', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'en-la', name: 'English (Latin)', flag: '🇬🇧' },
    { code: 'la', name: 'Latina', flag: '🏛️' },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const currentLang = languages.find(l => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 h-10 px-3 border-border/50">
           {currentLang ? (
             <>
                <span className="text-lg">{currentLang.flag}</span>
                <span className="hidden sm:inline text-sm font-medium">
                  {currentLang.name.split(' ')[0]}
                </span>
             </>
           ) : (
            <Languages className="h-4 w-4" />
           )}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
          >
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-2">
                <span className="text-lg">{lang.flag}</span>
                {lang.name}
              </span>
              {language === lang.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
