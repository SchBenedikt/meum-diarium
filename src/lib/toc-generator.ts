/**
 * Table of Contents Generator
 * Parst Markdown-Headings und generiert eine strukturierte TOC
 */

export interface TocItem {
  id: string;
  text: string;
  level: number; // 1, 2, 3, 4
}

/**
 * Extrahiert Headings aus Markdown-Text und generiert eine TOC
 * @param content - Markdown-Text mit Headings (## ### etc)
 * @returns Array von TOC-Items mit ID und Text
 */
export function generateTableOfContents(content: string): TocItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length; // ## = 2, ### = 3, #### = 4
    const text = match[2].trim();
    const id = slugify(text);
    
    toc.push({
      id,
      text,
      level,
    });
  }
  
  // Normalisiere die Level: Die kleinste verwendete Überschrift wird zu Level 1
  // Das sorgt dafür, dass TOCs ohne H1 (nur ##, ### etc.) richtig dargestellt werden
  if (toc.length > 0) {
    const minLevel = Math.min(...toc.map(item => item.level));
    if (minLevel > 1) {
      const offset = minLevel - 1;
      toc.forEach(item => {
        item.level = item.level - offset;
      });
    }
  }
  
  return toc;
}

/**
 * Konvertiert Text in einen URL-freundlichen Slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Entferne Sonderzeichen
    .replace(/\s+/g, '-') // Ersetze Leerzeichen mit Bindestrich
    .replace(/-+/g, '-') // Entferne mehrfache Bindestriche
    .trim();
}

/**
 * Injiziert IDs in Markdown-Headings
 * @param content - Markdown-Text
 * @returns Text mit IDs in den Headings
 */
export function injectHeadingIds(content: string): string {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  
  return content.replace(headingRegex, (match, hashes, text) => {
    const id = slugify(text.trim());
    return `${hashes} ${text}\n{#${id}}`; // Setext-style ID (wird später vom Formatter benutzt)
  });
}

/**
 * Extrahiert Heading-IDs aus Content für Scroll-Linking
 */
export function extractHeadingIds(content: string): Map<string, string> {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const ids = new Map<string, string>();
  
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[2].trim();
    const id = slugify(text);
    ids.set(text, id);
  }
  
  return ids;
}
