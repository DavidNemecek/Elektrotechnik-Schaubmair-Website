$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

if (-not (Test-Path "website")) {
  throw "Expected ./website directory to exist."
}

cmd /c "if exist _site rmdir /s /q _site"
New-Item -ItemType Directory -Path "_site" | Out-Null

Copy-Item -Recurse -Force "website\*" "_site\"

if (Test-Path "images") {
  New-Item -ItemType Directory -Path "_site\images" -Force | Out-Null
  Copy-Item -Recurse -Force "images\*" "_site\images\"
}

Write-Host "Built _site/ (same layout as GitHub Pages workflow)."

