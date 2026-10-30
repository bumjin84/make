# 🤖 PoC Specification: AI Chat Interface (Gemini Live Integration)

> **경로**: `apps/poc-ai-chat`  
> **서브 경로**: `/make/poc-ai-chat/`  
> **기술 스택**: Vite, React, Tailwind CSS, Google Gemini REST API  
> **반응형 원칙**: Mobile Viewport & Virtual Keyboard Optimized

---

## 1. 개요 및 목적
* 실제 **Google Gemini API**와 직접 연동되는 실시간 대화형 AI 샌드박스입니다.
* 정적 사이트(Client-Only) 환경에서 사용자가 직접 입력한 Gemini API Key를 기반으로 브라우저에서 직접 LLM과 SSE(Server-Sent Events) 스트리밍 대화를 수행합니다.

---

## 2. 주요 기능 및 UI 인터랙션 명세

### 2.1 API Key 관리 및 UI 배치 (핵심 🔑)
* **헤더 및 입력창 통합 접근**:
  * **헤더 우측 상태 버튼**:
    * 키 미등록 시: `⚪ Mock Mode [🔑 Key 등록]`
    * 키 등록 완료 시: `🟢 Gemini Live [gemini-2.5-flash]`
  * **하단 입력창 좌측 퀵 버튼**: 모바일에서 손쉽게 탭할 수 있는 `[🔑]` 아이콘 버튼 배치
* **API Key 설정 팝오버/모달**:
  * Gemini API Key 입력 인풋 (`type="password"`, 보기/숨기기 토글)
  * [저장] 시 브라우저 `localStorage`에 저장 및 즉시 Live 모드 전환
  * [삭제] 시 로컬 키 제거 및 Mock 시뮬레이션 모드로 자동 복귀
  * Google AI Studio 키 발급 바로가기 링크 제공
  * *"입력하신 키는 서버로 전송되지 않고 브라우저에만 저장됩니다"* 보안 안내문 표시

### 2.2 실시간 스트리밍 대화 (SSE)
* **엔드포인트**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key={API_KEY}`
* **SSE 파싱**: `fetch`의 `ReadableStream`과 `TextDecoder`를 사용해 토큰이 생성되는 즉시 화면에 타이핑 렌더링
* **Markdown & 코드 블록**:
  * 실시간 스트리밍 중에도 깨지지 않는 마크다운 렌더링
  * 코드 블록 언어 표시 및 원클릭 '복사' 기능

### 2.3 에러 처리 및 상태 복원
* 잘못된 API Key 입력 시 (400/403): 명확한 에러 안내 및 키 재입력 유도
* 쿼터 초과 (429): 재시도 안내
* 기존 대화 목록 및 API Key는 브라우저 새로고침 후에도 유지

### 2.4 모바일 가상 키보드 및 반응형 대응
* `100dvh` 동적 뷰포트 및 `interactive-widget=resizes-content` 메타태그를 통해 가상 키보드가 열려도 입력창이 최하단에 안정적으로 고정
* 상단 헤더의 `[← Portal]` 복귀 버튼 상시 유지

---

## 3. UI 레이아웃 와이어프레임

```
+-------------------------------------------------------------+
| [← Portal]     AI Chat Sandbox     [🟢 Gemini Live (설정 ⚙)]|
+-------------------------------------------------------------+
|                                                             |
|  [AI] 안녕하세요! Gemini 2.5 Flash 모델과 연결되어 있습니다. |
|                                                             |
|                         [User] 모노레포의 장점을 요약해줘   |
|                                                             |
|  [AI] 모노레포의 핵심 장점은 다음과 같습니다:               |
|  1. 코드 공유 및 일관된 패키지 관리                         |
|  2. 단일 빌드/배포 파이프라인 통합                          |
|  ... (실시간 스트리밍 타이핑 중)                           |
|                                                             |
+-------------------------------------------------------------+
| [🔑] [ Gemini에게 질문을 입력하세요...               ] [ 전송 ]|
+-------------------------------------------------------------+
```
