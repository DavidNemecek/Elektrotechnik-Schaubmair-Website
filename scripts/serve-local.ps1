$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

if (-not (Test-Path "_site")) {
  & "$PSScriptRoot\\build-local.ps1"
}

Set-Location "_site"
Write-Host "Serving http://localhost:8000 (Ctrl+C to stop)"
python -m http.server 8000

