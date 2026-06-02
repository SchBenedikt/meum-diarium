import { Link } from 'react-router-dom';
import { Scroll, Sparkles, BookOpen, Download, FileText, MessageCircle, Award, Library, Home, Clock3, Search, Info, BarChart3, Code2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  const text = (key: string, fallback: string) => {
    const val = t(key);
    return typeof val === 'string' ? val : fallback;
  };
  const appName = text('appName', 'Meum Diarium');
  const description = text('footerDescription', 'Tagebücher antiker Persönlichkeiten');
  const footerLinks = [
    {
      title: 'Navigation',
      links: [
        { label: 'Startseite', href: '/', icon: Home },
        { label: 'Zeitleiste', href: '/timeline', icon: Clock3 },
        { label: 'Lexikon', href: '/lexicon', icon: Search },
        { label: 'Über uns', href: '/about', icon: Info },
        { label: 'KI-Transparenz', href: '/ki', icon: Sparkles },
        { label: 'Statistik', href: '/stats', icon: BarChart3 },
        { label: 'API-Dokumentation', href: '/api', icon: Code2 },
      ]
    },
    {
      title: 'Lernen',
      links: [
        { label: 'Latein Tools', href: '/learn', icon: BookOpen },
        { label: 'Grammatik', href: '/learn/grammar', icon: FileText },
        { label: 'Vokabeltrainer', href: '/vocab', icon: Library },
        { label: 'Text-Leser', href: '/reader', icon: BookOpen },
        { label: 'OER Ressourcen', href: '/oer', icon: Download },
      ]
    },
    {
      title: 'Persönlichkeiten',
      links: [
        { label: 'Julius Caesar', href: '/caesar', icon: Scroll },
        { label: 'Marcus Cicero', href: '/cicero', icon: MessageCircle },
        { label: 'Kaiser Augustus', href: '/augustus', icon: Award },
        { label: 'Seneca der Jüngere', href: '/seneca', icon: BookOpen },
        { label: 'Catilina', href: '/catilina', icon: Sparkles },
        { label: 'Sallust', href: '/sallust', icon: BookOpen },
        { label: 'Sokrates', href: '/sokrates', icon: BookOpen },
      ]
    },
    {
      title: 'Interaktiv',
      links: [
        { label: 'KI-Gespräche', href: '/caesar/chat', icon: Sparkles },
        { label: 'Zeitreise Simulation', href: '/caesar/simulation', icon: Sparkles },
        { label: 'Rhetorik Übungen', href: '/learn/rhetoric', icon: Award },
      ]
    }
  ];
  return (
    <footer className="relative border-t border-border bg-card">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand & Mission */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02]">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Scroll className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-extrabold tracking-tighter text-foreground">
                {appName}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-sm font-light italic">
              "{description}"
            </p>
          </div>
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {footerLinks.map((column) => (
              <div key={column.title} className="space-y-8">
                <h4 className="font-display text-xs uppercase tracking-[0.3em] font-bold text-primary">
                  {column.title}
                </h4>
                <ul className="space-y-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground/80 hover:text-primary transition-colors flex items-center gap-2 group"
                      >
                        {link.icon && <link.icon className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />}
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="mt-20 sm:mt-32 pt-8 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
              {new Date().getFullYear()} {appName}
            </p>
            <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold">
              <Link to="/legal" className="text-muted-foreground hover:text-primary transition-colors">Impressum</Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Datenschutz</Link>
              <Link to="/cookies" className="text-muted-foreground hover:text-primary transition-colors">Cookies</Link>
              <Link to="/agb" className="text-muted-foreground hover:text-primary transition-colors">AGB</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
