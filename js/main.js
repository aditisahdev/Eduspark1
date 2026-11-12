// TODO: replace with the real number (country code, no +/spaces)
const PHONE = "919999999999";

// Data lives in js/data.js (loaded first): COLLEGES and COURSE_CATS. Course lists there are indicative.
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const uniq = a => [...new Set(a)].sort((x,y)=>x.localeCompare(y));
const states = uniq(COLLEGES.map(c=>c.state));
const wa = `https://wa.me/${PHONE}`;
const plural = (n,w) => `${n} ${w}${n===1?"":"s"}`;

// course tokens in the directory data, most common first
const courseCount = {};
COLLEGES.forEach(c=>c.courses.forEach(t=>courseCount[t]=(courseCount[t]||0)+1));
const COURSES = Object.keys(courseCount).sort((a,b)=>courseCount[b]-courseCount[a]||a.localeCompare(b));
const cq = t => "colleges.html?course="+encodeURIComponent(t);

// categories: how many directory institutions match each
COURSE_CATS.forEach(c=>{c.live=c.match.filter(t=>courseCount[t]);c.n=COLLEGES.filter(x=>x.courses.some(t=>c.match.includes(t))).length;});
const inAnyCat = new Set(COURSE_CATS.flatMap(c=>c.match));
const otherCourses = COURSES.filter(t=>!inAnyCat.has(t));
const catById = id => COURSE_CATS.find(c=>c.id===id);

// mobile menu
$(".menu-btn")?.addEventListener("click",()=>{
  const open=$("header.top nav").classList.toggle("open");
  $(".menu-btn").setAttribute("aria-expanded",open);
});

// call / WhatsApp links + floating button
const WA='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.52.146-.181.194-.301.297-.497.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.3 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
$$(".tb-call").forEach(a=>a.href=`tel:+${PHONE}`);
$$(".tb-wa").forEach(a=>a.href=wa);
document.body.insertAdjacentHTML("beforeend",
 `<div class="float"><a class="call" href="tel:+${PHONE}" aria-label="Call us"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg></a><a class="wa" href="${wa}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.52.146-.181.194-.301.297-.497.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.3 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></a></div>`);

// live counts in copy
$$("[data-n]").forEach(el=>{
  el.textContent = ({colleges:COLLEGES.length, states:states.length, courses:COURSE_CATS.length})[el.dataset.n];
});

// hero search -> colleges page
$("#finder")?.addEventListener("submit",e=>{e.preventDefault();location.href="colleges.html?q="+encodeURIComponent($("#fq").value.trim());});

// ---------- college cards
const PIN=`<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const init=c=>esc((c.name.match(/\b[A-Z]/g)||["E"]).slice(0,2).join(""));
// saved shortlist + compare picks live in this browser only (localStorage)
const store={
  get(k){try{return JSON.parse(localStorage.getItem(k)||"[]");}catch(e){return [];}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
};
const ckey=c=>c.name+"|"+c.city;
let saved=store.get("eduspark.saved"), cmpSel=store.get("eduspark.cmp").slice(0,3);
let renderShortlist=null;
const HEART=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>`;
const card=c=>`<article class="lc" data-k="${esc(ckey(c))}"><div class="lt">${c.logo?`<span class="mk logo"><img src="${esc(c.logo)}" alt="" loading="lazy"></span>`:`<span class="mk">${init(c)}</span>`}<div><h3><a href="contact.html">${esc(c.name)}</a></h3><span class="loc">${PIN}${esc(c.city)}<em>${esc(c.state)}</em></span></div></div>
  <div class="tagrow"><div class="tags">${c.courses.slice(0,3).map(t=>`<span class="t">${esc(t)}</span>`).join("")}</div>
    <label class="cmpchk"><input type="checkbox"${cmpSel.includes(ckey(c))?" checked":""}><span class="co">+ Compare</span><span class="ci">&check; Added</span></label></div>
  <div class="lf3"><span class="fee">Fees: <b>Not published</b></span>${c.site?`<a class="site" href="https://${esc(c.site)}" target="_blank" rel="noopener noreferrer nofollow">Official site <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a>`:`<span class="site off">Website not published</span>`}</div></article>`;
