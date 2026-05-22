import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISS_KEY = 'pwa-install-prompt-dismissed';

export function PWAInstallPrompt() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  const isStandalone = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  }, []);

  useEffect(() => {
    const dismissed = window.localStorage.getItem(DISMISS_KEY) === '1';
    if (dismissed || isStandalone) return;

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const onAppInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, [isStandalone]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  const handleDismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="fixed bottom-4 left-0 right-0 z-50 px-4 safe-bottom"
      >
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Download className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-base sm:text-lg">
                {t('installApp') || 'App installieren'}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('installAppDesc') || 'Meum Diarium als App speichern und offline nutzen.'}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto w-full sm:w-auto">
            <Button size="sm" variant="ghost" className="justify-center" onClick={handleDismiss}>
              <X className="mr-1 h-4 w-4" />
              {t('notNow') || 'Später'}
            </Button>
            <Button size="sm" className="justify-center" onClick={handleInstall}>
              <Download className="mr-1 h-4 w-4" />
              {t('installNow') || 'Installieren'}
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
