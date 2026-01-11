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

export default async function handler(req) {
  const { y,m,d,h } = await req.json();

  const swe = await load();

  const jd = swe.swe_julday(y,m,d,h,false);

  const sun = swe.swe_calc_ut(jd, swe.SE_SUN, swe.SEFLG_SWIEPH);
  const moon = swe.swe_calc_ut(jd, swe.SE_MOON, swe.SEFLG_SWIEPH);

  return new Response(JSON.stringify({ jd, sun, moon }), {
    headers:{ "Content-Type":"application/json" }
  });
}
