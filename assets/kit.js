/* calcflow 도구 공통 스크립트 — 파일 선택, 이미지 처리, 저장.
   모든 처리는 브라우저 안에서만 이뤄지고 파일은 어디로도 전송되지 않아요. */
(function(){
"use strict";
var K = {};

K.$ = function(s, r){ return (r||document).querySelector(s); };
K.$$ = function(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };

K.fmtBytes = function(n){
  if(n < 1024) return n + " B";
  if(n < 1048576) return (n/1024).toFixed(n < 10240 ? 1 : 0) + " KB";
  return (n/1048576).toFixed(2) + " MB";
};
K.baseName = function(name){ return String(name||"file").replace(/\.[^.]+$/, ""); };
K.extOf = function(type){
  return ({"image/jpeg":"jpg","image/png":"png","image/webp":"webp","image/gif":"gif","application/pdf":"pdf","application/zip":"zip"})[type] || "bin";
};
K.esc = function(s){ return String(s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]; }); };

/* 토스트 */
var toastEl = null, toastT = 0;
K.toast = function(msg){
  if(!toastEl){ toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role","status"); document.body.appendChild(toastEl); }
  toastEl.textContent = msg; toastEl.classList.add("show");
  clearTimeout(toastT); toastT = setTimeout(function(){ toastEl.classList.remove("show"); }, 2200);
};

/* 드롭존: el 안에 숨은 input을 만들고 클릭·드래그·붙여넣기로 파일 받기 */
K.dropzone = function(el, opt){
  opt = opt || {};
  var input = document.createElement("input");
  input.type = "file"; input.hidden = true;
  if(opt.accept) input.accept = opt.accept;
  if(opt.multiple) input.multiple = true;
  el.appendChild(input);
  el.setAttribute("tabindex","0"); el.setAttribute("role","button");
  function take(list){
    var files = Array.prototype.slice.call(list||[]);
    if(opt.filter) files = files.filter(opt.filter);
    if(!files.length){ if(list && list.length) K.toast(opt.rejectMsg || "지원하지 않는 파일 형식이에요."); return; }
    if(!opt.multiple) files = files.slice(0,1);
    opt.onFiles(files);
  }
  el.addEventListener("click", function(e){ if(e.target.closest("a,button:not(.drop-pick)")) return; input.click(); });
  el.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); input.click(); } });
  input.addEventListener("change", function(){ take(input.files); input.value = ""; });
  ["dragenter","dragover"].forEach(function(ev){ el.addEventListener(ev, function(e){ e.preventDefault(); el.classList.add("over"); }); });
  ["dragleave","drop"].forEach(function(ev){ el.addEventListener(ev, function(e){ e.preventDefault(); el.classList.remove("over"); }); });
  el.addEventListener("drop", function(e){ take(e.dataTransfer && e.dataTransfer.files); });
  if(opt.paste !== false){
    document.addEventListener("paste", function(e){
      var items = e.clipboardData && e.clipboardData.files;
      if(items && items.length) take(items);
    });
  }
  return { open: function(){ input.click(); } };
};
K.isImage = function(f){ return /^image\/(jpeg|png|webp|gif|bmp|avif)$/.test(f.type) || /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(f.name); };
K.isPdf = function(f){ return f.type === "application/pdf" || /\.pdf$/i.test(f.name); };

/* 이미지 불러오기 (EXIF 회전 반영) */
K.loadImage = function(file){
  return new Promise(function(res, rej){
    var url = URL.createObjectURL(file);
    var img = new Image();
    img.decoding = "async";
    img.onload = function(){ res({ img: img, url: url, name: file.name, type: file.type, size: file.size, w: img.naturalWidth, h: img.naturalHeight, file: file }); };
    img.onerror = function(){ URL.revokeObjectURL(url); rej(new Error("이미지를 열 수 없어요: " + file.name)); };
    img.src = url;
  });
};