const isUniversity = c => /univers|vishwavidyalaya|vidyapeeth|deemed/i.test(c.name);

const list=$("#list");
if(list){
  const q=$("#q"),st=$("#state"),city=$("#city"),course=$("#course"),count=$("#count"),line=$("#cityline"),note=$("#catnote");
  const limit=+list.dataset.limit||Infinity;
  const kind=list.dataset.kind||"";
  const fill=(sel,all,items)=>{const v=sel.value;sel.innerHTML=`<option value="">${all}</option>`+items.map(i=>`<option>${esc(i)}</option>`).join("");sel.value=items.includes(v)?v:"";};
  const cityOpts=()=>uniq(COLLEGES.filter(c=>(!st.value||c.state===st.value)&&(!region||c.ncr)).map(c=>c.city));
  let region="", catId="";            // region: "" or "ncr"; catId: course category filter from ?cat=
  if(st){
    fill(st,"All states",states);
    course.innerHTML=`<option value="">All courses</option>`
      +COURSE_CATS.filter(c=>c.live.length).map(c=>`<optgroup label="${esc(c.name)}">${c.live.map(t=>`<option>${esc(t)}</option>`).join("")}</optgroup>`).join("")
      +(otherCourses.length?`<optgroup label="Other">${otherCourses.map(t=>`<option>${esc(t)}</option>`).join("")}</optgroup>`:"");
    const p=new URLSearchParams(location.search);
    q.value=p.get("q")||""; st.value=states.includes(p.get("state"))?p.get("state"):"";
    if(p.get("region")==="ncr") region="ncr";
    if(catById(p.get("cat"))) catId=p.get("cat");
    if(COURSES.includes(p.get("course"))) course.value=p.get("course");
    fill(city,"All cities",cityOpts());
    if(COLLEGES.some(c=>c.city===p.get("city"))) city.value=p.get("city");
  }
  const rows=()=>{
    const t=q?q.value.toLowerCase().trim():"";
    const k=st&&course?course.value:"";   // course filter only on directory pages (home has an unrelated #course in the enquiry form)
    const cat=catId?catById(catId):null;
    return COLLEGES.filter(c=>(!kind||isUniversity(c))&&(!region||c.ncr)&&(!st||!st.value||c.state===st.value)&&(!city||!city.value||c.city===city.value)
      &&(!cat||c.courses.some(x=>cat.match.includes(x)))&&(!k||c.courses.includes(k))
      &&(c.name+" "+c.city+" "+c.state+" "+c.courses.join(" ")).toLowerCase().includes(t));
  };
  const render=()=>{
    const r=rows();
    if(count) count.textContent=plural(r.length,"institution");
    if(note) note.innerHTML=catId?`Showing: <b>${esc(catById(catId).name)}</b> <button type="button" class="linkbtn" id="clearcat">Clear</button>`:"";
    list.innerHTML=r.length?r.slice(0,limit).map(card).join(""):`<p class="empty">No institutions match. Clear a filter or search again.</p>`;
    if(line){
      const base=COLLEGES.filter(c=>!kind||isUniversity(c));
      const n=s=>base.filter(c=>c.state===s).length;
      line.innerHTML=`<button type="button" data-s="" class="${!st.value&&!region?"on":""}">All</button><button type="button" data-r="ncr" class="${region?"on":""}">Delhi NCR (${base.filter(c=>c.ncr).length})</button>`
        +states.filter(s=>n(s)).map(s=>`<button type="button" data-s="${s}" class="${st.value===s&&!region?"on":""}">${s} (${n(s)})</button>`).join("");
    }
    $("#clearcat")?.addEventListener("click",()=>{catId="";render();});
  };
  line?.addEventListener("click",e=>{
    const b=e.target.closest("button"); if(!b) return;
    region=b.dataset.r||""; st.value=region?"":b.dataset.s;
    fill(city,"All cities",cityOpts());
    render();
  });
  st?.addEventListener("change",()=>{region="";fill(city,"All cities",cityOpts());render();});
  if(st) [q,city,course].forEach(el=>el.addEventListener(el===q?"input":"change",render));
  render();
}

