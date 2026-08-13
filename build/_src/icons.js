'use strict';
/**
 * 아이콘 원본 정의.
 *
 * 글리프는 48x48 viewBox, 중심 (24,24) 기준으로 그린다. 색은 currentColor 로 두어
 * 배지가 글리프를 흰색으로 덮어쓸 수 있게 한다.
 *
 * 이 파일이 유일한 원본이다. PNG 를 직접 고치지 말고 여기를 고친 뒤
 * Build-Icons.ps1 로 다시 뽑는다.
 *
 * 스타일은 하나다 — 색으로 채운 둥근 사각 배지 + 흰 글리프. 배경판 없이
 * 컬러 글리프만 쓰는 안도 함께 만들어 Teams 데스크탑과 모바일에서 실측했고,
 * 배지 쪽이 채널 피드에서 종류가 먼저 잡혀 채택했다. 경위는 README 참고.
 */

const fs = require('fs');
const path = require('path');

const S = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';

const GLYPHS = {
  // --- 종류: 시작 카드 헤더에 쓴다 -----------------------------------------

  // 순환 화살표 두 개 — 지속적 통합.
  // 화살촉은 선 두께의 3.2배 폭으로 잡고, 호는 화살촉 밑동보다 5도 일찍 끊는다.
  // 그러지 않으면 둥근 선끝이 삼각형 밖으로 삐져나와 고리에 홈이 파인 것처럼 보인다.
  ci: `
    <g ${S} stroke-width="3.4">
      <path d="M14.10 22.61 A10 10 0 0 1 33.27 20.25"/>
      <path d="M33.90 25.39 A10 10 0 0 1 14.73 27.75"/>
    </g>
    <g fill="currentColor">
      <path d="M36.05 29.21 L28.40 22.66 L38.72 19.50 Z"/>
      <path d="M11.95 18.79 L19.60 25.34 L9.28 28.50 Z"/>
    </g>`,

  // 위로 나가는 화살표 + 받침 — 배포
  cd: `
    <g ${S} stroke-width="3.8">
      <path d="M24 31 V15.5"/>
      <path d="M16.8 22.3 L24 15 L31.2 22.3"/>
      <path d="M14.5 35.5 H33.5"/>
    </g>`,

  // 모니터 — 클라이언트
  client: `
    <g ${S} stroke-width="3.4">
      <rect x="9.5" y="11.5" width="29" height="21" rx="3.5"/>
      <path d="M24 32.5 V37.5"/>
      <path d="M17.5 37.5 H30.5"/>
    </g>`,

  // 랙 두 단 — 서버
  server: `
    <g ${S} stroke-width="3.2">
      <rect x="10" y="11.5" width="28" height="11" rx="3.2"/>
      <rect x="10" y="26.5" width="28" height="11" rx="3.2"/>
    </g>
    <g fill="currentColor">
      <circle cx="16.5" cy="17" r="1.9"/>
      <circle cx="16.5" cy="32" r="1.9"/>
    </g>`,

  // 큐브 — 메시/LOD
  lod: `
    <g ${S} stroke-width="3.2">
      <path d="M24 9.5 L37.5 17.2 V30.8 L24 38.5 L10.5 30.8 V17.2 Z"/>
      <path d="M24 24 L37.5 17.2"/>
      <path d="M24 24 L10.5 17.2"/>
      <path d="M24 24 V38.5"/>
    </g>`,

  // 실린더 — 데이터
  data: `
    <g ${S} stroke-width="3.2">
      <ellipse cx="24" cy="15" rx="11" ry="4.6"/>
      <path d="M13 15 V33 c0 2.54 4.92 4.6 11 4.6 s11 -2.06 11 -4.6 V15"/>
      <path d="M13 24 c0 2.54 4.92 4.6 11 4.6 s11 -2.06 11 -4.6"/>
    </g>`,

  // 꺾쇠 + 슬래시 — 스크립트
  script: `
    <g ${S} stroke-width="3.8">
      <path d="M18 17 L10.5 24 L18 31"/>
      <path d="M30 17 L37.5 24 L30 31"/>
      <path d="M27 14 L21 34"/>
    </g>`,

  // 노드를 잇는 경로 — 내비게이션 메시.
  // 삼각형 격자로 그리면 warning 의 삼각형과 32px 에서 헷갈려서 경로 형태로 간다.
  navmesh: `
    <g ${S} stroke-width="3.2">
      <path d="M12 33 L20 21 L28 27 L36 15"/>
    </g>
    <g fill="currentColor">
      <circle cx="12" cy="33" r="3.4"/>
      <circle cx="36" cy="15" r="3.4"/>
    </g>`,

  // 지구본 — 현지화
  localize: `
    <g ${S} stroke-width="3.2">
      <circle cx="24" cy="24" r="13"/>
      <ellipse cx="24" cy="24" rx="5.4" ry="13"/>
      <path d="M11.6 19.8 H36.4"/>
      <path d="M11.6 28.2 H36.4"/>
    </g>`,

  // 플라스크 — 테스트
  test: `
    <g ${S} stroke-width="3.2">
      <path d="M19 11 V21 L12 35 H36 L29 21 V11"/>
      <path d="M16.5 11 H31.5"/>
      <path d="M15.5 28 H32.5"/>
    </g>`,

  // 곁가지가 본류로 합쳐지는 형태 — 머지
  merge: `
    <g ${S} stroke-width="3.4">
      <path d="M16 15 V33"/>
      <path d="M32 18 v3 c0 6 -7 8 -16 8"/>
    </g>
    <g fill="currentColor">
      <circle cx="16" cy="13" r="3.6"/>
      <circle cx="16" cy="35" r="3.6"/>
      <circle cx="32" cy="15" r="3.6"/>
    </g>`,

  // 겹친 판 — 캐시. lod 의 육면체와 실루엣이 갈리도록 마름모를 쓴다.
  ddc: `
    <g ${S} stroke-width="3">
      <path d="M24 9.5 L38 16.5 L24 23.5 L10 16.5 Z"/>
      <path d="M10 24 L24 31 L38 24"/>
      <path d="M10 31 L24 38 L38 31"/>
    </g>`,

  // 아카이브 상자 — 체크포인트/저널/복원
  perforce: `
    <g ${S} stroke-width="3.2">
      <rect x="9.5" y="12" width="29" height="8" rx="2.5"/>
      <path d="M12 20 V34 c0 1.7 1.3 3 3 3 h18 c1.7 0 3 -1.3 3 -3 V20"/>
      <path d="M20 27 H28"/>
    </g>`,

  // 전원 버튼 — 서버 기동/정지
  serverExec: `
    <g ${S} stroke-width="3.6">
      <path d="M24 11 V24"/>
      <path d="M32.5 15.5 a12 12 0 1 1 -17 0"/>
    </g>`,

  // 중립. 종류를 특정하지 못했을 때 떨어지는 자리다.
  default: `
    <g fill="currentColor">
      <rect x="12" y="12" width="10" height="10" rx="2.6"/>
      <rect x="26" y="12" width="10" height="10" rx="2.6"/>
      <rect x="12" y="26" width="10" height="10" rx="2.6"/>
      <rect x="26" y="26" width="10" height="10" rx="2.6"/>
    </g>`,

  // --- 상태: 종료 댓글 헤더에 쓴다 -----------------------------------------

  // 체크 — 성공
  success: `
    <g ${S} stroke-width="4.4">
      <path d="M14.5 24.5 L21.5 31.5 L33.5 18"/>
    </g>`,

  // 원 안 느낌표 — 성공했으나 불안정
  unstable: `
    <g ${S} stroke-width="3.4">
      <circle cx="24" cy="24" r="13.2"/>
    </g>
    <g fill="currentColor">
      <rect x="22.15" y="15.6" width="3.7" height="10.6" rx="1.85"/>
      <circle cx="24" cy="30.6" r="2.25"/>
    </g>`,

  // 삼각형 느낌표 — 경고
  warning: `
    <g ${S} stroke-width="3.4">
      <path d="M24 10.5 L38.5 35.5 H9.5 Z"/>
    </g>
    <g fill="currentColor">
      <rect x="22.2" y="19" width="3.6" height="9" rx="1.8"/>
      <circle cx="24" cy="31.6" r="2.15"/>
    </g>`,

  // X — 실패
  failed: `
    <g ${S} stroke-width="4.4">
      <path d="M16.5 16.5 L31.5 31.5"/>
      <path d="M31.5 16.5 L16.5 31.5"/>
    </g>`,

  // 정지 — 중단
  aborted: `
    <g fill="currentColor">
      <rect x="16" y="16" width="16" height="16" rx="3.6"/>
    </g>`,
};

