import swe from "swisseph";
import moment from "moment-timezone";
import path from "path";

swe.set_ephe_path(path.join(process.cwd(), "ephe"));

function getJD(date, time, tz) {
  const dt = moment.tz(date + " " + time, "YYYY-MM-DD HH:mm", tz);
  return swe.julday(
    dt.year(),
    dt.month() + 1,
    dt.date(),
    dt.hour() + dt.minute() / 60 + dt.second() / 3600
  );
}

function getPlanet(jd, p) {
  const r = swe.calc(jd, p);
  return {
    degree: r.longitude,
    retrograde: r.speed < 0
  };
}

export default function handler(req, res) {
  try {
    const { date, time, lat, lon, tz } = req.body;

    const jd = getJD(date, time, tz || "Asia/Kolkata");

    swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0);

    const planets = {
      Sun: getPlanet(jd, swe.SUN),
      Moon: getPlanet(jd, swe.MOON),
      Mars: getPlanet(jd, swe.MARS),
      Mercury: getPlanet(jd, swe.MERCURY),
      Jupiter: getPlanet(jd, swe.JUPITER),
      Venus: getPlanet(jd, swe.VENUS),
      Saturn: getPlanet(jd, swe.SATURN),
      Rahu: getPlanet(jd, swe.TRUE_NODE),
      Ketu: getPlanet(jd, swe.TRUE_NODE + 180)
    };

    function sign(deg) {
      return Math.floor(deg / 30);
    }

    function nakshatra(deg) {
      return Math.floor(deg / 13.3333333);
    }

    let output = {};
    for (let p in planets) {
      output[p] = {
        degree: planets[p].degree,
        sign: sign(planets[p].degree),
        nakshatra: nakshatra(planets[p].degree),
        retrograde: planets[p].retrograde
      };
    }

    const ayanamsa = swe.get_ayanamsa(jd);

    res.status(200).json({
      jd,
      ayanamsa,
      planets: output
    });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
}