// ---------- course categories (home grid + courses page)
const catThumb = c => `<img src="${c.img}" alt="" width="72" height="72" loading="lazy">`;
const home=$("#cat-home");
if(home) home.innerHTML=COURSE_CATS.map(c=>`<a class="cg" href="courses.html#${c.id}">${catThumb(c)}<span><b>${esc(c.name)}</b><small>${esc(c.degrees.slice(0,4).join(", "))}</small></span></a>`).join("");

const ICON={
 engineering:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
 medical:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/><path d="M5 12h3l2-3 3 6 2-3h4"/>',
 management:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
 computer:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/>',
 law:'<path d="M12 3v18M5 21h14M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>',
 pharmacy:'<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7z"/><path d="m8.5 8.5 7 7"/>',
 commerce:'<path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/>',
 science:'<path d="M9 3h6M10 3v6L4.5 19a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9V3"/><path d="M7.5 15h9"/>',
 nursing:'<circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>',
 architecture:'<path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6M9 10h.01M15 10h.01"/>',
 agriculture:'<path d="M12 22V10"/><path d="M12 10c0-4 3-6 7-6 0 4-3 6-7 6zM12 14c0-3-2-5-6-5 0 3 2 5 6 5z"/>',
 arts:'<path d="M2 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8z"/>'
};
const ico = id => `<svg class="xi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[id]||""}</svg>`;

// Course -> Specialization -> Colleges. A course page is course.html?cat=&c=&s=
const courseUrl=(cat,k,s)=>`course.html?cat=${cat.id}&c=${encodeURIComponent(k.n)}${s?"&s="+encodeURIComponent(s):""}`;
const metaLine=(cat,k)=>`${esc(k.lvl)} • Usually ${esc(k.yrs)} • ${esc(cat.name)}`;
const fcard=(cat,k,s)=>`<a class="fc" href="${courseUrl(cat,k,s)}"><h4>${esc(s?`${k.n} – ${s}`:(k.title||k.n))}</h4><p>${metaLine(cat,k)}</p><span class="arrow">View Details &rarr;</span></a>`;
const treeHtml=cat=>cat.tree.map(k=>`<div class="cblock"><div class="ckhead"><h3>${esc(k.title||k.n)}</h3><p class="cmeta">${metaLine(cat,k)}</p></div>`
  +`<div class="fgrid">${k.sp.length?k.sp.map(s=>fcard(cat,k,s)).join(""):fcard(cat,k,"")}</div></div>`).join("");

