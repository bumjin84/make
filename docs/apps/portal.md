# 🌐 App Specification: Portal (Main Hub)

> **경로**: `apps/portal`  
> **서브 경로**: `/make/` (Root)  
> **기술 스택**: Vite, React 18/19, Tailwind CSS, Lucide React

---

## 1. 개요 및 목적
* 본 프로젝트의 **대문(Entrance)** 역할을 하는 메인 허브 사이트입니다.
* 지금까지 진행한 작업 내역을 아카이빙하고, 하위 PoC 테스트베드 목록을 카드 갤러리 형태로 탐색할 수 있도록 제공합니다.

---

## 2. 주요 기능 명세

### 2.1 Hero Section
* 개발자 프로필 및 사이트 정체성 소개 ("Work Archive & Tech Playground")
* 빠른 상태 표시: 등록된 총 작업 수, 활성 PoC 수

### 2.2 PoC Playground Section
* 개별 PoC 사이트로 바로 이동할 수 있는 카드 그리드
* 카드 구성:
  * 썸네일 / 아이콘
  * 제목 및 한 줄 요약
  * 상태 뱃지 (`🟢 Stable`, `🟡 In Progress`, `⚪ Idea`)
  * 사용 기술 태그 (예: `#React`, `#Three.js`, `#AI`)
  * 'Launch Demo' 버튼 (서브 URL 이동) 및 'Spec Doc' 링크 (마크다운 명세)

### 2.3 Work Archive Section
* 시간순 작업 기록(타임라인/리스트 뷰)
* 카테고리/태그 필터링 (예: Frontend, DevOps, ML, Design)
* 검색 기능 (작업명, 사용 기술 키워드)

---

## 3. 화면 와이어프레임 구조

```
+-------------------------------------------------------+
|  [Logo] Make Lab               [Works] [PoCs] [GitHub]|
+-------------------------------------------------------+
|                                                       |
|  Make: Work Archive & PoC Playground                  |
|  실험적인 웹 기술을 검증하고 작업 기록을 모아둡니다.  |
|                                                       |
+-------------------------------------------------------+
|  🧪 PoC Playground                                    |
|  +----------------+  +----------------+  +-----------+|
|  | AI Chat UI     |  | 3D Scene Lab   |  | MD Viewer ||
|  | 상태: In-Prog  |  | 상태: Stable   |  | 상태: Plan||
|  | [Launch Demo]  |  | [Launch Demo]  |  | [Launch]  ||
|  +----------------+  +----------------+  +-----------+|
+-------------------------------------------------------+
|  📚 Work Archive                                      |
|  [All] [Frontend] [Backend] [DevOps]                  |
|  - 2026.10: Monorepo 기반 PoC 테스트베드 아키텍처 수립|
|  - 2026.10: GitHub CLI 기반 자동화 파이프라인 연동    |
+-------------------------------------------------------+
|  © 2026 Park Beom Jin. Built with Vite & Tailwind CSS.|
+-------------------------------------------------------+
```
