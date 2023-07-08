// Packages
import { BrowserWindow, app } from "electron";
import isDev from "electron-is-dev";
import unhandled from "electron-unhandled";
import { createServer } from "http";
import next from "next";
import { parse } from "url";

unhandled();

const nextApp = next({ dev: isDev, dir: app.getAppPath() + "/renderer" });
const handle = nextApp.getRequestHandler();

app.on("ready", async () => {
  await nextApp.prepare();
  const port = process.argv[2] || 3000;

  createServer((req: any, res: any) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log(`> Ready on http://localhost:${port}/`);
  });

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(`http://localhost:${port}/`);
});

app.on("window-all-closed", app.quit);