// Courses page: search + Popular Categories + more; click a category to see all its courses
const pop=$("#pop-grid");
if(pop){
  const more=$("#more-grid"), out=$("#cat-courses"), q=$("#csearch"), res=$("#cat-results"), sections=$$(".cx-sec");
  const xcard=(c,hint)=>`<button type="button" class="xc" data-id="${c.id}" aria-pressed="false">${ico(c.id)}<b>${esc(c.name)}</b><small>${hint||esc(c.degrees.join(", "))}</small><span>Explore Courses &rarr;</span></button>`;
  pop.innerHTML=COURSE_CATS.slice(0,6).map(c=>xcard(c)).join("");
  more.innerHTML=COURSE_CATS.slice(6).map(c=>xcard(c)).join("");
  const chips=a=>`<div class="chiprow">${a.map(t=>`<span class="t">${esc(t)}</span>`).join("")}</div>`;
  const show=id=>{
    const c=catById(id);
    $$(".xc").forEach(b=>b.setAttribute("aria-pressed",b.dataset.id===id));
    if(!c){out.hidden=true;return;}
    out.hidden=false;
    out.innerHTML=`<div class="shead"><div class="dhead"><img src="${c.img}" alt="" width="72" height="72"><div><h2>${esc(c.name)}</h2><p class="sub">All courses and specializations in this category. Indicative: verify with the institution before applying.</p></div></div>`
      +(c.n?`<a class="btn" href="colleges.html?cat=${c.id}">View ${plural(c.n,"institution")}</a>`:`<a class="btn line" href="contact.html">Ask a counsellor</a>`)+`</div>`
      +`<p class="flow">${esc(c.name)} &rarr; Course &rarr; Specialization &rarr; Colleges offering it</p>`+treeHtml(c)
      +(c.live.length?`<p class="sub" style="margin-top:1.4rem">In our directory: ${c.live.map(t=>`<a class="arrow" href="${cq(t)}">${esc(t)} (${courseCount[t]})</a>`).join(" · ")}</p>`:"");
    history.replaceState(null,"","#"+id);
    out.scrollIntoView({behavior:"smooth",block:"start"});
  };
  document.addEventListener("click",e=>{const b=e.target.closest(".xc");if(b)show(b.dataset.id);});
  q.addEventListener("input",()=>{
    const t=q.value.trim().toLowerCase();
    sections.forEach(s=>s.hidden=!!t);
    res.hidden=!t;
    if(!t) return;
    const hits=COURSE_CATS.map(c=>({c,m:[...c.degrees,...c.specs].filter(x=>x.toLowerCase().includes(t))})).filter(h=>h.m.length||h.c.name.toLowerCase().includes(t));
    res.innerHTML=hits.length?`<h3 class="xh">${hits.length} ${hits.length===1?"category":"categories"} found</h3><div class="xgrid">`+hits.map(h=>xcard(h.c,h.m.length?esc([...new Set(h.m)].slice(0,3).join(", ")):"")).join("")+`</div>`:`<p class="empty">No course matches. Try a shorter word, for example "tech" or "law".</p>`;
  });
  if(catById(location.hash.slice(1))) show(location.hash.slice(1));
}

// ---------- course page: Category > Course > Specialization > colleges offering the course
const cv=$("#course-view");
if(cv){
  const p=new URLSearchParams(location.search);
  const cat=catById(p.get("cat")), k=cat&&cat.tree.find(x=>x.n===p.get("c")), s=p.get("s")||"";
  if(!k){
    cv.innerHTML=`<p class="empty">Course not found. <a class="arrow" href="courses.html">Browse all courses &rarr;</a></p>`;
  }else{
    const title=s?`${k.n} – ${s}`:(k.title||k.n);
    document.title=`${title} – Eduspark`;
    const rows=COLLEGES.filter(c=>c.courses.some(t=>k.tok.includes(t)));
    const exact=s?rows.filter(c=>c.courses.includes(s)):[];            // colleges that list the specialization itself
    const ordered=[...exact,...rows.filter(c=>!exact.includes(c))];
    const shown=ordered.slice(0,12);
    const seeAll=k.tok.length===1?cq(k.tok[0]):`colleges.html?cat=${cat.id}`;
    cv.innerHTML=`<nav class="crumbs" aria-label="Breadcrumb"><a href="courses.html">Courses</a> &rsaquo; <a href="courses.html#${cat.id}">${esc(cat.name)}</a> &rsaquo; <a href="${courseUrl(cat,k,"")}">${esc(k.n)}</a>${s?` &rsaquo; <span>${esc(s)}</span>`:""}</nav>`
      +`<div class="dhead" style="margin:1rem 0 1.4rem"><img src="${cat.img}" alt="" width="72" height="72"><div><h1>${esc(title)}</h1><p class="cmeta" style="margin-top:.4rem">${metaLine(cat,k)}</p></div></div>`
      +(k.sp.length?`<div class="card" style="margin-bottom:2rem"><h3>Specializations in ${esc(k.n)}</h3><div class="chiprow">${k.sp.map(x=>x===s?`<span class="t on">${esc(x)}</span>`:`<a class="t g" href="${courseUrl(cat,k,x)}">${esc(x)}</a>`).join("")}</div></div>`:"")
      +`<div class="shead"><div><h2>Colleges offering ${esc(k.n)}</h2><p class="sub">${rows.length?`${plural(rows.length,"institution")} in our directory list ${esc(k.n)}${exact.length?`, ${exact.length} of them also list ${esc(s)}`:""}.`:`We have not linked colleges to ${esc(k.n)} yet.`}${s?` Branch availability varies by college. Confirm ${esc(s)} with the institution.`:" Course availability varies by campus. Confirm with the institution."}</p></div>`
      +(rows.length>shown.length?`<a class="btn" href="${seeAll}">See all ${rows.length}</a>`:"")+`</div>`
      +(rows.length?`<div class="grid3">${shown.map(card).join("")}</div>`:`<div class="empty">A counsellor can list colleges offering ${esc(title)} for you. <a class="btn" style="margin-left:.6rem" href="contact.html">Ask a counsellor</a></div>`);
  }
}

