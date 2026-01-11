import fs from fs;
import https from https;
import path from path;

const base = httpsraw.githubusercontent.comptprashanttripathisweph-wasmmaindist;

const files = {
  publicswisseph.js `${base}swisseph.js`,
  publicswisseph.wasm `${base}swisseph.wasm`,
  publicepheseas_18.se1 httpsraw.githubusercontent.comaloistrswissephmasterepheseas_18.se1,
  publicephesemo_18.se1 httpsraw.githubusercontent.comaloistrswissephmasterephesemo_18.se1,
  publicephesepl_18.se1 httpsraw.githubusercontent.comaloistrswissephmasterephesepl_18.se1
};

function download(url, file) {
  return new Promise(res = {
    fs.mkdirSync(path.dirname(file), { recursivetrue });
    https.get(url, r = r.pipe(fs.createWriteStream(file)).on(finish, res));
  });
}

await Promise.all(Object.entries(files).map(([f,u])=download(u,f)));

console.log(Swiss Ephemeris WASM Installed);