K.canvas = function(w, h){
  var c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h));
  return c;
};

/* 고품질 축소: 절반씩 단계적으로 줄여서 계단 현상 줄이기 */
K.drawScaled = function(src, sw, sh, dw, dh){
  var cur = src, cw = sw, ch = sh;
  while(cw / 2 >= dw && ch / 2 >= dh){
    var step = K.canvas(cw/2, ch/2), sx = step.getContext("2d");
    sx.imageSmoothingQuality = "high";
    sx.drawImage(cur, 0, 0, cw, ch, 0, 0, step.width, step.height);
    cur = step; cw = step.width; ch = step.height;
  }
  var out = K.canvas(dw, dh), ctx = out.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(cur, 0, 0, cw, ch, 0, 0, out.width, out.height);
  return out;
};

K.fillBg = function(canvas, color){
  var c = K.canvas(canvas.width, canvas.height), x = c.getContext("2d");
  x.fillStyle = color || "#ffffff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(canvas, 0, 0);
  return c;
};

K.toBlob = function(canvas, type, quality){
  type = type || "image/png";
  if(type === "image/jpeg") canvas = K.fillBg(canvas, "#ffffff");
  return new Promise(function(res, rej){
    canvas.toBlob(function(b){ b ? res(b) : rej(new Error("이미지를 만들지 못했어요.")); }, type, quality);
  });
};

/* 목표 용량 이하가 될 때까지 품질을 이분 탐색 */
K.toBlobUnder = async function(canvas, type, maxBytes){
  var lo = 0.05, hi = 0.95, best = null;
  var first = await K.toBlob(canvas, type, hi);
  if(first.size <= maxBytes) return { blob: first, quality: hi };
  for(var i = 0; i < 8; i++){
    var mid = (lo + hi) / 2, b = await K.toBlob(canvas, type, mid);
    if(b.size <= maxBytes){ best = { blob: b, quality: mid }; lo = mid; } else { hi = mid; }
  }
  return best;
};

K.download = function(blob, filename){
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function(){ URL.revokeObjectURL(a.href); }, 4000);
};

var loaded = {};
K.loadScript = function(src){
  if(loaded[src]) return loaded[src];
  loaded[src] = new Promise(function(res, rej){
    var s = document.createElement("script"); s.src = src; s.onload = res;
    s.onerror = function(){ delete loaded[src]; rej(new Error("필요한 구성요소를 불러오지 못했어요. 네트워크를 확인해 주세요.")); };
    document.head.appendChild(s);
  });
  return loaded[src];
};

K.zip = async function(files, zipName){
  await K.loadScript("/assets/vendor/jszip.min.js");
  var z = new window.JSZip(), used = {};
  files.forEach(function(f){
    var n = f.name, i = 1;
    while(used[n]){ n = f.name.replace(/(\.[^.]+)?$/, "(" + (i++) + ")$1"); }
    used[n] = 1; z.file(n, f.blob);
  });
  var blob = await z.generateAsync({ type: "blob" });
  K.download(blob, zipName || "calcflow.zip");
};

/* 여러 파일 저장: 1개면 바로, 여러 개면 ZIP */
K.saveAll = async function(files, zipName){
  if(!files.length) return;
  if(files.length === 1) return K.download(files[0].blob, files[0].name);
  return K.zip(files, zipName);
};

K.pdfLib = async function(){ await K.loadScript("/assets/vendor/pdf-lib.min.js"); return window.PDFLib; };
K.pdfjs = async function(){
  var lib = await import("/assets/vendor/pdf.min.js");
  lib.GlobalWorkerOptions.workerSrc = "/assets/vendor/pdf.worker.min.js";
  return lib;
};

K.busy = function(btn, on, label){
  if(!btn) return;
  if(on){ btn.dataset.label = btn.textContent; btn.textContent = label || "처리 중…"; btn.disabled = true; }
  else { btn.textContent = btn.dataset.label || btn.textContent; btn.disabled = false; }
};