// ---------- home hero: browse by state (real counts, largest first)
const hs=$("#hero-states");
if(hs){
  const cnt=s=>COLLEGES.filter(c=>c.state===s).length;
  const top=[...states].sort((a,b)=>cnt(b)-cnt(a)).slice(0,6), max=cnt(top[0]);
  hs.innerHTML=top.map(s=>`<li><a href="colleges.html?state=${encodeURIComponent(s)}"><span class="sn">${esc(s)}</span><b>${cnt(s)}</b><i style="--w:${Math.round(cnt(s)/max*100)}%"></i></a></li>`).join("");
  $("#sm-ncr-n").textContent=COLLEGES.filter(c=>c.ncr).length+" colleges";
}

// ---------- home: scrolling states band (largest first, list repeated for a seamless loop)
const mq=$("#mq");
if(mq){
  const cnt=s=>COLLEGES.filter(c=>c.state===s).length;
  const names=[...states].sort((a,b)=>cnt(b)-cnt(a));
  mq.innerHTML=[...names,...names].map(n=>`<span>${esc(n)}</span>`).join("");
}

// ---------- home: featured courses
const feat=$("#featured-courses");
if(feat) feat.innerHTML=[["engineering","B.Tech","Computer Science"],["management","MBA","Finance"],["computer","BCA",""]].map(([id,n,s])=>{
  const cat=catById(id), k=cat.tree.find(x=>x.n===n); return fcard(cat,k,s);
}).join("");

// ---------- state-wise page
const sg=$("#state-grid");
if(sg) sg.innerHTML=states.map(s=>{
  const rows=COLLEGES.filter(c=>c.state===s), cs=uniq(rows.map(c=>c.city));
  const cn=plural(cs.length,"city").replace("citys","cities");
  return `<a class="sc" href="colleges.html?state=${encodeURIComponent(s)}"><div class="sc-top"><span class="sc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg></span><span class="sc-n"><b>${rows.length}</b> ${rows.length===1?"institution":"institutions"}</span></div><h3>${esc(s)}</h3><p class="subtle">${cn}: ${esc(cs.slice(0,3).join(", "))}${cs.length>3?" and more":""}</p><span class="arrow">View colleges &rarr;</span></a>`;
}).join("");

