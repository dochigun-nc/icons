# skyline 아이콘 — 원본과 재생성

`skyline/a`, `skyline/d` 의 PNG는 **여기서 생성된 산출물이다. 직접 편집하지 않는다.**
모양이나 색을 바꾸려면 `icons.js` 를 고치고 다시 뽑는다.

## 구성

| 경로 | 역할 |
|---|---|
| `icons.js` | 유일한 원본. 글리프 path, 색, 두 스타일의 조립 규칙 |
| `Build-Icons.ps1` | SVG 생성 → Chrome 헤드리스로 PNG 래스터라이즈 → 투명도 검증 |
| `svg/<style>/*.svg` | 생성된 벡터 원본. 다른 도구에 넘길 때 쓴다 |
| `../a/*.png`, `../d/*.png` | 실제로 참조되는 512x512 투명 PNG |

## 재생성

```powershell
pwsh ./Build-Icons.ps1                  # 전부
pwsh ./Build-Icons.ps1 -Only ci         # 하나만
pwsh ./Build-Icons.ps1 -Only ci -Style d   # 한 스타일의 하나만
```

Node.js 와 Chrome(없으면 Edge)이 필요하다. 별도 이미지 도구는 필요 없다.

## 두 스타일

| | 구성 | 특징 |
|---|---|---|
| **a** | 색으로 채운 둥근 사각 배지 + 흰 글리프 | 작은 크기에서 색 면적이 커 눈에 먼저 들어온다. 글리프가 흰색이라 배경 테마와 무관하게 대비가 보장된다 |
| **d** | 배경판 없이 컬러 글리프만 | 가볍고 조용하다. 글리프 자체가 색이라 **어두운 색은 다크 테마에서 묻힌다** — `aborted` 회색을 `#6B7280` 대신 `#8C97A8` 로 쓰는 이유다 |

## 아이콘 목록

**종류** — `ci` `cd` `client` `server` `lod`
**상태** — `success` `unstable` `warning` `failed` `aborted`

## 지켜야 할 것

- **512x512 투명 PNG.** 흰 배경이 구워지면 다크 테마에서 흰 상자로 보인다.
  `Build-Icons.ps1` 이 모서리 알파를 검사해 이 실수를 막는다.
- **글리프는 48x48 viewBox, 중심 (24,24).** 새 아이콘을 넣을 때도 같은 좌표계를 쓴다.
- **색은 `currentColor` 로 둔다.** 그래야 한 정의를 두 스타일이 공유한다.
- 두 스타일의 색이 갈리면 `icons.js` 의 `COLORS_D` 에 그 항목만 덮어쓴다.
