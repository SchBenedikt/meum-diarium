import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface UpdateEventDetail {
  registration: ServiceWorkerRegistration;
}

export function SWUpdateToast() {
  const { t } = useLanguage();
  const [waitingReg, setWaitingReg] = useState<ServiceWorkerRegistration | null>(null);
  const [visible, setVisible] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const onUpdateAvailable = (event: Event) => {
      const custom = event as CustomEvent<UpdateEventDetail>;
      setWaitingReg(custom.detail.registration);
      setVisible(true);
    };
    window.addEventListener('sw:update-available', onUpdateAvailable as EventListener);

    const onControllerChange = () => {
      // Once the new SW controls the page, reload to pick new assets
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    return () => {
      window.removeEventListener('sw:update-available', onUpdateAvailable as EventListener);
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  const handleUpdate = () => {
    if (!waitingReg?.waiting) return;
    setUpdating(true);
    // Ask waiting SW to become active
    waitingReg.waiting.postMessage({ type: 'SKIP_WAITING' });
  };

  const handleDismiss = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="fixed bottom-4 left-0 right-0 z-50 px-4 safe-bottom"
        >
          <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card shadow-xl shadow-black/10 p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-base sm:text-lg">
                  {t('updateAvailable') || 'Update verfügbar'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('updateAvailableDesc') || 'Eine neue Version ist bereit. Jetzt aktualisieren?'}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto w-full sm:w-auto">
              <Button
                size="sm"
                variant="ghost"
                className="justify-center"
                onClick={handleDismiss}
              >
                <X className="mr-1 h-4 w-4" />
                {t('notNow') || 'Später'}
              </Button>
              <Button
                size="sm"
                className="justify-center"
                onClick={handleUpdate}
                disabled={updating}
              >
                <RefreshCw className="mr-1 h-4 w-4" />
                {updating ? (t('updating') || 'Aktualisiere...') : (t('updateNow') || 'Aktualisieren')}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
