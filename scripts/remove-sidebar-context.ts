import fs from 'fs/promises';
import path from 'path';

async function run() {
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
          let modified = false;

          // Remove personalization marker from diary
          if (post.content && post.content.diary && typeof post.content.diary === 'string') {
            const diary = post.content.diary as string;
            const newDiary = diary.replace(/^\s*\[\[personalized\]\]\s*\n?/, '');
            if (newDiary !== diary) {
              post.content.diary = newDiary;
              modified = true;
            }
          }

          // If sidebar.context exists, merge into scientific and remove the context
          if (post.sidebar && post.sidebar.context && post.sidebar.context.content) {
            const contextContent = String(post.sidebar.context.content || '').trim();
            if (contextContent) {
              post.content = post.content || {};
              const sci = String(post.content.scientific || '').trim();
              // Append context content if not already present
              if (!sci.includes(contextContent)) {
                const append = (sci ? (sci + '\n\n' + contextContent) : contextContent);
                post.content.scientific = append;
                modified = true;
              }
            }
            delete post.sidebar.context;
            modified = true;
          }

          if (modified) {
            await fs.writeFile(filePath, JSON.stringify(post, null, 2), 'utf-8');
            console.log(`Updated ${filePath}`);
            changed++;
          }
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

run();
