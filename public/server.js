const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const forbiddenPaths = ['/template/', '/scripts/'];
  const isForbidden = forbiddenPaths.some(p => req.url.startsWith(p));

  if (isForbidden) {
    fs.readFile('403.html', (err, content) => {
      res.writeHead(403, { 'Content-Type': 'text/html' });
      res.end(content || '403 - גישה חסומה');
    });
    return;
  }

  const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath).toLowerCase();

  const contentTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 - לא נמצא');
    } else {
      res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
      res.end(content);
    }
  });
});

server.listen(3000, () => {
  console.log('✅ שרת פעיל בכתובת http://localhost:3000');
});
