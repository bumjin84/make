# 🎨 PoC Specification: 3D Scene Lab

> **경로**: `apps/poc-3d-scene`  
> **서브 경로**: `/make/poc-3d-scene/`  
> **기술 스택**: Vite, Vanilla Three.js (or React Three Fiber), Canvas API

---

## 1. 개요 및 목적
* 웹 브라우저 환경에서 **WebGL 기반의 3D 그래픽과 물리 인터랙션**을 가볍게 실험하는 샌드박스입니다.
* 무거운 프레임워크 의존성을 배제하고 순수 그래픽 렌더링 루프와 마우스 인터랙션을 테스트합니다.

---

## 2. 주요 실험(PoC) 항목

1. **인터랙티브 3D 지오메트리 조작**:
   * 마우스 드래그를 통한 360도 궤도 회전 (OrbitControls)
   * 마우스 오버 시 오브젝트 하이라이트 및 부유(Floating) 애니메이션
2. **동적 라이팅 및 재질(Material) 변경**:
   * 조명 위치 이동 및 그림자(Shadow map) 렌더링
   * Wireframe / Metallic / Cartoon Shading 등 실시간 재질 스위칭
3. **간이 컨트롤 패널 (GUI)**:
   * 회전 속도, 색상, 메쉬 파라미터를 조절할 수 있는 슬라이더 컨트롤러
4. **허브 복귀 네비게이션**:
   * 좌측 상단 플로팅 버튼으로 메인 포털(`/make/`) 복귀

---

## 3. UI 레이아웃 설계

```
+-------------------------------------------------------+
| [< Back to Portal]                                    |
|                                                       |
|                     [ 3D Canvas ]                     |
|                                                       |
|                         ▲                             |
|                       /   \       [ Control Panel ]   |
|                      / 3D  \      - Speed: [===|===]  |
|                      \ Box /      - Color: [#3b82f6]  |
|                       \   /       - Wireframe: [ON]   |
|                         ▼                             |
|                                                       |
|                                      FPS: 60 / WebGL2 |
+-------------------------------------------------------+
```
