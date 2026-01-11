import express from "express";
import swe from "swisseph-node";
import moment from "moment-timezone";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());

const EPHE = path.join(process.cwd(), "ephe");
if (!fs.existsSync(EPHE)) fs.mkdirSync(EPHE);

swe.set_ephe_path(EPHE);
swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0);

function jd(date, time, tz){
  const dt = moment.tz(date+" "+time,"YYYY-MM-DD HH:mm", tz || "Asia/Kolkata");
  return swe.julday(dt.year(), dt.month()+1, dt.date(),
    dt.hour()+dt.minute()/60+dt.second()/3600);
}

function P(jd, planet){
  const r = swe.calc(jd, planet);
  return { degree:r.longitude, retro:r.speed<0 };
}

app.post("/kundli",(req,res)=>{
  try{
    const {date,time,lat,lon,tz}=req.body;
    const j=jd(date,time,tz);

    res.json({
      jd:j,
      ayanamsa:swe.get_ayanamsa(j),
      planets:{
        Sun:P(j,swe.SUN),
        Moon:P(j,swe.MOON),
        Mars:P(j,swe.MARS),
        Mercury:P(j,swe.MERCURY),
        Jupiter:P(j,swe.JUPITER),
        Venus:P(j,swe.VENUS),
        Saturn:P(j,swe.SATURN),
        Rahu:P(j,swe.TRUE_NODE),
        Ketu:P(j,swe.TRUE_NODE+180)
      }
    });
  }catch(e){
    res.status(500).json({error:e.toString()});
  }
});

app.listen(process.env.PORT || 3000);
