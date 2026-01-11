import fs from "fs";
import https from "https";
import path from "path";

const files = {
  "public/swisseph.js":
    "https://raw.githubusercontent.com/ptprashanttripathi/sweph-wasm/main/dist/swisseph.js",
  "public/swisseph.wasm":
    "https://raw.githubusercontent.com/ptprashanttripathi/sweph-wasm/main/dist/swisseph.wasm",
  "public/ephe/seas_18.se1":
    "https://raw.githubusercontent.com/aloistr/swisseph/master/ephe/seas_18.se1",
  "public/ephe/semo_18.se1":
    "https://raw.githubusercontent.com/aloistr/swisseph/master/ephe/semo_18.se1",
  "public/ephe/sepl_18.se1":
    "https://raw.githubusercontent.com/aloistr/swisseph/master/ephe/sepl_18.se1"
};

function download(url, file) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    https.get(url, res => {
      if (res.statusCode !== 200) return reject(url);
      res.pipe(fs.createWriteStream(file))
        .on("finish", resolve);
    });
  });
}

await Promise.all(
  Object.entries(files).map(([file, url]) => download(url, file))
);

console.log("Swiss Ephemeris WASM Installed");
