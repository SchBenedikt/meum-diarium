import { useState, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return; // Don't show again for 7 days
      }
    }

    // Detect iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
    
    if (isIOS && !isInStandaloneMode) {
      // Show iOS-specific prompt after a delay
      setTimeout(() => {
        setShowIOSPrompt(true);
      }, 3000);
    }

    // Handle Android/Desktop PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a delay
      setTimeout(() => {
        setShowAndroidPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detect if app was installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowAndroidPrompt(false);
      setShowIOSPrompt(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
      localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    }
    
    setDeferredPrompt(null);
    setShowAndroidPrompt(false);
  };

  const handleDismiss = () => {
    setShowAndroidPrompt(false);
    setShowIOSPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Android/Desktop Install Prompt */}
      <Sheet open={showAndroidPrompt} onOpenChange={setShowAndroidPrompt}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader className="text-left">
            <SheetTitle className="flex items-center gap-3 text-2xl">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center">
                <Download className="h-6 w-6 text-primary-foreground" />
              </div>
              {t('installApp') || 'App installieren'}
            </SheetTitle>
            <SheetDescription className="text-base pt-2">
              {t('installAppDescription') || 'Installiere Meum Diarium für schnellen Zugriff und ein besseres Erlebnis.'}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-3">
            <Button 
              size="lg" 
              className="w-full h-14 text-lg rounded-xl"
              onClick={handleInstallClick}
            >
              <Download className="mr-2 h-5 w-5" />
              {t('install') || 'Installieren'}
            </Button>
            
            <Button 
              size="lg" 
              variant="ghost" 
              className="w-full h-14 text-lg rounded-xl"
              onClick={handleDismiss}
            >
              {t('notNow') || 'Nicht jetzt'}
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>{t('pwaFeature1') || 'Funktioniert auch offline'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>{t('pwaFeature2') || 'Schneller Start vom Homescreen'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>{t('pwaFeature3') || 'Keine Store-Installation nötig'}</span>
              </li>
            </ul>
          </div>
        </SheetContent>
      </Sheet>

      {/* iOS Install Instructions */}
      <AnimatePresence>
        {showIOSPrompt && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border rounded-t-3xl shadow-2xl"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
                    <Download className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {t('installApp') || 'App installieren'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('addToHomeScreen') || 'Zum Home-Bildschirm hinzufügen'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-secondary/50 rounded-2xl p-4 mb-4">
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <div className="flex items-center gap-2 flex-1">
                      <span>
                        {t('iosStep1') || 'Tippe auf das'}
                      </span>
                      <Share className="h-5 w-5 text-primary" />
                      <span>{t('iosStep1b') || 'Symbol unten'}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span>
                      {t('iosStep2') || 'Scrolle nach unten und wähle "Zum Home-Bildschirm"'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span>{t('iosStep3') || 'Tippe auf "Hinzufügen"'}</span>
                  </li>
                </ol>
              </div>

              <Button
                variant="ghost"
                size="lg"
                className="w-full h-12 text-base rounded-xl"
                onClick={handleDismiss}
              >
                {t('gotIt') || 'Verstanden'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
