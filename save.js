/* Pixie Save-to-Photos button.
   Usage: <button class="btn save" data-src="LIGHT_SAVE_COPY.mp4" data-name="clip.mp4" data-open="FULL.mp4">Save to Photos</button>
   Downloads one clip at a time, on first tap only, with real progress. Second tap opens the iPhone share sheet. */
(function(){
  var cache={}, TIMEOUT=90000, RETRIES=2;
  function name(b){return b.dataset.name||'clip.mp4';}
  async function fetchOnce(b){
    var ctl=new AbortController(), t=setTimeout(function(){ctl.abort();},TIMEOUT);
    try{
      var r=await fetch(b.dataset.src,{mode:'cors',signal:ctl.signal,cache:'force-cache'});
      if(!r.ok) throw new Error('HTTP '+r.status);
      var total=+r.headers.get('content-length')||0, got=0, parts=[];
      if(r.body&&r.body.getReader){
        var rd=r.body.getReader();
        for(;;){var x=await rd.read(); if(x.done)break; parts.push(x.value); got+=x.value.length;
          clearTimeout(t); t=setTimeout(function(){ctl.abort();},TIMEOUT);
          b.textContent=total?('Preparing '+Math.min(99,Math.floor(got*100/total))+'%'):('Preparing '+(got/1048576).toFixed(1)+' MB');}
      } else { parts.push(await r.blob()); }
      return new File(parts,name(b),{type:'video/mp4'});
    } finally { clearTimeout(t); }
  }
  async function load(b){
    var u=b.dataset.src; if(cache[u]) return cache[u];
    var last;
    for(var i=0;i<=RETRIES;i++){
      try{ cache[u]=await fetchOnce(b); return cache[u]; }
      catch(e){ last=e; b.textContent='Retrying ('+(i+1)+')...'; }
    }
    throw last;
  }
  function download(b,f){var a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=name(b);document.body.appendChild(a);a.click();a.remove();}
  async function onTap(b){
    var f=cache[b.dataset.src];
    if(!f){
      if(b.dataset.busy) return; b.dataset.busy=1;
      try{ await load(b); b.textContent='Tap again to save'; }
      catch(e){ b.textContent='Failed, tap to retry'; }
      delete b.dataset.busy; return;
    }
    if(navigator.canShare&&navigator.canShare({files:[f]})){
      try{ await navigator.share({files:[f]}); b.textContent='Saved? Tap to save again'; }
      catch(e){ if(e.name!=='AbortError') download(b,f); else b.textContent='Tap again to save'; }
    } else { download(b,f); }
  }
  function init(){
    document.querySelectorAll('button.save').forEach(function(b){
      b.addEventListener('click',function(){onTap(b);});
      var href=b.dataset.open||b.dataset.src;
      var a=document.createElement('a'); a.href=href; a.target='_blank'; a.rel='noopener';
      a.textContent='Open video'; a.style.cssText='display:block;font-size:13px;margin:6px 0 10px;color:#b9a6d6';
      b.insertAdjacentElement('afterend',a);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
