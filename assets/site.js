/* calcflow 공통 스크립트: 테마 전환, 검색, 목록 렌더 */
(function(){
"use strict";
var THEME_KEY="calcflow-theme";

/* ---------- 테마 ---------- */
function applyTheme(t){
  if(t==="dark"||t==="light") document.documentElement.setAttribute("data-theme",t);
  else document.documentElement.removeAttribute("data-theme");
  var b=document.getElementById("theme-btn");
  if(b){
    var dark=t==="dark"||(t!=="light"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches);
    b.textContent=dark?"☀️":"🌙";
    b.setAttribute("aria-label",dark?"밝은 화면으로 전환":"어두운 화면으로 전환");
  }
}
var saved=null;
try{saved=localStorage.getItem(THEME_KEY)}catch(e){}
applyTheme(saved);
document.addEventListener("click",function(e){
  if(!e.target.closest||!e.target.closest("#theme-btn")) return;
  var cur=document.documentElement.getAttribute("data-theme");
  var isDark=cur==="dark"||(!cur&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches);
  var next=isDark?"light":"dark";
  try{localStorage.setItem(THEME_KEY,next)}catch(err){}
  applyTheme(next);
});

/* ---------- 광고 자리 (승인 전에는 숨김) ---------- */
if(!window.__cfAds){
  window.__cfAds=true;
  if(!window.CF_ADS){
    var slots=document.querySelectorAll(".ad-slot");
    for(var si=0;si<slots.length;si++) slots[si].parentNode.removeChild(slots[si]);
  }
}

/* ---------- 데이터 ---------- */
var CALCS=window.CALCS||[], CATS=window.CALC_CATS||[];
if(!window.CF_SHOW_SOON) CALCS=CALCS.filter(function(c){return c.status==="live"});
function catOf(k){for(var i=0;i<CATS.length;i++){if(CATS[i].key===k) return CATS[i];}return{name:"",emoji:""}}
function cardHTML(c){
  var soon=c.status!=="live";
  var badge=soon?'<span class="badge">준비 중</span>':(c.isNew?'<span class="badge new">NEW</span>':"");
  return '<a class="card'+(soon?" soon":"")+'" href="'+(soon?"#":c.path)+'"'+(soon?' aria-disabled="true" tabindex="-1"':"")+'>'+
    '<span class="emoji">'+c.emoji+'</span>'+
    '<span class="t"><b>'+c.name+badge+'</b><span>'+c.desc+'</span></span></a>';
}
function renderInto(el,list){ if(el) el.innerHTML=list.map(cardHTML).join(""); }

/* 홈 */
var popEl=document.getElementById("popular-cards");
if(popEl){
  var live=CALCS.filter(function(c){return c.status==="live"});
  var pop=CALCS.filter(function(c){return c.popular});
  renderInto(popEl,pop.slice(0,8));
  var host=document.getElementById("category-sections");
  if(host){
    host.innerHTML=CATS.map(function(cat){
      var items=CALCS.filter(function(c){return c.cat===cat.key});
      var extra=items.length>8?items.length-8:0;
      if(extra) items=items.filter(function(c){return c.popular}).concat(items.filter(function(c){return !c.popular})).slice(0,8);
      return '<section><div class="sec-head"><h2>'+cat.emoji+" "+cat.name+'</h2><p>'+cat.desc+'</p>'+
        '<a class="more" href="'+cat.path+'">'+(extra?"전체 "+(items.length+extra)+"개 보기 →":"전체 보기 →")+'</a></div>'+
        '<div class="cards">'+items.map(cardHTML).join("")+'</div></section>';
    }).join("");
  }
  var s1=document.getElementById("stat-live"), s2=document.getElementById("stat-total"), s3=document.getElementById("stat-cat");
  if(s1) s1.textContent=live.length;
  if(s2) s2.textContent=CALCS.length;
  if(s3) s3.textContent=CATS.length;
}

/* 카테고리 페이지 */
var catEl=document.getElementById("cat-cards");
if(catEl){
  var key=catEl.getAttribute("data-cat"), inCat=CALCS.filter(function(c){return c.cat===key}), G=window.CALC_GROUPS;
  if(G&&inCat.some(function(c){return c.group})){
    var wrap=document.createElement("div"); wrap.style.cssText="display:flex;flex-direction:column;gap:30px";
    wrap.innerHTML=Object.keys(G).map(function(g){
      var list=inCat.filter(function(c){return c.group===g}); if(!list.length) return "";
      return '<section><div class="sec-head"><h2>'+G[g].name+'</h2><p>'+G[g].desc+'</p></div><div class="cards">'+list.map(cardHTML).join("")+'</div></section>';
    }).join("");
    catEl.replaceWith(wrap);
  } else renderInto(catEl,inCat);
}

/* 관련 계산기 (같은 카테고리 중 live 3개) */
var relEl=document.getElementById("related-list");
if(relEl){
  var me=relEl.getAttribute("data-id");
  var mine=CALCS.filter(function(c){return c.id===me})[0];
  var rel=CALCS.filter(function(c){return c.status==="live"&&c.id!==me});
  rel.sort(function(a,b){return (a.cat===(mine&&mine.cat)?-1:0)-(b.cat===(mine&&mine.cat)?-1:0)});
  relEl.innerHTML=rel.slice(0,4).map(function(c){
    return '<a href="'+c.path+'">'+c.emoji+" "+c.name+'</a>';
  }).join("")+'<a href="/">전체 계산기 보기</a>';
}

/* ---------- 검색 ---------- */
var overlay=null,input=null,resultsEl=null,sel=0,matches=[];
function openSearch(initial){
  if(overlay) return;
  overlay=document.createElement("div");
  overlay.className="overlay";
  overlay.innerHTML='<div class="box" role="dialog" aria-label="계산기 검색">'+
    '<input type="text" id="search-input" placeholder="계산기 이름이나 키워드로 검색" autocomplete="off">'+
    '<div class="results" id="search-results"></div></div>';
  document.body.appendChild(overlay);
  input=document.getElementById("search-input");
  resultsEl=document.getElementById("search-results");
  input.value=initial||"";
  input.addEventListener("input",function(){sel=0;draw(this.value)});
  input.addEventListener("keydown",keys);
  overlay.addEventListener("click",function(e){if(e.target===overlay) closeSearch()});
  draw(input.value);
  input.focus();
}
function closeSearch(){ if(overlay){overlay.remove();overlay=null;} }
function keys(e){
  if(e.key==="Escape"){closeSearch();return;}
  if(e.key==="ArrowDown"){sel=Math.min(sel+1,matches.length-1);paint();e.preventDefault();}
  if(e.key==="ArrowUp"){sel=Math.max(sel-1,0);paint();e.preventDefault();}
  if(e.key==="Enter"&&matches[sel]){location.href=matches[sel].path;}
}
function score(c,q){
  var hay=(c.name+" "+c.desc+" "+c.kw).toLowerCase();
  return hay.indexOf(q)>=0?(c.name.toLowerCase().indexOf(q)>=0?0:1):-1;
}
function draw(q){
  q=(q||"").trim().toLowerCase();
  var list=CALCS.slice();
  if(q){
    list=list.map(function(c){return{c:c,s:score(c,q)}}).filter(function(o){return o.s>=0})
      .sort(function(a,b){return a.s-b.s}).map(function(o){return o.c});
  }else{
    list=list.filter(function(c){return c.popular||c.status==="live"});
  }
  matches=list.filter(function(c){return c.status==="live"}).concat(list.filter(function(c){return c.status!=="live"}));
  paint();
}
function paint(){
  if(!resultsEl) return;
  if(!matches.length){resultsEl.innerHTML='<div class="empty">찾는 계산기가 없어요. 다른 말로 검색해 보세요.</div>';return;}
  resultsEl.innerHTML=matches.map(function(c,i){
    var soon=c.status!=="live";
    return '<a href="'+(soon?"#":c.path)+'" class="'+(i===sel?"sel":"")+'">'+
      '<span>'+c.emoji+'</span><span>'+c.name+(soon?' <span class="badge">준비 중</span>':"")+'</span>'+
      '<span class="cat">'+catOf(c.cat).name+'</span></a>';
  }).join("");
}
document.addEventListener("click",function(e){
  var t=e.target.closest&&e.target.closest("#search-trigger");
  if(t){openSearch("");}
});
document.addEventListener("keydown",function(e){
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openSearch("");}
  if(e.key==="/"&&!/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)){e.preventDefault();openSearch("");}
});
var heroInput=document.getElementById("hero-search");
if(heroInput){
  heroInput.addEventListener("focus",function(){openSearch(this.value);this.blur();});
}
})();