K.fail = function(err, box){
  var msg = (err && err.message) || String(err);
  if(box){ box.textContent = msg; box.hidden = false; } else K.toast(msg);
  if(window.console) console.warn(err);
};


/* ───────── 여러 이미지 일괄 처리 목록 ─────────
   K.batch({drop, list, run, save, zipName, process:async(item)=>({blob,name,w,h}), onLoad}) */
K.batch = function(o){
  var items = [], busy = false;
  function render(){
    o.list.innerHTML = items.map(function(it, i){
      var r = it.result, meta = it.info ? (it.info.w + "×" + it.info.h + " · " + K.fmtBytes(it.file.size)) : "불러오는 중…";
      var res = "";
      if(r){
        var pct = Math.round((1 - r.blob.size / it.file.size) * 100);
        res = ' → <span class="ok">' + (r.w ? r.w + "×" + r.h + " · " : "") + K.fmtBytes(r.blob.size) +
          (pct > 0 ? " (−" + pct + "%)" : pct < 0 ? " (+" + (-pct) + "%)" : "") + "</span>";
      } else if(it.err){ res = ' · <span style="color:var(--warn)">' + K.esc(it.err) + "</span>"; }
      return '<div class="fitem"><div class="th">' + (it.info ? '<img alt="" src="' + it.info.url + '">' : "🖼️") + '</div>' +
        '<div class="meta"><b>' + K.esc(r ? r.name : it.file.name) + '</b><span>' + meta + res + '</span></div>' +
        '<div class="acts"><button type="button" data-dl="' + i + '" title="저장" aria-label="저장"' + (r ? "" : " disabled") + '>⬇</button>' +
        '<button type="button" data-rm="' + i + '" title="빼기" aria-label="목록에서 빼기">✕</button></div></div>';
    }).join("");
    if(o.save){ o.save.disabled = !items.some(function(it){ return it.result; }); o.save.textContent = items.filter(function(it){return it.result}).length > 1 ? "전체 저장 (ZIP)" : "저장"; }
    if(o.run) o.run.disabled = !items.length || busy;
    if(o.onRender) o.onRender(items);
  }
  o.list.addEventListener("click", function(e){
    var d = e.target.closest("[data-dl]"), r = e.target.closest("[data-rm]");
    if(d){ var it = items[+d.dataset.dl]; if(it.result) K.download(it.result.blob, it.result.name); }
    if(r){ var rm = items.splice(+r.dataset.rm, 1)[0]; if(rm.info) URL.revokeObjectURL(rm.info.url); render(); }
  });
  K.dropzone(o.drop, { accept: o.accept || "image/*", multiple: true, filter: o.filter || K.isImage,
    onFiles: function(files){
      files.forEach(function(f){
        var it = { file: f, info: null, result: null };
        items.push(it);
        K.loadImage(f).then(function(info){ it.info = info; render(); if(o.onLoad) o.onLoad(it, items); if(o.auto) api.run(); })
          .catch(function(e){ it.err = e.message; render(); });
      });
      render();
    } });
  var api = {
    items: items,
    render: render,
    stale: function(){ items.forEach(function(it){ it.result = null; }); render(); },
    run: async function(){
      if(busy) return; busy = true; K.busy(o.run, true);
      try{
        for(var i = 0; i < items.length; i++){
          var it = items[i];
          if(!it.info) continue;
          try{ it.result = await o.process(it); it.err = null; }
          catch(e){ it.result = null; it.err = e.message; }
          render();
        }
      } finally { busy = false; K.busy(o.run, false); render(); }
    }
  };
  if(o.run) o.run.addEventListener("click", api.run);
  if(o.save) o.save.addEventListener("click", function(){
    K.saveAll(items.filter(function(it){ return it.result; }).map(function(it){ return { name: it.result.name, blob: it.result.blob }; }), o.zipName);
  });
  render();
  return api;
};

