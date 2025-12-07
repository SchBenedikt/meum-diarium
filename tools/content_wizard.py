#!/usr/bin/env python3
"""
Modern Blog Admin Dashboard - Backend Server
Startet einen lokalen Web-Server für das moderne Blog-Admin Interface
"""

import argparse
import json
import datetime as dt
import os
import re
import textwrap
import unicodedata
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import webbrowser


REPO_ROOT = Path(__file__).resolve().parents[1]  # Go up to repository root
POSTS_DIR = REPO_ROOT / 'src' / 'content' / 'posts'
LEXICON_DIR = REPO_ROOT / 'src' / 'content' / 'lexicon'
LEXICON_INDEX = REPO_ROOT / 'src' / 'data' / 'lexicon.ts'
AUTHORS_FILE = REPO_ROOT / 'src' / 'data' / 'authors.ts'
WORKS_DIR = REPO_ROOT / 'src' / 'content' / 'works'
WORKS_INDEX = REPO_ROOT / 'src' / 'data' / 'works.ts'
STATIC_DIR = REPO_ROOT / 'tools' / 'blog_admin'

AUTHORS = ['caesar', 'cicero', 'augustus', 'seneca']
CATEGORIES = ['Politik', 'Militär', 'Philosophie', 'Recht', 'Religion', 'Gesellschaft']


def simple_slugify(text: str) -> str:
    """Konvertiert Text zu URL-freundlichem Slug."""
    text = unicodedata.normalize('NFKD', text)
    text = text.encode('ascii', 'ignore').decode('ascii')
    text = re.sub(r"[^a-zA-Z0-9\s-]", '', text)
    text = re.sub(r"\s+", '-', text)
    text = re.sub(r"-+", '-', text)
    return text.strip('-').lower()


def next_id() -> int:
    """Findet nächste verfügbare Post-ID."""
    max_id = 0
    for ts_file in POSTS_DIR.rglob('*.ts'):
        try:
            content = ts_file.read_text(encoding='utf-8')
        except Exception:
            continue
        m = re.search(r"id:\s*'([0-9]+)'", content)
        if m:
            max_id = max(max_id, int(m.group(1)))
    return max_id + 1


def estimate_reading_time(*texts: str) -> int:
    """Schätzt Lesezeit in Minuten."""
    words = 0
    for t in texts:
        words += len(re.findall(r"\w+", t or ''))
    wpm = 200
    return max(1, round(words / wpm))


def escape_backticks(text: str) -> str:
    """Escaped Backticks im Text."""
    return (text or '').replace('`', '\\`')


def build_ts(post: dict) -> str:
    """Baut TypeScript-Datei-Inhalt."""
    diary_de = escape_backticks(post['content_de_diary'])
    scientific_de = escape_backticks(post['content_de_scientific'])
    diary_en = escape_backticks(post.get('content_en_diary', ''))
    scientific_en = escape_backticks(post.get('content_en_scientific', ''))
    diary_la = escape_backticks(post.get('content_la_diary', ''))
    scientific_la = escape_backticks(post.get('content_la_scientific', ''))

    tags_array = ', '.join([f"'{t.strip()}'" for t in post['tags'] if t.strip()])

    translations_blocks = []
    if any([post.get('title_en'), post.get('excerpt_en'), diary_en, scientific_en, post.get('tags_en')]):
        tags_en = ', '.join([f"'{t.strip()}'" for t in (post.get('tags_en') or []) if t.strip()])
        translations_blocks.append(textwrap.dedent(f"""
          en: {{
            title: '{post.get('title_en','')}',
            excerpt: '{post.get('excerpt_en','')}',
            content: {{ diary: `{diary_en}`, scientific: `{scientific_en}` }},
            tags: [{tags_en}]
          }}
        """).strip())
    
    if any([post.get('title_la'), post.get('excerpt_la'), diary_la, scientific_la, post.get('tags_la')]):
        tags_la = ', '.join([f"'{t.strip()}'" for t in (post.get('tags_la') or []) if t.strip()])
        translations_blocks.append(textwrap.dedent(f"""
          la: {{
            title: '{post.get('title_la','')}',
            excerpt: '{post.get('excerpt_la','')}',
            content: {{ diary: `{diary_la}`, scientific: `{scientific_la}` }},
            tags: [{tags_la}]
          }}
        """).strip())

    translations = ''
    if translations_blocks:
        translations = ",\n    translations: {\n      " + ",\n      ".join(translations_blocks) + "\n    }"

    ts = textwrap.dedent(f"""
    import {{ BlogPost }} from '@/types/blog';


    const post: BlogPost = {{
        id: '{post['id']}',
        slug: '{post['slug']}',
        author: '{post['author']}',
        title: '{post['title_de']}',
        excerpt: '{post['excerpt_de']}',
        historicalDate: '{post['historicalDate']}',
        historicalYear: {post['historicalYear']},
        date: '{post['date']}',
        readingTime: {post['readingTime']},
        tags: [{tags_array}],
        coverImage: '{post['coverImage']}',
        content: {{
          diary: `{diary_de}`,
          scientific: `{scientific_de}`
        }}{translations}
      }};


    export default post;
    """)
    return ts.strip() + "\n"


