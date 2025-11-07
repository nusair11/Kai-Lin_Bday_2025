    // PERSONALIZATION — set her name and your name here
    const HER_NAME = "Kai-Lin";     // ← change
    const YOUR_NAME = "Nusair";     // ← change

    // Typewriter lines
    const LINES = [
      `Happy birthday, Bunny!`,
      "Congraulations for another trip around the sun!",
      "Thank you for being you.",
      "I love you so much!",
      "I can't wait to see you again! (I wait)",
      "Happy birthday again!",
    ]
    // --- Basic helpers
    const qs = (s, el=document) => el.querySelector(s);
    const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));

    // Personalize text
    qs('#nameTarget').textContent = HER_NAME || 'Love';
    qs('#fromName').textContent = YOUR_NAME || 'Me';

    // Envelope open/close (defined later after confetti is initialized)
    const envelope = qs('#envelope');
    const openBtn = qs('#openBtn');
    const seal = qs('.seal');

    // Share button (copy URL)
    const shareBtn = qs('#shareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(location.href);
          toast('Link copied!');
        } catch (_) { alert('Link copied!'); }
      });
    }

    // Typewriter
    async function typeLines(lines) {
      const el = qs('#tw');
      console.log('typeLines called, el:', el, 'lines:', lines);
      if (!el) {
        console.error('Typewriter element #tw not found!');
        return;
      }
      el.textContent = '';
      el.style.display = 'inline-block';
      el.style.visibility = 'visible';
      el.style.opacity = '1';
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      for (let i=0; i<lines.length; i++) {
        el.textContent = '';
        console.log('Typing line', i, ':', lines[i]);
        for (const ch of lines[i]) {
          el.textContent += ch;
          await sleep(40 + Math.random()*40);
        }
        await sleep(900);
        if (i < lines.length - 1) await fadeBlink(el, 250);
      }
      el.style.borderRight = '0';
      console.log('Typewriter finished');
    }
    async function fadeBlink(el, dur=250) {
      el.style.opacity = .2; await new Promise(r => setTimeout(r, dur));
      el.style.opacity = 1;  await new Promise(r => setTimeout(r, dur));
    }

    // Confetti
    const confetti = (() => {
      const cv = qs('#confetti');
      if (!cv) {
        console.error('Confetti canvas not found!');
        return { start: () => {} };
      }
      const ctx = cv.getContext('2d');
      let W, H, pieces = [], animId;
      const colors = ['#ff7aa2', '#ffc857', '#7bdff2', '#c3f584'];
      const rand = (a,b) => Math.random()*(b-a)+a;
      const reset = () => { 
        W = cv.width = window.innerWidth; 
        H = cv.height = window.innerHeight;
        console.log('Canvas reset:', W, H);
      };
      const spawn = n => {
        for (let i=0;i<n;i++) pieces.push({
          x: rand(0, W), y: -10, r: rand(4,8), vx: rand(-1,1), vy: rand(6,10), rot: rand(0,Math.PI), color: colors[(Math.random()*colors.length)|0]
        });
        console.log('Spawned', n, 'confetti pieces');
      };
      const update = () => {
        ctx.clearRect(0,0,W,H);
        pieces.forEach(p => { p.x += p.vx; p.y += p.vy; p.rot += 0.05; p.vy *= 0.99; p.vx *= 0.99; });
        pieces = pieces.filter(p => p.y < H + 20);
        pieces.forEach(p => {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.r, -p.r/2, p.r*2, p.r);
          ctx.restore();
        });
        if (pieces.length) animId = requestAnimationFrame(update);
      };
      const start = () => { 
        console.log('Confetti starting!');
        cancelAnimationFrame(animId); 
        pieces = []; // Clear old pieces
        spawn(200); 
        update(); 
      };
      addEventListener('resize', reset, { passive: true });
      reset();
      return { start };
    })();
    
    // Now set up envelope opening after confetti is initialized
    const openEnvelope = () => {
      console.log('openEnvelope called!');
      const wasOpen = envelope.classList.contains('open');
      envelope.classList.toggle('open');
      if (!wasOpen) {
        console.log('Opening envelope - starting celebration!');
        confetti.start();
        typeLines(LINES);
      }
    };
    
    console.log('Setting up event listeners...');
    console.log('openBtn:', openBtn);
    console.log('seal:', seal);
    
    if (openBtn) {
      console.log('Adding click listener to openBtn');
      openBtn.addEventListener('click', openEnvelope);
    }
    if (seal) {
      console.log('Adding click listener to seal');
      seal.addEventListener('click', openEnvelope);
    }

    // Floating hearts background
    function makeHeart() {
      const e = document.createElement('div');
      e.className = 'heart'; e.textContent = '💖';
      e.style.left = Math.random()*100 + 'vw';
      e.style.animation = `floatUp ${6 + Math.random()*4}s linear`;
      e.style.fontSize = (18 + Math.random()*18) + 'px';
      document.body.appendChild(e);
      setTimeout(() => e.remove(), 11000);
    }
    setInterval(makeHeart, 1200);

    // Music controls
    const musicBtn = qs('#musicBtn');
    const bgm = qs('#bgm');
    let playing = false;
    if (musicBtn && bgm) {
      musicBtn.addEventListener('click', async () => {
        if (!bgm.src) {
          // Add your track URL here (must be same-origin or CORS-allowed). Example:
          // bgm.src = 'music.mp3';
        }
        try {
          if (!playing) { await bgm.play(); musicBtn.textContent = 'Pause music ❚❚'; }
          else { bgm.pause(); musicBtn.textContent = 'Play music ♪'; }
          playing = !playing;
        } catch (e) {
          toast('Autoplay blocked — tap again after interacting.');
        }
      });
    }

    // Lightbox gallery
    const lb = qs('#lightbox');
    const lbImg = qs('#lightbox img');
    if (lb && lbImg) {
      qsa('#gallery img').forEach(img => img.addEventListener('click', () => {
        lbImg.src = img.src; lb.classList.add('open');
      }));
      lb.addEventListener('click', () => lb.classList.remove('open'));
    }

    // Tiny toast
    function toast(msg) {
      const t = document.createElement('div');
      t.textContent = msg;
      Object.assign(t.style, {
        position:'fixed', left:'50%', bottom:'22px', transform:'translateX(-50%)', background:'#222', color:'#fff', padding:'10px 14px', borderRadius:'999px', boxShadow:'0 8px 20px rgba(0,0,0,.2)', zIndex: 20, opacity: 0
      });
      document.body.appendChild(t);
      requestAnimationFrame(()=>{ t.style.transition = 'opacity .3s ease'; t.style.opacity = 1; });
      setTimeout(()=>{ t.style.opacity = 0; setTimeout(()=>t.remove(), 300); }, 1600);
    }

    // Optional: auto-open on load for preview
    // setTimeout(() => openBtn.click(), 600);
