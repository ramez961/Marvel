const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
const files = new Set(['index.html', 'styles.css', 'catalog.js', 'app.js']);
const port = Number(process.env.PORT || 4173);
http.createServer((request, response) => {
  let filename;
  try { filename = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).replace(/^\//, '') || 'index.html'; }
  catch { response.writeHead(400).end('Bad request'); return; }
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
  if (!files.has(filename)) { response.writeHead(404).end('Not found'); return; }
  fs.readFile(path.join(root, filename), (error, data) => {
    if (error) { response.writeHead(500).end('Unable to read page'); return; }
    response.writeHead(200, { 'Content-Type': types[path.extname(filename)], 'Cache-Control': 'no-cache' });
    response.end(request.method === 'HEAD' ? undefined : data);
  });
}).listen(port, '127.0.0.1', () => console.log(`Marvel timeline: http://127.0.0.1:${port}`));
