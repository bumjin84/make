export const ARCHIVES = [
  {
    date: '2026.11.02',
    category: 'Data Pipeline Upgrade',
    title: '크론 수집기 고도화: 네이버 금융 실시간 재무 API 연동 & 실측 데이터 파이프라인 구축',
    desc: '기존 난수 생성을 전면 폐기하고, 네이버 금융 모바일 공식 API(/integration, /finance/annual)를 직접 연동하여 350개 국내 상장사의 실제 PER, 선행 PER, ROE, 배당률, 부채비율 및 60일 실시간 일봉·이평선 수집 체계 완성'
  },
  {
    date: '2026.11.02',
    category: 'Data Integrity',
    title: '가짜 데이터(Mock Fallback) 전면 제거, ETF 식별 및 결측치 N/A 안전 표기 체계 구축',
    desc: '843개 전 종목 유니버스는 온전히 보존하되 임의 난수(Mock) 생성을 완전히 제거하고, ETF 자동 식별 뱃지 부여 및 재무 결측치 N/A(\'-\') 안전 렌더링·전략 필터 널 가드 완비'
  },
  {
    date: '2026.11.02',
    category: 'UI/UX Improvement',
    title: '전략 카테고리 탭 영역 2행 그리드 & 가로 좌우 스크롤 구조 최적화',
    desc: '10대 투자 전략 탭을 2줄(2-Row Grid)로 정돈 배치하여 화면 수직 공간을 절약하고, 모바일 및 좁은 화면에서 매끄러운 터치 스크롤 지원'
  },
  {
    date: '2026.11.02',
    category: 'Strategy Lab',
    title: '10대 투자 전략 프리셋 확장 (금리 인하 수혜, 단기 변동성, 피터 린치 GARP 등)',
    desc: '거시경제(금리 인하 수혜), 단기 수급(변동성 폭발), 가치성장(피터 린치 PEG), 하락장 방어(저베타 피난처), 역발상(낙폭과대 바겐세일) 5대 신규 전략 프레임워크 전면 신설'
  },
  {
    date: '2026.11.02',
    category: 'Big Data Expansion',
    title: '843개 대규모 유니버스 확장 (S&P 500 + 코스피 200 + 코스닥 150) & 24개 스마트 페이징',
    desc: '기존 60개 종목에서 843개 대규모 우량주로 유니버스 전면 확대, 3대 시장 리그 탭 분기 및 모바일 60fps 보장 24개 단위 스마트 페이징 구축'
  },
  {
    date: '2026.11.02',
    category: 'UX Architecture',
    title: '1:1 맞대결 반응형 오버레이 UX 개편 (PC 정중앙 팝업 & 모바일 풀스크린)',
    desc: '하단 드로어의 시선 분산 문제를 해결하고, PC에서는 딤 블러 정중앙 모달, 모바일에서는 100% 풀스크린 뷰 및 하단 플로팅 런처 칩(ComparePill)으로 전면 리팩토링'
  },
  {
    date: '2026.10.30',
    category: 'Automation',
    title: 'GitHub Actions 기반 1일 4회 자동 크론 스케줄러 & 즉시 수동 갱신 파이프라인 구축',
    desc: '평일 06:15, 12:15, 16:15, 23:15 KST 정기 자동 수집 및 웹 UI 수동 실행 지원, 프론트엔드 실시간 데이터 기준 시점 뱃지 연동'
  },
  {
    date: '2026.10.30',
    category: 'Data Pipeline',
    title: '야후 파이낸스 & 네이버 금융 연동 일별 시세 수집기 및 이평선 정배열 분석기 구현',
    desc: '최근 60영업일 일별 종가·거래량 원천 데이터 실시간 수집, MA5/20/60/120 이동평균선 연산 및 완전 정배열(Strong Bull) 자동 판정 엔진 구축'
  },
  {
    date: '2026.10.30',
    category: 'Finance Lab',
    title: '스마트 주식 스크리너 & 1:1 맞대결 비교 분석 랩(PoC #5) 런칭',
    desc: '미국장/국내장 60개 우량주 대상 4대 투자전략(버핏, 고성장, 모멘텀, 배당) 원클릭 발굴, 기준 100 정규화 수익률 차트 및 승패 판정 스코어카드 구현'
  },
  {
    date: '2026.10.30',
    category: 'Architecture',
    title: '공통 컴포넌트 아키텍처 표준 및 Git Pre-commit 커밋 차단 린터 구축',
    desc: 'Fat Component(App.jsx) 비대화 차단, components/hooks/utils 필수 분리 강제화 및 위반 시 커밋 자동 거부 파이프라인 연동'
  },
  {
    date: '2026.10.30',
    category: 'Markdown Lab',
    title: '4종 프리미엄 테마 스위처 및 독립형 HTML/MD 내보내기 구현',
    desc: 'GitHub Dark/Light, Notion Clean, Academic Sepia 실시간 전환 및 CSS 인라인 내장형 독립 HTML 다운로드 파이프라인 개발'
  },
  {
    date: '2026.10.30',
    category: 'AI Lab',
    title: '세션별 독립 동시 스트리밍 및 백그라운드 답변 생성 지원',
    desc: '전역 락을 해제하고 세션별 타이핑 맵을 분리하여 대화방 1 생성 중 대화방 2에서 동시 질문 작업 가능'
  },
  {
    date: '2026.10.30',
    category: 'AI Lab',
    title: '멀티 세션(대화방 관리) 시스템 및 문맥 격리 아키텍처 구현',
    desc: '세션별 독립 대화방 개설, 첫 질문 기반 자동 제목 생성, 세션당 최신 30개 메시지 롤링 및 문맥 완벽 격리'
  },
  {
    date: '2026.10.30',
    category: 'DevOps',
    title: 'paths-filter 기반 스마트 부분 빌드(Incremental Build) 파이프라인 구축',
    desc: '수정된 앱만 30초 내로 단독 빌드하고, 나머지 사이트는 이전 캐시를 재사용하는 초고속 CI/CD 배포 구성'
  },
  {
    date: '2026.10.30',
    category: 'Architecture',
    title: 'Vite + pnpm Workspaces 기반 모노레포 구축 & 4개 독립 앱 스캐폴딩',
    desc: '포털 및 3개의 독립 PoC(AI Chat, 3D Scene, Markdown)를 완벽히 격리된 멀티 앱 구조로 번들링'
  }
];
