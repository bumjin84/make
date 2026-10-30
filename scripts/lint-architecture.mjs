import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const appsDir = path.join(rootDir, 'apps');

const MAX_APP_LINES = 130; // App.jsx 최대 허용 줄 수

console.log('🔍 [Architecture Linter] Verifying React component conventions across apps...\n');

let hasError = false;

// 1. apps 폴더 내 모든 하위 프로젝트 검사
const appNames = fs.readdirSync(appsDir).filter(name => {
  const stat = fs.statSync(path.join(appsDir, name));
  return stat.isDirectory();
});

for (const appName of appNames) {
  const appPath = path.join(appsDir, appName);
  const pkgJsonPath = path.join(appPath, 'package.json');
  
  if (!fs.existsSync(pkgJsonPath)) continue;

  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
  const isReactApp = (pkg.dependencies && pkg.dependencies.react) || (pkg.devDependencies && pkg.devDependencies.react);

  // React 기반 앱인 경우만 아키텍처 린트 적용
  if (!isReactApp) {
    console.log(`⏩ [${appName}]: Non-React app (skipped architecture rules)`);
    continue;
  }

  console.log(`📦 Checking [${appName}]...`);
  const srcDir = path.join(appPath, 'src');

  if (!fs.existsSync(srcDir)) {
    console.error(`  ❌ Error: Missing 'src/' directory in ${appName}`);
    hasError = true;
    continue;
  }

  // 1) 필수 components 디렉토리 검증
  const componentsDir = path.join(srcDir, 'components');
  if (!fs.existsSync(componentsDir) || !fs.statSync(componentsDir).isDirectory()) {
    console.error(`  ❌ Error: Missing required 'src/components/' directory in ${appName}`);
    hasError = true;
  } else {
    // components 내부에 실제 컴포넌트 파일이 있는지 확인
    const componentFiles = fs.readdirSync(componentsDir, { recursive: true }).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));
    if (componentFiles.length === 0) {
      console.error(`  ❌ Error: 'src/components/' directory in ${appName} is empty. Components must be modularized.`);
      hasError = true;
    }
  }

  // 2) utils 또는 hooks 디렉토리 검증 (로직/유틸 분리)
  const utilsDir = path.join(srcDir, 'utils');
  const hooksDir = path.join(srcDir, 'hooks');
  const hasUtils = fs.existsSync(utilsDir) && fs.statSync(utilsDir).isDirectory();
  const hasHooks = fs.existsSync(hooksDir) && fs.statSync(hooksDir).isDirectory();

  if (!hasUtils && !hasHooks) {
    console.error(`  ❌ Error: Missing required 'src/utils/' or 'src/hooks/' directory in ${appName} (Logic separation required)`);
    hasError = true;
  }

  // 3) App.jsx 라인 수 검증 (Fat Component 차단)
  const appJsxPath = path.join(srcDir, 'App.jsx');
  if (fs.existsSync(appJsxPath)) {
    const lines = fs.readFileSync(appJsxPath, 'utf-8').split('\n').length;
    if (lines > MAX_APP_LINES) {
      console.error(`  ❌ Error: App.jsx in ${appName} is too large (${lines} lines > max ${MAX_APP_LINES} lines). Break it down into components!`);
      hasError = true;
    } else {
      console.log(`  ✅ App.jsx size: ${lines} lines (within limit of ${MAX_APP_LINES})`);
    }
  }
}

console.log('');
if (hasError) {
  console.error('🚫 [Architecture Linter Failed] Code convention violations found! Commit is aborted.');
  console.error('💡 Action needed: Break down large components into src/components/ and extract logic to src/hooks/ or src/utils/.\n');
  process.exit(1);
} else {
  console.log('✨ [Architecture Linter Passed] All React apps satisfy strict component modularization conventions!\n');
  process.exit(0);
}