/* ───────── 자르기 상자 ─────────
   K.cropper(canvas, source, {ratio:null|number, onChange(rect)}) — rect는 원본 픽셀 기준 */
K.cropper = function(cv, src, opt){
  opt = opt || {};
  var ctx = cv.getContext("2d"), SW = src.naturalWidth || src.width, SH = src.naturalHeight || src.height;
  var scale = 1, ratio = opt.ratio || null, rect, drag = null, guide = opt.guide || null;
  function fit(){
    var box = cv.parentElement.getBoundingClientRect();
    var maxW = Math.max(200, box.width - 24), maxH = Math.max(240, window.innerHeight * 0.6);
    scale = Math.min(maxW / SW, maxH / SH, 1);
    var dpr = window.devicePixelRatio || 1;
    cv.style.width = Math.round(SW * scale) + "px"; cv.style.height = Math.round(SH * scale) + "px";
    cv.width = Math.round(SW * scale * dpr); cv.height = Math.round(SH * scale * dpr);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
    draw();
  }
  function initRect(){
    var w = SW * 0.8, h = SH * 0.8;
    if(ratio){ if(w / h > ratio) w = h * ratio; else h = w / ratio; }
    rect = { x: (SW - w) / 2, y: (SH - h) / 2, w: w, h: h };
  }
  function draw(){
    ctx.clearRect(0, 0, SW, SH);
    ctx.drawImage(src, 0, 0, SW, SH);
    ctx.fillStyle = "rgba(0,0,0,.5)";
    ctx.beginPath(); ctx.rect(0, 0, SW, SH); ctx.rect(rect.x, rect.y + rect.h, rect.w, -rect.h); ctx.fill("evenodd");
    var lw = 2 / scale;
    ctx.strokeStyle = "#fff"; ctx.lineWidth = lw; ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 1 / scale; ctx.beginPath();
    for(var k = 1; k < 3; k++){
      ctx.moveTo(rect.x + rect.w * k / 3, rect.y); ctx.lineTo(rect.x + rect.w * k / 3, rect.y + rect.h);
      ctx.moveTo(rect.x, rect.y + rect.h * k / 3); ctx.lineTo(rect.x + rect.w, rect.y + rect.h * k / 3);
    }
    ctx.stroke();
    if(guide) guide(ctx, rect, scale);
    var hs = 10 / scale; ctx.fillStyle = "#fff";
    corners().forEach(function(c){ ctx.fillRect(c[0] - hs / 2, c[1] - hs / 2, hs, hs); });
    if(opt.onChange) opt.onChange(api.get());
  }
  function corners(){ return [[rect.x, rect.y], [rect.x + rect.w, rect.y], [rect.x, rect.y + rect.h], [rect.x + rect.w, rect.y + rect.h]]; }
  function pos(e){ var b = cv.getBoundingClientRect(); return { x: (e.clientX - b.left) / scale, y: (e.clientY - b.top) / scale }; }
  function clamp(){
    rect.w = Math.min(Math.max(rect.w, 8), SW); rect.h = Math.min(Math.max(rect.h, 8), SH);
    rect.x = Math.min(Math.max(rect.x, 0), SW - rect.w); rect.y = Math.min(Math.max(rect.y, 0), SH - rect.h);
  }
  cv.addEventListener("pointerdown", function(e){
    var p = pos(e), tol = 16 / scale, cs = corners();
    for(var i = 0; i < 4; i++){ if(Math.abs(p.x - cs[i][0]) < tol && Math.abs(p.y - cs[i][1]) < tol){ drag = { type: "corner", i: i, ax: cs[3 - i][0], ay: cs[3 - i][1] }; break; } }
    if(!drag && p.x > rect.x && p.x < rect.x + rect.w && p.y > rect.y && p.y < rect.y + rect.h) drag = { type: "move", dx: p.x - rect.x, dy: p.y - rect.y };
    if(!drag){ drag = { type: "corner", i: 3, ax: p.x, ay: p.y }; }
    cv.setPointerCapture(e.pointerId); e.preventDefault();
  });
  cv.addEventListener("pointermove", function(e){
    var p = pos(e);
    if(!drag){
      var tol = 16 / scale, on = corners().some(function(c){ return Math.abs(p.x - c[0]) < tol && Math.abs(p.y - c[1]) < tol; });
      cv.style.cursor = on ? "nwse-resize" : (p.x > rect.x && p.x < rect.x + rect.w && p.y > rect.y && p.y < rect.y + rect.h ? "move" : "crosshair");
      return;
    }
    if(drag.type === "move"){ rect.x = p.x - drag.dx; rect.y = p.y - drag.dy; clamp(); draw(); return; }
    var px = Math.min(Math.max(p.x, 0), SW), py = Math.min(Math.max(p.y, 0), SH);
    var w = Math.abs(px - drag.ax), h = Math.abs(py - drag.ay);
    if(ratio){ if(w / h > ratio) h = w / ratio; else w = h * ratio; }
    var x = px < drag.ax ? drag.ax - w : drag.ax, y = py < drag.ay ? drag.ay - h : drag.ay;
    if(x < 0 || y < 0 || x + w > SW || y + h > SH){
      var maxW = px < drag.ax ? drag.ax : SW - drag.ax, maxH = py < drag.ay ? drag.ay : SH - drag.ay;
      var f = Math.min(1, maxW / w, maxH / h); w *= f; h *= f;
      x = px < drag.ax ? drag.ax - w : drag.ax; y = py < drag.ay ? drag.ay - h : drag.ay;
    }
    if(w >= 8 && h >= 8){ rect = { x: x, y: y, w: w, h: h }; draw(); }
  });
  function end(){ drag = null; }
  cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
  window.addEventListener("resize", function(){ if(cv.isConnected) fit(); });
  var api = {
    get: function(){ return { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.w), h: Math.round(rect.h) }; },
    set: function(r){ rect = { x: r.x, y: r.y, w: r.w, h: r.h }; clamp(); draw(); },
    setRatio: function(r){ ratio = r || null; initRect(); draw(); },
    setGuide: function(g){ guide = g; draw(); },
    full: function(){ rect = { x: 0, y: 0, w: SW, h: SH }; if(ratio){ ratio = null; } draw(); },
    redraw: draw, fit: fit
  };
  initRect(); fit();
  return api;
};

