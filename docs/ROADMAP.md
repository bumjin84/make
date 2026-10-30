# 🗺️ Project Roadmap & Progress Tracker

> 프로젝트 마일스톤 및 세부 태스크 진행 현황입니다. 개발과 기획 수정이 이루어질 때마다 상태를 업데이트합니다.

---

## 📌 Phase 1: 기반 기획 및 아키텍처 확정 (진행 중)
- [x] Git 저장소 연동 및 환경 설정 완료
- [x] 프로젝트 목표 정의 (작업 아카이브 + PoC 테스트베드)
- [x] 모노레포(`pnpm workspaces`) & 멀티 앱 아키텍처 수립 ([docs/PLANNING.md](file:///C:/make/docs/PLANNING.md))
- [x] 개별 사이트별 상세 명세서 작성
  - [x] [docs/apps/portal.md](file:///C:/make/docs/apps/portal.md) (메인 허브 포털)
  - [x] [docs/apps/poc-ai-chat.md](file:///C:/make/docs/apps/poc-ai-chat.md) (AI 챗 UI 샌드박스)
  - [x] [docs/apps/poc-3d-scene.md](file:///C:/make/docs/apps/poc-3d-scene.md) (3D 인터랙션 랩)
  - [x] [docs/apps/poc-markdown.md](file:///C:/make/docs/apps/poc-markdown.md) (마크다운 스튜디오)
- [ ] 패키지 매니저 (`pnpm`) 설치 및 모노레포 루트 `pnpm-workspace.yaml` 구성
- [ ] GitHub Pages 배포 전략 확정 (저장소 Public 전환 또는 자동 배포 Action)

---

## 📌 Phase 2: 모노레포 환경 구성 및 포털(`apps/portal`) 셋업
- [ ] 모노레포 워크스페이스 구조 (`apps/`, `package.json`) 초기화
- [ ] `apps/portal` (메인 포털) 템플릿 생성 (Vite + React + Tailwind)
- [ ] 메인 포털 UI 구현 (Hero, PoC 카드 갤러리, 작업 아카이브 섹션)
- [ ] 루트 통합 빌드 스크립트 작성 (`dist/` 통합)

---

## 📌 Phase 3: 개별 PoC 샌드박스 구현
- [ ] `apps/poc-ai-chat` 구현 (대화형 스트리밍 UI)
- [ ] `apps/poc-3d-scene` 구현 (Three.js 3D 오브젝트 조작)
- [ ] `apps/poc-markdown` 구현 (실시간 마크다운 스플릿 뷰 에디터)
- [ ] 각 PoC 상단에 포털 복귀 링크/글로벌 네비게이션 연동

---

## 📌 Phase 4: GitHub Pages 배포 및 지속적 아카이빙
- [ ] GitHub Actions 워크플로우를 통한 자동 빌드 및 배포 검증
- [ ] 추가 아이디어 및 작업 내역 지속 등록