def read_post_file(file_path: Path) -> dict:
    """Liest einen Post aus TypeScript-Datei."""
    try:
        content = file_path.read_text(encoding='utf-8')
        
        # Einfaches Parsing der TypeScript-Datei
        post: dict[str, object] = {
            'file_path': str(file_path),
            'filename': file_path.stem,
        }
        
        # Regex für verschiedene Felder
        patterns = {
            'id': r"id:\s*'([^']+)'",
            'slug': r"slug:\s*'([^']+)'",
            'author': r"author:\s*'([^']+)'",
            'title': r"title:\s*'([^']*)'",
            'excerpt': r"excerpt:\s*'([^']*)'",
            'historicalDate': r"historicalDate:\s*'([^']+)'",
            'historicalYear': r"historicalYear:\s*(-?\d+)",
            'date': r"date:\s*'([^']+)'",
            'readingTime': r"readingTime:\s*(\d+)",
            'coverImage': r"coverImage:\s*'([^']*)'",
        }
        
        for key, pattern in patterns.items():
            match = re.search(pattern, content)
            if match:
                post[key] = match.group(1)
        
        # Tags extrahieren
        tags_match = re.search(r"tags:\s*\[([^\]]*)\]", content)
        if tags_match:
            tags_str = tags_match.group(1)
            post['tags'] = [t.strip().strip("'\"") for t in tags_str.split(',') if t.strip()]
        else:
            post['tags'] = []

        # Content (DE) diary/scientific extrahieren
        diary_match = re.search(r"content:\s*\{\s*diary:\s*`([\s\S]*?)`,\s*scientific:\s*`([\s\S]*?)`\s*\}", content)
        if diary_match:
            post['content_de_diary'] = diary_match.group(1)
            post['content_de_scientific'] = diary_match.group(2)

        # Übersetzungen EN/LA extrahieren (Titel, Excerpt, Inhalte, Tags)
        # EN
        title_en = re.search(r"translations:\s*\{[\s\S]*?en:\s*\{[\s\S]*?title:\s*'([^']*)'", content)
        excerpt_en = re.search(r"translations:\s*\{[\s\S]*?en:\s*\{[\s\S]*?excerpt:\s*'([^']*)'", content)
        diary_en = re.search(r"translations:\s*\{[\s\S]*?en:\s*\{[\s\S]*?content:\s*\{\s*diary:\s*`([\s\S]*?)`", content)
        scientific_en = re.search(r"translations:\s*\{[\s\S]*?en:\s*\{[\s\S]*?content:\s*\{[\s\S]*?scientific:\s*`([\s\S]*?)`", content)
        tags_en_match = re.search(r"translations:\s*\{[\s\S]*?en:\s*\{[\s\S]*?tags:\s*\[([^\]]*)\]", content)
        if title_en: post['title_en'] = title_en.group(1)
        if excerpt_en: post['excerpt_en'] = excerpt_en.group(1)
        if diary_en: post['content_en_diary'] = diary_en.group(1)
        if scientific_en: post['content_en_scientific'] = scientific_en.group(1)
        if tags_en_match:
            tags_str = tags_en_match.group(1)
            tags_list = [t.strip().strip("'\"") for t in tags_str.split(',') if t.strip()]
            post['tags_en'] = tags_list

        # LA
        title_la = re.search(r"translations:\s*\{[\s\S]*?la:\s*\{[\s\S]*?title:\s*'([^']*)'", content)
        excerpt_la = re.search(r"translations:\s*\{[\s\S]*?la:\s*\{[\s\S]*?excerpt:\s*'([^']*)'", content)
        diary_la = re.search(r"translations:\s*\{[\s\S]*?la:\s*\{[\s\S]*?content:\s*\{\s*diary:\s*`([\s\S]*?)`", content)
        scientific_la = re.search(r"translations:\s*\{[\s\S]*?la:\s*\{[\s\S]*?content:\s*\{[\s\S]*?scientific:\s*`([\s\S]*?)`", content)
        tags_la_match = re.search(r"translations:\s*\{[\s\S]*?la:\s*\{[\s\S]*?tags:\s*\[([^\]]*)\]", content)
        if title_la: post['title_la'] = title_la.group(1)
        if excerpt_la: post['excerpt_la'] = excerpt_la.group(1)
        if diary_la: post['content_la_diary'] = diary_la.group(1)
        if scientific_la: post['content_la_scientific'] = scientific_la.group(1)
        if tags_la_match:
            tags_str = tags_la_match.group(1)
            tags_list_la = [t.strip().strip("'\"") for t in tags_str.split(',') if t.strip()]
            post['tags_la'] = tags_list_la
        
        return post
    except Exception as e:
        return {'error': str(e)}


def get_all_posts() -> list:
    """Liest alle Posts aus dem Posts-Verzeichnis."""
    posts = []
    for author_dir in POSTS_DIR.iterdir():
        if author_dir.is_dir():
            for ts_file in author_dir.glob('*.ts'):
                post = read_post_file(ts_file)
                if 'error' not in post:
                    posts.append(post)
    return sorted(posts, key=lambda p: p.get('date', ''), reverse=True)


def build_lexicon_ts(entry: dict) -> str:
    """Baut TypeScript-Datei-Inhalt für Lexikon-Eintrag."""
    term = entry['term']
    definition = escape_backticks(entry['definition'])
    category = entry['category']
    etymology = entry.get('etymology', '')
    variants = entry.get('variants', [])
    related_terms = entry.get('relatedTerms', [])
    
    variants_array = ', '.join([f'"{v.strip()}"' for v in variants if v.strip()])
    related_array = ', '.join([f'"{r.strip()}"' for r in related_terms if r.strip()])
    
    # Übersetzungen
    translations_blocks = []
    
    # DE (falls angegeben)
    if entry.get('term_de'):
        def_de = escape_backticks(entry.get('definition_de', ''))
        cat_de = entry.get('category_de', '')
        etym_de = entry.get('etymology_de', '')
        vars_de = ', '.join([f'"{v.strip()}"' for v in (entry.get('variants_de') or []) if v.strip()])
        translations_blocks.append(textwrap.dedent(f"""
      de: {{
        term: "{entry.get('term_de', '')}",
        definition: "{def_de}",
        category: "{cat_de}",
        etymology: "{etym_de}",
        variants: [{vars_de}]
      }}
        """).strip())
    
    # EN
    if entry.get('term_en'):
        def_en = escape_backticks(entry.get('definition_en', ''))
        cat_en = entry.get('category_en', '')
        etym_en = entry.get('etymology_en', '')
        vars_en = ', '.join([f'"{v.strip()}"' for v in (entry.get('variants_en') or []) if v.strip()])
        translations_blocks.append(textwrap.dedent(f"""
      en: {{
        term: "{entry.get('term_en', '')}",
        definition: "{def_en}",
        category: "{cat_en}",
        etymology: "{etym_en}",
        variants: [{vars_en}]
      }}
        """).strip())
    
    # LA
    if entry.get('term_la'):
        def_la = escape_backticks(entry.get('definition_la', ''))
        cat_la = entry.get('category_la', '')
        etym_la = entry.get('etymology_la', '')
        vars_la = ', '.join([f'"{v.strip()}"' for v in (entry.get('variants_la') or []) if v.strip()])
        translations_blocks.append(textwrap.dedent(f"""
      la: {{
        term: "{entry.get('term_la', '')}",
        definition: "{def_la}",
        category: "{cat_la}",
        etymology: "{etym_la}",
        variants: [{vars_la}]
      }}
        """).strip())
    
    translations = ''
    if translations_blocks:
        translations = ",\n    translations: {\n      " + ",\n      ".join(translations_blocks) + "\n    }"
    
    ts = textwrap.dedent(f"""
    import {{ LexiconEntry }} from '@/types/blog';

    const entry: LexiconEntry = {{
        term: "{term}",
        slug: "{entry['slug']}",
        variants: [{variants_array}],
        definition: "{definition}",
        category: "{category}",
        etymology: "{etymology}",
        relatedTerms: [{related_array}]{translations}
      }};

    export default entry;
    """)
    return ts.strip() + "\n"


