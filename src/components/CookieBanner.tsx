import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Cookie, Sparkles, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

type CookieConsent = {
  necessary: true;
  analytics: boolean;
  timestamp: number;
  source: 'banner';
};

const CONSENT_KEY = 'md_cookie_consent_v1';

function readConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    if (parsed.necessary !== true) return null;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      timestamp: typeof parsed.timestamp === 'number' ? parsed.timestamp : Date.now(),
      source: 'banner',
    };
  } catch {
    return null;
  }
}

function saveConsent(analytics: boolean) {
  const value: CookieConsent = {
    necessary: true,
    analytics,
    timestamp: Date.now(),
    source: 'banner',
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
}

export function CookieBanner() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  const isHiddenRoute = useMemo(
    () => location.pathname.startsWith('/admin'),
    [location.pathname],
  );

  useEffect(() => {
    if (isHiddenRoute) {
      setOpen(false);
      return;
    }
    const consent = readConsent();
    if (!consent) {
      setOpen(true);
      return;
    }
    setAnalyticsEnabled(consent.analytics);
    setOpen(false);
  }, [isHiddenRoute]);

  const acceptAll = () => {
    saveConsent(true);
    setOpen(false);
  };

  const acceptNecessaryOnly = () => {
    saveConsent(false);
    setOpen(false);
  };

  const saveCustom = () => {
    saveConsent(analyticsEnabled);
    setOpen(false);
  };

  if (!open || isHiddenRoute) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-x-4 bottom-4 z-[120] md:inset-x-8"
        role="dialog"
        aria-live="polite"
        aria-label="Cookie Einstellungen"
      >
        <div className="mx-auto max-w-4xl rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/10 shadow-2xl backdrop-blur-xl">
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  DER SENAT TAGT
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                  Cookies? Nur wenn sie Rom besser machen.
                </h2>
                <p className="mt-2 text-sm text-muted-foreground/90 leading-relaxed">
                  Notwendige Cookies halten das Forum stabil. Analyse-Cookies zeigen uns, welche Inhalte spannend sind.
                  Kein Werbe-Tracking, kein Datenhandel, keine Legionen von Bannern.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <Button className="rounded-full" onClick={acceptAll}>
                Alles akzeptieren
              </Button>
              <Button variant="outline" className="rounded-full" onClick={acceptNecessaryOnly}>
                Nur notwendige
              </Button>
              <Button
                variant="ghost"
                className="rounded-full"
                onClick={() => setExpanded((prev) => !prev)}
              >
                Einstellungen {expanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </Button>
            </div>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 rounded-2xl border border-border/60 bg-background/70 p-4 sm:p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">Notwendige Cookies</p>
                        <p className="text-xs text-muted-foreground">Immer aktiv fur Sprache, Theme und Kernfunktionen.</p>
                      </div>
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                        <ShieldCheck className="h-3.5 w-3.5" /> Aktiv
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">Analyse-Cookies</p>
                        <p className="text-xs text-muted-foreground">Anonyme Nutzungstrends, damit wir Inhalte verbessern konnen.</p>
                      </div>
                      <Switch
                        checked={analyticsEnabled}
                        onCheckedChange={setAnalyticsEnabled}
                        aria-label="Analyse-Cookies aktivieren"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Button className="rounded-full" onClick={saveCustom}>
                        Auswahl speichern
                      </Button>
                      <Link to="/cookies" className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-primary transition-colors">
                        Mehr erfahren
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
