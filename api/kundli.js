export const config = {
  runtime: "nodejs"
};

import SwissEph from "../public/swisseph.js";

let swe;

async function load() {
  if (!swe) {
    swe = await SwissEph({
      locateFile: () => "/swisseph.wasm"
    });
    swe.swe_set_ephe_path("/ephe");
  }
  return swe;
}

export default async function handler(req, res) {
  const { y, m, d, h } = req.body;

  const swe = await load();
  const jd = swe.swe_julday(y,m,d,h,false);

  const sun = swe.swe_calc_ut(jd, swe.SE_SUN, swe.SEFLG_SWIEPH);
  const moon = swe.swe_calc_ut(jd, swe.SE_MOON, swe.SEFLG_SWIEPH);

  res.status(200).json({ jd, sun, moon });
}
