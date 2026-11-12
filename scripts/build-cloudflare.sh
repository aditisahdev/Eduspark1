#!/bin/sh
# Copies only the public website into .cf-dist (so server.js, data/, etc. are never published).
set -e
cd "$(dirname "$0")/.."
rm -rf .cf-dist && mkdir .cf-dist
cp ./*.html .cf-dist/
cp -R css js assets admin .cf-dist/
cat > .cf-dist/_headers <<'H'
/admin/*
  X-Robots-Tag: noindex
  Cache-Control: no-store
/*
  X-Content-Type-Options: nosniff
H
cat > .cf-dist/404.html <<'H'
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found – Eduspark</title><link rel="icon" href="/assets/logo.png"><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#EEF3FC;font:16px/1.5 system-ui,sans-serif;color:#0A1B4D;text-align:center}a{color:#0B5FBE;font-weight:600}</style></head><body><main><h1>Page not found</h1><p>The page you are looking for does not exist.</p><p><a href="/">Go to the home page</a></p></main></body></html>
H
echo "built .cf-dist"
