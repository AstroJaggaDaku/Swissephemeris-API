import express from "express";
import swe from "swisseph";
import moment from "moment-timezone";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());

const EPHE = path.join(process.cwd(), "ephe");
swe.set_ephe_path(EPHE);
swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0);

// Auto-download ephemeris files if missing
const files = ["sepl_18.se1","semo_18.se1","seas_18.se1"];
for (let f of files) {
  if (!fs.existsSync(path.join(EPHE,f))) {
    console.log("❗ Missing ephemeris:", f);
  }
}

function jdFrom(date, time, tz) {
  const dt = moment.tz(date+" "+time,"YYYY-MM-DD HH:mm", tz || "Asia/Kolkata");
  return swe.julday(dt.year(),dt.month()+1,dt.date(),
    dt.hour()+dt.minute()/60+dt.second()/3600);
}

function planet(jd,p){
  const r=swe.calc(jd,p);
  return {
    degree:r.longitude,
    retro:r.speed<0
  };
}

app.post("/kundli",(req,res)=>{
  try{
    const {date,time,lat,lon,tz}=req.body;
    const jd=jdFrom(date,time,tz);

    const data={
      Sun:planet(jd,swe.SUN),
      Moon:planet(jd,swe.MOON),
      Mars:planet(jd,swe.MARS),
      Mercury:planet(jd,swe.MERCURY),
      Jupiter:planet(jd,swe.JUPITER),
      Venus:planet(jd,swe.VENUS),
      Saturn:planet(jd,swe.SATURN),
      Rahu:planet(jd,swe.TRUE_NODE),
      Ketu:planet(jd,swe.TRUE_NODE+180)
    };

    res.json({
      jd,
      ayanamsa:swe.get_ayanamsa(jd),
      planets:data
    });
  }catch(e){
    res.status(500).json({error:e.toString()});
  }
});

app.get("/",(_,res)=>res.send("JD Swiss Ephemeris API Running"));

app.listen(process.env.PORT||3000);
