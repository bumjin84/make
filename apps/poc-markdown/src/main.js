import { marked } from 'marked';

const editor = document.getElementById('editor');
const preview = document.getElementById('preview-content');
const panePreview = document.getElementById('pane-preview');
const themeSelect = document.getElementById('theme-select');

const btnExportMd = document.getElementById('btn-export-md');
const btnExportHtml = document.getElementById('btn-export-html');
const btnCopyHtml = document.getElementById('btn-copy-html');
const toast = document.getElementById('toast');

const tabEditor = document.getElementById('tab-editor');
const tabPreview = document.getElementById('tab-preview');
const paneEditor = document.getElementById('pane-editor');

// 1. 테마 복원 및 변경
const savedTheme = localStorage.getItem('markdown_studio_theme') || 'theme-github-dark';
themeSelect.value = savedTheme;
panePreview.className = `pane preview-pane ${savedTheme}`;

themeSelect.addEventListener('change', (e) => {
  const chosen = e.target.value;
  panePreview.className = `pane preview-pane ${chosen}`;
  localStorage.setItem('markdown_studio_theme', chosen);
});

// 2. 실시간 마크다운 렌더링
function render() {
  preview.innerHTML = marked.parse(editor.value);
}

editor.addEventListener('input', render);
render();

// 3. 토스트 알림 헬퍼
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// 4. .md 파일 내보내기 (Download Markdown)
btnExportMd.addEventListener('click', () => {
  const content = editor.value;
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  downloadBlob(blob, 'document.md');
  showToast('.md 파일로 다운로드되었습니다.');
});

