/* calcflow 세트 공용 스크립트
   - 세트 안에서 입력값을 이어받기 (localStorage)
   - 결과 링크 공유 (입력값을 주소에 담기)
   - 세트 진행 바 / 다음 단계 카드 렌더 */
(function(){
"use strict";
var KEY="calcflow-profile";
if(!window.__cfAds){
  window.__cfAds=true;
  if(!window.CF_ADS){
    var slots=document.querySelectorAll(".ad-slot");
    for(var si=0;si<slots.length;si++) slots[si].parentNode.removeChild(slots[si]);
  }
}
var CF=window.CF={};

CF.getProfile=function(){
  try{return JSON.parse(localStorage.getItem(KEY)||"{}")||{}}catch(e){return {}}
};
CF.saveProfile=function(patch){
  try{
    var p=CF.getProfile();
    for(var k in patch){ if(patch[k]!==""&&patch[k]!=null) p[k]=patch[k]; }
    localStorage.setItem(KEY,JSON.stringify(p));
  }catch(e){}
};
CF.toast=function(msg){
  var t=document.getElementById("cf-toast");
  if(!t){t=document.createElement("div");t.id="cf-toast";t.className="toast";t.setAttribute("role","status");document.body.appendChild(t);}
  t.textContent=msg;t.classList.add("show");
  clearTimeout(CF._tt);
  CF._tt=setTimeout(function(){t.classList.remove("show")},2200);
};

/* 입력 필드 ↔ 주소 ↔ 프로필 연결 */
CF.linkFields=function(ids){
  var params=new URLSearchParams(location.search);
  var prof=CF.getProfile();
  var carried=false;
  ids.forEach(function(id){
    var el=document.getElementById(id);
    if(!el) return;
    var v=params.get(id);
    if(v===null&&prof[id]!=null&&prof[id]!==""){ v=prof[id]; }
    if(v!==null&&v!==""){ el.value=v; carried=true; }
    el.addEventListener("change",function(){
      var patch={}; patch[id]=el.value; CF.saveProfile(patch);
    });
  });
  var badge=document.getElementById("carry-badge");
  if(badge&&carried) badge.hidden=false;

  var btn=document.getElementById("share-link");
  if(btn){
    btn.addEventListener("click",function(){
      var q=new URLSearchParams();
      ids.forEach(function(id){
        var el=document.getElementById(id);
        if(el&&el.value!=="") q.set(id,el.value);
      });
      var url=location.origin+location.pathname+(q.toString()?"?"+q.toString():"");
      if(navigator.clipboard){
        navigator.clipboard.writeText(url).then(function(){CF.toast("결과 링크를 복사했어요. 그대로 보내면 같은 결과가 보여요.")},
          function(){CF.toast("복사에 실패했어요.")});
      }else{ CF.toast("이 브라우저에서는 복사를 지원하지 않아요."); }
    });
  }
};

/* 세트 진행 바 + 다음 단계 */
CF.renderSet=function(setKey,currentId,fieldIds){
  var sets=window.CALC_SETS||{};
  /* 한 계산기가 여러 세트에 속하면(예: 퇴직금 → 퇴사·알바), 주소의 set= 값이 우선 */
  var want=new URLSearchParams(location.search).get("set");
  if(want&&sets[want]&&sets[want].steps.some(function(s){return s.id===currentId})) setKey=want;
  var set=sets[setKey];
  if(!set) return;
  var bar=document.getElementById("set-bar");
  if(bar){
    bar.className="set-bar";
    bar.innerHTML='<span class="title">'+set.emoji+" "+set.name+' · 입력값이 다음 계산기로 이어져요</span>'+
      '<div class="set-steps">'+set.steps.map(function(s,i){
        var cur=s.id===currentId;
        return '<a href="'+s.path+'?set='+setKey+'"'+(cur?' aria-current="page"':"")+'><span class="n">'+(i+1)+'</span>'+s.title+'</a>';
      }).join("")+'</div>';
  }
  var idx=-1;
  set.steps.forEach(function(s,i){ if(s.id===currentId) idx=i; });
  var next=set.steps[idx+1];
  var box=document.getElementById("set-next");
  if(box&&next){
    box.className="set-next";
    box.innerHTML='<span class="t"><b>다음 단계 · '+next.title+'</b>'+next.hint+'</span>'+
      '<button class="btn" type="button" id="go-next">'+next.title+' 이어서 계산 →</button>';
    document.getElementById("go-next").addEventListener("click",function(){
      var q=new URLSearchParams(); q.set("set",setKey);
      (fieldIds||[]).forEach(function(id){
        var el=document.getElementById(id);
        if(el&&el.value!=="") q.set(id,el.value);
      });
      location.href=next.path+(q.toString()?"?"+q.toString():"");
    });
  }else if(box){
    box.className="set-next";
    box.innerHTML='<span class="t"><b>'+set.name+' 완료</b>계산이 모두 끝났어요. 결과 링크를 복사해 두면 나중에 그대로 다시 볼 수 있어요.</span>';
  }
};
})();
