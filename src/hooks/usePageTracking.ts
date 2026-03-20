/**
 * Hook für automatisches Page-Tracking
 * Verfolgt die Verweildauer auf Seiten und speichert den Fortschritt
 */

import { useEffect, useRef, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { trackProgress } from '@/lib/user-progress';
import { getSafeLanguage } from '@/lib/language-utils';

interface UsePageTrackingOptions {
  type: 'post' | 'lexicon' | 'grammar' | 'vocab' | 'simulation' | 'chat';
  itemId: string;
  title: string;
  metadata?: Record<string, any>;
}

export function usePageTracking({ type, itemId, title, metadata }: UsePageTrackingOptions) {
  const { user } = useAuth();
  const startTime = useRef<number>(Date.now());
  const hasTracked = useRef(false);

  // Memoize metadata to prevent infinite re-renders
  const memoizedMetadata = useMemo(() => metadata, [JSON.stringify(metadata || {})]);

  useEffect(() => {
    if (!user || !user.id) return;

    // Cleanup-Funktion, die beim Verlassen der Seite ausgeführt wird
    const handlePageLeave = () => {
      if (hasTracked.current) return; // Verhindert doppeltes Tracking
      
      const duration = Math.floor((Date.now() - startTime.current) / 1000); // in Sekunden
      
      // Nur tracken, wenn der Benutzer mindestens 10 Sekunden auf der Seite war
      if (duration >= 10) {
        trackProgress({
          userId: user.id,
          type,
          itemId,
          title,
          duration,
          metadata: memoizedMetadata
        });
        hasTracked.current = true;
      }
    };

    // Event Listener für verschiedene Szenarien
    const events = ['beforeunload', 'pagehide', 'visibilitychange'];
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handlePageLeave();
      }
    };

    events.forEach(event => {
      if (event === 'visibilitychange') {
        document.addEventListener(event, handleVisibilityChange);
      } else {
        window.addEventListener(event, handlePageLeave);
      }
    });

    // Cleanup beim Unmount
    return () => {
      events.forEach(event => {
        if (event === 'visibilitychange') {
          document.removeEventListener(event, handleVisibilityChange);
        } else {
          window.removeEventListener(event, handlePageLeave);
        }
      });
      
      // Final tracking attempt
      handlePageLeave();
    };
  }, [user, type, itemId, title, memoizedMetadata]);
}

/**
 * Hook für manuelles Tracking (z.B. für abgeschlossene Übungen)
 */
export function useManualTracking() {
  const { user } = useAuth();

  const track = (options: Omit<UsePageTrackingOptions, 'itemId'> & { itemId?: string }) => {
    if (!user || !user.id) return;

    trackProgress({
      userId: user.id,
      type: options.type,
      itemId: options.itemId || `${options.type}-${Date.now()}`,
      title: options.title,
      duration: 60, // Standard 1 Minute für manuelles Tracking
      metadata: options.metadata
    });
  };

  return { track };
}