// ---------- compare page (up to 3 colleges)
const cmp=$("#cmp");
if(cmp){
  const sorted=[...COLLEGES].sort((a,b)=>a.name.localeCompare(b.name));
  const opts=`<option value="">Choose a college</option>`+sorted.map(c=>`<option value="${COLLEGES.indexOf(c)}">${esc(c.name)} (${esc(c.city)})</option>`).join("");
  const sels=$$(".cmp-sel"); sels.forEach(s=>s.innerHTML=opts);
  const ids=(new URLSearchParams(location.search).get("c")||"").split(",");
  sels.forEach((s,i)=>{if(ids[i]!==undefined&&ids[i]!==""&&COLLEGES[+ids[i]]) s.value=ids[i];});
  const draw=()=>{
    const picks=sels.filter(s=>s.value!=="").map(s=>COLLEGES[+s.value]).filter(Boolean);
    if(!picks.length){cmp.innerHTML=`<p class="empty">Pick two or three colleges above to compare them.</p>`;return;}
    const row=(label,f)=>`<tr><th scope="row">${label}</th>${picks.map(c=>`<td>${f(c)}</td>`).join("")}</tr>`;
    cmp.innerHTML=`<div class="tablewrap"><table class="cmpt"><thead><tr><th></th>${picks.map(c=>`<th scope="col">${esc(c.name)}</th>`).join("")}</tr></thead><tbody>`
      +row("City",c=>esc(c.city))+row("State",c=>c.state)
      +row("Course areas",c=>c.courses.map(t=>`<span class="t">${esc(t)}</span>`).join(" "))
      +row("Delhi NCR",c=>c.ncr?"Yes":"No")
      +row("Official website",c=>c.site?`<a class="arrow" href="https://${esc(c.site)}" target="_blank" rel="noopener noreferrer nofollow">${esc(c.site)}</a>`:"Not published")
      +row("Fees",()=>"Not published")+row("Facilities",()=>"Not published")
      +`</tbody></table></div><p class="sub" style="margin-top:1rem">Fees and facilities are not published yet. <a class="arrow" href="contact.html">Ask a counsellor</a> for current details.</p>`;
  };
  sels.forEach(s=>s.addEventListener("change",()=>{history.replaceState(null,"","?c="+sels.map(x=>x.value).join(","));draw();}));
  draw();
}

// ---------- footer subscribe: no email service yet, so it opens WhatsApp with the address
$("#subscribe")?.addEventListener("submit",e=>{
  e.preventDefault();
  const email=e.target.querySelector("input").value.trim();
  $("#sub-note").textContent="Opening WhatsApp to confirm your subscription…";
  window.open(`${wa}?text=${encodeURIComponent("Please add me to admission updates: "+email)}`,"_blank","noopener");
  e.target.reset();
});

// ---------- shortlist: heart toggle, header count, shortlist page
const refreshCount=()=>$$(".slcount").forEach(e=>{e.textContent=saved.length;e.hidden=!saved.length;});
refreshCount();
document.addEventListener("click",e=>{
  const h=e.target.closest(".heart"); if(!h) return;
  const k=h.closest("[data-k]").dataset.k;
  saved=saved.includes(k)?saved.filter(x=>x!==k):[...saved,k];
  store.set("eduspark.saved",saved);
  $$(".heart").forEach(b=>{if(b.closest("[data-k]")?.dataset.k===k) b.setAttribute("aria-pressed",saved.includes(k));});
  refreshCount();
  if(renderShortlist) renderShortlist();
});
const shl=$("#shortlist");
if(shl){
  renderShortlist=()=>{
    const rows=saved.map(k=>COLLEGES.find(c=>ckey(c)===k)).filter(Boolean);
    $("#shl-count").textContent=plural(rows.length,"saved college");
    shl.innerHTML=rows.length?rows.map(card).join(""):`<p class="empty">No saved colleges yet. Tap the heart on a college card to save it. <a class="arrow" href="colleges.html">Browse colleges &rarr;</a></p>`;
    $("#shl-actions").hidden=!rows.length;
    $("#shl-wa").href=`${wa}?text=`+encodeURIComponent("Hi, I'd like help with this shortlist:\n"+rows.map((c,i)=>`${i+1}. ${c.name} (${c.city}, ${c.state})`).join("\n"));
  };
  $("#shl-clear").addEventListener("click",()=>{saved=[];store.set("eduspark.saved",saved);refreshCount();renderShortlist();});
  renderShortlist();
}