/* ───────── GIF 만들기 (gifenc, MIT) ─────────
   var g = await K.gif(); g.add(canvas, delayMs); var blob = g.finish(loop) */
K.gif = async function(opt){
  opt = opt || {};
  var m = await import("/assets/vendor/gifenc.esm.js");
  var enc = m.GIFEncoder();
  return {
    add: function(cv, delay){
      var ctx = cv.getContext("2d", { willReadFrequently: true });
      var data = ctx.getImageData(0, 0, cv.width, cv.height).data;
      var palette = m.quantize(data, 256, { format: "rgb444" });
      var index = m.applyPalette(data, palette, "rgb444");
      enc.writeFrame(index, cv.width, cv.height, { palette: palette, delay: delay, repeat: opt.loop === false ? -1 : 0 });
    },
    finish: function(){
      enc.finish();
      return new Blob([enc.bytes()], { type: "image/gif" });
    }
  };
};
K.seek = function(video, t){
  return new Promise(function(res){
    var done = false;
    function ok(){ if(done) return; done = true; video.removeEventListener("seeked", ok); res(); }
    video.addEventListener("seeked", ok);
    video.currentTime = t;
    setTimeout(ok, 1500);
  });
};
K.fmtTime = function(t){
  t = Math.max(0, t || 0); var m = Math.floor(t / 60), s = t - m * 60;
  return m + ":" + (s < 10 ? "0" : "") + s.toFixed(1);
};

window.CFK = K;
})();
