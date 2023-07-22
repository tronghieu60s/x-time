"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Packages
const electron_1 = require("electron");
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const electron_unhandled_1 = __importDefault(require("electron-unhandled"));
const http_1 = require("http");
const next_1 = __importDefault(require("next"));
const url_1 = require("url");
(0, electron_unhandled_1.default)();
const nextApp = (0, next_1.default)({ dev: electron_is_dev_1.default, dir: electron_1.app.getAppPath() + '/renderer' });
const handle = nextApp.getRequestHandler();
electron_1.app.on('ready', async () => {
    await nextApp.prepare();
    const port = process.argv[2] || 3000;
    (0, http_1.createServer)((req, res) => {
        const parsedUrl = (0, url_1.parse)(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(port, () => {
        console.log(`> Ready on http://localhost:${port}/`);
    });
    const mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
        },
        autoHideMenuBar: !electron_is_dev_1.default,
    });
    mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.setWindowOpenHandler((details) => {
        electron_1.shell.openExternal(details.url);
        return { action: 'deny' };
    });
});
electron_1.app.on('window-all-closed', electron_1.app.quit);
