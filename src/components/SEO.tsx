import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

export interface SEOProps {
  title?: string;
  description?: string;
  author?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  structuredData?: Record<string, any> | Record<string, any>[];
  canonical?: string;
}

const defaultMeta = {
  de: {
    title: 'Meum Diarium – Das antike Rom erleben',
    description: 'Erlebe die Geschichte Roms durch die Augen großer Persönlichkeiten: Caesar, Cicero, Augustus und Seneca. Tagebucheinträge, wissenschaftliche Kommentare und interaktive Zeitreisen.',
    siteName: 'Meum Diarium',
    keywords: 'Römisches Reich, Latein, Caesar, Cicero, Augustus, Seneca, antike Geschichte, Römische Literatur, antike Philosophie, Tagebücher, Kommentare, Zeitreisen',
    author: 'Meum Diarium Team',
    publisher: 'Meum Diarium',
    contact: 'info@meum-diarium.de',
    type: 'website'
  },
  en: {
    title: 'Meum Diarium – Experience Ancient Rome',
    description: 'Experience history of Rome through the eyes of great personalities: Caesar, Cicero, Augustus and Seneca. Diary entries, scholarly commentary and interactive time travel.',
    siteName: 'Meum Diarium',
    keywords: 'Roman Empire, Latin, Caesar, Cicero, Augustus, Seneca, ancient history, Roman literature, ancient philosophy, diaries, commentary, time travel',
    author: 'Meum Diarium Team',
    publisher: 'Meum Diarium',
    contact: 'info@meum-diarium.de',
    type: 'website'
  },
  la: {
    title: 'Meum Diarium – Roma Antiqua',
    description: 'Experimur historiam Romae per oculos magnorum virorum: Caesar, Cicero, Augustus et Seneca. Commentarii diarii, eruditi et interactivae peregrinationes temporales.',
    siteName: 'Meum Diarium',
    keywords: 'Imperium Romanum, Lingua Latina, Caesar, Cicero, Augustus, Seneca, historia antiqua, litteratura romana, philosophia antiqua, diarii, commentarii, peregrinationes',
    author: 'Meum Diarium Team',
    publisher: 'Meum Diarium',
    contact: 'info@meum-diarium.de',
    type: 'website'
  }
};