// 5. 단독 실행형 .html 파일 내보내기 (Download Standalone HTML)
btnExportHtml.addEventListener('click', () => {
  const currentTheme = themeSelect.value;
  const renderedContent = preview.innerHTML;

  // 독립 HTML 문서 템플릿 (테마 CSS 인라인 내장)
  const standaloneHTML = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Markdown Document</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      padding: 40px 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      transition: background-color 0.2s, color 0.2s;
    }
    .markdown-body {
      max-width: 800px;
      margin: 0 auto;
      font-size: 15px;
      line-height: 1.7;
    }
    .markdown-body h1 { font-size: 1.8rem; margin: 20px 0 10px 0; border-bottom: 1px solid; padding-bottom: 8px; }
    .markdown-body h2 { font-size: 1.4rem; margin: 18px 0 8px 0; }
    .markdown-body h3 { font-size: 1.15rem; margin: 14px 0 6px 0; }
    .markdown-body p { margin-bottom: 12px; }
    .markdown-body ul, .markdown-body ol { padding-left: 24px; margin-bottom: 12px; }
    .markdown-body li { margin-bottom: 4px; }
    .markdown-body pre { padding: 14px; border-radius: 8px; overflow-x: auto; margin-bottom: 14px; }
    .markdown-body code { padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    .markdown-body pre code { background: none; border: none; padding: 0; }
    .markdown-body blockquote { padding: 8px 16px; border-left: 4px solid; margin: 12px 0; }
    .markdown-body table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
    .markdown-body table th, .markdown-body table td { border: 1px solid; padding: 8px 12px; }

    /* Theme: GitHub Dark */
    body.theme-github-dark { background-color: #0d1117; color: #e6edf3; }
    body.theme-github-dark .markdown-body h1, body.theme-github-dark .markdown-body h2, body.theme-github-dark .markdown-body h3 { color: #f0f6fc; border-color: #21262d; }
    body.theme-github-dark .markdown-body a { color: #58a6ff; }
    body.theme-github-dark .markdown-body code { background: #161b22; color: #79c0ff; border: 1px solid #30363d; }
    body.theme-github-dark .markdown-body pre { background: #161b22; border: 1px solid #30363d; color: #e6edf3; }
    body.theme-github-dark .markdown-body blockquote { border-left-color: #388bfd; color: #8b949e; background: #161b22; }
    body.theme-github-dark .markdown-body table th, body.theme-github-dark .markdown-body table td { border-color: #30363d; }

    /* Theme: GitHub Light */
    body.theme-github-light { background-color: #ffffff; color: #1f2328; }
    body.theme-github-light .markdown-body h1, body.theme-github-light .markdown-body h2, body.theme-github-light .markdown-body h3 { color: #1f2328; border-color: #d0d7de; }
    body.theme-github-light .markdown-body a { color: #0969da; }
    body.theme-github-light .markdown-body code { background: #f6f8fa; color: #cf222e; border: 1px solid #d0d7de; }
    body.theme-github-light .markdown-body pre { background: #f6f8fa; border: 1px solid #d0d7de; color: #1f2328; }
    body.theme-github-light .markdown-body blockquote { border-left-color: #0969da; color: #656d76; background: #f6f8fa; }
    body.theme-github-light .markdown-body table th, body.theme-github-light .markdown-body table td { border-color: #d0d7de; }

    /* Theme: Notion Clean */
    body.theme-notion-clean { background-color: #fbfbfa; color: #37352f; font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif; }
    body.theme-notion-clean .markdown-body h1, body.theme-notion-clean .markdown-body h2, body.theme-notion-clean .markdown-body h3 { color: #37352f; border-bottom: none; font-weight: 700; }
    body.theme-notion-clean .markdown-body a { color: #eb5757; text-decoration: underline; }
    body.theme-notion-clean .markdown-body code { background: #f1f1ef; color: #eb5757; padding: 2px 5px; border-radius: 4px; }
    body.theme-notion-clean .markdown-body pre { background: #f7f6f3; border-radius: 8px; color: #37352f; border: 1px solid #e9e9e7; }
    body.theme-notion-clean .markdown-body blockquote { border-left-color: #37352f; color: #787774; font-style: italic; }
    body.theme-notion-clean .markdown-body table th, body.theme-notion-clean .markdown-body table td { border-color: #e9e9e7; }

    /* Theme: Academic Sepia */
    body.theme-academic-sepia { background-color: #f4ecd8; color: #433422; font-family: "Georgia", "Cambria", "Times New Roman", serif; }
    body.theme-academic-sepia .markdown-body h1, body.theme-academic-sepia .markdown-body h2, body.theme-academic-sepia .markdown-body h3 { color: #2b1f13; border-color: #d8cbb5; }
    body.theme-academic-sepia .markdown-body a { color: #8b3a00; }
    body.theme-academic-sepia .markdown-body code { background: #e8deca; color: #7c2d12; font-family: monospace; }
    body.theme-academic-sepia .markdown-body pre { background: #e8deca; border: 1px solid #d8cbb5; color: #433422; font-family: monospace; }
    body.theme-academic-sepia .markdown-body blockquote { border-left-color: #a05a2c; color: #6b5744; }
    body.theme-academic-sepia .markdown-body table th, body.theme-academic-sepia .markdown-body table td { border-color: #d8cbb5; }
  </style>
</head>
<body class="${currentTheme}">
  <div class="markdown-body">
    ${renderedContent}
  </div>
</body>
</html>`;

  const blob = new Blob([standaloneHTML], { type: 'text/html;charset=utf-8' });
  downloadBlob(blob, 'document.html');
  showToast('.html 단독 실행 파일로 다운로드되었습니다.');
});

// 6. 렌더링된 HTML 클립보드 복사
btnCopyHtml.addEventListener('click', () => {
  navigator.clipboard.writeText(preview.innerHTML);
  showToast('HTML 코드가 클립보드에 복사되었습니다.');
});

// 가상 다운로드 앵커 유틸리티
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 7. 모바일 적응형 탭
function setupMobileTabs() {
  const isMobile = window.innerWidth < 768;
  if (!isMobile) {
    paneEditor.style.display = 'block';
    panePreview.style.display = 'block';
    return;
  }
  // 모바일에서는 현재 활성화된 탭만 노출
  if (tabEditor.classList.contains('active')) {
    paneEditor.style.display = 'block';
    panePreview.style.display = 'none';
  } else {
    paneEditor.style.display = 'none';
    panePreview.style.display = 'block';
  }
}

tabEditor.addEventListener('click', () => {
  tabEditor.classList.add('active');
  tabPreview.classList.remove('active');
  paneEditor.style.display = 'block';
  panePreview.style.display = 'none';
});

tabPreview.addEventListener('click', () => {
  tabPreview.classList.add('active');
  tabEditor.classList.remove('active');
  paneEditor.style.display = 'none';
  panePreview.style.display = 'block';
  render();
});

window.addEventListener('resize', setupMobileTabs);
setupMobileTabs();