def read_lexicon_file(file_path: Path) -> dict:
    """Liest einen Lexikon-Eintrag aus TypeScript-Datei."""
    try:
        content = file_path.read_text(encoding='utf-8')
        
        entry: dict[str, object] = {
            'file_path': str(file_path),
            'filename': file_path.stem,
            'slug': file_path.stem,
        }
        
        # Basis-Felder
        patterns = {
            'term': r'term:\s*"([^"]+)"',
            'slug': r'slug:\s*"([^"]+)"',
            'definition': r'definition:\s*"([^"]*)"',
            'category': r'category:\s*"([^"]+)"',
            'etymology': r'etymology:\s*"([^"]*)"',
        }
        
        for key, pattern in patterns.items():
            match = re.search(pattern, content)
            if match:
                entry[key] = match.group(1)
        
        # Variants
        variants_match = re.search(r'variants:\s*\[([^\]]*)\]', content)
        if variants_match:
            vars_str = variants_match.group(1)
            entry['variants'] = [v.strip().strip('"\'') for v in vars_str.split(',') if v.strip()]
        else:
            entry['variants'] = []
        
        # Related Terms
        related_match = re.search(r'relatedTerms:\s*\[([^\]]*)\]', content)
        if related_match:
            rel_str = related_match.group(1)
            entry['relatedTerms'] = [r.strip().strip('"\'') for r in rel_str.split(',') if r.strip()]
        else:
            entry['relatedTerms'] = []
        
        # Übersetzungen DE
        term_de = re.search(r'translations:\s*\{[\s\S]*?de:\s*\{[\s\S]*?term:\s*"([^"]*)"', content)
        def_de = re.search(r'translations:\s*\{[\s\S]*?de:\s*\{[\s\S]*?definition:\s*"([^"]*)"', content)
        cat_de = re.search(r'translations:\s*\{[\s\S]*?de:\s*\{[\s\S]*?category:\s*"([^"]*)"', content)
        etym_de = re.search(r'translations:\s*\{[\s\S]*?de:\s*\{[\s\S]*?etymology:\s*"([^"]*)"', content)
        vars_de_match = re.search(r'translations:\s*\{[\s\S]*?de:\s*\{[\s\S]*?variants:\s*\[([^\]]*)\]', content)
        if term_de: entry['term_de'] = term_de.group(1)
        if def_de: entry['definition_de'] = def_de.group(1)
        if cat_de: entry['category_de'] = cat_de.group(1)
        if etym_de: entry['etymology_de'] = etym_de.group(1)
        if vars_de_match:
            vars_str = vars_de_match.group(1)
            entry['variants_de'] = [v.strip().strip('"\'') for v in vars_str.split(',') if v.strip()]
        
        # Übersetzungen EN
        term_en = re.search(r'translations:\s*\{[\s\S]*?en:\s*\{[\s\S]*?term:\s*"([^"]*)"', content)
        def_en = re.search(r'translations:\s*\{[\s\S]*?en:\s*\{[\s\S]*?definition:\s*"([^"]*)"', content)
        cat_en = re.search(r'translations:\s*\{[\s\S]*?en:\s*\{[\s\S]*?category:\s*"([^"]*)"', content)
        etym_en = re.search(r'translations:\s*\{[\s\S]*?en:\s*\{[\s\S]*?etymology:\s*"([^"]*)"', content)
        vars_en_match = re.search(r'translations:\s*\{[\s\S]*?en:\s*\{[\s\S]*?variants:\s*\[([^\]]*)\]', content)
        if term_en: entry['term_en'] = term_en.group(1)
        if def_en: entry['definition_en'] = def_en.group(1)
        if cat_en: entry['category_en'] = cat_en.group(1)
        if etym_en: entry['etymology_en'] = etym_en.group(1)
        if vars_en_match:
            vars_str = vars_en_match.group(1)
            entry['variants_en'] = [v.strip().strip('"\'') for v in vars_str.split(',') if v.strip()]
        
        # Übersetzungen LA
        term_la = re.search(r'translations:\s*\{[\s\S]*?la:\s*\{[\s\S]*?term:\s*"([^"]*)"', content)
        def_la = re.search(r'translations:\s*\{[\s\S]*?la:\s*\{[\s\S]*?definition:\s*"([^"]*)"', content)
        cat_la = re.search(r'translations:\s*\{[\s\S]*?la:\s*\{[\s\S]*?category:\s*"([^"]*)"', content)
        etym_la = re.search(r'translations:\s*\{[\s\S]*?la:\s*\{[\s\S]*?etymology:\s*"([^"]*)"', content)
        vars_la_match = re.search(r'translations:\s*\{[\s\S]*?la:\s*\{[\s\S]*?variants:\s*\[([^\]]*)\]', content)
        if term_la: entry['term_la'] = term_la.group(1)
        if def_la: entry['definition_la'] = def_la.group(1)
        if cat_la: entry['category_la'] = cat_la.group(1)
        if etym_la: entry['etymology_la'] = etym_la.group(1)
        if vars_la_match:
            vars_str = vars_la_match.group(1)
            entry['variants_la'] = [v.strip().strip('"\'') for v in vars_str.split(',') if v.strip()]
        
        return entry
    except Exception as e:
        return {'error': str(e)}


def get_all_lexicon_entries() -> list:
    """Liest alle Lexikon-Einträge."""
    entries = []
    if LEXICON_DIR.exists():
        for ts_file in LEXICON_DIR.glob('*.ts'):
            entry = read_lexicon_file(ts_file)
            if 'error' not in entry:
                entries.append(entry)
    return sorted(entries, key=lambda e: e.get('term', '').lower())


