import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

// CLI 인자 파싱 (예: --portal --ai-chat --all)
const args = process.argv.slice(2);
const isAll = args.includes('--all') || args.length === 0 || !fs.existsSync(distDir) || !fs.existsSync(path.join(distDir, 'index.html'));

console.log('🚀 [Incremental Build] Checking targets...');
console.log('Arguments received:', args);
console.log('Full rebuild required:', isAll);

const targets = {
  portal: isAll || args.includes('--portal'),
  'poc-ai-chat': isAll || args.includes('--ai-chat'),
  'poc-3d-scene': isAll || args.includes('--3d-scene'),
  'poc-markdown': isAll || args.includes('--markdown'),
};

console.log('Build matrix:', targets);

// 1. 필요한 앱만 빌드 실행
for (const [app, shouldBuild] of Object.entries(targets)) {
  if (shouldBuild) {
    console.log(`\n📦 Building [${app}]...`);
    execSync(`pnpm --filter ${app} build`, {
      cwd: rootDir,
      stdio: 'inherit',
      shell: true,
    });
  } else {
    console.log(`⏭️  Skipping [${app}] (no changes detected, reusing cached build)`);
  }
}

// 2. dist 디렉토리 확보
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 3. 빌드된 산출물만 dist에 부분 덮어쓰기 (Partial Patch)
if (targets.portal) {
  const portalDist = path.join(rootDir, 'apps', 'portal', 'dist');
  if (fs.existsSync(portalDist)) {
    fs.cpSync(portalDist, distDir, { recursive: true });
    console.log('✅ Updated Portal in dist/ (root)');
  }
}

const pocs = [
  { id: 'poc-ai-chat', key: 'poc-ai-chat' },
  { id: 'poc-3d-scene', key: 'poc-3d-scene' },
  { id: 'poc-markdown', key: 'poc-markdown' }
];

for (const poc of pocs) {
  if (targets[poc.key]) {
    const source = path.join(rootDir, 'apps', poc.id, 'dist');
    const target = path.join(distDir, poc.id);
    if (fs.existsSync(source)) {
      if (fs.existsSync(target)) {
        fs.rmSync(target, { recursive: true, force: true });
      }
      fs.cpSync(source, target, { recursive: true });
      console.log(`✅ Updated ${poc.id} in dist/${poc.id}/`);
    }
  }
}

// 4. .nojekyll 플래그 생성
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('✅ Verified .nojekyll');

console.log('\n🎉 [Incremental Build] Build & assembly completed successfully!');

