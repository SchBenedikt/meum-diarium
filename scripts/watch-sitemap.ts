import { generateSitemap } from './generate-sitemap';
import chokidar from 'chokidar';

async function run() {
  console.log('[sitemap] initial generate');
  await generateSitemap();

  const watcher = chokidar.watch([
    'src/content/lexicon/**/*.ts',
    'src/content/posts/**/*.ts',
    'src/content/works/**/*.ts',
    'src/content/works-details/**/*.ts',
    'src/data/**/*.ts',
    'src/pages/**/*.tsx',
  ], {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 50 },
  });

  const regen = async (file: string) => {
    console.log(`[sitemap] change detected: ${file}`);
    try {
      await generateSitemap();
    } catch (e) {
      console.error('[sitemap] generation failed', e);
    }
  };

  watcher
    .on('add', regen)
    .on('change', regen)
    .on('unlink', regen);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