def update_lexicon_index():
    """Aktualisiert src/data/lexicon.ts mit allen Einträgen."""
    entries = get_all_lexicon_entries()
    
    imports = []
    export_list = []
    
    for entry in entries:
        slug = entry['slug']
        camel_name = ''.join([part.capitalize() for part in slug.split('-')])
        camel_name = camel_name[0].lower() + camel_name[1:] if camel_name else slug
        imports.append(f"import {camel_name} from '@/content/lexicon/{slug}';")
        export_list.append(f"  {camel_name},")
    
    index_content = textwrap.dedent(f"""
    import {{ LexiconEntry }} from '@/types/blog';

    {chr(10).join(imports)}

    export const lexicon: LexiconEntry[] = [
    {chr(10).join(export_list)}
    ];
    """).strip() + "\n"
    
    LEXICON_INDEX.write_text(index_content, encoding='utf-8')


# === Authors helpers ===
def read_authors() -> list:
    """Liest Autoren aus src/data/authors.ts."""
    if not AUTHORS_FILE.exists():
        return []
    content = AUTHORS_FILE.read_text(encoding='utf-8')
    # sehr einfaches Parsing: trennt Blöcke pro Autor
    authors = []
    # Match author blocks like: caesar: { ... }, or seneca: { ... },
    # The regex needs to handle both trailing commas and closing braces
    for m in re.finditer(r"(\w+):\s*\{([\s\S]*?)\}[,]?", content):
        key = m.group(1)
        block = m.group(2)
        a = {'id': key}
        def grab(name, pattern):
            mm = re.search(pattern, block)
            if mm:
                a[name] = mm.group(1)
        grab('name', r"name:\s*'([^']*)'")
        grab('latinName', r"latinName:\s*'([^']*)'")
        grab('title', r"title:\s*'([^']*)'")
        grab('years', r"years:\s*'([^']*)'")
        by = re.search(r"birthYear:\s*(-?\d+)", block)
        dy = re.search(r"deathYear:\s*(-?\d+)", block)
        a['birthYear'] = int(by.group(1)) if by else None
        a['deathYear'] = int(dy.group(1)) if dy else None
        grab('description', r"description:\s*'([^']*)'")
        grab('heroImage', r"heroImage:\s*'([^']*)'")
        grab('theme', r"theme:\s*'([^']*)'")
        grab('color', r"color:\s*'([^']*)'")
        # translations blocks
        def tgrab(lang, field, pat):
            mm = re.search(pat, block)
            if mm:
                a.setdefault(f'{field}_{lang}', mm.group(1))
        # de
        tgrab('de','name', r"translations:\s*\{[\s\S]*?de:\s*\{[\s\S]*?name:\s*'([^']*)'")
        tgrab('de','title', r"translations:\s*\{[\s\S]*?de:\s*\{[\s\S]*?title:\s*'([^']*)'")
        tgrab('de','years', r"translations:\s*\{[\s\S]*?de:\s*\{[\s\S]*?years:\s*'([^']*)'")
        tgrab('de','description', r"translations:\s*\{[\s\S]*?de:\s*\{[\s\S]*?description:\s*'([^']*)'")
        # en
        tgrab('en','name', r"translations:\s*\{[\s\S]*?en:\s*\{[\s\S]*?name:\s*'([^']*)'")
        tgrab('en','title', r"translations:\s*\{[\s\S]*?en:\s*\{[\s\S]*?title:\s*'([^']*)'")
        tgrab('en','years', r"translations:\s*\{[\s\S]*?en:\s*\{[\s\S]*?years:\s*'([^']*)'")
        tgrab('en','description', r"translations:\s*\{[\s\S]*?en:\s*\{[\s\S]*?description:\s*'([^']*)'")
        # la
        tgrab('la','name', r"translations:\s*\{[\s\S]*?la:\s*\{[\s\S]*?name:\s*'([^']*)'")
        tgrab('la','title', r"translations:\s*\{[\s\S]*?la:\s*\{[\s\S]*?title:\s*'([^']*)'")
        tgrab('la','years', r"translations:\s*\{[\s\S]*?la:\s*\{[\s\S]*?years:\s*'([^']*)'")
        tgrab('la','description', r"translations:\s*\{[\s\S]*?la:\s*\{[\s\S]*?description:\s*'([^']*)'")
        authors.append(a)
    return authors


def write_authors(authors: list):
    """Schreibt Autoren nach src/data/authors.ts."""
    lines = ["import { AuthorInfo } from '@/types/blog';", '', 'export const authors: Record<string, AuthorInfo> = {']
    for a in authors:
        id = a['id']
        def esc(s):
            return (s or '').replace("'", "\\'")
        block = [f"  {id}: {{",
                 f"    id: '{id}',",
                 f"    name: '{esc(a.get('name',''))}',",
                 f"    latinName: '{esc(a.get('latinName',''))}',",
                 f"    title: '{esc(a.get('title',''))}',",
                 f"    years: '{esc(a.get('years',''))}',",
                 f"    birthYear: {int(a.get('birthYear') or 0)},",
                 f"    deathYear: {int(a.get('deathYear') or 0)},",
                 f"    description: '{esc(a.get('description',''))}',",
                 f"    heroImage: '{esc(a.get('heroImage',''))}',",
                 f"    theme: '{esc(a.get('theme',''))}',",
                 f"    color: '{esc(a.get('color',''))}',"]
        # translations compose
        translations = []
        for lang in ['de','en','la']:
            if any([a.get(f'name_{lang}'), a.get(f'title_{lang}'), a.get(f'years_{lang}'), a.get(f'description_{lang}')]):
                translations.append("      {lang}: {\n        name: '" + esc(a.get(f'name_{lang}','')) + "',\n        title: '" + esc(a.get(f'title_{lang}','')) + "',\n        years: '" + esc(a.get(f'years_{lang}','')) + "',\n        description: '" + esc(a.get(f'description_{lang}','')) + "'\n      }")
        if translations:
            block.append("    translations: {\n" + ",\n".join(translations).replace('{lang}', '{lang}') + "\n    },")
        block.append("  },")
        lines.extend(block)
    lines.append('};\n')
    AUTHORS_FILE.write_text("\n".join(lines), encoding='utf-8')


