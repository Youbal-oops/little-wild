import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const webRoot = path.join(projectRoot, 'web');
const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.ttf', 'font/ttf'],
  ['.wav', 'audio/wav'],
]);

function localPath(requestUrl) {
  const pathname = new URL(requestUrl, 'http://localhost').pathname;
  const relativePath = decodeURIComponent(pathname === '/' ? '/index.html' : pathname).replace(
    /^[/\\]+/,
    '',
  );
  const candidate = path.resolve(webRoot, relativePath);
  return candidate.startsWith(`${webRoot}${path.sep}`) || candidate === webRoot ? candidate : null;
}

export function createPreviewServer() {
  return http.createServer(async (request, response) => {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }

    let file;
    try {
      file = localPath(request.url);
    } catch {
      response.writeHead(400).end();
      return;
    }
    if (!file) {
      response.writeHead(403).end();
      return;
    }

    try {
      const fileInfo = await stat(file);
      if (!fileInfo.isFile()) throw new Error('Not a file');
      response.writeHead(200, {
        'Content-Length': fileInfo.size,
        'Content-Type': mimeTypes.get(path.extname(file)) ?? 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      if (request.method === 'HEAD') response.end();
      else createReadStream(file).pipe(response);
    } catch {
      response.writeHead(404).end();
    }
  });
}

const port = Number(process.env.PORT ?? 4174);
createPreviewServer().listen(port, '127.0.0.1', () => {
  console.log(`Little Wild preview: http://127.0.0.1:${port}`);
});
