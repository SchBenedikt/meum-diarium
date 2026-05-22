import fs from 'fs/promises';
import path from 'path';

async function enhance() {
  const postsDir = path.resolve(process.cwd(), 'public', 'posts');
  try {
    const authorDirs = await fs.readdir(postsDir);
    let changed = 0;
    for (const authorDir of authorDirs) {
      if (authorDir === 'caesar') continue; // skip caesar per request
      const dirPath = path.join(postsDir, authorDir);
      let stat;
      try { stat = await fs.stat(dirPath); } catch { continue; }
      if (!stat.isDirectory()) continue;
      const files = await fs.readdir(dirPath);
      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const filePath = path.join(dirPath, file);
        try {
          const raw = await fs.readFile(filePath, 'utf-8');
          const post = JSON.parse(raw);
          if (!post.content) post.content = {};

          // Personalize diary: prepend a personal opener if not present
          const diary = (post.content.diary || '').toString().trim();
          if (diary) {
            const marker = '[[personalized]]';
            if (!diary.includes(marker)) {
              // Prepend a natural-sounding personal sentence if not already personal
              const opener = 'Ich erinnere mich noch genau an diesen Tag — ';
              let newDiary = diary;
              // Avoid duplicating if already starts with Ich or similar
              if (!/^Ich\b/.test(diary)) {
                newDiary = opener + diary;
              }
              // Add a hidden marker to avoid re-processing
              newDiary = marker + '\n' + newDiary;
              post.content.diary = newDiary;
            }
          }

          // Create/Enhance sidebar.context with contextual analysis based on scientific content
          const scientific = (post.content.scientific || '').toString().trim();
          post.sidebar = post.sidebar || {};
          const existingContext = post.sidebar.context && post.sidebar.context.content ? post.sidebar.context.content.toString().trim() : '';
          if (scientific && !existingContext) {
            // Build a concise context summary + include scientific text for depth
            const summary = scientific.split(/\n\n/)[0] || scientific.split('.').slice(0,2).join('. ') + '.';
            const contextContent = `Kontext & Analyse:\n\n${summary}\n\n${scientific}`;
            post.sidebar.context = {
              title: 'Kontext & Analyse',
              content: contextContent
            };
          }

          // Remove marker from saved scientific if accidentally present
          // (no-op but safe)

          await fs.writeFile(filePath, JSON.stringify(post, null, 2), 'utf-8');
          console.log(`Enhanced ${filePath}`);
          changed++;
        } catch (err) {
          console.error(`Failed to process ${filePath}:`, err instanceof Error ? err.message : err);
        }
      }
    }
    console.log(`Done. Files changed: ${changed}`);
  } catch (err) {
    console.error('Error scanning posts:', err);
    process.exit(1);
  }
}

enhance();
