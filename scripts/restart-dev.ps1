$ErrorActionPreference = 'Stop'

$ports = @(3000, 3010)
$connections = Get-NetTCPConnection -LocalPort $ports -ErrorAction SilentlyContinue |
  Where-Object { $_.OwningProcess -and $_.State -eq 'Listen' } |
  Select-Object -ExpandProperty OwningProcess -Unique

foreach ($processId in $connections) {
  Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
}

$nextPath = Join-Path (Get-Location) '.next'
if (Test-Path $nextPath) {
  Remove-Item $nextPath -Recurse -Force
}

npm run dev