/**
 * 색은 두 번째 단서다. 종류를 가르는 것은 어디까지나 모양이고, 색은 채널을 훑을 때
 * 덩어리로 먼저 눈에 들어오게 하는 역할이다. 그래서 색상환에서 되도록 벌려 잡되
 * 완전한 중복 회피에 매달리지 않는다 — 모양이 확실히 다르고 같은 화면에 잘 나오지
 * 않는 조합이면 비슷한 색을 써도 실사용에서 헷갈리지 않는다.
 *
 * 알아둘 것: merge 의 크림슨과 failed 의 빨강이 가깝다. 종류는 시작 카드,
 * 상태는 종료 댓글에 붙으므로 한 카드에 같이 나오지 않는다.
 */
const COLORS = {
  // 종류
  ci: '#2F6FED', cd: '#7A4FE0', client: '#12A594', server: '#C2410C', lod: '#D6336C',
  data: '#0E7490', script: '#4338CA', navmesh: '#15803D', localize: '#A21CAF',
  test: '#4D7C0F', merge: '#BE123C', ddc: '#A16207', perforce: '#475569',
  serverExec: '#9A3412', default: '#6B7280',
  // 상태
  success: '#1F9D55', unstable: '#E8A317', warning: '#E8730C',
  failed: '#E5484D', aborted: '#6B7280',
};