def get_all_works() -> list:
    """Liest alle Works aus content/works."""
    works = []
    if not WORKS_DIR.exists():
        return works
    for ts_file in WORKS_DIR.glob('*.ts'):
        try:
            content = ts_file.read_text(encoding='utf-8')
            work = {
                'id': ts_file.stem,
                'slug': ts_file.stem,
                'file_path': str(ts_file),
            }
            
            # Parse title, author, year, summary, takeaway
            def grab(name, pattern):
                m = re.search(pattern, content)
                if m:
                    work[name] = m.group(1)
            
            grab('title', r"title:\s*'([^']*)'")
            grab('author', r"author:\s*'([^']*)'")
            grab('year', r"year:\s*'([^']*)'")
            grab('summary', r"summary:\s*`([^`]*)`")
            grab('takeaway', r"takeaway:\s*`([^`]*)`")
            
            works.append(work)
        except Exception:
            pass
    return sorted(works, key=lambda x: x.get('id', ''))


def build_work_ts(work: dict) -> str:
    """Baut TypeScript-Datei für ein Work."""
    def esc(s):
        return (str(s) if s is not None else '').replace('`', '\\`')
    
    structure = work.get('structure', [])
    structure_code = ', '.join([f"{{ title: '{esc(s.get('title', ''))}', content: `{esc(s.get('content', ''))}` }}" for s in structure])
    
    translations_blocks = []
    if any([work.get('title_en'), work.get('summary_en'), work.get('takeaway_en')]):
        structure_en = ', '.join([f"{{ title: '{esc(s.get('title_en', ''))}', content: `{esc(s.get('content_en', ''))}` }}" for s in structure if s.get('title_en')])
        translations_blocks.append(textwrap.dedent(f"""
          en: {{
            title: '{esc(work.get('title_en', ''))}',
            summary: `{esc(work.get('summary_en', ''))}`,
            takeaway: `{esc(work.get('takeaway_en', ''))}`,
            structure: [{structure_en}]
          }}
        """).strip())
    
    if any([work.get('title_la'), work.get('summary_la'), work.get('takeaway_la')]):
        structure_la = ', '.join([f"{{ title: '{esc(s.get('title_la', ''))}', content: `{esc(s.get('content_la', ''))}` }}" for s in structure if s.get('title_la')])
        translations_blocks.append(textwrap.dedent(f"""
          la: {{
            title: '{esc(work.get('title_la', ''))}',
            summary: `{esc(work.get('summary_la', ''))}`,
            takeaway: `{esc(work.get('takeaway_la', ''))}`,
            structure: [{structure_la}]
          }}
        """).strip())
    
    translations_section = ""
    if translations_blocks:
        translations_section = f",\n    translations: {{\n{','.join(translations_blocks)}\n    }}"
    
    return textwrap.dedent(f"""
    import {{ Work }} from '@/types/blog';

    const work: Work = {{
      title: '{esc(work.get('title', ''))}',
      author: '{work.get('author', '')}',
      year: '{esc(work.get('year', ''))}',
      summary: `{esc(work.get('summary', ''))}`,
      takeaway: `{esc(work.get('takeaway', ''))}`,
      structure: [{structure_code}]{translations_section}
    }};

    export default work;
    """).strip()


def update_works_index():
    """Aktualisiert src/data/works.ts nach Änderungen."""
    works = get_all_works()
    lines = ["import { Work } from '@/types/blog';", ""]
    
    # Imports
    for work in works:
        slug = simple_slugify(work.get('id', ''))
        camel = ''.join(w.capitalize() for w in slug.split('-'))
        lines.append(f"import {camel} from '@/content/works/{slug}';")
    
    lines.extend(["", "export const works: Record<string, Work> = {"])
    
    # Map
    for work in works:
        slug = simple_slugify(work.get('id', ''))
        camel = ''.join(w.capitalize() for w in slug.split('-'))
        lines.append(f"  '{slug}': {camel},")
    
    lines.append("};")
    WORKS_INDEX.write_text("\n".join(lines), encoding='utf-8')


