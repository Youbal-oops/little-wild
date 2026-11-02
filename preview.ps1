$ErrorActionPreference = 'Stop'
python -m http.server 4174 --bind 127.0.0.1 --directory (Join-Path $PSScriptRoot 'web')
