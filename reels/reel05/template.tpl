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

      /* hook */
      #hTitle { position: absolute; left: 0; top: 380px; width: 1080px; text-align: center; font-weight: 800; font-size: 96px; line-height: 1.2; }
      #hTitle span { font-family: "Aref Ruqaa"; color: var(--acc); }
      #clock { position: absolute; left: 390px; top: 700px; width: 300px; height: 300px; }
      #clockTxt { position: absolute; left: 0; top: 1040px; width: 1080px; text-align: center; font-weight: 800; font-size: 64px; }
      #clockTxt b { color: var(--acc); }

      /* step pills */
      #steps { position: absolute; left: 0; top: 200px; width: 1080px; display: flex; justify-content: center; gap: 26px; direction: rtl; }
      .st { width: 92px; height: 92px; border-radius: 30px; background: #fff; color: var(--muted); font-weight: 800; font-size: 44px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 24px -12px rgba(60,40,110,.4); }

      /* app window */
      #win { left: 90px; top: 340px; width: 900px; height: 1000px; overflow: hidden; direction: ltr; }
      #bar { position: absolute; left: 0; top: 0; width: 900px; height: 84px; display: flex; align-items: center; gap: 12px; padding: 0 30px; border-bottom: 2px solid #f0ecf8; }
      #bar i { width: 16px; height: 16px; border-radius: 50%; background: #ddd6ee; }
      #bar i:first-child { background: var(--acc); }
      .crumb { position: absolute; left: 130px; top: 22px; font-weight: 800; font-size: 32px; color: var(--ink); white-space: nowrap; }
      .crumb em { font-style: normal; color: var(--muted); font-weight: 500; }
      .pane { position: absolute; left: 0; top: 84px; width: 900px; height: 916px; }

      /* pane 1: settings */
      #p1 .side { position: absolute; left: 0; top: 0; width: 260px; height: 916px; background: #faf8fe; padding: 40px 30px; }
      #p1 .side div { height: 64px; line-height: 64px; padding: 0 20px; border-radius: 16px; font-size: 28px; color: var(--muted); font-weight: 500; }
      #p1 .side .on { background: var(--lav-soft); color: var(--ink); font-weight: 800; }
      #p1 h2 { position: absolute; left: 310px; top: 50px; font-size: 44px; font-weight: 800; }
      #row1 { position: absolute; left: 310px; top: 150px; width: 540px; height: 150px; border-radius: 24px; border: 3px solid #eee8f8; padding: 26px 28px; }
      #row1 b { display: block; font-size: 30px; font-weight: 800; width: 380px; }
      #row1 span { display: block; margin-top: 8px; font-size: 22px; color: var(--muted); width: 380px; }
      .tog { position: absolute; width: 100px; height: 56px; border-radius: 28px; background: #ddd6ee; }
      .tog i { position: absolute; left: 6px; top: 6px; width: 44px; height: 44px; border-radius: 50%; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,.15); }
      #tog1 { right: 26px; top: 46px; }
      #row1b { position: absolute; left: 310px; top: 330px; width: 540px; height: 110px; border-radius: 24px; background: #faf8fe; }
      #row1c { position: absolute; left: 310px; top: 460px; width: 540px; height: 110px; border-radius: 24px; background: #faf8fe; }

      /* pane 2: files */
      #fold { position: absolute; left: 250px; top: 120px; width: 400px; height: 300px; }
      #fold .tb { position: absolute; left: 24px; top: 0; width: 160px; height: 64px; border-radius: 20px; background: #b39ce6; }
      #fold .bk { position: absolute; left: 0; top: 32px; width: 400px; height: 268px; border-radius: 26px; background: #b39ce6; }
      #fold .fr { position: absolute; left: 0; top: 100px; width: 400px; height: 200px; border-radius: 26px; background: var(--lav); }
      #zipper { position: absolute; left: 186px; top: 100px; width: 28px; height: 200px; background: repeating-linear-gradient(180deg, #2b2540 0 10px, #fff 10px 20px); border-radius: 6px; }
      #foldName { position: absolute; left: 0; top: 450px; width: 900px; text-align: center; font-family: var(--mono); font-size: 34px; font-weight: 700; }
      #fileRow { position: absolute; left: 230px; top: 540px; width: 440px; height: 100px; border-radius: 22px; border: 3px solid #eee8f8; display: flex; align-items: center; gap: 18px; padding: 0 26px; font-family: var(--mono); font-size: 32px; }
      #fileRow i { width: 40px; height: 50px; border-radius: 8px; background: var(--acc); }
      #zipBadge { position: absolute; left: 560px; top: 150px; height: 70px; padding: 0 26px; border-radius: 20px; background: var(--ink); color: #fff; font-family: var(--mono); font-weight: 700; font-size: 34px; line-height: 70px; }

      /* pane 3: customize > skills */
      #p3 h2 { position: absolute; left: 50px; top: 50px; font-size: 48px; font-weight: 800; }
      #plus { position: absolute; right: 50px; top: 44px; width: 76px; height: 76px; border-radius: 22px; background: var(--ink); color: #fff; font-size: 52px; font-weight: 800; line-height: 70px; text-align: center; }
      #empty { position: absolute; left: 50px; top: 170px; width: 800px; height: 140px; border-radius: 24px; border: 3px dashed #ddd6ee; color: var(--muted); font-size: 30px; display: flex; align-items: center; justify-content: center; }
      #menu { position: absolute; right: 50px; top: 136px; width: 400px; padding: 14px; border-radius: 24px; background: #fff; box-shadow: 0 24px 50px -16px rgba(43,37,64,.45); }
      #menu div { height: 72px; line-height: 72px; padding: 0 22px; border-radius: 16px; font-size: 30px; font-weight: 800; }
      #mi2 { margin-left: 30px; }
      #drop { position: absolute; left: 50px; top: 360px; width: 800px; height: 300px; border-radius: 28px; border: 4px dashed var(--lav); background: #faf8fe; }
      #drop p { position: absolute; left: 0; top: 40px; width: 800px; text-align: center; font-size: 30px; color: var(--muted); }
      #zipCard { position: absolute; left: 230px; top: 470px; width: 440px; height: 100px; border-radius: 22px; background: #fff; box-shadow: 0 16px 30px -12px rgba(60,40,110,.4); display: flex; align-items: center; gap: 18px; padding: 0 26px; font-family: var(--mono); font-size: 28px; }
      #zipCard i { width: 40px; height: 50px; border-radius: 8px; background: var(--ink); }
      #prog { position: absolute; left: 90px; top: 610px; width: 720px; height: 14px; border-radius: 7px; background: var(--acc); }
      #skRow { position: absolute; left: 50px; top: 170px; width: 800px; height: 140px; border-radius: 24px; border: 3px solid #eee8f8; background: #fff; padding: 28px 30px; }
      #skRow b { display: block; font-family: var(--mono); font-size: 32px; }
      #skRow span { display: block; margin-top: 8px; font-size: 24px; color: var(--muted); }
      #tog2 { right: 30px; top: 42px; }

      /* pane 4: chat */
      #user { position: absolute; right: 40px; top: 420px; max-width: 640px; padding: 26px 32px; border-radius: 30px 30px 8px 30px; background: var(--ink); color: #fff; font-size: 34px; font-weight: 500; direction: rtl; }
      #used { position: absolute; left: 40px; top: 560px; height: 54px; padding: 0 20px; border-radius: 16px; background: var(--lav-soft); font-family: var(--mono); font-size: 22px; line-height: 54px; color: #6d55b8; }
      #reply { position: absolute; left: 40px; top: 640px; width: 640px; padding: 28px 30px; border-radius: 30px 30px 30px 8px; background: #faf8fe; }
      #reply i { display: block; height: 16px; border-radius: 8px; background: var(--lav); margin-bottom: 18px; }

      /* warning */
      #warnT { position: absolute; left: 0; top: 330px; width: 1080px; text-align: center; font-weight: 800; font-size: 76px; }
      #warnT span { color: var(--acc); }
      .nm { position: absolute; left: 140px; width: 800px; height: 150px; padding: 26px 36px; direction: ltr; }
      .nm small { display: block; font-size: 24px; color: var(--muted); font-weight: 500; }
      .nm b { display: block; margin-top: 8px; font-family: var(--mono); font-size: 40px; }
      #nmA { top: 560px; } #nmB { top: 860px; }
      #eq { position: absolute; left: 470px; top: 725px; width: 140px; height: 120px; text-align: center; font-size: 100px; font-weight: 800; color: var(--ok); line-height: 120px; }

      /* cta */
      #ctaT { position: absolute; left: 0; top: 380px; width: 1080px; text-align: center; font-weight: 800; font-size: 80px; line-height: 1.25; }
      #ctaT span { font-family: "Aref Ruqaa"; color: var(--acc); }
      #cmt { left: 150px; top: 700px; width: 780px; height: 190px; padding: 30px 36px; display: flex; gap: 26px; align-items: center; direction: rtl; }
      #cmt .av { width: 96px; height: 96px; border-radius: 50%; background: linear-gradient(135deg, var(--lav), var(--sky)); flex: none; }
      #cmt small { display: block; font-size: 26px; color: var(--muted); font-weight: 500; direction: ltr; text-align: right; }
      #cmt b { display: block; font-size: 64px; font-weight: 800; color: var(--ink); direction: ltr; text-align: right; }
      #heart { position: absolute; left: 50px; top: 66px; font-size: 54px; }
      #gift { left: 260px; top: 960px; width: 560px; height: 110px; border-radius: 34px; background: var(--acc); color: #fff; font-size: 40px; font-weight: 800; display: flex; align-items: center; justify-content: center; }

      #cursor { position: absolute; left: 0; top: 0; width: 80px; height: 80px; }
      .cap-wrap { position: absolute; left: 0; top: 1440px; width: 1080px; }
      .cap { width: 1080px; text-align: center; font-weight: 800; font-size: 70px; line-height: 1.3; padding: 0 70px; }
      .w { display: inline-block; }
      .key { background: var(--acc); color: #fff; border-radius: 18px; padding: 0 20px 6px; }
            /* what is a skill */
      #dT { position: absolute; left: 0; top: 300px; width: 1080px; text-align: center; font-weight: 800; font-size: 84px; }
      #dT span { color: var(--acc); }
      #dFold { position: absolute; left: 120px; top: 480px; width: 840px; height: 720px; }
      #dFold .tb { position: absolute; left: 30px; top: 0; width: 460px; height: 80px; border-radius: 24px; background: #b39ce6; }
      #dFold .bk { position: absolute; left: 0; top: 40px; width: 840px; height: 680px; border-radius: 34px; background: var(--lav); }
      #dFold .lb { position: absolute; left: 40px; top: 3px; font-family: var(--mono); font-size: 24px; font-weight: 700; color: #fff; direction: ltr; }
      #dDoc { left: 170px; top: 580px; width: 740px; height: 580px; padding: 34px 40px; direction: ltr; font-family: var(--mono); }
      #dDoc h4 { font-size: 26px; color: var(--muted); font-weight: 700; }
      #dMeta { margin-top: 20px; padding: 18px 22px; border-radius: 18px; background: var(--lav-soft); font-size: 27px; line-height: 1.6; }
      #dMeta em { font-style: normal; color: #6d55b8; font-weight: 700; }
      #dMeta .ar { font-family: "Tajawal", sans-serif; direction: rtl; unicode-bidi: isolate; }
      #dBody { margin-top: 26px; }
      #dBody p { font-size: 27px; font-weight: 700; margin-bottom: 18px; }
      #dBody i { display: block; height: 18px; border-radius: 9px; background: var(--lav); margin-bottom: 20px; }
      #dEye { position: absolute; right: 200px; top: 600px; height: 64px; padding: 0 26px; border-radius: 22px; background: var(--acc); color: #fff; font-weight: 800; font-size: 32px; line-height: 64px; white-space: nowrap; }
      #dReq { position: absolute; right: 90px; top: 1230px; padding: 22px 32px; border-radius: 30px 30px 8px 30px; background: var(--ink); color: #fff; font-size: 34px; font-weight: 500; }
      #dOk { position: absolute; left: 90px; top: 1236px; height: 70px; padding: 0 26px; border-radius: 22px; background: var(--ok); color: #fff; font-weight: 800; font-size: 32px; line-height: 70px; }
      .src { position: absolute; left: 0; top: 1800px; width: 1080px; text-align: center; font-size: 24px; color: var(--muted); font-weight: 500; }
      .src b { font-family: var(--mono); font-weight: 400; direction: ltr; unicode-bidi: isolate; }

    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0.0" data-duration="__END__" data-width="1080" data-height="1920">
      <audio id="vo" class="clip" src="assets/vo2.mp3" data-start="0.0" data-track-index="20" data-volume="1"></audio>
      <audio id="w1" class="clip" src="assets/whoosh.wav" data-start="4.85" data-track-index="21" data-volume="0.5"></audio>
      <audio id="w2" class="clip" src="assets/whoosh.wav" data-start="22.36" data-track-index="22" data-volume="0.35"></audio>
      <audio id="w3" class="clip" src="assets/whoosh.wav" data-start="29.71" data-track-index="23" data-volume="0.35"></audio>
      <audio id="w4" class="clip" src="assets/whoosh.wav" data-start="35.61" data-track-index="24" data-volume="0.35"></audio>
      <audio id="w5" class="clip" src="assets/whoosh.wav" data-start="38.86" data-track-index="25" data-volume="0.5"></audio>
      <audio id="w6" class="clip" src="assets/whoosh.wav" data-start="42.31" data-track-index="26" data-volume="0.5"></audio>
      <audio id="k1" class="clip" src="assets/pop.wav" data-start="19.71" data-track-index="27" data-volume="0.55"></audio>
      <audio id="k2" class="clip" src="assets/pop.wav" data-start="28.46" data-track-index="28" data-volume="0.55"></audio>
      <audio id="k3" class="clip" src="assets/pop.wav" data-start="32.31" data-track-index="29" data-volume="0.55"></audio>
      <audio id="k4" class="clip" src="assets/pop.wav" data-start="34.06" data-track-index="30" data-volume="0.55"></audio>
      <audio id="k5" class="clip" src="assets/pop.wav" data-start="36.86" data-track-index="31" data-volume="0.55"></audio>
      <audio id="k6" class="clip" src="assets/tick.wav" data-start="41.39" data-track-index="32" data-volume="0.5"></audio>
      <audio id="k7" class="clip" src="assets/pop.wav" data-start="45.16" data-track-index="33" data-volume="0.55"></audio>

      <div id="background" class="clip full" data-start="0.0" data-duration="__END__" data-track-index="0">
        <div id="bg"></div><div id="glow"></div><div id="handle">aymen.ai.lab</div>
      </div>

      <!-- hook -->
      <div id="sHook" class="clip full" data-start="0.0" data-duration="5.4" data-track-index="1">
        <div id="hTitle">ثبّت <span>Skill</span><br>في Claude</div>
        <svg id="clock" viewBox="-150 -150 300 300"><circle r="130" fill="#fff" stroke="#c9b8ef" stroke-width="14"/><circle id="arc" r="130" fill="none" stroke="#e8775a" stroke-width="14" stroke-linecap="round" transform="rotate(-90)" stroke-dasharray="817" stroke-dashoffset="817"/><line id="hand" x1="0" y1="0" x2="0" y2="-95" stroke="#2b2540" stroke-width="12" stroke-linecap="round"/><circle r="14" fill="#2b2540"/></svg>
        <div id="clockTxt">في <b>أقل من دقيقة</b></div>
      </div>

            <!-- what is a skill (sources: support.claude.com "What are skills?", anthropic.com/engineering Agent Skills) -->
      <audio id="w0" class="clip" src="assets/whoosh.wav" data-start="17.26" data-track-index="34" data-volume="0.35"></audio>
      <audio id="k0" class="clip" src="assets/pop.wav" data-start="11.433" data-track-index="35" data-volume="0.5"></audio>
      <audio id="k00" class="clip" src="assets/pop.wav" data-start="13.915" data-track-index="36" data-volume="0.5"></audio>
      <div id="sDef" class="clip full" data-start="5.0" data-duration="12.86" data-track-index="5">
        <div id="dT">وش هي الـ <span>Skill</span>؟</div>
        <div id="dFold"><div class="tb"><div class="lb">arabic-caption-writer/</div></div><div class="bk"></div></div>
        <div id="dDoc" class="card">
          <h4>SKILL.md</h4>
          <div id="dMeta"><div><em>name:</em> arabic-caption-writer</div><div><em>description:</em> <span class="ar">يكتب كابشن Instagram بالعربي…</span></div></div>
          <div id="dBody"><p># التعليمات</p><i style="width:92%"></i><i style="width:78%"></i><i style="width:86%"></i><i style="width:60%"></i><i style="width:72%"></i></div>
        </div>
        <div id="dEye">👁 Claude يقرأ هذا فقط</div>
        <div id="dReq">اكتب كابشن لريلي ☕</div>
        <div id="dOk">✓ تناسبها</div>
      </div>
      <div id="srcDef" class="clip full" data-start="5.3" data-duration="11.96" data-track-index="10"><div class="src">المصدر: <b>support.claude.com</b> · <b>anthropic.com/engineering</b></div></div>
      <div id="srcSteps" class="clip full" data-start="17.81" data-duration="21.2" data-track-index="11"><div class="src">المصدر: <b>support.claude.com</b> · Use Skills in Claude</div></div>


      <!-- steps 1-4: one app window, its content changes per step -->
      <div id="sSteps" class="clip full" data-start="17.51" data-duration="21.9" data-track-index="2">
        <div id="steps"><div class="st" id="st1">1</div><div class="st" id="st2">2</div><div class="st" id="st3">3</div><div class="st" id="st4">4</div></div>
        <div id="win" class="card">
          <div id="bar"><i></i><i></i><i></i></div>
          <div class="crumb" id="cr1">Settings <em>›</em> Capabilities</div>
          <div class="crumb" id="cr2">arabic-caption-writer/</div>
          <div class="crumb" id="cr3">Customize <em>›</em> Skills</div>
          <div class="crumb" id="cr4">New chat</div>
          <div class="pane" id="p1">
            <div class="side"><div>General</div><div>Account</div><div>Privacy</div><div class="on">Capabilities</div></div>
            <h2>Capabilities</h2>
            <div id="row1"><b>Code execution and file creation</b><span>Create and edit files</span><div class="tog" id="tog1"><i></i></div></div>
            <div id="row1b"></div><div id="row1c"></div>
          </div>
          <div class="pane" id="p2">
            <div id="fold"><div class="tb"></div><div class="bk"></div><div class="fr"></div><div id="zipper"></div></div>
            <div id="zipBadge">.zip</div>
            <div id="foldName">arabic-caption-writer/</div>
            <div id="fileRow"><i></i>SKILL.md</div>
          </div>
          <div class="pane" id="p3">
            <h2>Skills</h2><div id="plus">+</div>
            <div id="empty">No skills yet</div>
            <div id="menu"><div id="mi1">+ Create skill</div><div id="mi2">Upload a skill</div></div>
            <div id="drop"><p>Drop your .zip here</p></div>
            <div id="zipCard"><i></i>arabic-caption-writer.zip</div>
            <div id="prog"></div>
            <div id="skRow"><b>arabic-caption-writer</b><span>كاتب الكابشن العربي</span><div class="tog" id="tog2"><i></i></div></div>
          </div>
          <div class="pane" id="p4">
            <div id="user">اكتب لي كابشن لريل عن القهوة ☕</div>
            <div id="used">✓ Using arabic-caption-writer</div>
            <div id="reply"><i style="width:90%"></i><i style="width:70%;background:#bfe3f7"></i><i style="width:82%"></i><i style="width:50%;background:#ffd3bf;margin:0"></i></div>
          </div>
        </div>
        <svg id="cursor" viewBox="0 0 60 60"><path d="M10 6 L10 46 L20 37 L27 53 L34 50 L27 34 L41 34 Z" fill="#2b2540" stroke="#fff" stroke-width="3" stroke-linejoin="round"/></svg>
      </div>

      <!-- tip: folder name = skill name -->
      <div id="sWarn" class="clip full" data-start="39.11" data-duration="3.9" data-track-index="3">
        <div id="warnT">⚠️ <span>انتبه</span></div>
        <div id="nmA" class="nm card"><small>Folder name</small><b>arabic-caption-writer/</b></div>
        <div id="eq">=</div>
        <div id="nmB" class="nm card"><small>SKILL.md → name:</small><b>arabic-caption-writer</b></div>
      </div>

      <!-- cta -->
      <div id="sCta" class="clip full" data-start="42.56" data-duration="5.75" data-track-index="4">
        <div id="ctaT">تبي مهارة <span>جاهزة</span><br>تجربها الحين؟</div>
        <div id="cmt" class="card"><div class="av"></div><div><small>@you</small><b>SKILL</b></div><div id="heart"><span id="hW">🤍</span><span id="hR" style="position:absolute;left:0;top:0;opacity:0">❤️</span></div></div>
        <div id="gift" class="card">🎁 أرسلها لك في الخاص</div>
      </div>

      <div id="streakLayer" class="clip full" data-start="0.0" data-duration="__END__" data-track-index="8" style="pointer-events:none"></div>
      <!--CAPTIONS-->
    </div>

    <script>
      const tl = gsap.timeline({ paused: true });
      tl.fromTo("#glow", { x: -60, y: 0 }, { x: 80, y: 160, duration: __END__, ease: "sine.inOut" }, 0.0);

      // ---------- hook (0 – 5.2) ----------
      tl.fromTo("#hTitle", { y: 50, opacity: 0, filter: "blur(10px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: .5, ease: "power3.out" }, 0.1);
      tl.fromTo("#clock", { scale: .4, opacity: 0 }, { scale: 1, opacity: 1, duration: .45, ease: "back.out(2)" }, 2.5);
      tl.fromTo("#arc", { attr: { "stroke-dashoffset": 817 } }, { attr: { "stroke-dashoffset": 60 }, duration: 2.2, ease: "power1.inOut" }, 2.7);
      tl.fromTo("#hand", { rotation: 0, svgOrigin: "0 0" }, { rotation: 330, duration: 2.2, ease: "power1.inOut" }, 2.7);
      tl.fromTo("#clockTxt", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .35, ease: "power3.out" }, 3.9);
      tl.to(["#hTitle", "#clock", "#clockTxt"], { y: -140, scale: .93, opacity: 0, filter: "blur(14px)", duration: .4, ease: "power3.in" }, 4.95);

      // ---------- steps (5.1 – 27) ----------
      tl.fromTo("#win", { y: 220, opacity: 0, scale: 1.04 }, { y: 0, opacity: 1, scale: 1, duration: .55, ease: "power3.out" }, 17.56);
      tl.fromTo(".st", { scale: 0 }, { scale: 1, duration: .3, ease: "back.out(2.4)", stagger: .06 }, 17.61);
      const stepOn = (n, t) => {
        tl.to("#st" + n, { backgroundColor: "#e8775a", color: "#ffffff", scale: 1.12, duration: .25, ease: "back.out(2)" }, t);
        if (n > 1) tl.to("#st" + (n - 1), { backgroundColor: "#4fb38a", color: "#ffffff", scale: 1, duration: .25 }, t);
      };
      const panes = ["#p1", "#p2", "#p3", "#p4"], crumbs = ["#cr1", "#cr2", "#cr3", "#cr4"];
      tl.set(panes.slice(1), { opacity: 0 }, 0.0); tl.set(crumbs.slice(1), { opacity: 0 }, 0.0);
      const swap = (i, t) => {
        tl.to(panes[i - 1], { x: -120, opacity: 0, filter: "blur(10px)", duration: .3, ease: "power2.in" }, t - .3);
        tl.fromTo(panes[i], { x: 160, opacity: 0, filter: "blur(10px)" }, { x: 0, opacity: 1, filter: "blur(0px)", duration: .4, ease: "power3.out" }, t);
        tl.to(crumbs[i - 1], { y: -30, opacity: 0, duration: .2 }, t - .2);
        tl.fromTo(crumbs[i], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .25, ease: "power2.out" }, t + .05);
      };
      // cursor travels in window coordinates (window at 90,340; pane top offset 84)
      const cur = (x, y, t, d = .45) => tl.to("#cursor", { x: x, y: y, duration: d, ease: "power3.inOut" }, t);
      const click = (t) => tl.to("#cursor", { scale: .8, duration: .07, yoyo: true, repeat: 1, transformOrigin: "20% 15%" }, t);
      tl.set("#cursor", { x: 980, y: 1500, opacity: 0 }, 0.0);

            // what is a skill: folder -> SKILL.md -> only name+description read -> request matches -> full instructions open
      tl.set(["#dEye", "#dReq", "#dOk"], { opacity: 0 }, 0);
      tl.fromTo("#dT", { y: 220, opacity: 0, filter: "blur(16px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: .5, ease: "power3.out" }, 5.05);
      tl.fromTo("#dFold", { scale: .5, opacity: 0, transformOrigin: "50% 100%" }, { scale: 1, opacity: 1, duration: .45, ease: "back.out(1.6)" }, 7.915 - .1);
      tl.fromTo("#dDoc", { y: 260, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: "back.out(1.4)" }, 8.507 - .05);
      tl.fromTo("#dDoc", { boxShadow: "0 0 0 0 rgba(232,119,90,0)" }, { boxShadow: "0 0 0 10px rgba(232,119,90,.3)", duration: .3, yoyo: true, repeat: 1 }, 9.841);
      tl.to("#dBody", { opacity: .35, filter: "blur(7px)", duration: .3 }, 11.433);
      tl.to("#dMeta", { outline: "4px solid #e8775a", duration: .2 }, 11.433);
      tl.fromTo("#dEye", { opacity: 0, y: 20, scale: .7 }, { opacity: 1, y: 0, scale: 1, duration: .3, ease: "back.out(2.4)" }, 11.433);
      tl.fromTo("#dReq", { opacity: 0, y: 60, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .35, ease: "back.out(2)" }, 13.285);
      tl.fromTo("#dOk", { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: .3, ease: "back.out(2)" }, 13.915);
      tl.to("#dEye", { opacity: 0, y: -20, duration: .2 }, 14.804);
      tl.to("#dMeta", { outline: "4px solid #4fb38a", duration: .2 }, 14.804);
      tl.to("#dBody", { opacity: 1, filter: "blur(0px)", duration: .4 }, 14.804);
      tl.fromTo("#dBody i", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: .25, stagger: .1 }, 15.1);
      tl.to(["#dT", "#dFold", "#dDoc", "#dReq", "#dOk"], { y: -170, scale: .93, opacity: 0, filter: "blur(16px)", duration: .42, ease: "power3.in" }, 17.36);


      // step 1: Settings > Capabilities, toggle on at "فعّل" (7.24)
      stepOn(1, 17.77);
      tl.to("#cursor", { opacity: 1, duration: .2 }, 18.61);
      cur(90 + 310 + 540 - 26 - 60, 340 + 84 + 150 + 46 + 20, 18.91, .6);
      click(19.61);
      tl.to("#tog1", { backgroundColor: "#e8775a", duration: .2 }, 19.65);
      tl.to("#tog1 i", { x: 44, duration: .25, ease: "back.out(2)" }, 19.65);
      tl.fromTo("#row1", { borderColor: "#eee8f8" }, { borderColor: "#e8775a", duration: .3 }, 19.71);
      tl.to("#cursor", { opacity: 0, duration: .2 }, 22.01);

      // step 2: folder with SKILL.md, compressed to ZIP at "واضغطه" (16.0)
      stepOn(2, 22.77); swap(1, 22.81);
      tl.set("#zipper", { opacity: 0 }, 0.0); tl.set("#zipBadge", { opacity: 0 }, 0.0);
      tl.fromTo("#fold", { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, duration: .4, ease: "back.out(1.8)" }, 23.97);
      tl.fromTo("#foldName", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .3 }, 24.41);
      tl.fromTo("#fileRow", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .35, ease: "back.out(2)" }, 25.29);
      tl.fromTo("#fileRow", { boxShadow: "0 0 0 0 rgba(232,119,90,0)" }, { boxShadow: "0 0 0 8px rgba(232,119,90,.35)", duration: .5, yoyo: true, repeat: 3 }, 25.77);
      tl.to("#fileRow", { y: -330, scale: .4, opacity: 0, duration: .45, ease: "power3.in" }, 27.91);
      tl.to("#fold", { scaleX: .72, duration: .3, ease: "back.in(1.5)" }, 28.41);
      tl.to("#fold .fr", { backgroundColor: "#2b2540", duration: .3 }, 28.41);
      tl.to("#zipper", { opacity: 1, duration: .15 }, 28.51);
      tl.fromTo("#zipBadge", { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .3, ease: "back.out(2.4)" }, 29.37);
      tl.to("#foldName", { opacity: 0, duration: .15 }, 28.41);

      // step 3: Customize > Skills, "+" (19.84), "Upload a skill" (21.6), file in (22.48)
      stepOn(3, 30.13); swap(2, 30.16);
      tl.set(["#menu", "#drop", "#zipCard", "#prog", "#skRow"], { opacity: 0 }, 0.0);
      tl.to("#cursor", { opacity: 1, duration: .2 }, 31.01);
      cur(90 + 900 - 50 - 50, 340 + 84 + 44 + 30, 31.31, .7);
      click(32.25);
      tl.fromTo("#menu", { opacity: 0, y: -20, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .25, ease: "back.out(2)" }, 32.31);
      tl.to("#mi1", { backgroundColor: "#ece5fb", duration: .15 }, 32.61);
      cur(90 + 900 - 50 - 220, 340 + 84 + 136 + 14 + 72 + 36, 33.41, .4);
      tl.to("#mi2", { backgroundColor: "#ffd3bf", duration: .15 }, 33.91);
      click(34.01);
      tl.to("#menu", { opacity: 0, duration: .2 }, 34.21);
      tl.to("#empty", { opacity: 0, duration: .2 }, 34.21);
      tl.fromTo("#drop", { opacity: 0, scale: .95 }, { opacity: 1, scale: 1, duration: .25 }, 34.26);
      tl.to("#cursor", { opacity: 0, duration: .2 }, 34.41);
      tl.fromTo("#zipCard", { opacity: 0, x: 0, y: 500, rotation: 8 }, { opacity: 1, y: 0, rotation: 0, duration: .45, ease: "back.out(1.5)" }, 34.89);
      tl.fromTo("#prog", { opacity: 1, scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: .55, ease: "power2.inOut" }, 35.21);
      tl.to(["#drop", "#zipCard", "#prog"], { opacity: 0, duration: .2 }, 35.81);
      tl.fromTo("#skRow", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)" }, 35.86);

      // step 4: toggle the skill on (24.4), then ask in chat (25.4)
      stepOn(4, 36.05);
      tl.to("#cursor", { opacity: 1, duration: .15 }, 36.11);
      cur(90 + 50 + 800 - 30 - 60, 340 + 84 + 170 + 42 + 20, 36.16, .5);
      click(36.79);
      tl.to("#tog2", { backgroundColor: "#4fb38a", duration: .2 }, 36.81);
      tl.to("#tog2 i", { x: 44, duration: .25, ease: "back.out(2)" }, 36.81);
      tl.to("#cursor", { opacity: 0, duration: .2 }, 37.31);
      tl.set(["#user", "#used", "#reply"], { opacity: 0 }, 0.0);
      swap(3, 37.61);
      tl.fromTo("#user", { opacity: 0, y: 40, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .3, ease: "back.out(2)" }, 37.81);
      tl.fromTo("#used", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .25 }, 38.31);
      tl.fromTo("#reply", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .25 }, 38.51);
      tl.fromTo("#reply i", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: .2, stagger: .12 }, 38.56);
      tl.to("#st4", { backgroundColor: "#4fb38a", scale: 1, duration: .25 }, 38.81);
      tl.to(["#win", "#steps"], { y: -170, scale: .93, opacity: 0, filter: "blur(16px)", duration: .42, ease: "power3.in" }, 39.01);

      // ---------- tip (26.9 – 30.3) ----------
      tl.fromTo("#warnT", { y: 220, opacity: 0, filter: "blur(16px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: .5, ease: "power3.out" }, 39.26);
      tl.fromTo("#nmA", { opacity: 0, x: 140 }, { opacity: 1, x: 0, duration: .35, ease: "power3.out" }, 40.37);
      tl.fromTo("#nmB", { opacity: 0, x: -140 }, { opacity: 1, x: 0, duration: .35, ease: "power3.out" }, 41.77);
      tl.fromTo("#eq", { opacity: 0, scale: .3 }, { opacity: 1, scale: 1, duration: .3, ease: "back.out(3)" }, 41.37);
      tl.to(["#nmA", "#nmB"], { boxShadow: "0 0 0 6px #4fb38a", duration: .25 }, 42.11);
      tl.to(["#warnT", "#nmA", "#nmB", "#eq"], { y: -170, scale: .93, opacity: 0, filter: "blur(16px)", duration: .42, ease: "power3.in" }, 42.41);

      // ---------- cta (30.3 – end) ----------
      tl.fromTo("#ctaT", { y: 220, opacity: 0, filter: "blur(16px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: .55, ease: "power3.out" }, 42.71);
      tl.fromTo("#cmt", { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: .4, ease: "back.out(1.6)" }, 44.69);
      tl.fromTo("#cmt b", { scale: .4 }, { scale: 1, duration: .3, ease: "back.out(3)", transformOrigin: "right center" }, 45.13);
      tl.set("#hW", { opacity: 0 }, 46.01); tl.set("#hR", { opacity: 1 }, 46.01);
      tl.fromTo("#heart", { scale: 1 }, { scale: 1.4, duration: .15, yoyo: true, repeat: 1 }, 46.01);
      tl.fromTo("#gift", { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: .4, ease: "back.out(2.4)" }, 46.41);
      tl.to("#gift", { scale: 1.06, duration: .2, yoyo: true, repeat: 1 }, 47.41);

      /*CAPTION_TWEENS*/

      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
