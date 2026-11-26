/* Knockout variant — hero placement + menu, one-time entrance, scroll reveals. */
(function(){
  var root=document.documentElement;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function layout(){return getComputedStyle(root).getPropertyValue('--layout').trim()||'desktop';}

  /* 1. Hero: focal-point cover + menu. The ring cluster (video px 1041, 545)
        lands at x = 700 u and 37.5% down the area below the band, with at
        least 0.95x zoom; on compact layouts the bangles (rows > 956) never
        sit under the headline. */
  var stage=document.getElementById('stage');
  if(stage){
    var img=document.getElementById('photo'),band=stage.querySelector('.band');
    var IW=1920,IH=1080,FX=1041,FY=545,ZOOM=0.95,TX=700,BANGLES=956;
    var nav=stage.querySelector('.nav'),btn=document.getElementById('menuBtn'),
        links=document.getElementById('navLinks'),label=btn.querySelector('.menu-label');
    var place=function(){
      var W=stage.clientWidth,H=stage.clientHeight; if(!W||!H) return;
      var u=Math.min(W/1280,H/640), bh=band.getBoundingClientRect().height, compact=layout()!=='desktop';
      var s=Math.max(W/IW,H/IH,compact?Math.max(ZOOM*W/1280,H/BANGLES):ZOOM*u);
      var tx=compact?W*TX/1280:(W-1280*u)/2+TX*u, ty=bh+0.375*(H-bh);
      var l=tx-FX*s,t=ty-FY*s;
      l=Math.min(0,Math.max(W-IW*s,l)); t=Math.min(0,Math.max(H-IH*s,compact?H-BANGLES*s:-Infinity,t));
      img.style.width=IW*s+'px';img.style.height=IH*s+'px';img.style.left=l+'px';img.style.top=t+'px';
      img.classList.add('is-placed'); stage.style.setProperty('--band-h',bh+'px');
      if(!compact&&nav.classList.contains('is-open')) setMenu(false,false);
    };
    var setMenu=function(open,moveFocus){
      nav.classList.toggle('is-open',open); btn.setAttribute('aria-expanded',String(open)); label.textContent=open?'CLOSE':'MENU';
      if(moveFocus!==false){ if(open){var first=links.querySelector('a'); if(first) requestAnimationFrame(function(){first.focus({preventScroll:true})});} else btn.focus(); }
    };
    btn.addEventListener('click',function(){setMenu(!nav.classList.contains('is-open'))});
    links.addEventListener('click',function(e){if(e.target.closest('a')&&layout()!=='desktop')setMenu(false,false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('is-open'))setMenu(false)});
    document.addEventListener('pointerdown',function(e){if(nav.classList.contains('is-open')&&!nav.contains(e.target))setMenu(false,false)});
    if(reduce){img.removeAttribute('autoplay');img.pause();}
    else if('IntersectionObserver' in window){
      /* pause the video while the hero is scrolled out of view */
      new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting){var p=img.play(); if(p&&p.catch)p.catch(function(){});} else img.pause(); });}).observe(stage);
    }
    place(); addEventListener('resize',place); if(window.ResizeObserver) new ResizeObserver(place).observe(stage);
    if(document.fonts) document.fonts.ready.then(place);
  }

  /* 2. Entrance (Web Animations, runs once): letters fill left to right, then
        nav, tagline, headline, CTA and the impact row rise into place. */
  if(stage&&root.classList.contains('is-entering')){
    var EXPO='cubic-bezier(0.16,1,0.3,1)', QUART='cubic-bezier(0.76,0,0.24,1)';
    var vid=document.getElementById('photo');
    var waits=[document.fonts?document.fonts.ready:null,vid&&vid.decode?vid.decode().catch(function(){}):null].filter(Boolean);
    Promise.race([Promise.all(waits),new Promise(function(r){setTimeout(r,700)})]).then(function(){
      if(!root.classList.contains('is-entering')) return;
      window.__kxEntrance=true;
      var desk=layout()==='desktop', lift=desk?6:4, anims=[];
      var play=function(el,kf,t,d,e){ if(el) anims.push(el.animate(kf,{delay:t*1000,duration:d*1000,easing:e||EXPO,fill:'both'})); };
      var rise=function(px){ return [{opacity:0,transform:'translateY('+px+'px)'},{opacity:1,transform:'none'}]; };
      var q=function(s){return stage.querySelector(s)};
      var lids=stage.querySelectorAll('.lid'), step=Math.min(.06,.42/Math.max(1,lids.length-1));
      [].forEach.call(lids,function(l,i){
        play(l,[{opacity:1,transform:'scaleY(1)'},{opacity:1,transform:'scaleY(0)'}],.06+i*step,1.0,QUART);
      });
      (desk?[].slice.call(stage.querySelectorAll('.nav .col')):[q('.menu-btn')]).forEach(function(el,i){ play(el,rise(lift),.50+i*.06,.6); });
      play(q('.tagline'),rise(lift),.70,.6);
      play(q('.headline'),[{transform:'translateY(100%)',clipPath:'inset(-100% -8px 100% -8px)'},{transform:'none',clipPath:'inset(0 -8px 0 -8px)'}],.85,1.0);
      play(q('.nav .cta'),[{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],1.10,.75);
      play(q('.proof'),rise(lift+2),1.20,.7);
      play(q('.cue'),rise(lift),1.30,.7);
      root.classList.remove('is-entering');
      Promise.all(anims.map(function(a){return a.finished})).then(function(){ anims.forEach(function(a){a.cancel()}); },function(){});
    });
  }

  /* 3. Scroll reveals: [data-rv] elements rise in as they enter the viewport. */
  if(root.classList.contains('rv-on')){
    window.__kxReveal=true;
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } });
    },{rootMargin:'0px 0px -8% 0px',threshold:0.01});
    [].forEach.call(document.querySelectorAll('[data-rv]'),function(el){ io.observe(el); });
  }

  /* 4. Footer year */
  [].forEach.call(document.querySelectorAll('[data-year]'),function(el){ el.textContent=new Date().getFullYear(); });
})();
