# 🗺️ Project Roadmap & Progress Tracker

> 프로젝트 마일스톤 및 세부 태스크 진행 현황입니다. 개발과 기획 수정이 이루어질 때마다 상태를 업데이트합니다.

---

## 📌 Phase 1: 기반 기획 및 아키텍처 확정 (완료 ✅)
- [x] Git 저장소 연동 및 환경 설정 완료
- [x] 프로젝트 목표 정의 (작업 아카이브 + PoC 테스트베드)
- [x] 모노레포(`pnpm workspaces`) & 멀티 앱 아키텍처 수립 ([docs/PLANNING.md](file:///C:/make/docs/PLANNING.md))
- [x] 모바일 퍼스트 & 반응형 필수 원칙 전면 도입
- [x] 개별 사이트별 상세 명세서 작성
  - [x] [docs/apps/portal.md](file:///C:/make/docs/apps/portal.md) (메인 허브 포털)
  - [x] [docs/apps/poc-ai-chat.md](file:///C:/make/docs/apps/poc-ai-chat.md) (AI 챗 UI 샌드박스)
  - [x] [docs/apps/poc-3d-scene.md](file:///C:/make/docs/apps/poc-3d-scene.md) (3D 인터랙션 랩)
  - [x] [docs/apps/poc-markdown.md](file:///C:/make/docs/apps/poc-markdown.md) (마크다운 스튜디오)

---

## 📌 Phase 2: 모노레포 환경 구성 및 스캐폴딩 (완료 ✅)
- [x] Node.js LTS (v26.13) 및 `pnpm` (v12.16) 환경 설치 완료
- [x] 모노레포 루트 워크스페이스 구조 (`pnpm-workspace.yaml`, `package.json`) 구축
- [x] `apps/portal` (메인 포털) 템플릿 및 반응형 UI 구현 (Vite + React + Tailwind CSS)
- [x] `apps/poc-ai-chat` 구현 (스트리밍 UI, 모바일 dvh 키보드 대응, 코드 복사)
- [x] `apps/poc-3d-scene` 구현 (Three.js WebGL 인터랙션, 터치 회전 제스처, 컨트롤러)
- [x] `apps/poc-markdown` 구현 (Marked.js 파서, 데스크톱 스플릿 뷰 / 모바일 탭 토글 모드)
- [x] 루트 통합 빌드 파이프라인 스크립트 (`scripts/build-all.mjs`) 검증 완료 (`dist/` 통합)
- [x] GitHub Pages 자동 배포 워크플로우 구성 (`.github/workflows/deploy.yml`)

---

## 📌 Phase 3: GitHub Pages 스마트 배포 및 부분 빌드 (완료 ✅)
- [x] 저장소 Public 전환 완료
- [x] GitHub Pages 환경 활성화 (`https://bumjin84.github.io/make/`)
- [x] `paths-filter` + `actions/cache` 기반 스마트 부분 빌드 파이프라인 구축 (`.github/workflows/deploy.yml`, `scripts/build-incremental.mjs`)
- [x] `poc-ai-chat` 실시간 Gemini 스트리밍 및 멀티 세션(대화방 관리) 구현 완료
- [x] 메인 포털 Work Archives 실시간 배포 내역 동기화 및 카테고리 필터링 구현
- [x] `poc-markdown` 4종 프리미엄 테마 스위처 및 독립 HTML/MD 파일 내보내기 구현
- [x] Git 커밋 메시지 한글화 표준 적용

---

## 📌 Phase 4: 아키텍처 린트(Lint) 강제화 & 주식 스크리너 랩 구축 (완료 ✅)
- [x] 공통 컴포넌트 아키텍처 표준 컨벤션 명문화 ([docs/PLANNING.md](file:///C:/make/docs/PLANNING.md))
- [x] 주식 스마트 스크리너 상세 명세서 작성 ([docs/apps/poc-stock-screener.md](file:///C:/make/docs/apps/poc-stock-screener.md))
- [x] 아키텍처 구조 린터 스크립트 작성 (`scripts/lint-architecture.mjs`)
- [x] Git Pre-commit Hook 등록 (규칙 위반 시 커밋 강제 차단)
- [x] 기존 React 앱 컴포넌트 분리 리팩토링 (`apps/portal`, `apps/poc-ai-chat`)
- [x] `apps/poc-stock-screener` 스캐폴딩 및 4대 전략 추천 / 비교 랩 개발
- [x] 모노레포 통합 빌드 및 GitHub Pages 배포 검증
