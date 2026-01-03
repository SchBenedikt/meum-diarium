import { useEffect } from 'react';
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
}

const defaultMeta = {
  de: {
    title: 'Meum Diarium – Das antike Rom erleben',
    description: 'Erlebe die Geschichte Roms durch die Augen großer Persönlichkeiten: Caesar, Cicero, Augustus und Seneca. Tagebucheinträge, wissenschaftliche Kommentare und interaktive Zeitreisen.',
    siteName: 'Meum Diarium'
  },
  en: {
    title: 'Meum Diarium – Experience Ancient Rome',
    description: 'Experience the history of Rome through the eyes of great personalities: Caesar, Cicero, Augustus and Seneca. Diary entries, scholarly commentary and interactive time travel.',
    siteName: 'Meum Diarium'
  },
  la: {
    title: 'Meum Diarium – Roma Antiqua',
    description: 'Experimur historiam Romae per oculos magnorum virorum: Caesar, Cicero, Augustus et Seneca. Commentarii diarii, eruditi et interactivae peregrinationes temporales.',
    siteName: 'Meum Diarium'
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
  noIndex,
  structuredData,
}: SEOProps) {
  const location = useLocation();
  const { language } = useLanguage();

  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://meum-diarium.xn--schchner-2za.de';
  const currentUrl = `${baseUrl}${location.pathname === '/' ? '' : location.pathname}`;

  const defaults = defaultMeta[language] || defaultMeta.de;
  const finalTitle = title ? `${title} | ${defaults.siteName}` : defaults.title;
  const finalDescription = description || defaults.description;
  const finalImage = image || `${baseUrl}/images/caesar-hero.jpg`;

  useEffect(() => {
    // Update document title
    document.title = finalTitle;

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let element = document.querySelector(selector);

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

    // Basic meta tags
    updateMetaTag('description', finalDescription);
    updateMetaTag('author', author || 'Meum Diarium');

    // Robots
    if (noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }

    if (tags.length > 0) {
      updateMetaTag('keywords', tags.join(', '));
    }

    // Open Graph
    updateMetaTag('og:title', finalTitle, true);
    updateMetaTag('og:description', finalDescription, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:image', finalImage, true);
    updateMetaTag('og:image:alt', title || defaults.siteName, true);
    updateMetaTag('og:site_name', defaults.siteName, true);
    updateMetaTag('og:locale', language === 'de' ? 'de_DE' : language === 'en' ? 'en_US' : 'la', true);
    Object.keys(defaultMeta)
      .filter(loc => loc !== language)
      .forEach(loc => updateMetaTag('og:locale:alternate', loc === 'en' ? 'en_US' : loc === 'de' ? 'de_DE' : 'la', true));

    // Article-specific Open Graph tags
    if (type === 'article') {
      if (author) {
        updateMetaTag('article:author', author, true);
      }
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true);
      }
      if (section) {
        updateMetaTag('article:section', section, true);
      }
      if (tags.length > 0) {
        // For multiple tags, we should create multiple meta tags
        // Remove existing article:tag tags first
        document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
        tags.forEach(tag => {
          const tagElement = document.createElement('meta');
          tagElement.setAttribute('property', 'article:tag');
          tagElement.setAttribute('content', tag);
          document.head.appendChild(tagElement);
        });
      }
    }

    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', finalImage);
    updateMetaTag('twitter:image:alt', title || defaults.siteName);
    updateMetaTag('twitter:site', '@meumdiarium');
    updateMetaTag('twitter:creator', author || '@meumdiarium');

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = currentUrl;

    // Update html lang attribute
    document.documentElement.lang = language;

    // hreflang alternates
    const existingAlternates = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingAlternates.forEach(el => el.remove());
    Object.keys(defaultMeta).forEach(loc => {
      const linkEl = document.createElement('link');
      linkEl.rel = 'alternate';
      linkEl.hreflang = loc === 'en' ? 'en' : loc === 'de' ? 'de' : 'la';
      linkEl.href = `${baseUrl}${location.pathname}`;
      document.head.appendChild(linkEl);
    });

    // theme-color for mobile UI polish
    updateMetaTag('theme-color', '#5a0f1f');
    updateMetaTag('mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');

    // Structured data (JSON-LD)
    const existingLd = document.querySelectorAll('script[data-managed="seo-ld"]');
    existingLd.forEach(el => el.remove());

    let blocks = Array.isArray(structuredData) ? [...structuredData] : structuredData ? [structuredData] : [];

    // Add default Article schema if it's an article and no schema provided
    if (type === 'article' && blocks.length === 0) {
      blocks.push({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title || finalTitle,
        description: finalDescription,
        image: finalImage,
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        author: {
          '@type': 'Person',
          name: author || 'Meum Diarium'
        }
      });
    }

    blocks.forEach(block => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.managed = 'seo-ld';
      script.text = JSON.stringify(block);
      document.head.appendChild(script);
    });

  }, [finalTitle, finalDescription, finalImage, currentUrl, language, author, type, publishedTime, modifiedTime, section, tags, noIndex, structuredData]);

  return null;
}
