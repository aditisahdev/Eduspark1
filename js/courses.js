// Course -> Specialization tree for each category (loaded after data.js).
// Row: "Course|Level|Typical years|Directory tokens (comma)|Specializations (comma)|Optional display title"
// Specializations are the ones in the client's course sheet. Years are typical ("Usually ...").
// Tokens link a course to colleges whose indicative course areas include it. No token = no colleges linked yet.
const TREE = {
engineering:[
 "B.Tech|Undergraduate|4 Years|B.Tech|Computer Science,AI & ML,Civil,Mechanical,Electrical,ECE,Chemical,Biotechnology",
 "M.Tech|Postgraduate|2 Years|M.Tech|",
 "Diploma|Diploma|3 Years||",
 "Polytechnic|Diploma|3 Years||"],
medical:[
 "MBBS|Undergraduate|5½ Years|MBBS,Medical|",
 "BDS|Undergraduate|5 Years|BDS,Dental|",
 "BAMS|Undergraduate|5½ Years||",
 "BHMS|Undergraduate|5½ Years||",
 "MD|Postgraduate|3 Years|Medical|",
 "MS|Postgraduate|3 Years|Medical|"],
management:[
 "MBA|Postgraduate|2 Years|MBA|Marketing,Finance,HR,Business Analytics,International Business",
 "PGDM|Postgraduate|2 Years||Marketing,Finance,HR,Business Analytics,International Business",
 "BBA|Undergraduate|3 Years|BBA|",
 "BMS|Undergraduate|3 Years||"],
computer:[
 "BCA|Undergraduate|3–4 Years|BCA|Cyber Security,Cloud Computing,Data Science|BCA – Computer Applications",
 "MCA|Postgraduate|2 Years|MCA|Cyber Security,Cloud Computing,Data Science",
 "B.Sc IT|Undergraduate|3 Years||"],
pharmacy:[
 "D.Pharm|Diploma|2 Years|Pharmacy|",
 "B.Pharm|Undergraduate|4 Years|Pharmacy|",
 "M.Pharm|Postgraduate|2 Years|Pharmacy|",
 "Pharm.D|Doctoral|6 Years|Pharmacy|"],
law:[
 "BA LLB|Undergraduate|5 Years|Law|",
 "BBA LLB|Undergraduate|5 Years|Law|",
 "LLB|Undergraduate|3 Years|Law|",
 "LLM|Postgraduate|1–2 Years|Law|"],
commerce:[
 "B.Com|Undergraduate|3 Years|Commerce|Accounting & Finance",
 "B.Com Hons|Undergraduate|3 Years|Commerce|",
 "M.Com|Postgraduate|2 Years|Commerce|"],
science:[
 "B.Sc|Undergraduate|3 Years|B.Sc,Science|Physics,Chemistry,Mathematics,Biology,Biotechnology",
 "M.Sc|Postgraduate|2 Years|M.Sc,Science|Physics,Chemistry,Mathematics,Biology,Biotechnology",
 "Integrated Science|Integrated|5 Years||"],
nursing:[
 "B.Sc Nursing|Undergraduate|4 Years|Nursing|",
 "GNM|Diploma|3½ Years|Nursing|",
 "ANM|Diploma|2 Years|Nursing|",
 "BPT|Undergraduate|4½ Years|Allied Health,Health Sciences|",
 "MLT|Diploma or Undergraduate|2–3 Years|Allied Health,Health Sciences|"],
architecture:[
 "B.Arch|Undergraduate|5 Years|Architecture|",
 "B.Des|Undergraduate|4 Years|Design|Interior Design,Fashion Design",
 "M.Des|Postgraduate|2 Years|Design|Interior Design,Fashion Design"],
agriculture:[
 "B.Sc Agriculture|Undergraduate|4 Years|Agriculture|Horticulture,Forestry",
 "M.Sc Agriculture|Postgraduate|2 Years|Agriculture|",
 "BVSc|Undergraduate|5½ Years||"],
arts:[
 "BA|Undergraduate|3 Years|Arts,Liberal Arts|Journalism",
 "MA|Postgraduate|2 Years|Arts,Liberal Arts|Journalism",
 "B.Ed|Undergraduate|2 Years|Education|",
 "M.Ed|Postgraduate|2 Years|Education|",
 "MSW|Postgraduate|2 Years|Social Sciences|"]
};
const split = s => s ? s.split(",").map(x=>x.trim()).filter(Boolean) : [];
COURSE_CATS.forEach(c=>{
  c.tree = (TREE[c.id]||[]).map(r=>{
    const [n,lvl,yrs,tok,sp,title] = r.split("|");
    return {n,lvl,yrs,tok:split(tok),sp:split(sp),title:title||""};
  });
});
