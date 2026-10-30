import { marked } from 'marked';

const editor = document.getElementById('editor');
const preview = document.getElementById('preview-content');

const tabEditor = document.getElementById('tab-editor');
const tabPreview = document.getElementById('tab-preview');
const paneEditor = document.getElementById('pane-editor');
const panePreview = document.getElementById('pane-preview');

// 1. 실시간 렌더링
function render() {
  preview.innerHTML = marked.parse(editor.value);
}

editor.addEventListener('input', render);
render();

// 2. 모바일 탭 스위칭 로직
function setupMobileTabs() {
  const isMobile = window.innerWidth < 768;
  if (!isMobile) {
    paneEditor.style.display = 'block';
    panePreview.style.display = 'block';
    return;
  }

  // 모바일 기본값: 에디터 표시
  paneEditor.style.display = 'block';
  panePreview.style.display = 'none';
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
  render(); // 최신 내용 갱신
});

window.addEventListener('resize', setupMobileTabs);
setupMobileTabs();

