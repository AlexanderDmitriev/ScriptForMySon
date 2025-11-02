import fetch from "node-fetch";
import fs from "fs";

const TARGET = "minecraft";
const LOG_PATH = "youtube_log.txt";
const DEVTOOLS_URL = "http://127.0.0.1:9222/json"; //URL локального интерфейса Remote Debugging Protocol у Chromium/Chrome (DevTools)
const POLL_INTERVAL = 5000;

let wasPlaying = false;

function log(msg: string) {
  const ts = new Date().toISOString().replace("T", " ").replace("Z", "");
  const line = `${ts}\t${msg}\n`;
  fs.appendFileSync(LOG_PATH, line);
  console.log(line.trim());
}

async function checkYouTube() {
  try {
    const res = await fetch(DEVTOOLS_URL);
    const tabs = await res.json() as { title: string; url: string }[];

    const matches = tabs.filter(
      (tab) =>
        tab.title &&
        (tab.title.includes("YouTube") || tab.url.includes("youtube.com")) &&
        tab.title.toLowerCase( ).includes(TARGET)
    );

    if (matches.length > 0) {
      if (!wasPlaying) {
        log(`START: найдено видео: ${matches.map((m) => m.title).join(" | ")}`);
        wasPlaying = true;
      }
    } else {
      if (wasPlaying) {
        log(`STOP: видео '${TARGET}' больше не обнаружено`);
        wasPlaying = false;
      }
    }
  } catch (err: any) {
    log(`ERROR: ${err.message}`);
  }
}

log(`--- YouTube Monitor started (target: "${TARGET}") ---`);
setInterval(checkYouTube, POLL_INTERVAL);
