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

## 📌 Phase 3: GitHub Pages 스마트 배포 및 부분 빌드 (진행 중 🚀)
- [x] 저장소 Public 전환 완료
- [x] GitHub Pages 환경 활성화 (`https://bumjin84.github.io/make/`)
- [x] `paths-filter` + `actions/cache` 기반 스마트 부분 빌드 파이프라인 구축 (`.github/workflows/deploy.yml`, `scripts/build-incremental.mjs`)
- [ ] 첫 배포 파이프라인 트리거 및 정상 서빙 검증
- [ ] 실제 작업 아카이브 및 블로그/기록 데이터 추가
- [ ] 신규 PoC 아이디어 추가 시 사전 명세 작성 및 샌드박스 확장