class BlogAdminHandler(SimpleHTTPRequestHandler):
    """Handler für Blog-Admin API."""

    def do_GET(self):
        """GET Requests bearbeiten."""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/posts':
            posts = get_all_posts()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(posts).encode())
        
        elif parsed_path.path.startswith('/api/posts/'):
            post_id = parsed_path.path.split('/')[-1]
            posts = get_all_posts()
            post = next((p for p in posts if p.get('id') == post_id), None)
            
            self.send_response(200 if post else 404)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(post or {}).encode())
        
        elif parsed_path.path == '/api/lexicon':
            entries = get_all_lexicon_entries()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(entries).encode())

        elif parsed_path.path == '/api/authors':
            authors = read_authors()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(authors).encode())
        
        elif parsed_path.path.startswith('/api/authors/'):
            author_id = parsed_path.path.split('/')[-1]
            authors = read_authors()
            author = next((a for a in authors if a.get('id') == author_id), None)
            
            self.send_response(200 if author else 404)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(author or {}).encode())
        
        elif parsed_path.path == '/api/works':
            works = get_all_works()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(works).encode())
        
        elif parsed_path.path.startswith('/api/works/'):
            work_id = parsed_path.path.split('/')[-1]
            works = get_all_works()
            work = next((w for w in works if w.get('id') == work_id), None)
            
            self.send_response(200 if work else 404)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(work or {}).encode())
        
        elif parsed_path.path.startswith('/api/lexicon/'):
            slug = parsed_path.path.split('/')[-1]
            entries = get_all_lexicon_entries()
            entry = next((e for e in entries if e.get('slug') == slug), None)
            
            self.send_response(200 if entry else 404)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(entry or {}).encode())
        
        elif parsed_path.path == '/':
            # Serve index.html
            index_file = STATIC_DIR / 'index.html'
            if index_file.exists():
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(index_file.read_bytes())
            else:
                self.send_response(404)
                self.end_headers()
        
        else:
            # Versuche statische Datei zu servieren
            file_path = STATIC_DIR / parsed_path.path.lstrip('/')
            if file_path.exists() and file_path.is_file():
                self.send_response(200)
                if file_path.suffix == '.css':
                    self.send_header('Content-type', 'text/css')
                elif file_path.suffix == '.js':
                    self.send_header('Content-type', 'text/javascript')
                self.end_headers()
                self.wfile.write(file_path.read_bytes())
            else:
                self.send_response(404)
                self.end_headers()

    def do_POST(self):
        """POST Requests bearbeiten."""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/lexicon':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            entry_data = json.loads(body.decode())
            
            # Neuen Lexikon-Eintrag speichern
            slug = entry_data.get('slug') or simple_slugify(entry_data.get('term', 'entry'))
            entry = {
                'slug': slug,
                'term': entry_data.get('term', ''),
                'definition': entry_data.get('definition', ''),
                'category': entry_data.get('category', 'Politik'),
                'etymology': entry_data.get('etymology', ''),
                'variants': entry_data.get('variants', []),
                'relatedTerms': entry_data.get('relatedTerms', []),
            }
            
            # Optional: DE
            if entry_data.get('term_de'):
                entry['term_de'] = entry_data.get('term_de', '')
                entry['definition_de'] = entry_data.get('definition_de', '')
                entry['category_de'] = entry_data.get('category_de', '')
                entry['etymology_de'] = entry_data.get('etymology_de', '')
                entry['variants_de'] = entry_data.get('variants_de', [])
            
            # Optional: EN
            if entry_data.get('term_en'):
                entry['term_en'] = entry_data.get('term_en', '')
                entry['definition_en'] = entry_data.get('definition_en', '')
                entry['category_en'] = entry_data.get('category_en', '')
                entry['etymology_en'] = entry_data.get('etymology_en', '')
                entry['variants_en'] = entry_data.get('variants_en', [])
            
            # Optional: LA
            if entry_data.get('term_la'):
                entry['term_la'] = entry_data.get('term_la', '')
                entry['definition_la'] = entry_data.get('definition_la', '')
                entry['category_la'] = entry_data.get('category_la', '')
                entry['etymology_la'] = entry_data.get('etymology_la', '')
                entry['variants_la'] = entry_data.get('variants_la', [])
            
            # Speichern
            LEXICON_DIR.mkdir(parents=True, exist_ok=True)
            out_path = LEXICON_DIR / f"{slug}.ts"
            
            ts = build_lexicon_ts(entry)
            out_path.write_text(ts, encoding='utf-8')
            
            # Index aktualisieren
            update_lexicon_index()
            
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'slug': slug}).encode())
        
        elif parsed_path.path == '/api/authors':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode())

            authors = read_authors()
            # prevent duplicates by id
            if any(a['id'] == data['id'] for a in authors):
                self.send_response(409)
                self.end_headers()
                return
            authors.append(data)
            write_authors(authors)
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'id': data['id']}).encode())

        elif parsed_path.path == '/api/works':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode())

            # Validierung
            if not data.get('title') or not data.get('author') or not data.get('year'):
                self.send_response(400)
                self.end_headers()
                return
            
            slug = simple_slugify(data.get('slug') or data.get('title', 'work'))
            
            # Überprüfe ob bereits vorhanden
            try:
                existing = (WORKS_DIR / f"{slug}.ts").read_text(encoding='utf-8')
                self.send_response(409)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Work already exists'}).encode())
                return
            except FileNotFoundError:
                pass
            
            # Work speichern
            work = {
                'id': slug,
                'title': data.get('title', ''),
                'author': data.get('author', ''),
                'year': data.get('year', ''),
                'summary': data.get('summary', ''),
                'takeaway': data.get('takeaway', ''),
                'structure': data.get('structure', []),
            }
            
            # Optional: EN/LA
            if data.get('title_en'):
                work['title_en'] = data.get('title_en', '')
                work['summary_en'] = data.get('summary_en', '')
                work['takeaway_en'] = data.get('takeaway_en', '')
            
            if data.get('title_la'):
                work['title_la'] = data.get('title_la', '')
                work['summary_la'] = data.get('summary_la', '')
                work['takeaway_la'] = data.get('takeaway_la', '')
            
            # Datei speichern
            WORKS_DIR.mkdir(parents=True, exist_ok=True)
            work_path = WORKS_DIR / f"{slug}.ts"
            ts = build_work_ts(work)
            work_path.write_text(ts, encoding='utf-8')
            
            # Index aktualisieren
            update_works_index()
            
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'slug': slug}).encode())

        elif parsed_path.path == '/api/posts':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            post_data = json.loads(body.decode())
            
            # Neuen Post speichern
            post = {
                'id': str(next_id()),
                'slug': post_data.get('slug') or simple_slugify(post_data.get('title_de', 'post')),
                'author': post_data.get('author', 'caesar'),
                'title_de': post_data.get('title_de', ''),
                'excerpt_de': post_data.get('excerpt_de', ''),
                'historicalDate': post_data.get('historicalDate', ''),
                'historicalYear': int(post_data.get('historicalYear', 0)),
                'date': post_data.get('date', dt.date.today().isoformat()),
                'readingTime': estimate_reading_time(post_data.get('content_de_diary', ''), post_data.get('content_de_scientific', '')),
                'tags': post_data.get('tags', []),
                'coverImage': post_data.get('coverImage', '/images/post-default.jpg'),
                'content_de_diary': post_data.get('content_de_diary', ''),
                'content_de_scientific': post_data.get('content_de_scientific', ''),
            }
            
            # Optional: EN/LA
            if post_data.get('content_en_diary'):
                post['title_en'] = post_data.get('title_en', '')
                post['excerpt_en'] = post_data.get('excerpt_en', '')
                post['content_en_diary'] = post_data.get('content_en_diary', '')
                post['content_en_scientific'] = post_data.get('content_en_scientific', '')
                post['tags_en'] = post_data.get('tags_en', [])
            
            if post_data.get('content_la_diary'):
                post['title_la'] = post_data.get('title_la', '')
                post['excerpt_la'] = post_data.get('excerpt_la', '')
                post['content_la_diary'] = post_data.get('content_la_diary', '')
                post['content_la_scientific'] = post_data.get('content_la_scientific', '')
                post['tags_la'] = post_data.get('tags_la', [])
            
            # Speichern
            out_dir = POSTS_DIR / post['author']
            out_dir.mkdir(parents=True, exist_ok=True)
            out_path = out_dir / f"{post['slug']}.ts"
            
            ts = build_ts(post)
            out_path.write_text(ts, encoding='utf-8')
            
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'id': post['id']}).encode())
        
        else:
            self.send_response(404)
            self.end_headers()

    def do_PUT(self):
        """PUT Requests bearbeiten (Post/Lexikon aktualisieren)."""
        parsed_path = urlparse(self.path)

        if parsed_path.path.startswith('/api/lexicon/'):
            # Lexikon-Eintrag aktualisieren
            slug = parsed_path.path.split('/')[-1]
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            entry_data = json.loads(body.decode())
            
            # Bestehenden Eintrag finden
            entries = get_all_lexicon_entries()
            existing = next((e for e in entries if e.get('slug') == slug), None)
            if not existing:
                self.send_response(404)
                self.end_headers()
                return
            
            # Zielpfad
            file_path = Path(existing['file_path'])
            new_slug = entry_data.get('slug') or simple_slugify(entry_data.get('term', existing.get('term', 'entry')))
            new_path = LEXICON_DIR / f"{new_slug}.ts"
            
            # Aktualisieren
            entry = {
                'slug': new_slug,
                'term': entry_data.get('term', existing.get('term', '')),
                'definition': entry_data.get('definition', existing.get('definition', '')),
                'category': entry_data.get('category', existing.get('category', 'Politik')),
                'etymology': entry_data.get('etymology', existing.get('etymology', '')),
                'variants': entry_data.get('variants', existing.get('variants', [])),
                'relatedTerms': entry_data.get('relatedTerms', existing.get('relatedTerms', [])),
            }
            
            # Optional: DE
            if entry_data.get('term_de') or existing.get('term_de'):
                entry['term_de'] = entry_data.get('term_de', existing.get('term_de', ''))
                entry['definition_de'] = entry_data.get('definition_de', existing.get('definition_de', ''))
                entry['category_de'] = entry_data.get('category_de', existing.get('category_de', ''))
                entry['etymology_de'] = entry_data.get('etymology_de', existing.get('etymology_de', ''))
                entry['variants_de'] = entry_data.get('variants_de', existing.get('variants_de', []))
            
            # Optional: EN
            if entry_data.get('term_en') or existing.get('term_en'):
                entry['term_en'] = entry_data.get('term_en', existing.get('term_en', ''))
                entry['definition_en'] = entry_data.get('definition_en', existing.get('definition_en', ''))
                entry['category_en'] = entry_data.get('category_en', existing.get('category_en', ''))
                entry['etymology_en'] = entry_data.get('etymology_en', existing.get('etymology_en', ''))
                entry['variants_en'] = entry_data.get('variants_en', existing.get('variants_en', []))
            
            # Optional: LA
            if entry_data.get('term_la') or existing.get('term_la'):
                entry['term_la'] = entry_data.get('term_la', existing.get('term_la', ''))
                entry['definition_la'] = entry_data.get('definition_la', existing.get('definition_la', ''))
                entry['category_la'] = entry_data.get('category_la', existing.get('category_la', ''))
                entry['etymology_la'] = entry_data.get('etymology_la', existing.get('etymology_la', ''))
                entry['variants_la'] = entry_data.get('variants_la', existing.get('variants_la', []))
            
            # Datei-Inhalt
            ts = build_lexicon_ts(entry)
            
            # Falls Slug geändert, alte Datei löschen
            try:
                if file_path.resolve() != new_path.resolve():
                    if file_path.exists():
                        file_path.unlink()
                new_path.write_text(ts, encoding='utf-8')
                
                # Index aktualisieren
                update_lexicon_index()
            except Exception:
                self.send_response(500)
                self.end_headers()
                return
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'slug': new_slug}).encode())
        
        elif parsed_path.path.startswith('/api/authors/'):
            author_id = parsed_path.path.split('/')[-1]
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode())

            authors = read_authors()
            idx = next((i for i,a in enumerate(authors) if a.get('id') == author_id), None)
            if idx is None:
                self.send_response(404)
                self.end_headers()
                return
            authors[idx] = data
            write_authors(authors)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True}).encode())

        elif parsed_path.path.startswith('/api/works/'):
            slug = parsed_path.path.split('/')[-1]
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode())

            # Finde bestehende Datei
            work_path = WORKS_DIR / f"{slug}.ts"
            if not work_path.exists():
                self.send_response(404)
                self.end_headers()
                return
            
            # Aktualisiere Work
            work = {
                'title': data.get('title', ''),
                'author': data.get('author', ''),
                'year': data.get('year', ''),
                'summary': data.get('summary', ''),
                'takeaway': data.get('takeaway', ''),
                'structure': data.get('structure', []),
            }
            
            # Optional: EN/LA
            if data.get('title_en'):
                work['title_en'] = data.get('title_en', '')
                work['summary_en'] = data.get('summary_en', '')
                work['takeaway_en'] = data.get('takeaway_en', '')
            
            if data.get('title_la'):
                work['title_la'] = data.get('title_la', '')
                work['summary_la'] = data.get('summary_la', '')
                work['takeaway_la'] = data.get('takeaway_la', '')
            
            # Neue Slug falls geändert
            new_slug = simple_slugify(data.get('slug') or data.get('title', slug))
            work['id'] = new_slug
            new_path = WORKS_DIR / f"{new_slug}.ts"
            
            try:
                ts = build_work_ts(work)
                
                # Falls Slug geändert, alte Datei löschen
                if work_path.resolve() != new_path.resolve():
                    if work_path.exists():
                        work_path.unlink()
                
                new_path.write_text(ts, encoding='utf-8')
                update_works_index()
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'slug': new_slug}).encode())
            except Exception as e:
                self.send_response(500)
                self.end_headers()

        elif parsed_path.path.startswith('/api/posts/'):
            # Post ID aus URL
            post_id = parsed_path.path.split('/')[-1]
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            post_data = json.loads(body.decode())

            # Bestehenden Post finden
            posts = get_all_posts()
            existing = next((p for p in posts if p.get('id') == post_id), None)
            if not existing:
                self.send_response(404)
                self.end_headers()
                return

            # Zielpfad bestimmen (bestehende Datei überschreiben)
            file_path = Path(existing['file_path'])

            # Slug ggf. aktualisieren -> bei Änderung Datei umbenennen
            new_slug = post_data.get('slug') or simple_slugify(post_data.get('title_de', existing.get('title', 'post')))
            new_author = post_data.get('author', existing.get('author', 'caesar'))
            new_dir = POSTS_DIR / new_author
            new_dir.mkdir(parents=True, exist_ok=True)
            new_path = new_dir / f"{new_slug}.ts"

            # Neu berechnen (ID bleibt gleich)
            post = {
                'id': post_id,
                'slug': new_slug,
                'author': new_author,
                'title_de': post_data.get('title_de', existing.get('title', '')),
                'excerpt_de': post_data.get('excerpt_de', existing.get('excerpt', '')),
                'historicalDate': post_data.get('historicalDate', existing.get('historicalDate', '')),
                'historicalYear': int(post_data.get('historicalYear', existing.get('historicalYear', 0))),
                'date': post_data.get('date', existing.get('date', dt.date.today().isoformat())),
                'readingTime': estimate_reading_time(post_data.get('content_de_diary', ''), post_data.get('content_de_scientific', '')),
                'tags': post_data.get('tags', existing.get('tags', [])),
                'coverImage': post_data.get('coverImage', existing.get('coverImage', '/images/post-default.jpg')),
                'content_de_diary': post_data.get('content_de_diary', ''),
                'content_de_scientific': post_data.get('content_de_scientific', ''),
            }

            # Optional EN
            if post_data.get('content_en_diary') or existing.get('title_en'):
                post['title_en'] = post_data.get('title_en', existing.get('title_en', ''))
                post['excerpt_en'] = post_data.get('excerpt_en', existing.get('excerpt_en', ''))
                post['content_en_diary'] = post_data.get('content_en_diary', existing.get('content_en_diary', ''))
                post['content_en_scientific'] = post_data.get('content_en_scientific', existing.get('content_en_scientific', ''))
                post['tags_en'] = post_data.get('tags_en', existing.get('tags_en', []))

            # Optional LA
            if post_data.get('content_la_diary') or existing.get('title_la'):
                post['title_la'] = post_data.get('title_la', existing.get('title_la', ''))
                post['excerpt_la'] = post_data.get('excerpt_la', existing.get('excerpt_la', ''))
                post['content_la_diary'] = post_data.get('content_la_diary', existing.get('content_la_diary', ''))
                post['content_la_scientific'] = post_data.get('content_la_scientific', existing.get('content_la_scientific', ''))
                post['tags_la'] = post_data.get('tags_la', existing.get('tags_la', []))

            # Datei-Inhalt erstellen
            ts = build_ts(post)

            # Falls Pfad sich ändert (Slug/Autor), alte Datei löschen
            try:
                if file_path.resolve() != new_path.resolve():
                    # Lösche alte Datei
                    if file_path.exists():
                        file_path.unlink()
                # Schreibe neue Datei
                new_path.write_text(ts, encoding='utf-8')
            except Exception:
                self.send_response(500)
                self.end_headers()
                return

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'id': post_id}).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_DELETE(self):
        """DELETE Requests bearbeiten."""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path.startswith('/api/lexicon/'):
            slug = parsed_path.path.split('/')[-1]
            entries = get_all_lexicon_entries()
            entry = next((e for e in entries if e.get('slug') == slug), None)
            
            if entry and 'file_path' in entry:
                try:
                    Path(entry['file_path']).unlink()
                    # Index aktualisieren
                    update_lexicon_index()
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': True}).encode())
                    return
                except Exception:
                    pass
            
            self.send_response(404)
            self.end_headers()
        
        elif parsed_path.path.startswith('/api/authors/'):
            author_id = parsed_path.path.split('/')[-1]
            authors = read_authors()
            new_authors = [a for a in authors if a.get('id') != author_id]
            if len(new_authors) == len(authors):
                self.send_response(404)
                self.end_headers()
                return
            write_authors(new_authors)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True}).encode())

        elif parsed_path.path.startswith('/api/works/'):
            slug = parsed_path.path.split('/')[-1]
            work_path = WORKS_DIR / f"{slug}.ts"
            
            if not work_path.exists():
                self.send_response(404)
                self.end_headers()
                return
            
            try:
                work_path.unlink()
                update_works_index()
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True}).encode())
            except Exception as e:
                self.send_response(500)
                self.end_headers()

        elif parsed_path.path.startswith('/api/posts/'):
            post_id = parsed_path.path.split('/')[-1]
            posts = get_all_posts()
            post = next((p for p in posts if p.get('id') == post_id), None)
            
            if post and 'file_path' in post:
                try:
                    Path(post['file_path']).unlink()
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': True}).encode())
                    return
                except Exception as e:
                    pass
            
            self.send_response(404)
            self.end_headers()
        
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        """CORS Preflight bearbeiten."""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()


