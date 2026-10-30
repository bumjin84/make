# 📝 PoC Specification: Markdown Studio

> **경로**: `apps/poc-markdown`  
> **서브 경로**: `/make/poc-markdown/`  
> **기술 스택**: Vite, Vanilla JS, Marked.js, Highlight.js

---

## 1. 개요 및 목적
* 브라우저에서 마크다운 텍스트를 작성하고 실시간으로 파싱 결과를 미리보는 **실시간 마크다운 스튜디오/뷰어**입니다.
* 가벼운 순수 JS 파서 엔진과 커스텀 렌더러 플러그인을 실험합니다.

---

## 2. 주요 실험(PoC) 항목

1. **스플릿 뷰 (Split-View) 실시간 에디터**:
   * 좌측: Raw Markdown 에디터 (줄 번호, 자동 들여쓰기)
   * 우측: 렌더링된 HTML 뷰어 (실시간 동기화 스크롤)
2. **코드 구문 강조 (Syntax Highlighting)**:
   * 다양한 언어(Python, JS, Shell, SQL, CSS 등)의 코드 블록 자동 인식 및 테마 하이라이트
3. **GFM(GitHub Flavored Markdown) 지원**:
   * 체크리스트(`- [x]`), 테이블, 각주, 알림창(Callout) 렌더링 검증
4. **내보내기 기능**:
   * 작성한 내용을 `.md` 파일 다운로드 또는 HTML 클립보드 복사
5. **허브 복귀 네비게이션**:
   * 상단 헤더의 버튼으로 메인 포털(`/make/`) 복귀

---

## 3. UI 레이아웃 설계

```
+-------------------------------------------------------+
| [< Back to Portal]   Markdown Studio     [Export] [Copy]|
+---------------------------+---------------------------+
| Raw Editor                | Preview                   |
| ------------------------- | ------------------------- |
| # Hello World             | # Hello World             |
| - [x] Plan completed      |  ☑ Plan completed         |
| - [ ] Development         |  ☐ Development            |
|                           |                           |
| ```js                     | +-----------------------+ |
| console.log("Make");      | | console.log("Make");  | |
| ```                       | +-----------------------+ |
+---------------------------+---------------------------+
```