// ---------- compare tray: tick up to 3 colleges, then open the compare page
const tray=document.createElement("div");
tray.className="tray"; tray.hidden=true; tray.setAttribute("role","region"); tray.setAttribute("aria-label","Compare tray");
document.body.appendChild(tray);
let trayMsg="";
const drawTray=()=>{
  const idx=cmpSel.map(k=>COLLEGES.findIndex(c=>ckey(c)===k)).filter(i=>i>=0);
  tray.hidden=!idx.length;
  document.body.classList.toggle("has-tray",!!idx.length);
  tray.innerHTML=`<div class="tray-in"><span class="tray-l">Compare ${idx.length}/3</span><div class="tray-chips">${idx.map(i=>`<span class="tchip">${esc(COLLEGES[i].name)}<button type="button" data-rm="${esc(ckey(COLLEGES[i]))}" aria-label="Remove ${esc(COLLEGES[i].name)}">&times;</button></span>`).join("")}${trayMsg?`<span class="tray-note">${trayMsg}</span>`:""}</div><a class="btn sm${idx.length<2?" dis":""}" href="${idx.length<2?"#":"compare.html?c="+idx.join(",")}">Compare &rarr;</a><button type="button" class="linkbtn" data-clear>Clear</button></div>`;
};
const saveCmp=()=>{store.set("eduspark.cmp",cmpSel);drawTray();};
document.addEventListener("change",e=>{
  const box=e.target.closest(".cmpchk input"); if(!box) return;
  const k=box.closest("[data-k]").dataset.k;
  if(box.checked){
    if(cmpSel.length>=3){box.checked=false;trayMsg="Up to 3 colleges";drawTray();setTimeout(()=>{trayMsg="";drawTray();},2500);return;}
    if(!cmpSel.includes(k)) cmpSel.push(k);
  }else cmpSel=cmpSel.filter(x=>x!==k);
  saveCmp();
});
tray.addEventListener("click",e=>{
  const rm=e.target.closest("[data-rm]"), clr=e.target.closest("[data-clear]");
  if(!rm&&!clr) return;
  cmpSel=rm?cmpSel.filter(x=>x!==rm.dataset.rm):[];
  $$(".cmpchk input").forEach(b=>{b.checked=cmpSel.includes(b.closest("[data-k]").dataset.k);});
  saveCmp();
});
drawTray();

// ---------- scroll reveal + count-up (off when the visitor prefers reduced motion)
if(!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window){
  const targets=$$("#how .card,.gsteps li,.cg,.fc,.xc,.cblock,.shead,.sl-card");
  targets.forEach(t=>t.classList.add("rv"));
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target);}}),{threshold:.1});
  targets.forEach(t=>io.observe(t));
  setTimeout(()=>targets.forEach(t=>t.classList.add("in")),2500);   // safety net
  $$(".sl b").forEach(b=>{
    const end=+b.textContent; let t0;
    const step=ts=>{t0=t0||ts;const p=Math.min((ts-t0)/900,1);b.textContent=Math.round(end*p);if(p<1)requestAnimationFrame(step);};
    b.textContent=0; requestAnimationFrame(step);
    setTimeout(()=>{b.textContent=end;},1300);   // fallback: always end on the real number
  });
}

