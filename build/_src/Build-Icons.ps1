#requires -Version 7.0
<#
.SYNOPSIS
  빌드 알림 아이콘 PNG를 원본(icons.js)에서 다시 뽑는다.

.DESCRIPTION
  icons.js 가 유일한 원본이다. 글리프나 색을 고쳤으면 이 스크립트를 돌려
  build/*.png 를 갱신한 뒤 커밋한다. PNG를 직접 편집하지 않는다.

  래스터라이즈는 Chrome(없으면 Edge) 헤드리스로 한다. ImageMagick 이나
  Inkscape 같은 별도 설치가 필요 없고, SVG 렌더가 브라우저와 동일하기 때문이다.
  알파를 살리려면 --default-background-color=00000000 이 반드시 있어야 한다.

.PARAMETER Only
  특정 아이콘만 다시 뽑는다. 이름은 확장자 없이 준다 (예: -Only ci,aborted).

.EXAMPLE
  pwsh ./Build-Icons.ps1
  전부 다시 뽑는다.

.EXAMPLE
  pwsh ./Build-Icons.ps1 -Only ci
  ci 아이콘만 다시 뽑는다.
#>
[CmdletBinding()]
param(
  [string[]] $Only
)

$ErrorActionPreference = 'Stop'

$srcDir   = $PSScriptRoot                       # .../build/_src
$outDir   = Split-Path -Parent $PSScriptRoot    # .../build
$svgDir   = Join-Path $srcDir 'svg'
$htmlDir  = Join-Path $srcDir '.html'

# --- 도구 확인 --------------------------------------------------------------
$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node) { throw 'node 를 찾을 수 없다. Node.js 를 설치하거나 PATH 에 넣어라.' }

$browser = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $browser) { throw 'Chrome 이나 Edge 를 찾을 수 없다. 래스터라이즈를 할 수 없다.' }
Write-Host "래스터라이저: $browser"

# --- SVG 와 래스터라이즈용 HTML 생성 ---------------------------------------
& $node (Join-Path $srcDir 'icons.js') $svgDir $htmlDir
if ($LASTEXITCODE -ne 0) { throw "icons.js 실행 실패 (exit $LASTEXITCODE)" }

# --- PNG 로 변환 ------------------------------------------------------------
$pages = Get-ChildItem $htmlDir -Filter *.html
if ($Only) { $pages = $pages | Where-Object { $Only -contains $_.BaseName } }
if (-not $pages) { throw '뽑을 대상이 없다. -Only 에 준 이름을 확인해라.' }

$made = 0
foreach ($p in $pages) {
  $dst = Join-Path $outDir "$($p.BaseName).png"
  $uri = 'file:///' + ($p.FullName -replace '\\', '/')
  & $browser --headless=new --disable-gpu --hide-scrollbars `
             --force-device-scale-factor=1 --default-background-color=00000000 `
             --screenshot="$dst" --window-size=512,512 $uri 2>&1 | Out-Null
  if (-not (Test-Path $dst)) { throw "래스터라이즈 실패: $($p.BaseName)" }
  $made += 1
  Write-Host "  $($p.BaseName).png"
}

# --- 검증: 알파가 살아 있어야 한다 -----------------------------------------
# 흰 배경이 구워지면 다크 테마 Teams 에서 흰 상자로 보인다. 여기서 잡는다.
Add-Type -AssemblyName System.Drawing
$opaque = @()
Get-ChildItem $outDir -Filter *.png | ForEach-Object {
  $bmp = New-Object System.Drawing.Bitmap($_.FullName)
  try {
    if ($bmp.GetPixel(2, 2).A -ne 0) { $opaque += $_.Name }
  } finally { $bmp.Dispose() }
}
if ($opaque) { throw "모서리가 불투명하다 — 배경이 구워졌다: $($opaque -join ', ')" }

Write-Host ""
Write-Host "PNG $made 개 생성, 투명도 검증 통과."
Write-Host "다음: git add -A && git commit && git push"
