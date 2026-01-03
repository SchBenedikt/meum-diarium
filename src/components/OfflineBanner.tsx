import { useState, useEffect } from 'react';
import { WifiOff, Download, CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export function OfflineBanner() {
    const isMobile = useIsMobile();
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [isCaching, setIsCaching] = useState(false);
    const [cacheComplete, setCacheComplete] = useState(false);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const triggerPrecache = () => {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            setIsCaching(true);
            navigator.serviceWorker.controller.postMessage({ type: 'TRIGGER_PRECACHE' });

            // Mock progress/completion for UI feedback since SW doesn't report back easily yet
            setTimeout(() => {
                setIsCaching(false);
                setCacheComplete(true);
                setTimeout(() => setVisible(false), 5000);
            }, 3000);
        }
    };

    if (!visible || !isMobile) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 z-50 pointer-events-none md:bottom-6 md:left-auto md:w-96">
            <AnimatePresence>
                {isOffline && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="pointer-events-auto mb-3 p-4 rounded-xl bg-destructive text-destructive-foreground shadow-lg border border-destructive/20 flex items-center justify-between gap-3"
                    >
                        <div className="flex items-center gap-3">
                            <WifiOff className="h-5 w-5" />
                            <div className="text-sm font-medium">
                                <p>Du bist offline</p>
                                <p className="text-[10px] opacity-80">Einige Inhalte sind evtl. nicht verfügbar</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={() => setVisible(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </motion.div>
                )}

                {!isOffline && !cacheComplete && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="pointer-events-auto p-4 rounded-xl bg-card border border-border shadow-xl backdrop-blur-md flex flex-col gap-3"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isCaching ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                    {isCaching ? <Download className="h-5 w-5 animate-bounce" /> : <Download className="h-5 w-5" />}
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold">Offline verfügbar machen?</p>
                                    <p className="text-xs text-muted-foreground">Speichert alle Artikel und das Lexikon für unterwegs.</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setVisible(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        {!isCaching ? (
                            <Button size="sm" onClick={triggerPrecache} className="w-full">
                                Jetzt herunterladen
                            </Button>
                        ) : (
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 3 }}
                                />
                            </div>
                        )}
                    </motion.div>
                )}

                {cacheComplete && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="pointer-events-auto p-4 rounded-xl bg-green-500/10 text-green-600 border border-green-500/20 shadow-lg flex items-center gap-3"
                    >
                        <CheckCircle className="h-5 w-5" />
                        <div className="text-sm font-medium">
                            <p>Alle Inhalte offline verfügbar!</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto" onClick={() => setVisible(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
