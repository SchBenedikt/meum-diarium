import { spawnSync } from 'node:child_process';
import { mkdtemp, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = join(projectRoot, 'dist');
const temporaryDir = await mkdtemp(join(tmpdir(), 'meum-pages-functions-'));

try {
  const wranglerBin = join(projectRoot, 'node_modules', 'wrangler', 'bin', 'wrangler.js');
  const build = spawnSync(process.execPath, [
    wranglerBin,
    'pages', 'functions', 'build', 'functions',
    '--outdir', temporaryDir,
    '--build-output-directory', outputDir,
  ], { cwd: projectRoot, stdio: 'inherit' });

  if (build.error) throw build.error;
  if (build.status !== 0) throw new Error(`Pages Functions build failed with exit code ${build.status}`);

  await copyFile(join(temporaryDir, 'index.js'), join(outputDir, '_worker.js'));
} finally {
  await rm(temporaryDir, { recursive: true, force: true });
}
