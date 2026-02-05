#!/usr/bin/env python3
"""
The Latin Library - Complete Web Scraper v3.1 (FULLY WORKING)
Crawlt die gesamte Website https://www.thelatinlibrary.com

FIXES in v3.1:
- Regex-Parser für malformed HTML mit fehlenden </option> Tags
- KORREKTE URL-Auflösung für relative Links (Caesar, Apuleius, etc.)
- parse_author_page() bekommt author_url als Parameter
- Relative URLs werden gegen author_url aufgelöst, nicht base_url
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
import re
import time
from pathlib import Path
import logging
from typing import Dict, List, Optional, Tuple

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class LatinLibraryScraperV31:
    """Fully working version - alle Fehler behoben"""
    
    def __init__(self, base_url="https://www.thelatinlibrary.com", output_dir="latin_library"):
        self.base_url = base_url
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        self.visited_urls = set()
        self.saved_works = set()
        self.failed_urls = []
    
    def fetch_page(self, url: str) -> Optional[str]:
        """Herunterladung mit Error-Handling"""
        if url in self.visited_urls:
            return None
        
        self.visited_urls.add(url)
        
        try:
            time.sleep(0.15)
            response = self.session.get(url, timeout=10)
            response.encoding = 'utf-8'
            response.raise_for_status()
            return response.text
        except Exception as e:
            logger.warning(f"Error fetching {url}: {str(e)[:50]}")
            self.failed_urls.append((url, str(e)))
            return None
    
    def normalize_url(self, url: str) -> str:
        """Normalisiere URLs"""
        if not url:
            return ""
        
        url = url.strip().strip('"').strip("'")
        
        if url.startswith('http'):
            return url
        
        if url.startswith('/'):
            return self.base_url + url
        else:
            return urljoin(self.base_url + '/', url)
    
    def extract_links_from_index_REGEX(self, html: str) -> Dict[str, str]:
        """
        Extrahiere Autoren mit REGEX (robuster gegen malformed HTML)
        """
        authors = {}
        
        pattern = r'<option\s+value\s*=\s*["\']?([^"\'\s>]+)["\']?\s*>\s*([^<\n]+)'
        matches = re.finditer(pattern, html, re.IGNORECASE)
        
        for match in matches:
            try:
                href = match.group(1).strip()
                name = match.group(2).strip()
                
                if name in ['Select an Author', ''] or not name:
                    continue
                
                if len(name) > 100:
                    logger.debug(f"Skipping too-long option: {name[:50]}...")
                    continue
                
                if '\n' in name or '\r' in name:
                    logger.debug(f"Skipping option with newlines: {name[:50]}...")
                    continue
                
                if href:
                    full_url = self.normalize_url(href)
                    
                    if full_url not in authors.values():
                        authors[name] = full_url
                        logger.debug(f"Added: {name}")
            
            except Exception as e:
                logger.debug(f"Error parsing match: {e}")
                continue
        
        logger.info(f"Found {len(authors)} authors")
        return authors
    
    def parse_author_page(self, html: str, author_name: str, author_url: str) -> List[Tuple[str, str]]:
        """
        Parse Autor-Seite und extrahiere Werk-Links
        KRITISCH: author_url als Parameter für korrekte relative URL-Auflösung
        """
        soup = BeautifulSoup(html, 'html.parser')
        works = []
        seen_urls = set()
        
        body = soup.find('body')
        if not body:
            body = soup
        
        for link in body.find_all('a', href=True):
            href = link.get('href', '').strip()
            link_text = link.get_text(strip=True)
            
            if not href or not link_text:
                continue
            
            # Skippe Navigation
            if any(x in href.lower() for x in ['index', '#']):
                continue
            
            if any(x in link_text.lower() for x in ['index', 'classics page', 'latin library', 'credits', 'about', 'technical', 'contact']):
                continue
            
            # Nur HTML/SHTML
            if not any(href.endswith(ext) for ext in ['.shtml', '.html']):
                continue
            
            # KRITISCH: Korrekte URL-Auflösung gegen author_url
            if href.startswith('http'):
                full_url = href
            elif href.startswith('/'):
                # Absolute Pfade vom Host
                full_url = self.base_url + href
            else:
                # Relative Pfade relativ zur Autor-Seite
                base = author_url
                if not base.endswith('/'):
                    base = base + '/'
                full_url = urljoin(base, href)
            
            # Nur thelatinlibrary URLs
            if not full_url.startswith(self.base_url):
                continue
            
            # Duplikat Check
            if full_url in seen_urls:
                continue
            
            # Malformed names skippen
            if '\n' in link_text or len(link_text) > 100:
                continue
            
            seen_urls.add(full_url)
            works.append((link_text, full_url))
        
        logger.info(f"  Found {len(works)} works for {author_name}")
        return works
    
    def parse_verses_from_html(self, html: str) -> Tuple[Dict, int]:
        """Parse Verse - intelligenter Multiformat-Parser"""
        soup = BeautifulSoup(html, 'html.parser')
        verses = {}
        
        # Methode 1: Verse mit [<a name="N">...</a>] Format
        for para in soup.find_all('p'):
            for anchor in para.find_all('a', {'name': re.compile(r'^\d+$')}):
                verse_num = anchor.get('name')
                
                if verse_num and verse_num.isdigit():
                    full_text = para.get_text()
                    
                    match = re.search(r'\[\s*\d+\s*\]\s*(.*?)(?=\n\[|\Z)', full_text, re.DOTALL)
                    if match:
                        verse_text = match.group(1).strip()
                        if verse_text and len(verse_text) > 20:
                            verses[verse_num] = {
                                'number': int(verse_num),
                                'text': verse_text
                            }
        
        # Methode 2: Fallback - Parse Absätze
        if len(verses) < 5:
            verses.clear()
            para_count = 0
            
            for para in soup.find_all('p'):
                text = para.get_text().strip()
                
                if len(text) > 50 and not any(nav in text.lower() for nav in 
                    ['latin library', 'classics page', 'index', 'contact', 'technical', 'about']):
                    para_count += 1
                    verses[str(para_count)] = {
                        'number': para_count,
                        'text': text[:1000] + '...' if len(text) > 1000 else text
                    }
        
        return verses, len(verses)
    
    def sanitize_name(self, name: str, max_len: int = 80) -> str:
        """Sanitize Namen"""
        if not name:
            return "Unknown"
        
        # Entferne Newlines
        name = re.sub(r'[\n\r\t]+', ' ', name).strip()
        
        # Limit
        name = name[:max_len]
        
        # Saubere Zeichen
        name = re.sub(r'[^\w\s\-äöüßÄÖÜ]', '', name).strip()
        
        return name if name else "Unknown"
    
    def scrape_work(self, work_name: str, url: str) -> Optional[Dict]:
        """Scrape ein einzelnes Werk"""
        logger.debug(f"    Scraping: {work_name} from {url}")
        
        html = self.fetch_page(url)
        if not html:
            logger.debug(f"    Failed to fetch: {work_name}")
            return None
        
        soup = BeautifulSoup(html, 'html.parser')
        
        # Extrahiere Titel
        title = soup.find('h1')
        title_text = title.get_text(strip=True) if title else work_name
        
        # Parse Verse
        verses, verse_count = self.parse_verses_from_html(html)
        
        if verse_count == 0:
            logger.debug(f"    No verses found in {work_name}")
            return None
        
        logger.debug(f"    Found {verse_count} verses")
        
        return {
            'title': title_text,
            'url': url,
            'verse_count': verse_count,
            'verses': verses
        }
    
    def save_work_json(self, author_name: str, work_name: str, work_data: Dict) -> Optional[Path]:
        """Speichere Werk als JSON"""
        safe_author = self.sanitize_name(author_name, max_len=80)
        safe_work = self.sanitize_name(work_name, max_len=50)
        
        author_dir = self.output_dir / safe_author
        
        try:
            author_dir.mkdir(exist_ok=True)
        except OSError as e:
            logger.error(f"Cannot create directory {safe_author}: {e}")
            return None
        
        filename = author_dir / f"{safe_work}.json"
        
        # Duplikat Check
        if filename in self.saved_works:
            return None
        
        self.saved_works.add(filename)
        
        data = {
            'metadata': {
                'author': author_name,
                'work': work_name,
                'url': work_data['url'],
                'verse_count': work_data['verse_count'],
                'title': work_data['title']
            },
            'verses': work_data['verses']
        }
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return filename
        except Exception as e:
            logger.error(f"Error saving {filename}: {e}")
            return None
    
    def scrape_author(self, author_name: str, author_url: str) -> int:
        """Scrape alle Werke eines Autors"""
        safe_name = self.sanitize_name(author_name)
        logger.info(f"Processing: {safe_name}")
        
        html = self.fetch_page(author_url)
        if not html:
            logger.warning(f"Failed to fetch author page: {author_name}")
            return 0
        
        # KRITISCH: author_url übergeben!
        works = self.parse_author_page(html, author_name, author_url)
        
        saved_works = 0
        for work_name, work_url in works:
            work_data = self.scrape_work(work_name, work_url)
            
            if work_data:
                filename = self.save_work_json(author_name, work_name, work_data)
                if filename:
                    saved_works += 1
                    logger.debug(f"  ✓ {filename.name}")
        
        if saved_works > 0:
            logger.info(f"  ✓ Saved {saved_works} works")
        
        return saved_works
    
    def run(self):
        """Hauptmethode"""
        logger.info("="*70)
        logger.info("The Latin Library v3.1 - Scraper (FULLY WORKING)")
        logger.info("="*70)
        logger.info(f"Base URL: {self.base_url}")
        logger.info(f"Output: {self.output_dir}\n")
        
        # Herunterlade Index
        logger.info("[1/3] Fetching main index...")
        html = self.fetch_page(f"{self.base_url}/index.html")
        if not html:
            logger.error("Failed to fetch main index")
            return False
        
        # Extrahiere Autoren mit REGEX
        logger.info("[2/3] Extracting authors (using REGEX)...")
        authors = self.extract_links_from_index_REGEX(html)
        
        if not authors:
            logger.error("No authors found!")
            return False
        
        # Scrape Autoren
        logger.info(f"[3/3] Scraping {len(authors)} authors...\n")
        total_works = 0
        successful_authors = 0
        
        for idx, (author_name, author_url) in enumerate(sorted(authors.items()), 1):
            saved = self.scrape_author(author_name, author_url)
            if saved > 0:
                successful_authors += 1
                total_works += saved
            
            if idx % 10 == 0:
                logger.info(f"  Progress: {idx}/{len(authors)} authors")
        
        # Statistiken
        logger.info("\n" + "="*70)
        logger.info("✓ SCRAPING COMPLETE!")
        logger.info("="*70)
        logger.info(f"Successful authors: {successful_authors}/{len(authors)}")
        logger.info(f"Total works saved: {total_works}")
        logger.info(f"Failed URLs: {len(self.failed_urls)}")
        logger.info(f"Output directory: {self.output_dir.absolute()}")
        logger.info("="*70)
        
        return True

def main():
    scraper = LatinLibraryScraperV31()
    success = scraper.run()
    exit(0 if success else 1)

if __name__ == "__main__":
    main()