const SIZE = 512;

/**
 * 색으로 채운 둥근 사각 배지 + 흰 글리프.
 *
 * 글리프를 흰색으로 고정하는 것이 핵심이다. PNG 는 뷰어의 테마에 반응하지 못하는데,
 * 흰 글리프는 어떤 색 판 위에서도 대비가 확보되므로 라이트/다크 양쪽에서 똑같이 읽힌다.
 */
function badge(name) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${SIZE}" height="${SIZE}">`
    + `<rect x="1" y="1" width="46" height="46" rx="13" fill="${COLORS[name]}"/>`
    + `<g color="#ffffff">${GLYPHS[name]}</g></svg>`;
}

/**
 * Chrome 헤드리스가 스크린샷할 페이지. 배경을 투명하게 두고 SVG를 정확한 픽셀로 못박는다.
 * --default-background-color=00000000 과 짝을 이뤄야 알파가 살아남는다.
 */
function page(svg) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>`
    + `html,body{margin:0;padding:0;background:transparent;overflow:hidden}`
    + `svg{display:block;width:${SIZE}px;height:${SIZE}px}</style></head><body>${svg}</body></html>`;
}

// --- 실행부: SVG 원본과 래스터라이즈용 HTML을 쓴다 --------------------------
// 인자 1: SVG 출력 루트 (버전 관리 대상)
// 인자 2: HTML 출력 루트 (임시, 버전 관리 제외)
if (require.main === module) {
  const svgRoot = process.argv[2];
  const htmlRoot = process.argv[3];
  if (!svgRoot || !htmlRoot) {
    console.error('usage: node icons.js <svgRoot> <htmlRoot>');
    process.exit(1);
  }
  fs.mkdirSync(svgRoot, { recursive: true });
  fs.mkdirSync(htmlRoot, { recursive: true });
  let count = 0;
  for (const name of Object.keys(GLYPHS)) {
    const svg = badge(name);
    fs.writeFileSync(path.join(svgRoot, `${name}.svg`), svg, 'utf8');
    fs.writeFileSync(path.join(htmlRoot, `${name}.html`), page(svg), 'utf8');
    count += 1;
  }
  console.log(`wrote ${count} svg`);
}

module.exports = { GLYPHS, COLORS, badge, SIZE };
