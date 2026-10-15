"use strict";
(() => {
  const data = window.RAIN;
  const $ = (selector) => document.querySelector(selector);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  let teaserPaused = reducedMotion.matches;
  const icon = paths => `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
  const resourceIcons = {
    Paper: icon('<path d="M5 2.5h6l4 4v11H5zM11 2.5v4h4M8 10h4M8 13h4"/>'),
    arXiv: '<img src="assets/icons/arxiv.svg" alt="" width="16" height="16">',
    Code: '<img src="assets/icons/github.svg" alt="" width="16" height="16">',
    Models: icon('<path d="M10 2.5v10m-3-3 3 3 3-3M3.5 13v4.5h13V13"/>')
  };
  const resourceButton = (r) => r.url
    ? `<a class="resource-button" href="${escapeHTML(r.url)}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">${resourceIcons[r.name] || r.symbol}</span>${r.name}</a>`
    : `<button class="resource-button" type="button" disabled title="${escapeHTML(r.status)}"><span aria-hidden="true">${resourceIcons[r.name] || r.symbol}</span>${r.name}<small>soon</small></button>`;
  $("#hero-resources").innerHTML = data.resources.map(resourceButton).join("");
  $("#resource-list").innerHTML = data.resources.map(r => `<div class="resource-item"><h3>${r.url ? `<a href="${escapeHTML(r.url)}">${r.name} ↗</a>` : r.name}</h3><p>${escapeHTML(r.detail)}</p><span class="status">${r.url ? "Available" : escapeHTML(r.status)}</span></div>`).join("");
  $("#citation-authors").textContent = data.authors.map(a => a.name).join(", ");
  $("#citation-title").textContent = data.title;
  if (data.citation?.bibtex) {
    $("#citation-bibtex").textContent = data.citation.bibtex;
    $("#citation-status").textContent = "Available";
  }
  if (data.authors.length) {
    const names = $("#authors"); names.hidden = false;
    names.innerHTML = data.authors.map((a, index) => {
      const name = a.url ? `<a href="${escapeHTML(a.url)}">${escapeHTML(a.name)}</a>` : escapeHTML(a.name);
      const numbers = (a.affiliations || []).join(",");
      const roles = `${a.equalContribution ? "†" : ""}${a.corresponding ? "*" : ""}`;
      const roleLabel = `${a.equalContribution ? "; equal contribution" : ""}${a.corresponding ? "; corresponding author" : ""}`;
      return `<span class="author-name">${name}<sup aria-label="Affiliations ${escapeHTML(numbers)}${roleLabel}">${escapeHTML(numbers)}${roles}</sup>${index < data.authors.length - 1 ? ',' : ''}</span>`;
    }).join(' ');
    if (data.affiliations?.length) {
      const affiliations = $("#affiliations"); affiliations.hidden = false;
      affiliations.innerHTML = data.affiliations.map(a => `<span class="affiliation"><sup>${a.id}</sup>${escapeHTML(a.name)}</span>`).join("");
    }
    const notes = [];
    if (data.authors.some(a => a.equalContribution)) notes.push('<span><sup>†</sup> Equal contribution</span>');
    if (data.authors.some(a => a.corresponding)) notes.push('<span><sup>*</sup> Corresponding authors</span>');
    if (notes.length) { $("#author-notes").hidden = false; $("#author-notes").innerHTML = notes.join('<span class="note-separator" aria-hidden="true"> · </span>'); }
  }
  $("#teaser-grid").innerHTML = data.robotTasks.map((t,i) => `<div class="teaser-tile"><h3><span>(${String.fromCharCode(97+i)})</span>${t.name}</h3><video muted loop playsinline preload="none" poster="assets/posters/${t.id}.webp" data-src="assets/videos/hero-${t.id}.mp4" aria-label="${t.name}, three times source playback"></video></div>`).join("");
  $("#robot-tabs").innerHTML = data.robotTasks.map((t,i) => `<button role="tab" type="button" id="tab-${t.id}" aria-controls="robot-panel" aria-selected="${i===0}" tabindex="${i===0 ? 0 : -1}">${t.name}</button>`).join("");
  const robotVideo = $("#robot-video");
  function selectRobot(index) {
    const t = data.robotTasks[index]; robotVideo.pause();
    robotVideo.poster = `assets/posters/${t.id}.webp`;
    robotVideo.dataset.src = `assets/videos/${t.id}.mp4`;
    if (robotVideo.hasAttribute("src")) { robotVideo.src = robotVideo.dataset.src; robotVideo.load(); }
    $("#robot-task-title").textContent = t.name;
    $("#robot-task-description").textContent = t.description;
    $("#robot-panel").setAttribute("aria-labelledby", `tab-${t.id}`);
    $("#robot-bars").innerHTML = t.results.map((rate, i) => `<div class="bar-row ${i===2 ? "ours" : ""}"><span>${["ACT","DP","RAIN"][i]}</span><div class="bar-track" aria-hidden="true"><div class="bar-fill" style="width:${rate}%"></div></div><span class="bar-value">${rate}%</span></div>`).join("");
    $("#robot-video").setAttribute("aria-label", `Selected RAIN ${t.name} rollout`);
    document.querySelectorAll("#robot-tabs button").forEach((b,i) => { b.setAttribute("aria-selected",String(i===index)); b.tabIndex = i===index ? 0 : -1; });
  }
  const robotTabs = [...document.querySelectorAll("#robot-tabs button")];
  robotTabs.forEach((b,i) => {
    b.addEventListener("click", () => selectRobot(i));
    b.addEventListener("keydown", event => {
      let next;
      if(event.key === "ArrowRight") next=(i+1)%robotTabs.length;
      if(event.key === "ArrowLeft") next=(i+robotTabs.length-1)%robotTabs.length;
      if(event.key === "Home") next=0;
      if(event.key === "End") next=robotTabs.length-1;
      if(next!==undefined){event.preventDefault();selectRobot(next);robotTabs[next].focus();}
    });
  });
  selectRobot(0);
  const fillTable = (selector, rows, format) => {
    $(selector).innerHTML = rows.map(row => `<tr class="${row[0] === "RAIN" ? "ours" : ""}">${row.map((v,i) => i===0 ? `<th scope="row">${escapeHTML(v)}</th>` : `<td>${format ? format(v,i) : v}</td>`).join("")}</tr>`).join("");
  };
  fillTable("#robot-table tbody",data.robotRows);
  fillTable("#simulation-table tbody",data.simRows,(v,i)=>i===9 || i===10 ? Number(v).toFixed(3) : v);
  fillTable("#controls-table tbody",data.controls,(v,i)=>Number(v).toFixed(i===1 ? 1 : 3));
  $("#sim-grid").innerHTML = data.simTasks.map(t => `<article class="sim-card"><video controls muted playsinline preload="none" poster="assets/posters/${t.id}.webp" data-src="assets/videos/${t.id}.mp4" aria-label="${t.name} demonstration"></video><h3>${t.name}</h3><p class="sim-success">Success rate: <strong>${t.success}%</strong></p></article>`).join("");
  const videos = [...document.querySelectorAll("video")];
  function loadVideo(video){ if (!video.hasAttribute("src") && video.dataset.src) {video.src=video.dataset.src;video.load();} }
  const observeMedia = new IntersectionObserver(entries => entries.forEach(entry => {
    const video = entry.target;
    if(entry.isIntersecting){loadVideo(video);if(video.closest(".teaser-grid") && !teaserPaused && !document.hidden) video.play().catch(()=>{});}
    else video.pause();
  }), {rootMargin:"80px 0px",threshold:0.05});
  videos.forEach(video => {
    observeMedia.observe(video);
    video.addEventListener("pointerdown",()=>loadVideo(video),{once:true});
    video.addEventListener("focus",()=>loadVideo(video),{once:true});
    video.addEventListener("play",()=>{if(!video.closest(".teaser-grid"))videos.forEach(other=>{if(other!==video && !other.closest(".teaser-grid"))other.pause();});});
  });
  function setTeaserState(){
    const button=$("#teaser-toggle");button.setAttribute("aria-pressed",String(teaserPaused));
    button.innerHTML=teaserPaused ? 'Play previews <span aria-hidden="true">▷</span>' : 'Pause previews <span aria-hidden="true">Ⅱ</span>';
    document.querySelectorAll(".teaser-grid video").forEach(v=>{if(teaserPaused)v.pause();else{loadVideo(v);v.play().catch(()=>{});}});
  }
  $("#teaser-toggle").addEventListener("click",()=>{teaserPaused=!teaserPaused;setTeaserState();});
  if(teaserPaused)setTeaserState();
  reducedMotion.addEventListener("change",()=>{teaserPaused=reducedMotion.matches;setTeaserState();});
  document.addEventListener("visibilitychange",()=>{if(document.hidden) videos.forEach(v=>v.pause());else if(!teaserPaused)document.querySelectorAll(".teaser-grid video").forEach(v=>{const r=v.getBoundingClientRect();if(r.bottom>0 && r.top<innerHeight)v.play().catch(()=>{});});});

  const routeVideo=$("#route-video"); let routeTrace, routeRequest=0, routeFrameHandle=null;
  const routeCache = new Map();
  $("#route-tabs").innerHTML=data.routingTasks.map((t,i)=>`<button role="tab" type="button" id="route-tab-${t.id}" aria-controls="route-panel" aria-selected="${i===0}" tabindex="${i===0?0:-1}">${t.name}</button>`).join("");
  const routeTabs=[...document.querySelectorAll("#route-tabs button")];
  function updateRoute(playbackTime=routeVideo.currentTime){
    if(!routeTrace)return;
    if(typeof playbackTime!=="number")playbackTime=routeVideo.currentTime;
    const frame=Math.min(routeTrace.frames-1,Math.floor(playbackTime*routeTrace.fps+1e-6));
    const n=routeTrace.selected_refinements[frame];$("#route-n").textContent=n;
    $("#route-step-label").innerHTML=`${n===1 ? "step" : "steps"} for this<br>action chunk`;
    document.querySelectorAll(".route-options span").forEach(s=>s.classList.toggle("active",Number(s.dataset.level)===n));
    const cursor=$(".route-cursor");if(cursor)cursor.style.left=`${100*frame/routeTrace.frames}%`;
  }
  function showRouteTrace(trace){
    routeTrace=trace;const segments=[];
    trace.selected_refinements.forEach((n,frame)=>{const previous=segments.at(-1);if(previous && previous.n===n)previous.end=frame+1;else segments.push({n,start:frame,end:frame+1});});
    $("#route-timeline").innerHTML=segments.map(s=>`<button type="button" data-level="${s.n}" data-frame="${s.start}" style="flex:${s.end-s.start}" aria-label="Jump to ${(s.start/trace.fps).toFixed(1)} seconds: ${s.n} refinement ${s.n===1 ? "step" : "steps"}">${s.n}</button>`).join("")+'<span class="route-cursor" aria-hidden="true"></span>';
    document.querySelectorAll("#route-timeline button").forEach(b=>b.addEventListener("click",()=>{const target=Number(b.dataset.frame)/trace.fps;loadVideo(routeVideo);if(routeVideo.readyState>=1){routeVideo.currentTime=target;updateRoute();}else routeVideo.addEventListener("loadedmetadata",()=>{routeVideo.currentTime=target;updateRoute();},{once:true});}));
    updateRoute();
  }
  async function selectRoute(index){
    const task=data.routingTasks[index], request=++routeRequest;
    routeVideo.pause();routeTrace=null;
    routeVideo.poster=`assets/posters/routing-${task.id}.webp`;
    routeVideo.dataset.src=`assets/videos/routing-${task.id}.mp4`;
    if(routeVideo.hasAttribute("src")){routeVideo.src=routeVideo.dataset.src;routeVideo.load();}
    routeVideo.setAttribute("aria-label",`RAIN ${task.name} refinement demonstration`);
    $("#route-task-name").textContent=task.name;
    $("#route-task-description").textContent=task.description;
    $("#route-panel").setAttribute("aria-labelledby",`route-tab-${task.id}`);
    $("#route-n").textContent="—";$("#route-timeline").innerHTML="";
    document.querySelectorAll(".route-options span").forEach(s=>s.classList.remove("active"));
    routeTabs.forEach((b,i)=>{b.setAttribute("aria-selected",String(i===index));b.tabIndex=i===index?0:-1;});
    try{
      let trace=routeCache.get(task.id);
      if(!trace){const response=await fetch(`assets/routing-${task.id}.json`);if(!response.ok)throw new Error("Trace unavailable");trace=await response.json();routeCache.set(task.id,trace);}
      if(request===routeRequest)showRouteTrace(trace);
    }catch{if(request===routeRequest)$("#route-timeline").textContent="Please select another task.";}
  }
  routeTabs.forEach((button,index)=>{
    button.addEventListener("click",()=>selectRoute(index));
    button.addEventListener("keydown",event=>{
      let next;
      if(event.key==="ArrowRight")next=(index+1)%routeTabs.length;
      if(event.key==="ArrowLeft")next=(index+routeTabs.length-1)%routeTabs.length;
      if(event.key==="Home")next=0;
      if(event.key==="End")next=routeTabs.length-1;
      if(next!==undefined){event.preventDefault();selectRoute(next);routeTabs[next].focus();}
    });
  });
  selectRoute(0);
  routeVideo.addEventListener("loadedmetadata",updateRoute);
  routeVideo.addEventListener("timeupdate",updateRoute);routeVideo.addEventListener("seeked",updateRoute);
  function stopRouteFrames(){
    if(routeFrameHandle!==null)routeVideo.cancelVideoFrameCallback?.(routeFrameHandle);
    routeFrameHandle=null;
  }
  function followRouteFrames(){
    if(!routeVideo.requestVideoFrameCallback || routeVideo.paused)return;
    routeFrameHandle=routeVideo.requestVideoFrameCallback((_,frame)=>{
      routeFrameHandle=null;updateRoute(frame.mediaTime);followRouteFrames();
    });
  }
  routeVideo.addEventListener("play",()=>{stopRouteFrames();followRouteFrames();});
  routeVideo.addEventListener("pause",stopRouteFrames);
  routeVideo.addEventListener("ended",()=>{stopRouteFrames();updateRoute();});
  const dialog=$("#figure-dialog");
  document.querySelectorAll("[data-image]").forEach(button=>button.addEventListener("click",()=>{$("#dialog-image").src=button.dataset.image;$("#dialog-image").alt=button.querySelector("img").alt;dialog.showModal();}));
  $("#dialog-close").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",event=>{const r=dialog.getBoundingClientRect();if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom)dialog.close();});
  const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)document.querySelectorAll(".site-header nav a").forEach(a=>{const active=a.getAttribute("href")==='#'+entry.target.id;a.classList.toggle("active",active);if(active)a.setAttribute("aria-current","location");else a.removeAttribute("aria-current");});}),{rootMargin:"-15% 0px -65% 0px"});
  document.querySelectorAll("main section[id]").forEach(s=>navObserver.observe(s));
})();
