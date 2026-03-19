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
    
    // Add global function for manual cache clearing
    (window as any).clearCaches = clearServiceWorkerCaches;
    (window as any).clearApiCaches = clearApiCaches;
    (window as any).getCacheInfo = getCacheInfo;
    
    console.log('🔧 [Dev] Cache management functions available in console:');
    console.log('  - clearCaches() - Clear all service worker caches');
    console.log('  - clearApiCaches() - Clear only API caches');
    console.log('  - getCacheInfo() - Show cache information');
  }
}
