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
      .tile { position: absolute; width: 230px; height: 230px; border-radius: 52px; background: #fff; box-shadow: 0 30px 60px -20px rgba(60,40,110,.3); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; font-weight: 800; font-size: 34px; direction: ltr; }
      .tile i { font-style: normal; font-size: 84px; line-height: 1; }
      .tile.cl { background: var(--ink); color: #fff; }
      .tile.cl i { color: var(--acc); }

      /* hook: Claude reaching the services */
      #hTitle { position: absolute; left: 0; top: 300px; width: 1080px; text-align: center; font-weight: 800; font-size: 82px; line-height: 1.2; }
      #hTitle span { color: var(--acc); }
      #tC { left: 425px; top: 760px; } #tN { left: 110px; top: 1060px; } #tG { left: 740px; top: 1060px; }
      #wires { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; }

      /* MCP */
      #mBig { position: absolute; left: 0; top: 330px; width: 1080px; text-align: center; font-family: var(--mono); font-weight: 800; font-size: 230px; direction: ltr; color: var(--ink); }
      #mFull { position: absolute; left: 0; top: 620px; width: 1080px; text-align: center; font-family: var(--mono); font-size: 52px; font-weight: 700; direction: ltr; }
      #mFull b { color: var(--acc); }
      #mBadge { position: absolute; left: 270px; top: 730px; width: 540px; height: 84px; border-radius: 42px; background: var(--ink); color: #fff; font-size: 36px; font-weight: 800; line-height: 84px; text-align: center; }
      #hand { position: absolute; left: 0; top: 880px; width: 1080px; height: 520px; }
      #mC { left: 70px; top: 1010px; width: 200px; height: 200px; border-radius: 46px; }
      .svc { position: absolute; left: 770px; width: 250px; height: 110px; border-radius: 30px; background: #fff; box-shadow: 0 20px 40px -16px rgba(60,40,110,.3); font-weight: 800; font-size: 34px; line-height: 110px; text-align: center; direction: ltr; }
      #sv1 { top: 900px; } #sv2 { top: 1055px; } #sv3 { top: 1210px; }

      /* ready connector, no code */
      #rT { position: absolute; left: 0; top: 340px; width: 1080px; text-align: center; font-weight: 800; font-size: 84px; line-height: 1.25; }
      #rT span { font-family: "Aref Ruqaa"; color: var(--acc); }
      #plug { left: 190px; top: 720px; width: 300px; height: 300px; border-radius: 60px; display: flex; align-items: center; justify-content: center; font-size: 150px; }
      #code { left: 590px; top: 720px; width: 300px; height: 300px; border-radius: 60px; display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 110px; font-weight: 800; color: var(--muted); }
      #cross { position: absolute; left: 600px; top: 860px; width: 280px; height: 22px; border-radius: 11px; background: var(--acc); }
      #plugOk { position: absolute; left: 190px; top: 1050px; width: 300px; text-align: center; font-size: 40px; font-weight: 800; color: var(--ok); }

      /* steps: one app window (illustration) */
      #steps { position: absolute; left: 0; top: 200px; width: 1080px; display: flex; justify-content: center; gap: 26px; direction: rtl; }
      .st { width: 92px; height: 92px; border-radius: 30px; background: #fff; color: var(--muted); font-weight: 800; font-size: 44px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 24px -12px rgba(60,40,110,.4); }
      #win { left: 90px; top: 340px; width: 900px; height: 1000px; overflow: hidden; direction: ltr; }
      #bar { position: absolute; left: 0; top: 0; width: 900px; height: 84px; display: flex; align-items: center; gap: 12px; padding: 0 30px; border-bottom: 2px solid #f0ecf8; }
      #bar i { width: 16px; height: 16px; border-radius: 50%; background: #ddd6ee; }
      #bar i:first-child { background: var(--acc); }
      #illu { position: absolute; right: 24px; top: 22px; height: 40px; padding: 0 16px; border-radius: 20px; background: var(--lav-soft); color: #6d55b8; font-size: 22px; font-weight: 800; line-height: 40px; direction: rtl; }
      .pane { position: absolute; left: 0; top: 84px; width: 900px; height: 916px; }
      .pane h2 { position: absolute; left: 50px; top: 46px; font-size: 52px; font-weight: 800; font-family: Georgia, serif; }
      #tabs { position: absolute; left: 50px; top: 140px; display: flex; gap: 14px; font-size: 30px; font-weight: 500; }
      #tabs div { height: 58px; line-height: 58px; padding: 0 22px; border-radius: 16px; color: var(--ink); }
      #tabSk { background: #f1eef7; }
      #srch { position: absolute; left: 50px; top: 240px; width: 800px; height: 76px; border-radius: 20px; border: 3px solid #e7e2f1; font-size: 32px; line-height: 70px; padding: 0 24px; color: var(--muted); }
      #srchTxt { color: var(--ink); }
      .row { position: absolute; left: 50px; width: 800px; height: 120px; border-radius: 22px; border: 3px solid #eee8f8; padding: 22px 26px; }
      .row b { display: block; font-size: 32px; } .row span { display: block; margin-top: 6px; font-size: 22px; color: var(--muted); }
      #rowN { top: 350px; } #rowX1 { top: 490px; opacity: .45; } #rowX2 { top: 630px; opacity: .3; }
      #btnC { position: absolute; right: 26px; top: 30px; height: 60px; padding: 0 28px; border-radius: 18px; background: var(--ink); color: #fff; font-size: 28px; font-weight: 800; line-height: 60px; }
      #auth { left: 120px; top: 200px; width: 660px; height: 520px; padding: 46px; border-radius: 30px; text-align: center; }
      #auth .lg { margin: 0 auto; width: 120px; height: 120px; border-radius: 30px; background: #f1eef7; font-size: 34px; font-weight: 800; line-height: 120px; }
      #auth p { margin-top: 30px; font-size: 32px; font-weight: 800; }
      #auth small { display: block; margin-top: 14px; font-size: 24px; color: var(--muted); }
      #allow { position: absolute; left: 160px; top: 390px; width: 340px; height: 76px; border-radius: 20px; background: var(--ink); color: #fff; font-size: 30px; font-weight: 800; line-height: 76px; }
      #done { position: absolute; left: 230px; top: 780px; width: 440px; height: 80px; border-radius: 24px; background: var(--ok); color: #fff; font-size: 34px; font-weight: 800; line-height: 80px; text-align: center; }
      #user { position: absolute; right: 40px; top: 120px; max-width: 660px; padding: 26px 32px; border-radius: 30px 30px 8px 30px; background: var(--ink); color: #fff; font-size: 34px; font-weight: 500; direction: rtl; line-height: 1.4; }
      #used { position: absolute; left: 40px; top: 360px; height: 54px; padding: 0 20px; border-radius: 16px; background: var(--lav-soft); font-family: var(--mono); font-size: 24px; line-height: 54px; color: #6d55b8; }
      #reply { position: absolute; left: 40px; top: 440px; width: 700px; padding: 30px; border-radius: 30px 30px 30px 8px; background: #faf8fe; }
      #reply i { display: block; height: 18px; border-radius: 9px; background: var(--lav); margin-bottom: 20px; }
      #cursor { position: absolute; left: 0; top: 0; width: 80px; height: 80px; }

      /* next lesson */
      #nT { position: absolute; left: 0; top: 340px; width: 1080px; text-align: center; font-weight: 800; font-size: 78px; line-height: 1.25; }
      #nT span { color: var(--acc); }
      #nCard { left: 140px; top: 690px; width: 800px; height: 200px; padding: 40px 44px; direction: ltr; }
      #nCard b { display: block; font-family: var(--mono); font-size: 50px; }
      #nCard span { display: block; margin-top: 12px; font-size: 28px; color: var(--muted); }
      #nNext { left: 290px; top: 950px; width: 500px; height: 100px; border-radius: 34px; background: var(--acc); color: #fff; font-size: 40px; font-weight: 800; display: flex; align-items: center; justify-content: center; }

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
      <audio id="w1" class="clip" src="assets/whoosh.wav" data-start="SUB(W(7),.42)" data-track-index="21" data-volume="0.45"></audio>
      <audio id="w2" class="clip" src="assets/whoosh.wav" data-start="SUB(W(23),.42)" data-track-index="22" data-volume="0.4"></audio>
      <audio id="w3" class="clip" src="assets/whoosh.wav" data-start="SUB(W(32),.42)" data-track-index="23" data-volume="0.4"></audio>
      <audio id="w4" class="clip" src="assets/whoosh.wav" data-start="SUB(W(66),.42)" data-track-index="24" data-volume="0.45"></audio>
      <audio id="w5" class="clip" src="assets/whoosh.wav" data-start="SUB(W(79),.42)" data-track-index="25" data-volume="0.45"></audio>
      <audio id="k1" class="clip" src="assets/pop.wav" data-start="W(36)" data-track-index="26" data-volume="0.5"></audio>
      <audio id="k2" class="clip" src="assets/pop.wav" data-start="W(42)" data-track-index="27" data-volume="0.5"></audio>
      <audio id="k3" class="clip" src="assets/pop.wav" data-start="W(46)" data-track-index="28" data-volume="0.5"></audio>
      <audio id="k4" class="clip" src="assets/tick.wav" data-start="W(60)" data-track-index="29" data-volume="0.45"></audio>
      <audio id="k5" class="clip" src="assets/pop.wav" data-start="ADD(W(80),.5)" data-track-index="30" data-volume="0.5"></audio>

      <div id="background" class="clip full" data-start="0" data-duration="__END__" data-track-index="0">
        <div id="bg"></div><div id="glow"></div><div id="handle">aymen.ai.lab</div>
      </div>

      <div id="sHook" class="clip full" data-start="0" data-duration="ADD(W(7),.1)" data-track-index="1">
        <div id="hTitle">خلّ <span>Claude</span> يشتغل<br>في خدماتك</div>
        <svg id="wires" viewBox="0 0 1080 1920"><path id="wN" d="M540 990 C 420 1060, 300 1080, 225 1100" fill="none" stroke="#e8775a" stroke-width="10" stroke-linecap="round" stroke-dasharray="400" stroke-dashoffset="400"/><path id="wG" d="M540 990 C 660 1060, 780 1080, 855 1100" fill="none" stroke="#e8775a" stroke-width="10" stroke-linecap="round" stroke-dasharray="400" stroke-dashoffset="400"/></svg>
        <div id="tN" class="tile"><i>N</i>Notion</div>
        <div id="tG" class="tile"><i>📅</i>Calendar</div>
        <div id="tC" class="tile cl"><i>✳</i>Claude</div>
      </div>

      <div id="sMcp" class="clip full" data-start="W(7)" data-duration="SPAN(7,23,.25)" data-track-index="2">
        <div id="mBig">MCP</div>
        <div id="mFull"><b>M</b>odel <b>C</b>ontext <b>P</b>rotocol</div>
        <div id="mBadge">معيار مفتوح من Anthropic</div>
        <svg id="hand" viewBox="0 880 1080 520"><path id="arm" d="M270 1110 C 470 1110, 560 960, 770 955" fill="none" stroke="#2b2540" stroke-width="12" stroke-linecap="round" stroke-dasharray="560" stroke-dashoffset="560"/><path id="arm2" d="M270 1110 L 770 1110" fill="none" stroke="#2b2540" stroke-width="12" stroke-linecap="round" stroke-dasharray="500" stroke-dashoffset="500"/><path id="arm3" d="M270 1110 C 470 1110, 560 1265, 770 1265" fill="none" stroke="#2b2540" stroke-width="12" stroke-linecap="round" stroke-dasharray="560" stroke-dashoffset="560"/></svg>
        <div id="mC" class="tile cl"><i>✳</i>Claude</div>
        <div id="sv1" class="svc">Notion</div><div id="sv2" class="svc">Calendar</div><div id="sv3" class="svc">Drive</div>
      </div>

      <div id="sReady" class="clip full" data-start="W(23)" data-duration="SPAN(23,32,.25)" data-track-index="3">
        <div id="rT">موصّل <span>جاهز</span><br>بدون كود</div>
        <div id="plug" class="card">🔌</div>
        <div id="code" class="card">&lt;/&gt;</div><div id="cross"></div>
        <div id="plugOk">✓ ضغطة وحدة</div>
      </div>

      <div id="sSteps" class="clip full" data-start="W(32)" data-duration="SPAN(32,66,.25)" data-track-index="4">
        <div id="steps"><div class="st" id="st1">1</div><div class="st" id="st2">2</div><div class="st" id="st3">3</div></div>
        <div id="win" class="card">
          <div id="bar"><i></i><i></i><i></i><div id="illu">رسم توضيحي</div></div>
          <div class="pane" id="p1">
            <h2>Customize</h2>
            <div id="tabs"><div id="tabSk">Skills</div><div id="tabCo">Connectors</div><div>Plugins</div></div>
            <div id="srch">🔍 <span id="srchTxt">Notion</span></div>
            <div id="rowN" class="row"><b>Notion</b><span>Connector</span><div id="btnC">Connect</div></div>
            <div id="rowX1" class="row"><b>Google Calendar</b><span>Connector</span></div>
            <div id="rowX2" class="row"><b>Google Drive</b><span>Connector</span></div>
          </div>
          <div class="pane" id="p2">
            <div id="auth" class="card"><div class="lg">N</div><p>Claude wants to access<br>your Notion workspace</p><small>Sign in, then allow access</small><div id="allow">Allow access</div></div>
            <div id="done">✓ Connected</div>
          </div>
          <div class="pane" id="p3">
            <div id="user">ابحث في Notion عن ملاحظات آخر اجتماع ولخّصها</div>
            <div id="used">✓ Searched Notion</div>
            <div id="reply"><i style="width:92%"></i><i style="width:80%"></i><i style="width:86%"></i><i style="width:58%"></i></div>
          </div>
        </div>
        <svg id="cursor" viewBox="0 0 80 80"><path d="M10 6 L10 62 L24 49 L34 72 L44 67 L34 45 L54 45 Z" fill="#2b2540" stroke="#fff" stroke-width="4" stroke-linejoin="round"/></svg>
      </div>

      <div id="sNext" class="clip full" data-start="W(66)" data-duration="SPAN(66,79,.25)" data-track-index="5">
        <div id="nT">وإذا خدمتك<br><span>ما لها موصّل؟</span></div>
        <div id="nCard" class="card"><b>mcp-builder</b><span>Skill · by Anthropic</span></div>
        <div id="nNext" class="card">⏭ الدرس الجاي</div>
      </div>

      <div id="sCta" class="clip full" data-start="W(79)" data-duration="TAIL(79)" data-track-index="6">
        <div id="ctaT">تبي قائمة <span>الموصّلات</span>؟</div>
        <div id="cmt" class="card"><div class="av"></div><div><small>@you</small><b>MCP</b></div><div id="heart"><span id="hW">🤍</span><span id="hR" style="position:absolute;left:0;top:0;opacity:0">❤️</span></div></div>
        <div id="gift" class="card">📋 أرسلها لك في الخاص</div>
      </div>

      <div id="srcA" class="clip full" data-start="W(7)" data-duration="SPAN(7,32,0)" data-track-index="10"><div class="src">المصدر: <b>modelcontextprotocol.io</b> · <b>anthropic.com</b></div></div>
      <div id="srcB" class="clip full" data-start="W(32)" data-duration="SPAN(32,66,0)" data-track-index="11"><div class="src">المصدر: <b>support.claude.com</b> · Connectors</div></div>
      <!--CAPTIONS-->
    </div>

    <script>
      const tl = gsap.timeline({ paused: true });
      tl.fromTo("#glow", { x: -60, y: 0 }, { x: 80, y: 160, duration: __END__, ease: "sine.inOut" }, 0);
      const out = (sel, t) => tl.to(sel, { y: -170, scale: .93, opacity: 0, filter: "blur(16px)", duration: .42, ease: "power3.in" }, t);
      const inn = (sel, t) => tl.fromTo(sel, { y: 220, opacity: 0, filter: "blur(16px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: .5, ease: "power3.out" }, t);

      // hook: Claude in the middle, wires reach Notion and Calendar
      inn("#hTitle", .1);
      tl.fromTo("#tC", { scale: .3, opacity: 0 }, { scale: 1, opacity: 1, duration: .45, ease: "back.out(2)" }, .5);
      tl.fromTo(["#tN", "#tG"], { scale: .3, opacity: 0 }, { scale: 1, opacity: 1, duration: .4, ease: "back.out(2)", stagger: .15 }, W(5) - .1);
      tl.to(["#wN", "#wG"], { attr: { "stroke-dashoffset": 0 }, duration: .6, ease: "power2.inOut" }, W(5) + .2);
      tl.fromTo(["#tN", "#tG"], { boxShadow: "0 0 0 0 rgba(232,119,90,0)" }, { boxShadow: "0 0 0 12px rgba(232,119,90,.35)", duration: .3, yoyo: true, repeat: 1 }, W(5) + .8);
      out(["#hTitle", "#tC", "#tN", "#tG", "#wires"], W(7) - .45);

      // MCP: the letters, the full name, the badge, then Claude's arm reaching three services
      tl.fromTo("#mBig", { scale: 1.6, opacity: 0, filter: "blur(18px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: .5, ease: "power3.out" }, W(7) + .05);
      tl.fromTo("#mFull", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .4, ease: "power3.out" }, W(11) - .1);
      tl.fromTo("#mBadge", { scale: .5, opacity: 0 }, { scale: 1, opacity: 1, duration: .35, ease: "back.out(2.4)" }, W(14));
      tl.fromTo("#mC", { x: -200, opacity: 0 }, { x: 0, opacity: 1, duration: .4, ease: "power3.out" }, W(18) - .2);
      tl.fromTo(".svc", { x: 200, opacity: 0 }, { x: 0, opacity: 1, duration: .35, ease: "power3.out", stagger: .1 }, W(18));
      tl.to(["#arm", "#arm2", "#arm3"], { attr: { "stroke-dashoffset": 0 }, duration: .55, ease: "power2.inOut", stagger: .12 }, W(20));
      tl.to(".svc", { backgroundColor: "#ffd3bf", duration: .25, stagger: .12 }, W(21));
      out(["#mBig", "#mFull", "#mBadge", "#hand", "#mC", ".svc"], W(23) - .45);

      // ready connector vs code
      inn("#rT", W(23) + .05);
      tl.fromTo("#plug", { scale: .4, opacity: 0 }, { scale: 1, opacity: 1, duration: .4, ease: "back.out(2)" }, W(26));
      tl.fromTo("#code", { scale: .4, opacity: 0 }, { scale: 1, opacity: 1, duration: .4, ease: "back.out(2)" }, W(28));
      tl.fromTo("#cross", { scaleX: 0, rotation: -18, transformOrigin: "left center" }, { scaleX: 1, rotation: -18, duration: .3, ease: "power3.out" }, W(30));
      tl.fromTo("#plugOk", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .3 }, W(30) + .2);
      out(["#rT", "#plug", "#code", "#cross", "#plugOk"], W(32) - .45);

      // steps
      tl.fromTo("#win", { y: 220, opacity: 0, scale: 1.04 }, { y: 0, opacity: 1, scale: 1, duration: .55, ease: "power3.out" }, W(32) + .05);
      tl.fromTo(".st", { scale: 0 }, { scale: 1, duration: .3, ease: "back.out(2.4)", stagger: .06 }, W(32) + .1);
      const step = (n, t) => {
        tl.to("#st" + n, { backgroundColor: "#e8775a", color: "#ffffff", scale: 1.12, duration: .25, ease: "back.out(2)" }, t);
        if (n > 1) tl.to("#st" + (n - 1), { backgroundColor: "#4fb38a", color: "#ffffff", scale: 1, duration: .25 }, t);
      };
      const cur = (x, y, t, d = .45) => tl.to("#cursor", { x: x, y: y, duration: d, ease: "power3.inOut" }, t);
      const click = (t) => tl.to("#cursor", { scale: .8, duration: .07, yoyo: true, repeat: 1, transformOrigin: "20% 15%" }, t);
      tl.set("#cursor", { x: 980, y: 1500, opacity: 0 }, 0);
      tl.set(["#p2", "#p3", "#srch", "#rowN", "#rowX1", "#rowX2", "#done"], { opacity: 0 }, 0);

      // 1: Customize > Connectors (window at 90,340; pane top 84)
      step(1, W(32));
      tl.to("#cursor", { opacity: 1, duration: .2 }, W(33));
      cur(90 + 50 + 150 + 120, 340 + 84 + 140 + 20, W(35) - .5);
      click(W(36) - .05);
      tl.to("#tabSk", { backgroundColor: "rgba(0,0,0,0)", duration: .15 }, W(36));
      tl.to("#tabCo", { backgroundColor: "#f1eef7", duration: .15 }, W(36));
      tl.fromTo(["#rowX1", "#rowX2"], { y: 30 }, { y: 0, opacity: 1, duration: .3, stagger: .08 }, W(36) + .1);
      tl.set("#rowX1", { opacity: .45 }, W(36) + .45); tl.set("#rowX2", { opacity: .3 }, W(36) + .5);

      // 2: search Notion, Connect
      step(2, W(37));
      tl.fromTo("#srch", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: .25 }, W(37));
      tl.fromTo("#srchTxt", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: .5, ease: "steps(6)" }, W(39));
      tl.fromTo("#rowN", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)" }, W(40));
      tl.to(["#rowX1", "#rowX2"], { y: 0, duration: .01 }, W(40));
      cur(90 + 850 - 26 - 90, 340 + 84 + 350 + 60, W(41) - .3);
      click(W(42) - .05);
      tl.fromTo("#btnC", { scale: 1 }, { scale: .9, duration: .08, yoyo: true, repeat: 1 }, W(42) - .05);

      // 3: sign in and allow
      step(3, W(43));
      tl.to("#p1", { x: -120, opacity: 0, filter: "blur(10px)", duration: .3, ease: "power2.in" }, W(43) - .3);
      tl.fromTo("#p2", { x: 160, opacity: 0, filter: "blur(10px)" }, { x: 0, opacity: 1, filter: "blur(0px)", duration: .4, ease: "power3.out" }, W(43));
      cur(90 + 120 + 160 + 200, 340 + 84 + 200 + 390 + 50, W(45) - .3);
      click(W(46) - .05);
      tl.to("#allow", { backgroundColor: "#4fb38a", duration: .2 }, W(46));
      tl.fromTo("#done", { opacity: 0, y: 30, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .35, ease: "back.out(2)" }, W(47));
      tl.to("#cursor", { opacity: 0, duration: .2 }, W(48));

      // try it: the request and the answer
      tl.to("#st3", { backgroundColor: "#4fb38a", scale: 1, duration: .25 }, W(49));
      tl.to("#p2", { x: -120, opacity: 0, filter: "blur(10px)", duration: .3, ease: "power2.in" }, W(49) - .3);
      tl.fromTo("#p3", { x: 160, opacity: 0, filter: "blur(10px)" }, { x: 0, opacity: 1, filter: "blur(0px)", duration: .4, ease: "power3.out" }, W(49));
      tl.set(["#user", "#used", "#reply"], { opacity: 0 }, 0);
      tl.fromTo("#user", { opacity: 0, y: 40, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .3, ease: "back.out(2)" }, W(50));
      tl.fromTo("#used", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .25 }, W(60));
      tl.fromTo("#reply", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .25 }, W(62));
      tl.fromTo("#reply i", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: .2, stagger: .12 }, W(62) + .05);
      out(["#win", "#steps"], W(66) - .45);

      // next lesson
      inn("#nT", W(66) + .05);
      tl.fromTo("#nCard", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: .4, ease: "back.out(1.6)" }, W(74));
      tl.fromTo("#nNext", { scale: .5, opacity: 0 }, { scale: 1, opacity: 1, duration: .35, ease: "back.out(2.4)" }, W(76));
      out(["#nT", "#nCard", "#nNext"], W(79) - .45);

      // cta
      inn("#ctaT", W(79) + .05);
      tl.fromTo("#cmt", { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: .4, ease: "back.out(1.6)" }, W(79) + .4);
      tl.fromTo("#cmt b", { scale: .4 }, { scale: 1, duration: .3, ease: "back.out(3)", transformOrigin: "right center" }, W(80));
      tl.set("#hW", { opacity: 0 }, W(80) + .5); tl.set("#hR", { opacity: 1 }, W(80) + .5);
      tl.fromTo("#heart", { scale: 1 }, { scale: 1.4, duration: .15, yoyo: true, repeat: 1 }, W(80) + .5);
      tl.fromTo("#gift", { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: .4, ease: "back.out(2.4)" }, W(83));

      /*CAPTION_TWEENS*/

      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
