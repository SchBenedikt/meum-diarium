// Cache management utilities for service worker

export async function clearServiceWorkerCaches(): Promise<void> {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('✅ [Cache] All service worker caches cleared');
    } catch (error) {
      console.error('❌ [Cache] Failed to clear caches:', error);
    }
  }
}

export async function clearApiCaches(): Promise<void> {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      const apiCacheNames = cacheNames.filter(name => 
        name.includes('runtime') || name.includes('offline') || name.includes('api')
      );
      await Promise.all(
        apiCacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('✅ [Cache] API caches cleared');
    } catch (error) {
      console.error('❌ [Cache] Failed to clear API caches:', error);
    }
  }
}

export async function unregisterServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
      console.log('✅ [SW] Service worker unregistered');
      
      // Also clear caches after unregistering
      await clearServiceWorkerCaches();
      
      // Force reload to ensure clean state
      window.location.reload();
    } catch (error) {
      console.error('❌ [SW] Failed to unregister service worker:', error);
    }
  }
}

export async function getCacheInfo(): Promise<{name: string, size?: number}[]> {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      const cacheInfo = [];
      
      for (const name of cacheNames) {
        try {
          const cache = await caches.open(name);
          const keys = await cache.keys();
          cacheInfo.push({ name, size: keys.length });
        } catch (error) {
          cacheInfo.push({ name, size: undefined });
        }
      }
      
      return cacheInfo;
    } catch (error) {
      console.error('❌ [Cache] Failed to get cache info:', error);
      return [];
    }
  }
  return [];
}

// Development cache clearing
export function setupDevelopmentCacheClearing(): void {
  // Clear caches in development mode to prevent stale data issues
  if (import.meta.env.DEV) {
    console.log('🔧 [Dev] Setting up cache management...');
    
    // Clear caches on page load in development
    clearApiCaches();
    
    // Add global functions for manual cache clearing
    (window as any).clearCaches = clearServiceWorkerCaches;
    (window as any).clearApiCaches = clearApiCaches;
    (window as any).unregisterSW = unregisterServiceWorker;
    (window as any).getCacheInfo = getCacheInfo;
    
    console.log('🔧 [Dev] Cache management functions available in console:');
    console.log('  - clearCaches() - Clear all service worker caches');
    console.log('  - clearApiCaches() - Clear only API caches');
    console.log('  - unregisterSW() - Unregister service worker and reload');
    console.log('  - getCacheInfo() - Show cache information');
    
    // Auto-fix for common JSON parsing errors
    window.addEventListener('error', (event) => {
      if (event.error instanceof SyntaxError && 
          event.error.message.includes('JSON') && 
          event.error.message.includes('<!doctype')) {
        console.warn('🚨 [Auto-Fix] Detected JSON parsing error - clearing API caches...');
        clearApiCaches();
      }
    });
  }
}

// Force refresh function that bypasses cache
export function forceRefresh(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.active?.postMessage({ type: 'SKIP_WAITING' });
      });
    });
  }
  
  // Clear all caches and reload
  clearServiceWorkerCaches().then(() => {
    window.location.reload();
  });
}
