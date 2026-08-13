'use strict';
/**
 * 아이콘 원본 정의.
 *
 * 글리프는 48x48 viewBox, 중심 (24,24) 기준으로 그린다. 색은 currentColor 로 두어
 * 스타일 A(색 판 + 흰 글리프)와 D(글리프만 컬러)가 같은 정의를 공유한다.
 *
 * 이 파일이 유일한 원본이다. PNG 를 직접 고치지 말고 여기를 고친 뒤
 * Build-Icons.ps1 로 다시 뽑는다.
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

const COLORS = {
  ci: '#2F6FED', cd: '#7A4FE0', client: '#12A594', server: '#C2410C', lod: '#D6336C',
  success: '#1F9D55', unstable: '#E8A317', warning: '#E8730C',
  failed: '#E5484D', aborted: '#6B7280',
};

// 스타일 D 전용 색 보정.
// A는 색을 판에 칠하고 글리프를 흰색으로 쓰므로 어떤 색이든 대비가 확보되지만,
// D는 글리프 자체가 그 색이라 어두운 회색이 다크 테마에서 묻힌다. 회색만 밝게 올린다.
const COLORS_D = Object.assign({}, COLORS, { aborted: '#8C97A8' });

const SIZE = 512;

/** A — 색으로 채운 둥근 사각 배지 + 흰 글리프. */
function styleA(name) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${SIZE}" height="${SIZE}">`
    + `<rect x="1" y="1" width="46" height="46" rx="13" fill="${COLORS[name]}"/>`
    + `<g color="#ffffff">${GLYPHS[name]}</g></svg>`;
}

/** D — 배경판 없이 컬러 글리프만. 판이 없어 실루엣이 작아지므로 1.28배로 키운다. */
function styleD(name) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${SIZE}" height="${SIZE}">`
    + `<g color="${COLORS_D[name]}" transform="translate(24 24) scale(1.28) translate(-24 -24)">`
    + `${GLYPHS[name]}</g></svg>`;
}

const STYLES = { a: styleA, d: styleD };

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
  let count = 0;
  for (const style of Object.keys(STYLES)) {
    const svgDir = path.join(svgRoot, style);
    const htmlDir = path.join(htmlRoot, style);
    fs.mkdirSync(svgDir, { recursive: true });
    fs.mkdirSync(htmlDir, { recursive: true });
    for (const name of Object.keys(GLYPHS)) {
      const svg = STYLES[style](name);
      fs.writeFileSync(path.join(svgDir, `${name}.svg`), svg, 'utf8');
      fs.writeFileSync(path.join(htmlDir, `${name}.html`), page(svg), 'utf8');
      count += 1;
    }
  }
  console.log(`wrote ${count} svg (${Object.keys(GLYPHS).length} glyphs x ${Object.keys(STYLES).length} styles)`);
}

module.exports = { GLYPHS, COLORS, COLORS_D, STYLES, SIZE };
