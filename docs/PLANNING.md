# 📌 Project: Make (Monorepo PoC Testbed & Work Archive)

> **"하나의 저장소 안에서 다양한 독립 웹 애플리케이션을 실험(PoC)하고, 작업 기록을 아카이빙하는 멀티 앱(Multi-App) 정적 플랫폼"**

---

## 1. 아키텍처 비전: Monorepo & Multi-App

본 프로젝트는 **`pnpm Workspaces`** 기반의 모노레포 구조로 설계되어, 각 테스트베드 사이트가 독립적인 기술 스택과 빌드 라이프사이클을 가집니다.

```
make/ (Monorepo Root)
├── apps/
│   ├── portal/          # [메인 허브] 작업 아카이브 및 PoC 카드 쇼케이스 (Vite + React + Tailwind)
│   ├── poc-ai-chat/     # [독립 PoC 1] AI 채팅 UI 및 스트리밍 실험 (React + Tailwind)
│   ├── poc-3d-scene/    # [독립 PoC 2] Three.js 인터랙티브 3D 그래픽 실험 (Three.js / Canvas)
│   └── poc-markdown/    # [독립 PoC 3] 실시간 마크다운 파서 및 뷰어 실험 (Vanilla / Marked)
├── docs/                # 전체 프로젝트 및 사이트별 기획/명세 문서
│   ├── PLANNING.md      # 본 통합 아키텍처 기획서
│   ├── ROADMAP.md       # 마일스톤 및 진행 현황
│   └── apps/            # 각 사이트별 상세 명세 문서
│       ├── portal.md
│       ├── poc-ai-chat.md
│       ├── poc-3d-scene.md
│       └── poc-markdown.md
└── dist/                # [통합 빌드 산출물] GitHub Pages 단일 배포 루트
```

---

## 2. 핵심 기술 스택 및 선정 이유

| 구분 | 도구 | 선정 이유 |
| :--- | :--- | :--- |
| **패키지 매니저** | **pnpm Workspaces** | 하드링크 기반 패키지 공유로 디스크 절약, 초고속 설치, 특정 앱 단독 실행(`pnpm --filter poc-ai-chat dev`) 용이 |
| **빌드 엔진** | **Vite** | 극도로 빠른 HMR 및 빌드 속도, React/Vue/Vanilla 등 멀티 프레임워크 호환, 서브경로(`base`) 설정 직관성 |
| **스타일링** | **Tailwind CSS** | 별도 CSS 번들링 복잡도 없이 유틸리티 클래스로 초고속 프로토타이핑 |
| **호스팅 / 배포** | **GitHub Pages** (or Cloudflare Pages) | 정적 사이트 기반 제로 서버 유지비, GitHub Actions로 통합 자동 빌드 |

---

## 3. 사이트별 역할 및 서브경로 매핑

| 사이트 이름 | 서브 경로 (URL) | 기술 스택 | 핵심 목적 | 상세 명세 |
| :--- | :--- | :--- | :--- | :---: |
| **Portal (Hub)** | `/make/` (Root) | Vite + React + Tailwind | 작업 아카이브 검색, PoC 갤러리 네비게이션, 프로필 | [명세서](file:///C:/make/docs/apps/portal.md) |
| **PoC: AI Chat** | `/make/poc-ai-chat/` | React + Tailwind | 대화형 UI, 텍스트 스트리밍, 메시지 롤링 인터랙션 | [명세서](file:///C:/make/docs/apps/poc-ai-chat.md) |
| **PoC: 3D Scene** | `/make/poc-3d-scene/` | Three.js + Vite | 3D 모델 렌더링, 조명/카메라 인터랙션, 성능 측정 | [명세서](file:///C:/make/docs/apps/poc-3d-scene.md) |
| **PoC: Markdown** | `/make/poc-markdown/` | Vanilla JS + Marked.js | 마크다운 실시간 파싱, 코드 하이라이팅, 다크모드 뷰어 | [명세서](file:///C:/make/docs/apps/poc-markdown.md) |

---

## 4. 통합 빌드 및 GitHub Pages 배포 전략

각 사이트는 각자의 빌드 명령어(`build`)를 실행하여 산출물을 생성하며, 루트 빌드 스크립트가 이를 하나의 `dist/` 폴더로 조합합니다.

```mermaid
flowchart TD
    RootBuild["pnpm build (루트 통합 빌드)"] --> B1["apps/portal 빌드"]
    RootBuild --> B2["apps/poc-ai-chat 빌드"]
    RootBuild --> B3["apps/poc-3d-scene 빌드"]
    RootBuild --> B4["apps/poc-markdown 빌드"]

    B1 --> D1["dist/ (메인 포털)"]
    B2 --> D2["dist/poc-ai-chat/"]
    B3 --> D3["dist/poc-3d-scene/"]
    B4 --> D4["dist/poc-markdown/"]

    D1 & D2 & D3 & D4 --> Deploy["GitHub Pages 단일 배포 (dist/)"]
```

* **Vite `base` 설정 원칙**:
  * Portal: `base: '/make/'`
  * PoC AI Chat: `base: '/make/poc-ai-chat/'`
  * PoC 3D Scene: `base: '/make/poc-3d-scene/'`
  * PoC Markdown: `base: '/make/poc-markdown/'`

---

## 5. 지속적 문서 및 개발 사이클 규칙

1. **사전 문서화**: 신규 PoC 생성 전 `docs/apps/poc-{name}.md`를 먼저 작성하여 목적과 기능 정의
2. **독립 구현**: 타 PoC에 영향 없이 `apps/poc-{name}/` 내에서 독립 개발
3. **로드맵 갱신**: 개발 완료 시 `docs/ROADMAP.md` 상태 업데이트 및 커밋
