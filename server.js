/* eslint-disable @typescript-eslint/no-require-imports */
const next = require("next");
const http = require("http");
const port = 3089;

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http
    .createServer((req, res) => {
      handle(req, res);
    })
    .listen(port, (err) => {
      if (err) throw err;
      console.info(`> Ready on http://localhost:${port}`);
    });
});
