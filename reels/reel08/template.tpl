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
      .tag { position: absolute; height: 40px; padding: 0 16px; border-radius: 20px; background: var(--lav-soft); color: #6d55b8; font-size: 22px; font-weight: 800; line-height: 40px; }

      /* hook: no connector -> build one */
      #hT1 { position: absolute; left: 0; top: 330px; width: 1080px; text-align: center; font-weight: 800; font-size: 84px; line-height: 1.2; }
      #hT1 span { color: var(--acc); }
      #plugA { position: absolute; left: 250px; top: 760px; font-size: 200px; }
      #plugB { position: absolute; left: 600px; top: 760px; width: 230px; height: 230px; border-radius: 52px; background: #fff; box-shadow: 0 30px 60px -20px rgba(60,40,110,.3); font-size: 40px; font-weight: 800; line-height: 230px; text-align: center; direction: ltr; }
      #hT2 { position: absolute; left: 0; top: 1080px; width: 1080px; text-align: center; font-weight: 800; font-size: 72px; }
      #hT2 span { font-family: "Aref Ruqaa"; color: var(--acc); }

      /* the skill */
      #skCard { left: 140px; top: 380px; width: 800px; height: 210px; padding: 40px 44px; direction: ltr; }
      #skCard b { display: block; font-family: var(--mono); font-size: 54px; }
      #skCard span { display: block; margin-top: 12px; font-size: 28px; color: var(--muted); }
      #tog { position: absolute; right: 44px; top: 76px; width: 100px; height: 56px; border-radius: 28px; background: #ddd6ee; }
      #tog i { position: absolute; left: 6px; top: 6px; width: 44px; height: 44px; border-radius: 50%; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,.15); }
      #mess { left: 140px; top: 700px; width: 380px; height: 330px; padding: 34px; font-family: var(--mono); font-size: 26px; color: var(--muted); direction: ltr; line-height: 1.6; }
      #messX { position: absolute; left: 150px; top: 850px; width: 360px; height: 22px; border-radius: 11px; background: var(--acc); }
      #neat { left: 560px; top: 700px; width: 380px; height: 330px; padding: 34px; font-family: var(--mono); font-size: 26px; direction: ltr; line-height: 1.6; }
      #neat em { font-style: normal; color: var(--ok); font-weight: 700; }
      #path { position: absolute; left: 0; top: 1110px; width: 1080px; text-align: center; }
      #path b { display: inline-block; padding: 14px 30px; border-radius: 22px; background: var(--ink); color: #fff; font-family: var(--mono); font-size: 32px; direction: ltr; }

      /* prompt */
      #chat { left: 90px; top: 380px; width: 900px; height: 820px; }
      #pIllu { right: 26px; top: 24px; }
      #prompt { position: absolute; right: 40px; top: 130px; width: 760px; padding: 30px 36px; border-radius: 30px 30px 8px 30px; background: var(--ink); color: #fff; font-size: 38px; font-weight: 500; line-height: 1.5; }
      #prompt b { color: #ffb59c; font-family: var(--mono); font-weight: 700; }
      #thinking { position: absolute; left: 40px; top: 520px; height: 56px; padding: 0 22px; border-radius: 16px; background: var(--lav-soft); font-family: var(--mono); font-size: 24px; line-height: 56px; color: #6d55b8; direction: ltr; }

      /* phases */
      #phT { position: absolute; left: 0; top: 320px; width: 1080px; text-align: center; font-weight: 800; font-size: 76px; }
      #phT span { color: var(--acc); }
      .ph { position: absolute; left: 140px; width: 800px; height: 150px; padding: 0 40px; display: flex; align-items: center; gap: 30px; }
      .ph i { font-style: normal; width: 84px; height: 84px; border-radius: 26px; background: var(--lav-soft); font-size: 44px; line-height: 84px; text-align: center; flex: none; }
      .ph b { font-size: 46px; font-weight: 800; }
      .ph em { font-style: normal; margin-right: auto; font-family: var(--mono); font-size: 34px; color: var(--muted); }
      #ph1 { top: 480px; } #ph2 { top: 660px; } #ph3 { top: 840px; } #ph4 { top: 1020px; }

      /* deploy + custom connector */
      #codeBox { left: 140px; top: 360px; width: 800px; height: 260px; padding: 34px 40px; background: var(--ink); color: #e9e4f5; font-family: var(--mono); font-size: 28px; line-height: 1.6; direction: ltr; }
      #codeBox em { font-style: normal; color: #ffb59c; }
      #arrow { position: absolute; left: 500px; top: 640px; font-size: 80px; color: var(--acc); }
      #url { left: 140px; top: 760px; width: 800px; height: 110px; border-radius: 30px; font-family: var(--mono); font-size: 34px; line-height: 110px; text-align: center; direction: ltr; }
      #url em { font-style: normal; color: var(--acc); }
      #dlg { left: 140px; top: 920px; width: 800px; height: 400px; padding: 40px 44px; direction: ltr; }
      #dlg h3 { font-size: 40px; font-weight: 800; }
      #dlg .crumb { margin-top: 6px; font-size: 24px; color: var(--muted); font-family: var(--mono); }
      #field { margin-top: 30px; height: 84px; border-radius: 20px; border: 3px solid #e7e2f1; font-family: var(--mono); font-size: 28px; line-height: 78px; padding: 0 24px; color: var(--muted); }
      #fieldTxt { color: var(--ink); }
      #addBtn { position: absolute; right: 44px; bottom: 40px; width: 180px; height: 76px; border-radius: 20px; background: var(--ink); color: #fff; font-size: 32px; font-weight: 800; line-height: 76px; text-align: center; }
      #dIllu { right: 44px; top: 40px; }
      #added { position: absolute; left: 340px; top: 1350px; width: 400px; height: 70px; border-radius: 24px; background: var(--ok); color: #fff; font-size: 32px; font-weight: 800; line-height: 70px; text-align: center; direction: ltr; }

      /* caution */
      #wT { position: absolute; left: 0; top: 360px; width: 1080px; text-align: center; font-weight: 800; font-size: 76px; line-height: 1.3; }
      #wT span { color: var(--acc); }
      #lvl { left: 240px; top: 720px; width: 600px; height: 120px; border-radius: 36px; font-size: 40px; font-weight: 800; line-height: 120px; text-align: center; }
      #shield { left: 190px; top: 900px; width: 700px; height: 150px; border-radius: 40px; background: var(--ink); color: #fff; font-size: 40px; font-weight: 800; line-height: 150px; text-align: center; }

      /* cta */
      #ctaT { position: absolute; left: 0; top: 380px; width: 1080px; text-align: center; font-weight: 800; font-size: 76px; line-height: 1.25; }
      #ctaT span { font-family: "Aref Ruqaa"; color: var(--acc); }
      #cmt { left: 150px; top: 700px; width: 780px; height: 190px; padding: 30px 36px; display: flex; gap: 26px; align-items: center; direction: rtl; }
      #cmt .av { width: 96px; height: 96px; border-radius: 50%; background: linear-gradient(135deg, var(--lav), var(--sky)); flex: none; }
      #cmt small { display: block; font-size: 26px; color: var(--muted); font-weight: 500; direction: ltr; text-align: right; }
      #cmt b { display: block; font-size: 64px; font-weight: 800; color: var(--ink); direction: ltr; text-align: right; }
      #heart { position: absolute; left: 50px; top: 66px; font-size: 54px; }
      #gift { left: 200px; top: 960px; width: 680px; height: 110px; border-radius: 34px; background: var(--acc); color: #fff; font-size: 38px; font-weight: 800; display: flex; align-items: center; justify-content: center; }

      .src { position: absolute; left: 0; top: 1800px; width: 1080px; text-align: center; font-size: 24px; color: var(--muted); font-weight: 500; }
      .src b { font-family: var(--mono); font-weight: 400; direction: ltr; unicode-bidi: isolate; }
      .cap-wrap { position: absolute; left: 0; top: 1440px; width: 1080px; }
      .cap { width: 1080px; text-align: center; font-weight: 800; font-size: 68px; line-height: 1.3; padding: 0 60px; }
      .w { display: inline-block; }
      .key { background: var(--acc); color: #fff; border-radius: 18px; padding: 0 20px 6px; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="__END__" data-width="1080" data-height="1920">
      <audio id="vo" class="clip" src="assets/vo.mp3" data-start="0" data-track-index="20" data-volume="1"></audio>
      <audio id="w1" class="clip" src="assets/whoosh.wav" data-start="SUB(W(12),.42)" data-track-index="21" data-volume="0.45"></audio>
      <audio id="w2" class="clip" src="assets/whoosh.wav" data-start="SUB(W(31),.42)" data-track-index="22" data-volume="0.4"></audio>
      <audio id="w3" class="clip" src="assets/whoosh.wav" data-start="SUB(W(43),.42)" data-track-index="23" data-volume="0.4"></audio>
      <audio id="w4" class="clip" src="assets/whoosh.wav" data-start="SUB(W(57),.42)" data-track-index="24" data-volume="0.4"></audio>
      <audio id="w5" class="clip" src="assets/whoosh.wav" data-start="SUB(W(76),.42)" data-track-index="25" data-volume="0.45"></audio>
      <audio id="w6" class="clip" src="assets/whoosh.wav" data-start="SUB(W(88),.42)" data-track-index="26" data-volume="0.45"></audio>
      <audio id="k1" class="clip" src="assets/pop.wav" data-start="W(26)" data-track-index="27" data-volume="0.5"></audio>
      <audio id="k2" class="clip" src="assets/tick.wav" data-start="W(48)" data-track-index="28" data-volume="0.4"></audio>
      <audio id="k3" class="clip" src="assets/tick.wav" data-start="W(50)" data-track-index="29" data-volume="0.4"></audio>
      <audio id="k4" class="clip" src="assets/tick.wav" data-start="W(52)" data-track-index="30" data-volume="0.4"></audio>
      <audio id="k5" class="clip" src="assets/tick.wav" data-start="W(55)" data-track-index="31" data-volume="0.4"></audio>
      <audio id="k6" class="clip" src="assets/pop.wav" data-start="W(75)" data-track-index="32" data-volume="0.5"></audio>
      <audio id="k7" class="clip" src="assets/pop.wav" data-start="ADD(W(89),.5)" data-track-index="33" data-volume="0.5"></audio>

      <div id="background" class="clip full" data-start="0" data-duration="__END__" data-track-index="0">
        <div id="bg"></div><div id="glow"></div><div id="handle">aymen.ai.lab</div>
      </div>

      <div id="sHook" class="clip full" data-start="0" data-duration="ADD(W(12),.1)" data-track-index="1">
        <div id="hT1">خدمتك <span>ما لها موصّل</span><br>في Claude؟</div>
        <div id="plugA">🔌</div><div id="plugB">?</div>
        <div id="hT2">ابنِ واحد <span>بنفسك</span></div>
      </div>

      <div id="sSkill" class="clip full" data-start="W(12)" data-duration="SPAN(12,31,.25)" data-track-index="2">
        <div id="skCard" class="card"><b>mcp-builder</b><span>Skill · by Anthropic</span><div id="tog"><i></i></div></div>
        <div id="mess" class="card">fetch(url)<br>// ???<br>try { … }<br>catch {}</div><div id="messX"></div>
        <div id="neat" class="card">server<br><em>✓</em> tools<br><em>✓</em> errors<br><em>✓</em> tests</div>
        <div id="path"><b>Customize › Skills</b></div>
      </div>

      <div id="sPrompt" class="clip full" data-start="W(31)" data-duration="SPAN(31,43,.25)" data-track-index="3">
        <div id="chat" class="card">
          <div id="pIllu" class="tag">رسم توضيحي</div>
          <div id="prompt">استخدم <b>mcp-builder</b> وابنِ خادم MCP لخدمتي، وابدأ بالبحث والتخطيط</div>
          <div id="thinking">✓ Reading mcp-builder…</div>
        </div>
      </div>

      <div id="sPhases" class="clip full" data-start="W(43)" data-duration="SPAN(43,57,.25)" data-track-index="4">
        <div id="phT"><span>4</span> مراحل</div>
        <div id="ph1" class="ph card"><i>🔍</i><b>بحث وتخطيط</b><em>01</em></div>
        <div id="ph2" class="ph card"><i>⌨️</i><b>كتابة الكود</b><em>02</em></div>
        <div id="ph3" class="ph card"><i>✅</i><b>مراجعة واختبار</b><em>03</em></div>
        <div id="ph4" class="ph card"><i>📊</i><b>تقييم الأدوات</b><em>04</em></div>
      </div>

      <div id="sDeploy" class="clip full" data-start="W(57)" data-duration="SPAN(57,76,.25)" data-track-index="5">
        <div id="codeBox" class="card">server.<em>ts</em><br>tools: search, create…<br>transport: <em>http</em></div>
        <div id="arrow">↓</div>
        <div id="url" class="card">https://<em>your-server</em>.com/mcp</div>
        <div id="dlg" class="card"><div id="dIllu" class="tag">رسم توضيحي</div><h3>Add custom connector</h3><div class="crumb">Connectors › +</div><div id="field"><span id="fieldTxt">https://your-server.com/mcp</span></div><div id="addBtn">Add</div></div>
        <div id="added">✓ Connector added</div>
      </div>

      <div id="sWarn" class="clip full" data-start="W(76)" data-duration="SPAN(76,88,.25)" data-track-index="6">
        <div id="wT">⚠️ <span>انتبه</span></div>
        <div id="lvl" class="card">🧑‍💻 تحتاج خبرة تقنية</div>
        <div id="shield" class="card">🛡 اربط بس اللي تثق فيه</div>
      </div>

      <div id="sCta" class="clip full" data-start="W(88)" data-duration="TAIL(88)" data-track-index="7">
        <div id="ctaT">تبي <span>البرومبت</span> كامل؟</div>
        <div id="cmt" class="card"><div class="av"></div><div><small>@you</small><b>BUILD</b></div><div id="heart"><span id="hW">🤍</span><span id="hR" style="position:absolute;left:0;top:0;opacity:0">❤️</span></div></div>
        <div id="gift" class="card">📋 أرسله لك في الخاص</div>
      </div>

      <div id="srcA" class="clip full" data-start="W(12)" data-duration="SPAN(12,57,0)" data-track-index="10"><div class="src">المصدر: <b>github.com/anthropics/skills</b> · mcp-builder</div></div>
      <div id="srcB" class="clip full" data-start="W(57)" data-duration="SPAN(57,88,0)" data-track-index="11"><div class="src">المصدر: <b>support.claude.com</b> · Custom connectors</div></div>
      <!--CAPTIONS-->
    </div>

    <script>
      const tl = gsap.timeline({ paused: true });
      tl.fromTo("#glow", { x: -60, y: 0 }, { x: 80, y: 160, duration: __END__, ease: "sine.inOut" }, 0);
      const out = (sel, t) => tl.to(sel, { y: -170, scale: .93, opacity: 0, filter: "blur(16px)", duration: .42, ease: "power3.in" }, t);
      const inn = (sel, t) => tl.fromTo(sel, { y: 220, opacity: 0, filter: "blur(16px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: .5, ease: "power3.out" }, t);
      const pop = (sel, t) => tl.fromTo(sel, { scale: .5, opacity: 0 }, { scale: 1, opacity: 1, duration: .38, ease: "back.out(2.2)" }, t);

      // hook: the plug finds nothing, then "build one yourself"
      inn("#hT1", .1);
      pop("#plugA", W(3)); pop("#plugB", W(3) + .15);
      tl.fromTo("#plugA", { x: 0 }, { x: 60, duration: .25, yoyo: true, repeat: 3, ease: "power1.inOut" }, W(4));
      inn("#hT2", W(6));
      tl.to("#plugB", { backgroundColor: "#ffd3bf", duration: .3 }, W(10));
      out(["#hT1", "#plugA", "#plugB", "#hT2"], W(12) - .45);

      // the skill: by Anthropic, structured not random, enabled in Customize > Skills
      tl.fromTo("#skCard", { y: 220, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: "power3.out" }, W(12) + .05);
      pop("#mess", W(23)); tl.fromTo("#messX", { scaleX: 0, rotation: -24, transformOrigin: "left center" }, { scaleX: 1, rotation: -24, duration: .3 }, W(25));
      pop("#neat", W(21));
      tl.fromTo("#path b", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .3, ease: "back.out(2)" }, W(27));
      tl.to("#tog", { backgroundColor: "#4fb38a", duration: .2 }, W(26)); tl.to("#tog i", { x: 44, duration: .25, ease: "back.out(2)" }, W(26));
      out(["#skCard", "#mess", "#messX", "#neat", "#path"], W(31) - .45);

      // the prompt
      tl.fromTo("#chat", { y: 220, opacity: 0, scale: 1.04 }, { y: 0, opacity: 1, scale: 1, duration: .55, ease: "power3.out" }, W(31) + .05);
      tl.fromTo("#prompt", { opacity: 0, y: 40, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .35, ease: "back.out(2)" }, W(34) - .1);
      tl.fromTo("#thinking", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .25 }, W(41));
      out("#chat", W(43) - .45);

      // four phases light up as they are named
      inn("#phT", W(43) + .05);
      tl.fromTo(".ph", { x: 160, opacity: 0 }, { x: 0, opacity: .45, duration: .35, ease: "power3.out", stagger: .08 }, W(46));
      [[1, W(48)], [2, W(50)], [3, W(52)], [4, W(55)]].forEach(([n, t]) => {
        tl.to("#ph" + n, { opacity: 1, scale: 1.04, boxShadow: "0 0 0 6px #e8775a", duration: .2 }, t);
        tl.to("#ph" + n + " i", { backgroundColor: "#ffd3bf", duration: .2 }, t);
      });
      out(["#phT", ".ph"], W(57) - .45);

      // the result is code; it needs a URL; then Add custom connector
      tl.fromTo("#codeBox", { y: 220, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: "power3.out" }, W(57) + .05);
      pop("#arrow", W(61)); pop("#url", W(63));
      tl.fromTo("#dlg", { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: .4, ease: "back.out(1.5)" }, W(67));
      tl.to(["#codeBox", "#arrow"], { opacity: 0, duration: .3 }, W(67));
      tl.to("#url", { y: -380, duration: .45, ease: "power3.inOut" }, W(67));
      tl.fromTo("#fieldTxt", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: .7, ease: "steps(10)" }, W(74));
      tl.to("#addBtn", { scale: .9, duration: .08, yoyo: true, repeat: 1 }, W(75));
      pop("#added", W(75) + .3);
      out(["#url", "#dlg", "#added"], W(76) - .45);

      // caution
      inn("#wT", W(76) + .05);
      pop("#lvl", W(80)); pop("#shield", W(82));
      out(["#wT", "#lvl", "#shield"], W(88) - .45);

      // cta
      inn("#ctaT", W(88) + .05);
      tl.fromTo("#cmt", { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: .4, ease: "back.out(1.6)" }, W(88) + .4);
      tl.fromTo("#cmt b", { scale: .4 }, { scale: 1, duration: .3, ease: "back.out(3)", transformOrigin: "right center" }, W(89));
      tl.set("#hW", { opacity: 0 }, W(89) + .5); tl.set("#hR", { opacity: 1 }, W(89) + .5);
      tl.fromTo("#heart", { scale: 1 }, { scale: 1.4, duration: .15, yoyo: true, repeat: 1 }, W(89) + .5);
      pop("#gift", W(92));

      /*CAPTION_TWEENS*/

      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
