import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('🚀 [Build All] Starting monorepo build pipeline...');

// 1. 개별 앱 빌드 실행
const apps = ['portal', 'poc-ai-chat', 'poc-3d-scene', 'poc-markdown', 'poc-stock-screener'];
for (const app of apps) {
  console.log(`\n📦 Building app: ${app}...`);
  execSync(`pnpm --filter ${app} build`, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true,
  });
}

// 2. 통합 dist 디렉토리 준비
console.log('\n📂 Assembling unified dist directory for GitHub Pages...');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 3. portal 산출물을 dist 루트에 복사
const portalDist = path.join(rootDir, 'apps', 'portal', 'dist');
if (fs.existsSync(portalDist)) {
  fs.cpSync(portalDist, distDir, { recursive: true });
  console.log('✅ Mounted Portal at root (/)');
}

// 4. 개별 PoC 산출물을 dist/poc-* 서브 디렉토리에 복사
const pocs = ['poc-ai-chat', 'poc-3d-scene', 'poc-markdown', 'poc-stock-screener'];
for (const poc of pocs) {
  const pocDist = path.join(rootDir, 'apps', 'poc', 'dist'); // check path
  const source = path.join(rootDir, 'apps', poc, 'dist');
  const target = path.join(distDir, poc);
  if (fs.existsSync(source)) {
    fs.cpSync(source, target, { recursive: true });
    console.log(`✅ Mounted ${poc} at /${poc}/`);
  }
}

// 5. GitHub Pages Jekyll 비활성화 플래그 생성
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('✅ Created .nojekyll file');

console.log('\n🎉 [Build All] Unified static site successfully built into dist/!');

