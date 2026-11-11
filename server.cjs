const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const root = __dirname;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const files = new Set(['index.html', 'styles.css', 'catalog.js', 'story-order.js', 'app.js']);
const cache = new Map();
const port = Number(process.env.PORT || 4173);
http.createServer(async (request, response) => {
  let filename;
  try { filename = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).replace(/^\//, '') || 'index.html'; }
  catch { response.writeHead(400).end('Bad request'); return; }
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
  const imageAsset = /^assets\/(?:artwork|hero)\/[a-z0-9][a-z0-9._-]*\.(?:jpe?g|png|webp|svg)$/i.test(filename);
  if (!files.has(filename) && !imageAsset) { response.writeHead(404).end('Not found'); return; }
  try {
    const fullPath = path.join(root, filename);
    const stat = await fs.promises.stat(fullPath);
    const etag = `W/"${stat.size.toString(16)}-${stat.mtimeMs.toString(16)}"`;
    const headers = { 'Content-Type': types[path.extname(filename)], 'Cache-Control': imageAsset ? 'public, max-age=86400' : 'no-cache', ETag: etag, 'X-Content-Type-Options': 'nosniff' };
    const compressible = /\.(?:html|css|js|svg)$/i.test(filename);
    if (compressible) headers.Vary = 'Accept-Encoding';
    if (request.headers['if-none-match'] === etag) { response.writeHead(304, headers).end(); return; }
    let cached = cache.get(filename);
    if (!cached || cached.etag !== etag) {
      const data = await fs.promises.readFile(fullPath);
      cached = { etag, data };
      cache.set(filename, cached);
    }
    // Negotiate encodings, respecting explicit q=0 refusals.
    const accepted = new Map((request.headers['accept-encoding'] || '').split(',').map(part => {
      const [name, ...params] = part.trim().split(';');
      const quality = params.find(value => value.trim().startsWith('q='));
      return [name, quality ? Number(quality.trim().slice(2)) : 1];
    }));
    const quality = encoding => accepted.get(encoding) ?? accepted.get('*') ?? 0;
    const encoding = compressible ? ['br', 'gzip'].filter(value => quality(value) > 0).sort((a, b) => quality(b) - quality(a))[0] : null;
    let data = cached.data;
    if (encoding) {
      if (!cached[encoding]) cached[encoding] = encoding === 'br'
        ? zlib.brotliCompressSync(data, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4 } })
        : zlib.gzipSync(data);
      data = cached[encoding];
      headers['Content-Encoding'] = encoding;
    }
    headers['Content-Length'] = data.length;
    response.writeHead(200, headers);
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch (error) { response.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Unable to read page'); }
}).listen(port, '127.0.0.1', () => console.log(`Marvel timeline: http://127.0.0.1:${port}`));
