param(
  [string]$Message
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path "$PSScriptRoot\.."
Set-Location $repoRoot

Write-Host "== Flower deploy ==" -ForegroundColor Cyan

# Commit + push if there are changes
$changes = git -C $repoRoot status --porcelain
if (-not $changes) {
  Write-Host "No git changes detected. Skipping commit/push." -ForegroundColor Yellow
} else {
  git -C $repoRoot add -A
  if (-not $Message) {
    $Message = "Auto deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
  }
  git -C $repoRoot commit -m $Message
  git -C $repoRoot push
}

# VPS deploy (Flower only)
$envPath = "D:\rental\backend\.env"
if (-not (Test-Path $envPath)) {
  throw "Missing VPS env file at $envPath"
}

$envLines = Get-Content $envPath
function Get-EnvValue([string]$key) {
  ($envLines | Where-Object { $_ -match "^$key=" } | Select-Object -First 1) -replace "^$key=", ""
}

$vpsUser = Get-EnvValue "name"
$vpsHost = Get-EnvValue "IP"
$vpsPass = Get-EnvValue "password"
$vpsHostKey = Get-EnvValue "VPS_HOSTKEY"

if (-not ($vpsUser -and $vpsHost -and $vpsPass -and $vpsHostKey)) {
  throw "Missing VPS credentials in $envPath (name/IP/password/VPS_HOSTKEY)"
}

$plink = "D:\putty\plink.exe"
if (-not (Test-Path $plink)) {
  throw "PuTTY plink not found at $plink"
}

$pwFile = Join-Path $env:TEMP "vps_pw.txt"
$cmdFile = Join-Path $env:TEMP "vps_cmd.txt"
Set-Content -Path $pwFile -Value $vpsPass -NoNewline

$remoteCommands = @"
set -e
cd /root/fflowerr
git pull --ff-only
if [ ! -f ./.env.vps ]; then
  echo ".env.vps missing in /root/fflowerr" 1>&2
  exit 2
fi
docker-compose --env-file ./.env.vps -f docker-compose.vps.yml up -d --build
"@

Set-Content -Path $cmdFile -Value $remoteCommands -NoNewline

& $plink -ssh "$vpsUser@$vpsHost" -pwfile $pwFile -hostkey $vpsHostKey -batch -m $cmdFile

Remove-Item $pwFile, $cmdFile -ErrorAction SilentlyContinue
Write-Host "Deploy complete." -ForegroundColor Green
