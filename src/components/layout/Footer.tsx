import { Link } from 'react-router-dom';
import { Scroll, Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border py-12 bg-secondary/30">
      <div className="container mx-auto">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Scroll className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg">Meum Diarium</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Erlebe die Geschichte durch die Augen der größten Persönlichkeiten 
              des antiken Roms. Tagebücher und wissenschaftliche Perspektiven.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium mb-4 text-sm">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Startseite
                </Link>
              </li>
              <li>
                <Link to="/timeline" className="text-muted-foreground hover:text-foreground transition-colors">
                  Zeitstrahl
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Über das Projekt
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-medium mb-4 text-sm">Folge uns</h4>
            <div className="flex gap-2">
              <a 
                href="#" 
                className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Meum Diarium. Alle Rechte vorbehalten.
          </p>
          <p className="text-sm text-muted-foreground">
            SPQR · Senatus Populusque Romanus
          </p>
        </div>
      </div>
    </footer>
  );
}
