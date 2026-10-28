<!doctype html>
<html lang="ar" dir="rtl" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      @font-face { font-family: "Tajawal"; font-weight: 500; font-display: block; src: url("assets/fonts/Tajawal-500-arabic.woff2") format("woff2"); unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+200C-200E, U+FB50-FDFF, U+FE70-FEFF; }
      @font-face { font-family: "Tajawal"; font-weight: 500; font-display: block; src: url("assets/fonts/Tajawal-500-latin.woff2") format("woff2"); unicode-range: U+0000-00FF, U+2000-206F, U+2190-21FF; }
      @font-face { font-family: "Tajawal"; font-weight: 800; font-display: block; src: url("assets/fonts/Tajawal-800-arabic.woff2") format("woff2"); unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+200C-200E, U+FB50-FDFF, U+FE70-FEFF; }
      @font-face { font-family: "Tajawal"; font-weight: 800; font-display: block; src: url("assets/fonts/Tajawal-800-latin.woff2") format("woff2"); unicode-range: U+0000-00FF, U+2000-206F, U+2190-21FF; }
      @font-face { font-family: "Aref Ruqaa"; font-weight: 700; font-display: block; src: url("assets/fonts/ArefRuqaa-700-arabic.woff2") format("woff2"); unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+200C-200E, U+FB50-FDFF, U+FE70-FEFF; }
      :root { --lav: #c9b8ef; --lav-soft: #ece5fb; --sky: #bfe3f7; --sky-soft: #e3f3fc; --peach: #ffd3bf; --acc: #e8775a; --ink: #2b2540; --muted: #8a82a3; --ok: #4fb38a; --mono: "JetBrains Mono", monospace; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1080px; height: 1920px; overflow: hidden; background: var(--lav-soft); }
      #root { position: relative; width: 1080px; height: 1920px; font-family: "Tajawal", sans-serif; color: var(--ink); }
      .full { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; }
      #bg { position: absolute; inset: 0; background: linear-gradient(165deg, var(--lav-soft) 0%, #f1ecfc 45%, var(--sky-soft) 100%); }
      #glow { position: absolute; left: 140px; top: 420px; width: 800px; height: 800px; border-radius: 50%; background: radial-gradient(circle, rgba(255,211,191,.7) 0%, rgba(255,211,191,0) 70%); }
      #handle { position: absolute; left: 60px; top: 70px; font-weight: 800; font-size: 30px; color: var(--muted); direction: ltr; }
      .card { position: absolute; background: #fff; border-radius: 30px; box-shadow: 0 30px 60px -20px rgba(60,40,110,.28), 0 4px 12px rgba(60,40,110,.08); }

      /* hook title, then step pills in the same band */
      #hTitle { position: absolute; left: 0; top: 150px; width: 1080px; text-align: center; font-weight: 800; font-size: 74px; }
      #hTitle span { color: var(--acc); }
      #real { position: absolute; left: 380px; top: 258px; width: 320px; height: 50px; border-radius: 25px; background: var(--ink); color: #fff; font-size: 26px; font-weight: 800; line-height: 50px; text-align: center; }
      #real i { display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: #ff5a4f; margin-left: 10px; }
      #steps { position: absolute; left: 0; top: 170px; width: 1080px; display: flex; justify-content: center; gap: 26px; direction: rtl; }
      .st { width: 92px; height: 92px; border-radius: 30px; background: #fff; color: var(--muted); font-weight: 800; font-size: 44px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 24px -12px rgba(60,40,110,.4); }

      /* the screen: real recordings, cropped (no sidebar, no URL bar), zoomed by GSAP on .cam wrappers */
      #screen { left: 40px; top: 320px; width: 1000px; height: 926px; overflow: hidden; border: 6px solid #fff; }
      .cam { position: absolute; left: 0; top: 0; width: 1000px; height: 926px; }
      .cam video { position: absolute; left: 0; top: 0; width: 1000px; height: 926px; object-fit: cover; }
      #flash { position: absolute; left: 0; top: 0; width: 1000px; height: 926px; background: #ffd3bf; opacity: 0; }

      /* callout naming the exact button */
      .call { position: absolute; left: 0; top: 1268px; width: 1080px; text-align: center; }
      .call b { display: inline-block; padding: 14px 30px; border-radius: 22px; background: var(--ink); color: #fff; font-family: var(--mono); font-size: 30px; font-weight: 700; direction: ltr; }
      .call b em { font-style: normal; color: #ffb59c; }

      /* cta */
      #ctaT { position: absolute; left: 0; top: 380px; width: 1080px; text-align: center; font-weight: 800; font-size: 80px; line-height: 1.25; }
      #ctaT span { font-family: "Aref Ruqaa"; color: var(--acc); }
      #cmt { left: 150px; top: 700px; width: 780px; height: 190px; padding: 30px 36px; display: flex; gap: 26px; align-items: center; direction: rtl; }
      #cmt .av { width: 96px; height: 96px; border-radius: 50%; background: linear-gradient(135deg, var(--lav), var(--sky)); flex: none; }
      #cmt small { display: block; font-size: 26px; color: var(--muted); font-weight: 500; direction: ltr; text-align: right; }
      #cmt b { display: block; font-size: 64px; font-weight: 800; color: var(--ink); direction: ltr; text-align: right; }
      #heart { position: absolute; left: 50px; top: 66px; font-size: 54px; }
      #gift { left: 260px; top: 960px; width: 560px; height: 110px; border-radius: 34px; background: var(--acc); color: #fff; font-size: 40px; font-weight: 800; display: flex; align-items: center; justify-content: center; }

      .cap-wrap { position: absolute; left: 0; top: 1440px; width: 1080px; }
      .cap { width: 1080px; text-align: center; font-weight: 800; font-size: 68px; line-height: 1.3; padding: 0 60px; }
      .w { display: inline-block; }
      .key { background: var(--acc); color: #fff; border-radius: 18px; padding: 0 20px 6px; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="__END__" data-width="1080" data-height="1920">
      <audio id="vo" class="clip" src="assets/vo.mp3" data-start="0" data-track-index="20" data-volume="1"></audio>
      <audio id="w1" class="clip" src="assets/whoosh.wav" data-start="4.7" data-track-index="21" data-volume="0.45"></audio>
      <audio id="w2" class="clip" src="assets/whoosh.wav" data-start="11.85" data-track-index="22" data-volume="0.3"></audio>
      <audio id="w3" class="clip" src="assets/whoosh.wav" data-start="19.0" data-track-index="23" data-volume="0.3"></audio>
      <audio id="w4" class="clip" src="assets/whoosh.wav" data-start="32.2" data-track-index="24" data-volume="0.3"></audio>
      <audio id="w5" class="clip" src="assets/whoosh.wav" data-start="35.7" data-track-index="25" data-volume="0.3"></audio>
      <audio id="w6" class="clip" src="assets/whoosh.wav" data-start="40.0" data-track-index="26" data-volume="0.5"></audio>
      <audio id="k1" class="clip" src="assets/pop.wav" data-start="8.8" data-track-index="27" data-volume="0.55"></audio>
      <audio id="k2" class="clip" src="assets/pop.wav" data-start="34.4" data-track-index="28" data-volume="0.55"></audio>
      <audio id="k3" class="clip" src="assets/tick.wav" data-start="18.3" data-track-index="29" data-volume="0.45"></audio>
      <audio id="k4" class="clip" src="assets/pop.wav" data-start="43.2" data-track-index="30" data-volume="0.55"></audio>

      <div id="background" class="clip full" data-start="0" data-duration="__END__" data-track-index="0">
        <div id="bg"></div><div id="glow"></div><div id="handle">aymen.ai.lab</div>
      </div>

      <div id="sHook" class="clip full" data-start="0" data-duration="5.2" data-track-index="1">
        <div id="hTitle">خلّ Claude يبني لك <span>Skill</span></div>
        <div id="real"><i></i>تسجيل شاشة حقيقي</div>
      </div>
      <div id="sSteps" class="clip full" data-start="4.9" data-duration="35.5" data-track-index="2">
        <div id="steps"><div class="st" id="st1">1</div><div class="st" id="st2">2</div><div class="st" id="st3">3</div><div class="st" id="st4">4</div></div>
      </div>

      <div id="sScreen" class="full">
        <div id="screen" class="card">
          <div class="cam" id="cam0"><video id="v0" class="clip" src="assets/s10b.mp4" muted playsinline data-start="0" data-duration="5.0" data-track-index="10"></video></div>
          <div class="cam" id="cam1"><video id="v1" class="clip" src="assets/s1.mp4" muted playsinline data-start="5.2" data-duration="7.0" data-track-index="11"></video></div>
          <div class="cam" id="cam2"><video id="v2" class="clip" src="assets/s2.mp4" muted playsinline data-start="12.2" data-duration="2.0" data-media-start="0.3" data-track-index="12"></video></div>
          <div class="cam" id="cam3"><video id="v3" class="clip" src="assets/s3.mp4" muted playsinline data-start="14.2" data-duration="3.2" data-media-start="0.6" data-track-index="13"></video></div>
          <div class="cam" id="cam4"><video id="v4" class="clip" src="assets/s4.mp4" muted playsinline data-start="17.4" data-duration="2.0" data-media-start="0.6" data-track-index="14"></video></div>
          <div class="cam" id="cam5"><video id="v5" class="clip" src="assets/s5.mp4" muted playsinline data-start="19.4" data-duration="5.5" data-track-index="15"></video></div>
          <div class="cam" id="cam6"><video id="v6" class="clip" src="assets/s6.mp4" muted playsinline data-start="24.9" data-duration="4.0" data-playback-rate="1.25" data-track-index="16"></video></div>
          <div class="cam" id="cam7"><video id="v7" class="clip" src="assets/s7.mp4" muted playsinline data-start="28.9" data-duration="3.7" data-playback-rate="1.35" data-track-index="17"></video></div>
          <div class="cam" id="cam8"><video id="v8" class="clip" src="assets/s8.mp4" muted playsinline data-start="32.6" data-duration="2.3" data-media-start="1.0" data-track-index="18"></video></div>
          <div class="cam" id="cam9"><video id="v9" class="clip" src="assets/s9.mp4" muted playsinline data-start="34.9" data-duration="1.2" data-media-start="0.5" data-track-index="19"></video></div>
          <div class="cam" id="cam10"><video id="v10" class="clip" src="assets/s10a.mp4" muted playsinline data-start="36.1" data-duration="2.0" data-playback-rate="1.5" data-track-index="31"></video></div>
          <div class="cam" id="cam11"><video id="v11" class="clip" src="assets/s10b.mp4" muted playsinline data-start="38.1" data-duration="2.4" data-track-index="32"></video></div>
          <div id="flash"></div>
        </div>
      </div>

      <div id="c1" class="clip call" data-start="5.6" data-duration="6.5" data-track-index="5"><b>Settings › Capabilities › <em>Run code in the cloud</em></b></div>
      <div id="c2" class="clip call" data-start="12.4" data-duration="6.9" data-track-index="5"><b>Customize › Skills › <em>skill-creator</em></b></div>
      <div id="c3" class="clip call" data-start="19.6" data-duration="5.2" data-track-index="5"><b>New chat › <em>اطلب المهارة</em></b></div>
      <div id="c4" class="clip call" data-start="25.1" data-duration="7.4" data-track-index="5"><b>Claude ✍ <em>SKILL.md</em></b></div>
      <div id="c5" class="clip call" data-start="32.8" data-duration="3.2" data-track-index="5"><b><em>Save skill</em> ✓</b></div>
      <div id="c6" class="clip call" data-start="36.3" data-duration="4.0" data-track-index="5"><b><em>Loaded skill</em> ✓</b></div>

      <div id="sCta" class="clip full" data-start="40.3" data-duration="5.3" data-track-index="4">
        <div id="ctaT">تبي مهارة كابشن <span>جاهزة</span>؟</div>
        <div id="cmt" class="card"><div class="av"></div><div><small>@you</small><b>SKILL</b></div><div id="heart"><span id="hW">🤍</span><span id="hR" style="position:absolute;left:0;top:0;opacity:0">❤️</span></div></div>
        <div id="gift" class="card">🎁 أرسلها لك في الخاص</div>
      </div>

      <!--CAPTIONS-->
    </div>

    <script>
      const tl = gsap.timeline({ paused: true });
      tl.fromTo("#glow", { x: -60, y: 0 }, { x: 80, y: 160, duration: __END__, ease: "sine.inOut" }, 0);

      // hook: the finished result first, then the steps that got there
      tl.fromTo("#hTitle", { y: 40, opacity: 0, filter: "blur(10px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: .5, ease: "power3.out" }, .1);
      tl.fromTo("#real", { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, duration: .35, ease: "back.out(2.4)" }, .5);
      tl.fromTo("#screen", { y: 260, opacity: 0, scale: 1.04 }, { y: 0, opacity: 1, scale: 1, duration: .6, ease: "power3.out" }, .15);
      tl.fromTo("#cam0", { scale: 1.25, transformOrigin: "60% 30%" }, { scale: 1.45, duration: 4.8, ease: "sine.inOut" }, .2);
      tl.to(["#hTitle", "#real"], { y: -80, opacity: 0, filter: "blur(12px)", duration: .35, ease: "power3.in" }, 4.75);
      tl.fromTo(".st", { scale: 0 }, { scale: 1, duration: .3, ease: "back.out(2.4)", stagger: .06 }, 5.0);

      // shared cut: a peach flash on the screen at each section change
      [5.2, 12.2, 19.4, 32.6, 36.1].forEach(t => tl.fromTo("#flash", { opacity: .85 }, { opacity: 0, duration: .35, ease: "power2.out", immediateRender: false }, t));
      // step pills: current in accent, done in green
      const step = (n, t) => {
        tl.to("#st" + n, { backgroundColor: "#e8775a", color: "#ffffff", scale: 1.12, duration: .25, ease: "back.out(2)" }, t);
        if (n > 1) tl.to("#st" + (n - 1), { backgroundColor: "#4fb38a", color: "#ffffff", scale: 1, duration: .25 }, t);
      };
      step(1, 5.2); step(2, 12.48); step(3, 19.3); step(4, 32.63);
      tl.to("#st4", { backgroundColor: "#4fb38a", scale: 1, duration: .25 }, 36.0);

      // camera on each recording (card coords 1000x926)
      // label first, then pan to its toggle as it switches on
      tl.fromTo("#cam1", { scale: 1, transformOrigin: "2% 86%" }, { scale: 1.55, duration: .9, ease: "power2.inOut" }, 7.2);
      tl.to("#cam1", { transformOrigin: "97% 86%", duration: .7, ease: "power2.inOut" }, 8.2);
      tl.to("#cam1", { scale: 1.65, duration: 3.2, ease: "none" }, 8.9);
      tl.fromTo("#cam2", { scale: 1.06, transformOrigin: "30% 20%" }, { scale: 1.16, duration: 2, ease: "none" }, 12.2);
      tl.fromTo("#cam3", { scale: 1.1, transformOrigin: "72% 12%" }, { scale: 1.65, duration: .8, ease: "power2.inOut" }, 14.3);
      tl.to("#cam3", { scale: 1.4, transformOrigin: "40% 30%", duration: 1.2, ease: "power2.inOut" }, 15.9);
      tl.fromTo("#cam4", { scale: 1.2, transformOrigin: "55% 20%" }, { scale: 1.75, transformOrigin: "94% 14%", duration: .9, ease: "power2.inOut" }, 17.5);
      tl.fromTo("#cam5", { scale: 1.1, transformOrigin: "74% 8%" }, { scale: 1.7, duration: 1.0, ease: "power2.inOut" }, 20.8);
      tl.to("#cam5", { scale: 1.8, duration: 3.0, ease: "none" }, 21.8);
      tl.fromTo("#cam6", { scale: 1.35, transformOrigin: "72% 0%" }, { scale: 1.55, duration: 4, ease: "none" }, 24.9);
      tl.fromTo("#cam7", { scale: 1.15, transformOrigin: "50% 10%" }, { scale: 1.45, duration: 3.7, ease: "sine.inOut" }, 28.9);
      tl.fromTo("#cam8", { scale: 1.1, transformOrigin: "77% 71%" }, { scale: 1.8, duration: .9, ease: "power2.inOut" }, 33.3);
      tl.fromTo("#cam9", { scale: 1.3, transformOrigin: "10% 50%" }, { scale: 1.5, duration: 1.2, ease: "none" }, 34.9);
      tl.fromTo("#cam10", { scale: 1.35, transformOrigin: "70% 10%" }, { scale: 1.5, duration: 2, ease: "none" }, 36.1);
      tl.fromTo("#cam11", { scale: 1.3, transformOrigin: "60% 25%" }, { scale: 1.55, duration: 2.4, ease: "sine.inOut" }, 38.1);
      tl.to("#screen", { y: -170, scale: .93, opacity: 0, filter: "blur(16px)", duration: .42, ease: "power3.in" }, 40.0);

      // callouts pop in
      ["#c1", "#c2", "#c3", "#c4", "#c5", "#c6"].forEach((c, i) => tl.fromTo(c + " b", { y: 30, opacity: 0, scale: .9 }, { y: 0, opacity: 1, scale: 1, duration: .3, ease: "back.out(2)" }, [5.6, 12.4, 19.6, 25.1, 32.8, 36.3][i]));

      // cta
      tl.fromTo("#ctaT", { y: 220, opacity: 0, filter: "blur(16px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: .55, ease: "power3.out" }, 40.4);
      tl.fromTo("#cmt", { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: .4, ease: "back.out(1.6)" }, 41.6);
      tl.fromTo("#cmt b", { scale: .4 }, { scale: 1, duration: .3, ease: "back.out(3)", transformOrigin: "right center" }, 42.3);
      tl.set("#hW", { opacity: 0 }, 43.2); tl.set("#hR", { opacity: 1 }, 43.2);
      tl.fromTo("#heart", { scale: 1 }, { scale: 1.4, duration: .15, yoyo: true, repeat: 1 }, 43.2);
      tl.fromTo("#gift", { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: .4, ease: "back.out(2.4)" }, 43.6);

      /*CAPTION_TWEENS*/

      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