// ---------- numbers block: count from 0 up to each value when it scrolls into view
$$(".nums b").forEach(b=>{
  const end=+b.textContent; if(!end) return;
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce||!("IntersectionObserver" in window)) return;
  b.textContent="0";
  let done=false;
  const run=()=>{
    if(done) return; done=true;
    const dur=1600; let t0;
    const step=ts=>{
      t0=t0||ts; const p=Math.min((ts-t0)/dur,1), e=1-Math.pow(1-p,3);   // ease-out
      b.textContent=Math.round(end*e);
      if(p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    setTimeout(()=>{b.textContent=end;},dur+300);                      // always end on the real number
  };
  new IntersectionObserver((es,io)=>es.forEach(en=>{if(en.isIntersecting){run();io.disconnect();}}),{threshold:.4}).observe(b);
});

// ---------- enquiry form: no backend yet, opens WhatsApp with the details
$("#enquiry-form")?.addEventListener("submit",e=>{
  e.preventDefault();
  const f=new FormData(e.target);
  const msg=`Hi, I'm ${f.get("name")} (${f.get("phone")}). Interested in ${f.get("course")}. ${f.get("msg")?"Score/rank: "+f.get("msg"):""}`;
  $("#note").textContent="Opening WhatsApp to send your enquiry…";
  window.open(`${wa}?text=${encodeURIComponent(msg)}`,"_blank","noopener");
  e.target.reset();
});

// ---------- home: quick enquiry popup, shown once per visit on the first scroll
(()=>{
  const m=$("#qe"); if(!m) return;
  let seen=false; try{seen=sessionStorage.getItem("qe")==="1"}catch(e){}
  let last=null;
  $("#qe-colleges").innerHTML=COLLEGES.map(c=>`<option value="${esc(c.name)}">`).join("");
  $("#qe-city").insertAdjacentHTML("beforeend",[...new Set(COLLEGES.map(c=>c.city))].sort().map(c=>`<option>${esc(c)}</option>`).join(""));
  const show=()=>{ if(!m.hidden) return; last=document.activeElement; m.hidden=false; document.body.classList.add("qe-open"); m.querySelector("input").focus(); };
  const open=()=>{ if(seen||!m.hidden) return; seen=true; try{sessionStorage.setItem("qe","1")}catch(e){}; show(); };
  const hc=$(".hcta"); if(hc) hc.insertAdjacentHTML("afterbegin",'<button type="button" class="hbtn hbtn-inq qe-trigger" aria-haspopup="dialog">Inquiry Now</button>');
  const nv=$("header nav ul"); if(nv) nv.insertAdjacentHTML("beforeend",'<li class="nav-inq"><button type="button" class="qe-trigger" aria-haspopup="dialog">Inquiry Now</button></li>');
  document.addEventListener("click",e=>{ if(e.target.closest(".qe-trigger")){ seen=true; try{sessionStorage.setItem("qe","1")}catch(x){}; show(); } });
  const close=()=>{ m.hidden=true; document.body.classList.remove("qe-open"); last&&last.focus&&last.focus(); };
  const onScroll=()=>{ if((document.documentElement.scrollTop||document.body.scrollTop)>30){ removeEventListener("scroll",onScroll); open(); } };
  if(!seen) addEventListener("scroll",onScroll,{passive:true});
  if(!seen) setTimeout(()=>{ removeEventListener("scroll",onScroll); open(); },7000); // short pages that do not scroll
  m.addEventListener("click",e=>{ if(e.target===m||e.target.closest(".qe-x")) close(); });
  addEventListener("keydown",e=>{ if(e.key==="Escape"&&!m.hidden) close(); });
  $("#qe-form").addEventListener("submit",e=>{
    e.preventDefault(); const f=new FormData(e.target);
    const bits=[f.get("college")&&`College: ${f.get("college")}`,f.get("city")&&`City: ${f.get("city")}`,f.get("course")&&`Programme: ${f.get("course")}`].filter(Boolean).join(". ");
    const msg=`Hi, I'm ${f.get("name")} (${f.get("phone")}, ${f.get("email")}). ${bits}`;
    window.open(`${wa}?text=${encodeURIComponent(msg)}`,"_blank","noopener");
    e.target.reset(); close();
  });
})();