export function SEO({
  title,
  description,
  author,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noIndex = false,
  structuredData,
  canonical
}: SEOProps) {
  const location = useLocation();
  const { language } = useLanguage();
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://meum-diarium.xn--schchner-2za.de';
  const currentUrl = `${baseUrl}${location.pathname === '/' ? '' : location.pathname}`;
  const defaults = defaultMeta[language] || defaultMeta.de;
  const finalTitle = title ? `${title} | ${defaults.siteName}` : defaults.title;
  const finalDescription = description || defaults.description;
  const finalImage = image || `${baseUrl}/images/caesar-hero.png`;
  
  // Create JSON-LD structured data once
  const jsonLdData = useMemo(() => {
    // If custom structured data is provided, use it directly (for pages like BlogPosting)
    if (structuredData) {
      if (Array.isArray(structuredData)) {
        // Multiple structured data objects - return array
        return structuredData;
      } else {
        // Single structured data object - return as-is
        return structuredData;
      }
    }

    // Default WebSite schema for pages without custom structured data
    const baseData: Record<string, any>[] = [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": defaults.siteName,
        "url": baseUrl,
        "description": finalDescription,
        "inLanguage": language === 'de' ? 'de-DE' : language === 'en' ? 'en-US' : 'la',
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${baseUrl}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        },
        "publisher": {
          "@type": "Organization",
          "name": defaults.publisher,
          "url": baseUrl,
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/icons/favicon.svg`,
            "width": 512,
            "height": 512
          }
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": defaults.siteName,
        "url": baseUrl,
        "logo": `${baseUrl}/icons/favicon.svg`,
        "description": finalDescription,
        "sameAs": [
          `${baseUrl}/about`,
          `${baseUrl}/oer`
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "email": defaults.contact
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": defaults.siteName,
        "url": baseUrl,
        "description": finalDescription,
        "educationalLevel": "Sekundarstufe I & II",
        "audience": {
          "@type": "EducationalAudience",
          "educationalRole": ["student", "teacher"]
        }
      }
    ];

    return baseData;
  }, [language, defaults, finalDescription, structuredData, baseUrl]);

  useEffect(() => {
    // Update document title
    document.title = finalTitle;
    
    // Update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      let element = document.querySelector(`meta[${isProperty ? 'property' : 'name'}="${property}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', property);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Remove existing meta tags to avoid duplicates
    const removeMetaTag = (property: string, isProperty = false) => {
      const elements = document.querySelectorAll(`meta[${isProperty ? 'property' : 'name'}="${property}"]`);
      elements.forEach(el => el.remove());
    };

    // Basic meta tags
    removeMetaTag('description');
    removeMetaTag('author');
    removeMetaTag('robots');
    removeMetaTag('keywords');
    removeMetaTag('og:title');
    removeMetaTag('og:description');
    removeMetaTag('og:type');
    removeMetaTag('og:url');
    removeMetaTag('og:image');
    removeMetaTag('og:image:alt');
    removeMetaTag('og:site_name');
    removeMetaTag('og:locale');
    removeMetaTag('twitter:card');
    removeMetaTag('twitter:title');
    removeMetaTag('twitter:description');
    removeMetaTag('twitter:image');
    removeMetaTag('twitter:image:alt');
    removeMetaTag('twitter:site');
    removeMetaTag('twitter:creator');
    removeMetaTag('theme-color');
    removeMetaTag('mobile-web-app-capable');
    removeMetaTag('apple-mobile-web-app-capable');
    removeMetaTag('apple-mobile-web-app-status-bar-style');
    removeMetaTag('canonical');
    
    // Add new meta tags
    updateMetaTag('description', finalDescription);
    updateMetaTag('author', author || defaults.author);
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    updateMetaTag('keywords', defaults.keywords);
    
    // Open Graph
    updateMetaTag('og:title', finalTitle, true);
    updateMetaTag('og:description', finalDescription, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:image', finalImage, true);
    updateMetaTag('og:image:alt', title || defaults.siteName, true);
    updateMetaTag('og:site_name', defaults.siteName, true);
    updateMetaTag('og:locale', language === 'de' ? 'de_DE' : language === 'en' ? 'en_US' : 'la', true);
    
    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', finalImage);
    updateMetaTag('twitter:image:alt', title || defaults.siteName);
    updateMetaTag('twitter:site', '@meumdiarium');
    updateMetaTag('twitter:creator', author || defaults.author);
    
    // Mobile and PWA
    updateMetaTag('theme-color', '#5a0f1f');
    updateMetaTag('mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
    
    // Tags
    if (tags.length > 0) {
      updateMetaTag('keywords', tags.join(', '));
    }
    
    // Canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = canonical;
    } else {
      const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (canonicalLink) {
        canonicalLink.remove();
      }
    }
    
    // Update html lang attribute
    document.documentElement.lang = language;
    
    // hreflang alternates
    const existingAlternates = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingAlternates.forEach(el => el.remove());
    Object.keys(defaultMeta).forEach(loc => {
      if (loc !== language) {
        const linkEl = document.createElement('link');
        linkEl.rel = 'alternate';
        linkEl.hreflang = loc === 'en' ? 'en' : loc === 'de' ? 'de' : loc === 'la' ? 'la' : 'en';
        linkEl.href = `${baseUrl}${location.pathname}`;
        document.head.appendChild(linkEl);
      }
    });
    
    // JSON-LD structured data
    const existingLd = document.querySelectorAll('script[data-managed="seo-ld"]');
    existingLd.forEach(el => el.remove());

    // Handle both single objects and arrays of structured data
    if (Array.isArray(jsonLdData)) {
      // Multiple structured data objects - create separate script tags for each
      jsonLdData.forEach((data, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.dataset.managed = 'seo-ld';
        script.dataset.index = String(index);
        script.text = JSON.stringify(data);
        document.head.appendChild(script);
      });
    } else {
      // Single structured data object
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.managed = 'seo-ld';
      script.text = JSON.stringify(jsonLdData);
      document.head.appendChild(script);
    }
  }, [finalTitle, finalDescription, finalImage, currentUrl, language, author, type, publishedTime, modifiedTime, section, tags, noIndex, structuredData, canonical, jsonLdData]);
  
  return null;
}