def start_server(port=8001):
    """Startet den Blog-Admin Server."""
    # Stelle sicher, dass Static Dir existiert
    STATIC_DIR.mkdir(parents=True, exist_ok=True)
    
    server = HTTPServer(('localhost', port), BlogAdminHandler)
    print(f"✔ Blog Admin Server läuft auf http://localhost:{port}")
    print(f"  Posts Verzeichnis: {POSTS_DIR}")
    
    # Öffne automatisch im Browser nach kurzer Verzögerung
    def open_browser():
        import time
        time.sleep(1)
        webbrowser.open(f'http://localhost:{port}')
    
    thread = threading.Thread(target=open_browser, daemon=True)
    thread.start()
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n✔ Server beendet")
        server.server_close()


def main():
    """Hauptfunktion."""
    parser = argparse.ArgumentParser(description='Meum Diarium Blog Admin Dashboard')
    parser.add_argument('--port', type=int, default=8001, help='Server Port')
    parser.add_argument('--repo', type=Path, default=Path.cwd(), help='Repository-Root')
    args = parser.parse_args()
    
    global REPO_ROOT, POSTS_DIR, LEXICON_DIR, LEXICON_INDEX, STATIC_DIR
    REPO_ROOT = args.repo
    POSTS_DIR = REPO_ROOT / 'src' / 'content' / 'posts'
    LEXICON_DIR = REPO_ROOT / 'src' / 'content' / 'lexicon'
    LEXICON_INDEX = REPO_ROOT / 'src' / 'data' / 'lexicon.ts'
    STATIC_DIR = REPO_ROOT / 'tools' / 'blog_admin'
    
    start_server(args.port)


if __name__ == '__main__':
    main()