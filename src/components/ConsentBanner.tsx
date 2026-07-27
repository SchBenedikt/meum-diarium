import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Cookie, Sparkles, ShieldCheck, ChevronDown, ChevronUp, Settings, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

type CookieConsent = {
  necessary: true;
  analytics: boolean;
  functional: boolean;
  timestamp: number;
  version: number;
  source: 'banner';
};

const CONSENT_KEY = 'md_cookie_consent_v2';
const CONSENT_VERSION = 2; // Increment when cookie policy changes

function readConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    if (parsed.necessary !== true) return null;
    // Show banner again if version changed (new cookie policy)
    if (typeof parsed.version !== 'number' || parsed.version < CONSENT_VERSION) return null;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      functional: Boolean(parsed.functional),
      timestamp: typeof parsed.timestamp === 'number' ? parsed.timestamp : Date.now(),
      version: CONSENT_VERSION,
      source: 'banner',
    };
  } catch {
    return null;
  }
}

function saveConsent(analytics: boolean, functional: boolean) {
  const value: CookieConsent = {
    necessary: true,
    analytics,
    functional,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
    source: 'banner',
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(value));

  // Dispatch event for analytics tracking integration
  window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
    detail: { analytics, functional }
  }));
}

export function ConsentBanner() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [functionalEnabled, setFunctionalEnabled] = useState(true);

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
    setFunctionalEnabled(consent.functional);
    setOpen(false);
  }, [isHiddenRoute]);

  const acceptAll = () => {
    saveConsent(true, true);
    setOpen(false);
  };

  const acceptNecessaryOnly = () => {
    saveConsent(false, false);
    setOpen(false);
  };

  const saveCustom = () => {
    saveConsent(analyticsEnabled, functionalEnabled);
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
                  GDPR-KONFORM • DATENSCHUTZ
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                  Cookies? Nur mit deiner Zustimmung.
                </h2>
                <p className="mt-2 text-sm text-muted-foreground/90 leading-relaxed">
                  Diese Webseite nutzt Cookies, um dir das bestmögliche Erlebnis zu bieten. Notwendige Cookies sichern Kernfunktionen (Sprache, Theme). Analyse-Cookies helfen uns, Inhalte zu verbessern. Funktionale Cookies ermöglichen erweiterte Features. Du entscheidest, was gespeichert wird.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <Button className="rounded-full gap-2" onClick={acceptAll}>
                <CheckCircle2 className="h-4 w-4" />
                Alle akzeptieren
              </Button>
              <Button variant="outline" className="rounded-full" onClick={acceptNecessaryOnly}>
                Nur notwendige
              </Button>
              <Button
                variant="ghost"
                className="rounded-full gap-2"
                onClick={() => setExpanded((prev) => !prev)}
              >
                <Settings className="h-4 w-4" />
                Einstellungen {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
                        <p className="text-xs text-muted-foreground mt-0.5">Immer aktiv. Ermöglichen Grundfunktionen wie Sprache, Theme und Navigation.</p>
                      </div>
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary whitespace-nowrap">
                        <ShieldCheck className="h-3.5 w-3.5" /> Erforderlich
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">Analyse-Cookies</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Anonyme Nutzungsstatistiken zur Verbesserung der Inhalte und Benutzererfahrung.</p>
                      </div>
                      <Switch
                        checked={analyticsEnabled}
                        onCheckedChange={setAnalyticsEnabled}
                        aria-label="Analyse-Cookies aktivieren"
                      />
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">Funktionale Cookies</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Erweiterte Features wie Lesezeichen, Favoriten und personalisierte Einstellungen.</p>
                      </div>
                      <Switch
                        checked={functionalEnabled}
                        onCheckedChange={setFunctionalEnabled}
                        aria-label="Funktionale Cookies aktivieren"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40">
                      <Button className="rounded-full" onClick={saveCustom}>
                        Auswahl speichern
                      </Button>
                      <Link to="/cookies" className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-primary transition-colors px-3">
                        Cookie-Richtlinien
                      </Link>
                      <Link to="/privacy" className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-primary transition-colors px-3">
                        Datenschutz
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
