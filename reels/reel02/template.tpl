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
      @font-face { font-family: "Aref Ruqaa"; font-weight: 700; font-display: block; src: url("assets/fonts/ArefRuqaa-700-latin.woff2") format("woff2"); unicode-range: U+0000-00FF, U+2000-206F, U+2190-21FF; }

      :root {
        --lavender: #c9b8ef; --lavender-soft: #ece5fb; --sky: #bfe3f7; --sky-soft: #e3f3fc; --peach: #ffd3bf;
        --accent: #e8775a; --ink: #2b2540; --muted: #8a82a3; --term: #221d33; --ok: #4fb38a;
        --font: "Tajawal", sans-serif; --hand: "Aref Ruqaa", serif; --mono: "JetBrains Mono", monospace;
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1080px; height: 1920px; overflow: hidden; background: var(--lavender-soft); }
      #root { position: relative; width: 1080px; height: 1920px; font-family: var(--font); color: var(--ink); }
      .full { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; }
      #bg { position: absolute; inset: 0; background: linear-gradient(165deg, var(--lavender-soft) 0%, #f1ecfc 45%, var(--sky-soft) 100%); }
      #glow { position: absolute; left: 140px; top: 420px; width: 800px; height: 800px; border-radius: 50%; background: radial-gradient(circle, rgba(255,211,191,.7) 0%, rgba(255,211,191,0) 70%); }
      #glow2 { position: absolute; left: -200px; top: 1300px; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(191,227,247,.9) 0%, rgba(191,227,247,0) 70%); }
      #handle { position: absolute; left: 60px; top: 70px; font-weight: 800; font-size: 30px; color: var(--muted); direction: ltr; }

      .card { position: absolute; background: #fff; border-radius: 30px; box-shadow: 0 30px 60px -20px rgba(60,40,110,.28), 0 4px 12px rgba(60,40,110,.08); }
      .ln { display: block; height: 14px; border-radius: 7px; background: var(--lavender); margin-bottom: 16px; }
      .title { position: absolute; left: 0; width: 1080px; text-align: center; font-weight: 800; font-size: 64px; }
      .hand { font-family: var(--hand); color: var(--accent); }
      .chip { position: absolute; height: 60px; padding: 0 24px; border-radius: 18px; font-weight: 800; font-size: 30px; display: flex; align-items: center; gap: 10px; white-space: nowrap; }
      .mono { font-family: var(--mono); direction: ltr; }

      /* S1 split */
      .win { position: absolute; top: 330px; width: 450px; height: 640px; border-radius: 30px; background: var(--term); overflow: hidden; box-shadow: 0 40px 70px -24px rgba(34,29,51,.5); }
      .win .bar { height: 56px; display: flex; align-items: center; gap: 10px; padding: 0 22px; direction: ltr; border-bottom: 1px solid rgba(255,255,255,.08); }
      .win .bar i { width: 13px; height: 13px; border-radius: 50%; background: #5a5373; } .win .bar i:first-child { background: var(--accent); }
      .win .bar b { margin-left: 8px; color: #cfc8e6; font-family: var(--mono); font-size: 20px; font-weight: 400; }
      #winL { left: 60px; } #winR { left: 570px; }
      .out { position: absolute; left: 30px; top: 90px; width: 390px; }
      .mess i { position: absolute; display: block; height: 16px; border-radius: 8px; }
      .neat .blk { position: relative; border-radius: 16px; background: rgba(255,255,255,.07); padding: 20px; margin-bottom: 18px; }
      .neat .blk i { display: block; height: 13px; border-radius: 7px; background: #c9b8ef; margin-bottom: 12px; }
      .neat .blk i.s { background: #9fd8f5; width: 70%; } .neat .blk i.p { background: var(--peach); width: 45%; margin: 0; }
      .lab { position: absolute; top: 1000px; width: 450px; text-align: center; font-weight: 800; font-size: 50px; }
      #labL { left: 60px; color: #c0566a; } #labR { left: 570px; color: var(--ok); }
      #skills { position: absolute; left: 0; top: 640px; width: 1080px; height: 260px; }
      .sk { position: absolute; left: 0; top: 0; width: 1080px; text-align: center; font-family: "Inter", sans-serif; font-weight: 900; font-size: 210px; letter-spacing: .02em; direction: ltr; line-height: 260px; }
      #sk0 { color: var(--ink); } #sk1 { color: #5ec8f0; clip-path: inset(0 0 62% 0); } #sk2 { color: var(--accent); clip-path: inset(55% 0 0 0); }

      /* S2 stack */
      .note { position: absolute; width: 640px; height: 170px; padding: 28px 34px; border-radius: 26px; background: #fff; box-shadow: 0 18px 40px -16px rgba(60,40,110,.35); }
      .note b { display: block; font-size: 30px; font-weight: 800; margin-bottom: 14px; }
      .note .ln { height: 12px; margin-bottom: 12px; } .note .ln:nth-of-type(2) { width: 75%; }
      .note.hot { outline: 5px solid var(--accent); }
      #typing { left: 170px; top: 230px; width: 740px; height: 96px; display: flex; align-items: center; gap: 14px; padding: 0 30px; border-radius: 24px; font-size: 34px; font-weight: 500; }
      #typing .cur { width: 4px; height: 40px; background: var(--accent); }
      #lost { left: 300px; top: 1180px; background: #fde4e4; color: #c0566a; }

      /* S3 folder */
      #folder { position: absolute; left: 290px; top: 560px; width: 500px; height: 380px; }
      #fBack { position: absolute; left: 0; top: 40px; width: 500px; height: 340px; border-radius: 30px; background: #b39ce6; }
      #fTab { position: absolute; left: 30px; top: 0; width: 200px; height: 80px; border-radius: 24px; background: #b39ce6; }
      #paper { position: absolute; left: 80px; top: 60px; width: 340px; height: 420px; border-radius: 22px; background: #fff; padding: 70px 36px 0; }
      #paper .nm { position: absolute; top: 18px; left: 0; width: 340px; text-align: center; font-family: var(--mono); font-size: 30px; color: var(--accent); direction: ltr; font-weight: 700; }
      #fFront { position: absolute; left: 0; top: 130px; width: 500px; height: 250px; border-radius: 30px; background: linear-gradient(180deg, #d9ccf7, #c9b8ef); box-shadow: 0 -10px 30px rgba(60,40,110,.12); }
      #fFront span { position: absolute; bottom: 30px; right: 40px; font-weight: 800; font-size: 34px; color: #6d55b8; }
      #spark3 { left: 120px; top: 1080px; width: 150px; height: 150px; display: flex; align-items: center; justify-content: center; }
      .sparksvg { width: 86px; height: 86px; }
      #wire3 { position: absolute; left: 270px; top: 1152px; width: 220px; height: 6px; border-radius: 3px; background: var(--accent); }
      #exp3 { left: 500px; top: 1120px; background: var(--ink); color: #fff; height: 76px; font-size: 34px; }

      /* S4 library */
      #lib { position: absolute; left: 90px; top: 250px; width: 900px; height: 620px; }
      .shelf { position: absolute; left: 0; width: 900px; height: 16px; border-radius: 8px; background: #b9a7e0; }
      .book { position: absolute; width: 52px; border-radius: 8px 8px 4px 4px; }
      #bookGlow { position: absolute; width: 52px; height: 170px; border-radius: 8px; box-shadow: 0 0 40px 14px rgba(255,190,140,.95); background: #ffb48f; }
      #openBook { position: absolute; left: 290px; top: 360px; width: 500px; height: 300px; }
      #openBook .pg { position: absolute; top: 0; width: 250px; height: 300px; background: #fff; box-shadow: 0 20px 40px -12px rgba(60,40,110,.35); padding: 40px 28px; }
      #pgR { right: 0; border-radius: 0 20px 20px 0; } #pgL { left: 0; border-radius: 20px 0 0 20px; }
      #index { left: 110px; top: 930px; width: 860px; padding: 26px 34px; }
      #index h4 { font-size: 28px; color: var(--muted); font-weight: 800; margin-bottom: 14px; }
      .row { position: relative; display: flex; justify-content: space-between; align-items: center; height: 74px; padding: 0 22px; border-radius: 16px; font-size: 30px; font-weight: 500; }
      .row .nm { font-family: var(--mono); font-size: 26px; color: var(--accent); direction: ltr; }
      #rowHi { position: absolute; left: 34px; right: 34px; height: 74px; border-radius: 16px; background: #fff0e9; outline: 3px solid var(--accent); }
      #req { left: 260px; top: 150px; background: var(--ink); color: #fff; height: 80px; font-size: 34px; }
      #many { left: 330px; top: 600px; background: var(--accent); color: #fff; height: 96px; font-size: 52px; padding: 0 40px; }

      /* S5 two ways */
      #w5title { top: 220px; }
      .way { position: absolute; top: 420px; width: 440px; height: 760px; border-radius: 34px; background: #fff; box-shadow: 0 30px 60px -20px rgba(60,40,110,.28); padding: 36px 30px; }
      #wayA { left: 560px; } #wayB { left: 80px; }
      .way .num { width: 74px; height: 74px; border-radius: 22px; background: var(--accent); color: #fff; font-weight: 800; font-size: 44px; display: flex; align-items: center; justify-content: center; }
      .way h3 { margin-top: 22px; font-size: 44px; font-weight: 800; }
      .way p { margin-top: 8px; font-size: 28px; color: var(--muted); font-weight: 500; }
      #autoList { position: absolute; left: 30px; top: 300px; width: 380px; }
      .pick { height: 70px; border-radius: 16px; background: var(--lavender-soft); margin-bottom: 16px; display: flex; align-items: center; padding: 0 20px; font-family: var(--mono); font-size: 24px; color: var(--muted); direction: ltr; }
      #pickHi { position: absolute; left: 30px; top: 386px; width: 380px; height: 70px; border-radius: 16px; outline: 4px solid var(--accent); background: rgba(232,119,90,.12); }
      #autoSpark { position: absolute; left: 330px; top: 220px; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; }
      #miniTerm { position: absolute; left: 30px; top: 320px; width: 380px; height: 260px; border-radius: 22px; background: var(--term); padding: 70px 26px; }
      #miniTerm .t { color: #fff; font-family: var(--mono); font-size: 34px; direction: ltr; white-space: nowrap; }
      #miniTerm .sl { color: var(--accent); font-weight: 700; }
      #slashBig { position: absolute; left: 160px; top: 620px; width: 120px; text-align: center; font-family: var(--mono); font-size: 120px; font-weight: 700; color: var(--accent); }

      /* S6 bundle */
      #folder6 { position: absolute; left: 390px; top: 600px; width: 300px; height: 230px; }
      #folder6 .b { position: absolute; left: 0; top: 24px; width: 300px; height: 206px; border-radius: 24px; background: #b39ce6; }
      #folder6 .tb { position: absolute; left: 20px; top: 0; width: 120px; height: 50px; border-radius: 16px; background: #b39ce6; }
      #folder6 .f { position: absolute; left: 0; top: 80px; width: 300px; height: 150px; border-radius: 24px; background: linear-gradient(180deg, #d9ccf7, #c9b8ef); }
      .file { position: absolute; width: 230px; height: 84px; border-radius: 20px; background: #fff; box-shadow: 0 16px 30px -12px rgba(60,40,110,.35); display: flex; align-items: center; justify-content: center; gap: 12px; font-family: var(--mono); font-size: 25px; direction: ltr; color: var(--ink); }
      .file i { width: 16px; height: 16px; border-radius: 5px; display: inline-block; }
      .orb { position: absolute; width: 170px; height: 170px; border-radius: 40px; background: #fff; box-shadow: 0 20px 40px -14px rgba(60,40,110,.35); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; font-size: 28px; font-weight: 800; }
      .orb svg { width: 74px; height: 74px; }
      .orb.hot { outline: 5px solid var(--accent); }

      /* S7 outro */
      #duo { position: absolute; left: 90px; top: 300px; width: 900px; height: 360px; }
      .col { position: absolute; top: 0; width: 420px; height: 360px; border-radius: 30px; padding: 40px 30px; text-align: center; }
      #colU { left: 480px; background: #fff; } #colB { left: 0; background: var(--ink); color: #fff; }
      .col h3 { font-size: 40px; font-weight: 800; } .col p { margin-top: 18px; font-size: 30px; font-weight: 500; opacity: .75; }
      .col .ic { margin: 30px auto 0; width: 96px; height: 96px; border-radius: 26px; display: flex; align-items: center; justify-content: center; font-size: 54px; }
      #logo { position: absolute; left: 340px; top: 620px; width: 400px; height: 400px; border-radius: 100px; background: linear-gradient(150deg, #c9b8ef, #bfe3f7 60%, #ffd3bf); box-shadow: 0 40px 80px -20px rgba(60,40,110,.45); display: flex; align-items: center; justify-content: center; }
      #logo svg { width: 200px; height: 200px; }
      #logoName { position: absolute; left: 0; top: 1060px; width: 1080px; text-align: center; font-weight: 800; font-size: 64px; direction: ltr; }
      #follow { left: 390px; top: 1180px; background: var(--accent); color: #fff; height: 96px; font-size: 48px; padding: 0 50px; border-radius: 30px; }
      .tok { position: absolute; width: 90px; height: 90px; border-radius: 26px; }

      .stage, .zoom { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; }
      #streak { position: absolute; left: -300px; top: -400px; width: 260px; height: 2800px; opacity: 0;
        background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.95) 45%, rgba(255,211,191,.9) 55%, rgba(255,255,255,0)); }
      #teaser { left: 140px; top: 250px; width: 800px; height: 210px; padding: 34px 40px; }
      #teaser .k { display: inline-block; height: 44px; line-height: 44px; padding: 0 18px; border-radius: 12px; background: var(--ink); color: #fff; font-size: 24px; font-weight: 800; direction: ltr; letter-spacing: .08em; }
      #teaser h3 { margin-top: 16px; font-size: 46px; font-weight: 800; }
      #teaser h3 span { color: var(--accent); }
      #follow .a, #follow .b { position: absolute; left: 0; top: 0; width: 100%; height: 96px; line-height: 96px; text-align: center; }
      #follow { width: 300px; left: 390px; padding: 0; justify-content: center; overflow: hidden; }
      #cursor { position: absolute; left: 760px; top: 1420px; width: 90px; height: 90px; }
      #ring { position: absolute; left: 490px; top: 1178px; width: 100px; height: 100px; border-radius: 50%; border: 6px solid var(--accent); }
      .dot { position: absolute; left: 532px; top: 1220px; width: 22px; height: 22px; border-radius: 50%; }
      #team { position: absolute; left: 30px; top: 470px; width: 390px; display: flex; flex-wrap: wrap; gap: 10px; direction: rtl; }
      .tm { height: 46px; padding: 0 14px; border-radius: 14px; background: rgba(255,255,255,.1); color: #fff; font-size: 22px; font-weight: 800; display: flex; align-items: center; }
      #lockF { position: absolute; left: 290px; top: 600px; width: 500px; height: 380px; }
      #lockF .lfTab { position: absolute; left: 30px; top: 0; width: 200px; height: 80px; border-radius: 24px; background: #b39ce6; }
      #lockF .lfBack { position: absolute; left: 0; top: 40px; width: 500px; height: 340px; border-radius: 30px; background: #b39ce6; }
      #lockF .lfFront { position: absolute; left: 0; top: 110px; width: 500px; height: 270px; border-radius: 30px; background: linear-gradient(180deg, #d9ccf7, #c9b8ef); display: flex; align-items: flex-end; justify-content: center; padding-bottom: 34px; }
      #lockF .lfFront span { font-size: 44px; font-weight: 700; color: #6d55b8; }
      #lock { position: absolute; left: 190px; top: 150px; width: 120px; height: 140px; }
      #lock .shackle { position: absolute; left: 22px; top: 0; width: 76px; height: 80px; border: 14px solid #2b2540; border-bottom: none; border-radius: 40px 40px 0 0; }
      #lock .body { position: absolute; left: 0; top: 56px; width: 120px; height: 84px; border-radius: 20px; background: #e8775a; }
      #lock .body i { position: absolute; left: 52px; top: 24px; width: 16px; height: 34px; border-radius: 8px; background: #fff; }
      #soon { left: 380px; top: 1080px; background: var(--ink); color: #fff; height: 76px; font-size: 34px; }
      #logoE { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; }
      #logoTile { position: absolute; left: 340px; top: 520px; width: 400px; height: 400px; border-radius: 100px; overflow: hidden; background: linear-gradient(150deg, #c9b8ef, #bfe3f7 60%, #ffd3bf); box-shadow: 0 40px 80px -20px rgba(60,40,110,.45); display: flex; align-items: center; justify-content: center; }
      #logoTile svg { width: 200px; height: 200px; }
      #sheen { position: absolute; left: -200px; top: -100px; width: 140px; height: 700px; background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.85), rgba(255,255,255,0)); }
      #logoTxt { position: absolute; left: 0; top: 960px; width: 1080px; text-align: center; font-weight: 800; font-size: 64px; direction: ltr; }
      #followE { left: 420px; top: 1080px; background: var(--accent); color: #fff; height: 92px; font-size: 44px; padding: 0 46px; border-radius: 28px; }
      /* captions */
      .cap-wrap { position: absolute; left: 0; top: 1440px; width: 1080px; }
      .cap { width: 1080px; text-align: center; font-weight: 800; font-size: 70px; line-height: 1.3; padding: 0 70px; }
      .w { display: inline-block; }
      .key { background: var(--accent); color: #fff; border-radius: 18px; padding: 0 20px 6px; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="__END__" data-width="1080" data-height="1920">
      <audio id="vo" class="clip" src="assets/vo.mp3" data-start="0" data-track-index="20" data-volume="1"></audio>

      <div id="background" class="clip full" data-start="0" data-duration="__END__" data-track-index="0">
        <div id="bg"></div><div id="glow"></div><div id="glow2"></div>
        <div id="handle">aymen.ai.lab</div>
      </div>

      <!-- S1 hook: same Claude, beginner vs expert -->
      <div id="s1" class="clip full" data-start="0" data-duration="8.9" data-track-index="1"><div class="stage" id="st1"><div class="zoom" id="z1">
        <div id="winL" class="win"><div class="bar"><i></i><i></i><i></i><b>Claude</b></div>
          <div class="out mess" id="mess">
            <i style="left:10px;top:0;width:300px;background:#8a82a3"></i><i style="left:60px;top:40px;width:220px;background:#c0566a"></i>
            <i style="left:0;top:86px;width:360px;background:#6e6790"></i><i style="left:120px;top:120px;width:180px;background:#8a82a3"></i>
            <i style="left:20px;top:170px;width:260px;background:#c0566a"></i><i style="left:150px;top:206px;width:230px;background:#6e6790"></i>
            <i style="left:0;top:260px;width:140px;background:#8a82a3"></i><i style="left:200px;top:290px;width:170px;background:#c0566a"></i>
            <i style="left:40px;top:340px;width:310px;background:#6e6790"></i><i style="left:10px;top:390px;width:200px;background:#8a82a3"></i>
            <i style="left:180px;top:430px;width:190px;background:#c0566a"></i>
          </div>
        </div>
        <div id="winR" class="win"><div class="bar"><i></i><i></i><i></i><b>Claude</b></div>
          <div class="out neat">
            <div class="blk" id="nb1"><i></i><i class="s"></i><i class="p"></i></div>
            <div class="blk" id="nb2"><i></i><i class="s"></i><i class="p"></i></div>
            <div class="blk" id="nb3"><i></i><i class="s"></i><i class="p"></i></div>
          </div>
        </div>
        <div id="labL" class="lab">مبتدئ</div>
        <div id="labR" class="lab">خبير ✓</div>
        <div id="skills"><div id="sk0" class="sk">SKILLS</div><div id="sk1" class="sk">SKILLS</div><div id="sk2" class="sk">SKILLS</div></div>
        </div></div></div>

      <!-- S2 problem: repeating instructions pile up -->
      <div id="s2" class="clip full" data-start="8.3" data-duration="8.95" data-track-index="2"><div class="stage" id="st2"><div class="zoom" id="z2">
        <div id="typing" class="card"><span>اكتب بأسلوبي... اتبع الخطوات... لا تنسَ</span><span class="cur"></span></div>
        <div id="n1" class="note" style="left:230px;top:380px"><b>أسلوبك</b><i class="ln"></i><i class="ln"></i></div>
        <div id="n2" class="note" style="left:200px;top:470px"><b>خطواتك</b><i class="ln"></i><i class="ln"></i></div>
        <div id="n3" class="note" style="left:250px;top:560px"><b>قواعدك</b><i class="ln"></i><i class="ln"></i></div>
        <div id="n4" class="note" style="left:180px;top:650px"><b>أسلوبك (مرة ثانية)</b><i class="ln"></i><i class="ln"></i></div>
        <div id="n5" class="note" style="left:240px;top:740px"><b>خطواتك (مرة ثالثة)</b><i class="ln"></i><i class="ln"></i></div>
        <div id="n6" class="note" style="left:210px;top:830px"><b>قواعدك... من جديد</b><i class="ln"></i><i class="ln"></i></div>
        <div id="n7" class="note" style="left:260px;top:920px"><b>نفس التعليمات</b><i class="ln"></i><i class="ln"></i></div>
        <div id="n8" class="note" style="left:190px;top:1010px"><b>نفس التعليمات</b><i class="ln"></i><i class="ln"></i></div>
        <div id="lost" class="chip">⚠ نسيت جزء من القواعد</div>
        </div></div></div>

      <!-- S3 definition: folder opens, SKILL.md glows -->
      <div id="s3" class="clip full" data-start="16.65" data-duration="12.1" data-track-index="3"><div class="stage" id="st3"><div class="zoom" id="z3">
        <div id="t3" class="title" style="top:250px">ما هي الـ <span class="hand">Skill</span>؟</div>
        <div id="folder">
          <div id="fTab"></div><div id="fBack"></div>
          <div id="paper"><div class="nm">SKILL.md</div><i class="ln" id="pl1"></i><i class="ln" id="pl2" style="width:80%;background:var(--sky)"></i><i class="ln" id="pl3" style="width:90%"></i><i class="ln" id="pl4" style="width:60%;background:var(--peach)"></i><i class="ln" id="pl5" style="width:85%"></i></div>
          <div id="fFront"><span>my-skill/</span></div>
        </div>
        <div id="spark3" class="card"><svg class="sparksvg" viewBox="0 0 100 100"><g fill="#e8775a"><rect x="45" y="6" width="10" height="88" rx="5"/><rect x="45" y="6" width="10" height="88" rx="5" transform="rotate(45 50 50)"/><rect x="45" y="6" width="10" height="88" rx="5" transform="rotate(90 50 50)"/><rect x="45" y="6" width="10" height="88" rx="5" transform="rotate(135 50 50)"/></g></svg></div>
        <div id="wire3"></div>
        <div id="exp3" class="chip">خبرة جاهزة ✓</div>
        </div></div></div>

      <!-- S4 the smart part: library, only names are read -->
      <div id="s4" class="clip full" data-start="28.15" data-duration="15.85" data-track-index="4"><div class="stage" id="st4"><div class="zoom" id="z4">
        <div id="req" class="chip">« سوّ لي مونتاج لهالفيديو »</div>
        <div id="lib">
          <div class="shelf" style="top:190px"></div><div class="shelf" style="top:400px"></div><div class="shelf" style="top:610px"></div>
          <!--BOOKS-->
          <div id="bookGlow" style="left:424px;top:230px"></div>
        </div>
        <div id="openBook"><div id="pgL" class="pg"><i class="ln"></i><i class="ln" style="width:70%"></i><i class="ln"></i></div><div id="pgR" class="pg"><i class="ln" style="background:var(--peach)"></i><i class="ln" style="width:60%"></i><i class="ln"></i></div></div>
        <div id="index" class="card">
          <h4>اللي يشوفه Claude: الاسم والوصف فقط</h4>
          <div id="rowHi" style="top:84px"></div>
          <div class="row" id="r1"><span>مونتاج الفيديو</span><span class="nm">video-editor</span></div>
          <div class="row" id="r2"><span>كتابة الكابشن</span><span class="nm">ig-caption</span></div>
          <div class="row" id="r3"><span>تقارير شهرية</span><span class="nm">monthly-report</span></div>
          <div class="row" id="r4"><span>تنظيم المهام</span><span class="nm">task-planner</span></div>
        </div>
        <div id="many" class="chip">+48 مهارة</div>
        </div></div></div>

      <!-- S5 two ways to run -->
      <div id="s5" class="clip full" data-start="43.4" data-duration="9.9" data-track-index="5"><div class="stage" id="st5"><div class="zoom" id="z5">
        <div id="w5title" class="title">طريقتين للتشغيل</div>
        <div id="wayA" class="way"><div class="num">1</div><h3>تلقائي</h3><p>Claude يختار المهارة</p>
          <div id="autoSpark"><svg class="sparksvg" viewBox="0 0 100 100" style="width:64px;height:64px"><g fill="#e8775a"><rect x="45" y="6" width="10" height="88" rx="5"/><rect x="45" y="6" width="10" height="88" rx="5" transform="rotate(45 50 50)"/><rect x="45" y="6" width="10" height="88" rx="5" transform="rotate(90 50 50)"/><rect x="45" y="6" width="10" height="88" rx="5" transform="rotate(135 50 50)"/></g></svg></div>
          <div id="autoList"><div class="pick">ig-caption</div><div class="pick">video-editor</div><div class="pick">task-planner</div><div class="pick">monthly-report</div></div>
          <div id="pickHi"></div>
        </div>
        <div id="wayB" class="way"><div class="num">2</div><h3>يدوي</h3><p>تستدعيها أنت</p>
          <div id="miniTerm"><div class="t"><span class="sl">/</span><span id="slTyped">video-editor</span></div></div>
          <div id="slashBig">/</div>
        </div>
        </div></div></div>

      <!-- S6 more than text -->
      <div id="s6" class="clip full" data-start="52.7" data-duration="12.2" data-track-index="6"><div class="stage" id="st6"><div class="zoom" id="z6">
        <div id="t6" class="title" style="top:220px">أكبر من <span class="hand">مجرد نص</span></div>
        <div id="folder6"><div class="tb"></div><div class="b"></div><div class="f"></div></div>
        <div id="f1" class="file" style="left:425px;top:620px"><i style="background:var(--accent)"></i>SKILL.md</div>
        <div id="f2" class="file" style="left:425px;top:620px"><i style="background:#5ec8f0"></i>script.py</div>
        <div id="f3" class="file" style="left:425px;top:620px"><i style="background:var(--lavender)"></i>reference.md</div>
        <div id="f4" class="file" style="left:425px;top:620px"><i style="background:var(--ok)"></i>template.json</div>
        <div id="orbit" style="position:absolute;left:0;top:0;width:1080px;height:1920px">
          <div id="o1" class="orb" style="left:455px;top:300px"><svg viewBox="0 0 80 80"><rect x="8" y="6" width="64" height="68" rx="10" fill="#c9b8ef"/><rect x="20" y="40" width="10" height="22" rx="3" fill="#e8775a"/><rect x="35" y="28" width="10" height="34" rx="3" fill="#e8775a"/><rect x="50" y="18" width="10" height="44" rx="3" fill="#e8775a"/></svg>تقارير</div>
          <div id="o2" class="orb" style="left:780px;top:880px"><svg viewBox="0 0 80 80"><rect x="6" y="10" width="68" height="60" rx="8" fill="#bfe3f7"/><g fill="#fff"><rect x="12" y="18" width="24" height="12" rx="3"/><rect x="44" y="18" width="24" height="12" rx="3"/><rect x="12" y="36" width="24" height="12" rx="3"/><rect x="44" y="36" width="24" height="12" rx="3"/><rect x="12" y="54" width="24" height="10" rx="3"/><rect x="44" y="54" width="24" height="10" rx="3"/></g></svg>تحليل ملفات</div>
          <div id="o3" class="orb" style="left:130px;top:880px"><svg viewBox="0 0 80 80"><rect x="6" y="14" width="68" height="52" rx="12" fill="#ffd3bf"/><path d="M33 28 L54 40 L33 52 Z" fill="#e8775a"/></svg>مونتاج</div>
        </div>
        </div></div></div>

      <!-- Outro: black beat, split returns, expert half takes over, locked skill, logo, cut back to the opening -->
      <div id="outro" class="clip full" data-start="64.3" data-duration="21.0" data-track-index="7">
        <div id="eSplit" class="full">
          <div id="eL" class="win" style="left:60px"><div class="bar"><i></i><i></i><i></i><b>Claude</b></div><div class="out mess">
            <i style="left:10px;top:0;width:300px;background:#8a82a3"></i><i style="left:60px;top:40px;width:220px;background:#c0566a"></i>
            <i style="left:0;top:86px;width:360px;background:#6e6790"></i><i style="left:120px;top:120px;width:180px;background:#8a82a3"></i>
            <i style="left:20px;top:170px;width:260px;background:#c0566a"></i><i style="left:150px;top:206px;width:230px;background:#6e6790"></i>
            <i style="left:0;top:260px;width:140px;background:#8a82a3"></i><i style="left:200px;top:290px;width:170px;background:#c0566a"></i>
            <i style="left:40px;top:340px;width:310px;background:#6e6790"></i><i style="left:10px;top:390px;width:200px;background:#8a82a3"></i>
            <i style="left:180px;top:430px;width:190px;background:#c0566a"></i></div></div>
          <div id="eR" class="win" style="left:570px"><div class="bar"><i></i><i></i><i></i><b>Claude</b></div><div class="out neat"><div class="blk"><i></i><i class="s"></i><i class="p"></i></div><div class="blk"><i></i><i class="s"></i><i class="p"></i></div><div class="blk"><i></i><i class="s"></i><i class="p"></i></div></div>
            <div id="team"><span class="tm">✂️ مونتاج</span><span class="tm">✍️ كتابة</span><span class="tm">🎨 تصميم</span><span class="tm">📊 تقارير</span></div>
          </div>
          <div id="eLabL" class="lab" style="left:60px;color:#c0566a">أداة</div>
          <div id="eLabR" class="lab" style="left:570px;color:var(--ok)">فريق عمل ✓</div>
        </div>
        <div id="flash" class="full" style="background:#fff"></div>
        <div id="lockF">
          <div class="lfTab"></div><div class="lfBack"></div>
          <div class="lfFront"><span class="mono">SKILL.md</span></div>
          <div id="lock"><div class="shackle"></div><div class="body"><i></i></div></div>
        </div>
        <div id="soon" class="chip">🔒 الحلقة الجاية</div>
        <div id="logoE"><div id="logoTile"><svg viewBox="0 0 100 100"><g fill="#2b2540"><rect x="45" y="6" width="10" height="88" rx="5"/><rect x="45" y="6" width="10" height="88" rx="5" transform="rotate(45 50 50)"/><rect x="45" y="6" width="10" height="88" rx="5" transform="rotate(90 50 50)"/><rect x="45" y="6" width="10" height="88" rx="5" transform="rotate(135 50 50)"/></g></svg><div id="sheen"></div></div><div id="logoTxt">aymen.ai.lab</div>
          <div id="followE" class="chip">تابع +</div></div>
        <div id="black" class="full" style="background:#000"></div>
      </div>
      <div id="loopCut" class="clip full" data-start="85.25" data-duration="__LOOPDUR__" data-track-index="8">
        <div class="win" style="left:60px"><div class="bar"><i></i><i></i><i></i><b>Claude</b></div><div class="out mess">
            <i style="left:10px;top:0;width:300px;background:#8a82a3"></i><i style="left:60px;top:40px;width:220px;background:#c0566a"></i>
            <i style="left:0;top:86px;width:360px;background:#6e6790"></i><i style="left:120px;top:120px;width:180px;background:#8a82a3"></i>
            <i style="left:20px;top:170px;width:260px;background:#c0566a"></i><i style="left:150px;top:206px;width:230px;background:#6e6790"></i>
            <i style="left:0;top:260px;width:140px;background:#8a82a3"></i><i style="left:200px;top:290px;width:170px;background:#c0566a"></i>
            <i style="left:40px;top:340px;width:310px;background:#6e6790"></i><i style="left:10px;top:390px;width:200px;background:#8a82a3"></i>
            <i style="left:180px;top:430px;width:190px;background:#c0566a"></i></div></div>
        <div class="win" style="left:570px"><div class="bar"><i></i><i></i><i></i><b>Claude</b></div><div class="out neat"><div class="blk"><i></i><i class="s"></i><i class="p"></i></div><div class="blk"><i></i><i class="s"></i><i class="p"></i></div><div class="blk"><i></i><i class="s"></i><i class="p"></i></div></div></div>
      </div>
      <div id="streakLayer" class="clip full" data-start="0" data-duration="__END__" data-track-index="8" style="pointer-events:none"><div id="streak"></div></div>
      <audio id="whS" class="clip" src="assets/whoosh.wav" data-start="7.08" data-track-index="21" data-volume="0.35"></audio>
      <audio id="wh0" class="clip" src="assets/whoosh.wav" data-start="7.98" data-track-index="22" data-volume="0.55"></audio>
      <audio id="wh1" class="clip" src="assets/whoosh.wav" data-start="16.33" data-track-index="23" data-volume="0.55"></audio>
      <audio id="wh2" class="clip" src="assets/whoosh.wav" data-start="27.83" data-track-index="24" data-volume="0.55"></audio>
      <audio id="wh3" class="clip" src="assets/whoosh.wav" data-start="43.08" data-track-index="25" data-volume="0.55"></audio>
      <audio id="wh4" class="clip" src="assets/whoosh.wav" data-start="52.38" data-track-index="26" data-volume="0.55"></audio>
      <audio id="bass" class="clip" src="assets/bass.wav" data-start="71.82" data-track-index="31" data-volume="0.9"></audio>
      <!--CAPTIONS-->
    </div>

    <script>
      const tl = gsap.timeline({ paused: true });
      const pop = (sel, t, extra = {}) => tl.fromTo(sel, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .4, ease: "back.out(2)", ...extra }, t);
      const rise = (sel, t, d = .4) => tl.fromTo(sel, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: d, ease: "power3.out" }, t);
      const out = (sel, t) => tl.to(sel, { opacity: 0, scale: .92, filter: "blur(10px)", duration: .3, ease: "power2.in" }, t);

      tl.fromTo("#glow", { x: -60, y: 0 }, { x: 80, y: 160, duration: __END__, ease: "sine.inOut" }, 0);
      tl.fromTo("#glow2", { x: 0 }, { x: 160, duration: __END__, ease: "sine.inOut" }, 0);

      // ---------- S1 (0 – 8.45) ----------
      tl.fromTo("#winL", { opacity: 0, x: -120, rotationY: -30, transformPerspective: 1400 }, { opacity: 1, x: 0, rotationY: 0, duration: .55, ease: "power3.out" }, .15);
      tl.fromTo("#winR", { opacity: 0, x: 120, rotationY: 30, transformPerspective: 1400 }, { opacity: 1, x: 0, rotationY: 0, duration: .55, ease: "power3.out" }, .4);
      tl.fromTo("#mess i", { opacity: 0 }, { opacity: 1, duration: .08, stagger: .09 }, .7);
      ["#nb1", "#nb2", "#nb3"].forEach((s, i) => rise(s, 1.0 + i * .35, .35));
      // glitch jitter on the messy side
      for (let i = 0; i < 14; i++) {
        const t = 1.4 + i * .35;
        tl.to("#mess", { x: (i % 2 ? -10 : 12), skewX: (i % 3 - 1) * 6, duration: .04, ease: "none" }, t);
        tl.to("#mess", { x: 0, skewX: 0, duration: .04, ease: "none" }, t + .06);
      }
      pop("#labL", 3.9); pop("#labR", 5.4);
      tl.to(["#winL", "#winR", "#labL", "#labR"], { y: -60, scale: .82, opacity: .25, filter: "blur(4px)", duration: .5, ease: "power2.inOut" }, 6.45);
      tl.set("#skills", { opacity: 0 }, 0);
      tl.set("#skills", { opacity: 1 }, 7.5);
      tl.fromTo("#sk0", { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: .25, ease: "power4.out" }, 7.5);
      [[7.5, 40, -30], [7.62, -26, 18], [7.74, 14, -8], [7.86, 0, 0]].forEach(([t, a, b]) => {
        tl.to("#sk1", { x: a, duration: .05, ease: "none" }, t);
        tl.to("#sk2", { x: b, duration: .05, ease: "none" }, t);
      });
      tl.fromTo(["#sk1", "#sk2"], { opacity: 0 }, { opacity: .85, duration: .05 }, 7.5);
      tl.to(["#sk1", "#sk2"], { opacity: 0, duration: .1 }, 7.95);
      // glitch exit
      tl.to("#skills", { x: 30, skewX: 20, duration: .05, ease: "none" }, 8.25);

      // ---------- S2 (8.45 – 16.9) ----------
      rise("#typing", 8.55);
      tl.fromTo("#typing span:first-child", { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: 1.4, ease: "steps(26)" }, 8.7);
      tl.fromTo("#typing .cur", { opacity: 1 }, { opacity: 0, duration: .25, ease: "steps(1)", yoyo: true, repeat: 15 }, 8.6);
      const nts = ["#n1", "#n2", "#n3", "#n4", "#n5", "#n6", "#n7", "#n8"];
      const ntT = [10.3, 11.0, 11.6, 12.5, 13.1, 14.0, 14.5, 15.0];
      const rots = [-3, 4, -5, 3, -4, 6, -2, 5];
      nts.forEach((s, i) => tl.fromTo(s, { opacity: 0, y: -260, rotation: 0, scale: 1.1 }, { opacity: 1, y: 0, rotation: rots[i], scale: 1, duration: .38, ease: "bounce.out" }, ntT[i]));
      [["#n1", 12.52], ["#n2", 13.08], ["#n3", 14.04]].forEach(([s, t]) => {
        tl.set(s, { outline: "5px solid #e8775a" }, t);
        tl.set(s, { outline: "0px solid #e8775a" }, t + .55);
      });
      tl.to(["#n3", "#n6"], { y: 900, rotation: 40, opacity: 0, duration: .8, ease: "power2.in", stagger: .12 }, 15.72);
      pop("#lost", 15.95);

      // ---------- S3 (16.9 – 28.4) ----------
      rise("#t3", 17.0);
      tl.fromTo("#folder", { opacity: 0, scale: .5, y: 80 }, { opacity: 1, scale: 1, y: 0, duration: .5, ease: "back.out(1.8)" }, 17.3);
      tl.fromTo("#folder", { rotation: 0 }, { rotation: -4, duration: .15, yoyo: true, repeat: 3, ease: "sine.inOut" }, 18.32);
      tl.set("#paper", { y: 120, opacity: 0 }, 0);
      tl.fromTo("#fFront", { rotationX: 0, transformOrigin: "50% 100%", transformPerspective: 900 }, { rotationX: -55, duration: .45, ease: "power2.out" }, 19.25);
      tl.to("#paper", { y: -230, opacity: 1, duration: .6, ease: "back.out(1.4)" }, 19.35);
      tl.fromTo("#paper", { boxShadow: "0 0 0px 0px rgba(255,180,140,0)" }, { boxShadow: "0 0 70px 18px rgba(255,180,140,.85)", duration: .8, ease: "sine.inOut", yoyo: true, repeat: 7 }, 19.7);
      ["#pl1", "#pl2", "#pl3", "#pl4", "#pl5"].forEach((s, i) => tl.fromTo(s, { scaleX: 0, transformOrigin: "right center" }, { scaleX: 1, duration: .3, ease: "power2.out" }, 20.6 + i * .3));
      pop("#spark3", 24.9);
      tl.to("#spark3 svg", { rotation: 360, duration: 3.5, ease: "none" }, 24.9);
      tl.fromTo("#wire3", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: .35, ease: "power2.inOut" }, 25.3);
      pop("#exp3", 25.52);

      // ---------- S4 (28.4 – 43.65) ----------
      tl.fromTo(".shelf", { scaleX: 0 }, { scaleX: 1, duration: .4, ease: "power3.out", stagger: .1 }, 28.5);
      tl.fromTo(".book", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .25, ease: "power2.out", stagger: { each: .015, from: "random" } }, 28.7);
      tl.set("#bookGlow", { opacity: 0 }, 0);
      tl.to(".book", { opacity: .35, duration: .4 }, 29.68);
      tl.to("#lib", { scale: .62, y: -120, duration: .6, ease: "power3.inOut" }, 32.5);
      rise("#index", 32.7, .5);
      ["#r1", "#r2", "#r3", "#r4"].forEach((s, i) => rise(s, 32.9 + i * .18, .3));
      tl.set("#rowHi", { opacity: 0 }, 0);
      tl.set(["#req", "#many", "#openBook"], { opacity: 0 }, 0);
      tl.fromTo("#req", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: .35, ease: "back.out(2)" }, 35.0);
      tl.fromTo("#rowHi", { opacity: 0, scaleX: .4 }, { opacity: 1, scaleX: 1, duration: .35, ease: "power3.out" }, 35.5);
      tl.to("#bookGlow", { opacity: 1, duration: .3 }, 36.4);
      tl.to("#index", { opacity: 0, y: 60, duration: .35, ease: "power2.in" }, 37.4);
      tl.to("#lib", { scale: 1, y: 0, opacity: .25, duration: .5, ease: "power3.inOut" }, 37.5);
      tl.fromTo("#openBook", { opacity: 0, scale: .3, y: -80 }, { opacity: 1, scale: 1, y: 0, duration: .55, ease: "back.out(1.6)" }, 37.7);
      tl.fromTo("#pgL", { rotationY: 90, transformOrigin: "right center", transformPerspective: 1000 }, { rotationY: 0, duration: .5, ease: "power2.out" }, 38.3);
      tl.fromTo("#openBook", { boxShadow: "0 0 0 rgba(0,0,0,0)" }, { boxShadow: "0 0 80px 20px rgba(255,190,140,.7)", duration: .5 }, 38.4);
      tl.to(["#openBook", "#req"], { opacity: 0, scale: .9, duration: .3 }, 40.3);
      tl.to("#lib", { opacity: 1, duration: .3 }, 40.4);
      tl.to(".book", { opacity: 1, duration: .3, stagger: { each: .008, from: "random" } }, 40.5);
      pop("#many", 40.96);

      // ---------- S5 (43.65 – 52.95) ----------
      rise("#w5title", 43.7);
      tl.fromTo("#wayA", { opacity: 0, x: 120 }, { opacity: 1, x: 0, duration: .5, ease: "power3.out" }, 44.2);
      tl.fromTo("#wayB", { opacity: 0, x: -120 }, { opacity: 1, x: 0, duration: .5, ease: "power3.out" }, 44.45);
      tl.set(["#pickHi", "#slashBig"], { opacity: 0 }, 0);
      tl.fromTo("#autoSpark svg", { rotation: 0 }, { rotation: 360, duration: 2, ease: "power2.inOut" }, 45.6);
      tl.fromTo("#pickHi", { opacity: 0, y: -86 }, { opacity: 1, y: 0, duration: .6, ease: "back.out(1.6)" }, 46.44);
      tl.fromTo("#wayA", { boxShadow: "0 30px 60px -20px rgba(60,40,110,.28)" }, { boxShadow: "0 0 0 6px #e8775a", duration: .3, yoyo: true, repeat: 1 }, 46.5);
      tl.fromTo("#miniTerm .sl", { opacity: 0 }, { opacity: 1, duration: .05 }, 48.64);
      tl.fromTo("#slTyped", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "steps(12)" }, 49.4);
      tl.fromTo("#slashBig", { opacity: 0, scale: .4, rotation: -30 }, { opacity: 1, scale: 1, rotation: 0, duration: .45, ease: "back.out(2.4)" }, 51.04);

      // ---------- S6 (52.95 – 64.55) ----------
      rise("#t6", 53.0);
      pop("#folder6", 53.3);
      [["#f1", -330, -190, -6], ["#f2", 300, -190, 5], ["#f3", -330, 310, 4], ["#f4", 300, 310, -5]].forEach(([s, x, y, r], i) => {
        tl.fromTo(s, { opacity: 0, x: 0, y: 0, scale: .4 }, { opacity: 1, x, y, rotation: r, scale: 1, duration: .5, ease: "back.out(1.6)" }, [54.6, 56.08, 56.8, 57.3][i]);
      });
      tl.to(["#f1", "#f2", "#f3", "#f4"], { opacity: 0, scale: .6, x: 0, y: 0, duration: .4, ease: "power2.in" }, 58.3);
      tl.set(["#o1", "#o2", "#o3"], { opacity: 0 }, 0);
      ["#o1", "#o2", "#o3"].forEach((s, i) => pop(s, 58.6 + i * .2));
      [["#o1", 61.92], ["#o2", 62.32], ["#o3", 63.84]].forEach(([s, t]) => {
        tl.set(s, { outline: "5px solid #e8775a" }, t);
        tl.fromTo(s, { scale: 1 }, { scale: 1.15, duration: .2, yoyo: true, repeat: 1, ease: "power2.out" }, t);
      });
      tl.fromTo("#folder6", { boxShadow: "0 0 0 rgba(0,0,0,0)" }, { boxShadow: "0 0 70px 16px rgba(255,180,140,.8)", duration: .6, yoyo: true, repeat: 5 }, 58.4);

      // ---------- connective layer: push transitions, streak, slow zoom ----------
      const START = [0, 8.3, 16.65, 28.15, 43.4, 52.7, 64.4];
      const CUT = [8.4, 16.75, 28.25, 43.5, 52.8];
      for (let n = 1; n <= 6; n++) {
        tl.fromTo("#z" + n, { scale: 1 }, { scale: 1.045, duration: START[n] - START[n - 1] + .6, ease: "none", transformOrigin: "50% 42%" }, START[n - 1]);
      }
      CUT.forEach((c, i) => {
        const a = "#st" + (i + 1), b = "#st" + (i + 2);
        tl.to(a, { y: -170, scale: .93, opacity: 0, filter: "blur(16px)", duration: .42, ease: "power3.in" }, c - .3);
        tl.fromTo(b, { y: 220, scale: 1.06, opacity: 0, filter: "blur(16px)" }, { y: 0, scale: 1, opacity: 1, filter: "blur(0px)", duration: .6, ease: "power3.out" }, c - .05);
        tl.fromTo("#streak", { x: 0, opacity: 0, rotation: 18 }, { x: 1700, opacity: 1, duration: .55, ease: "power2.inOut" }, c - .3);
        tl.to("#streak", { opacity: 0, duration: .1 }, c + .25);
      });
      // S2 -> S3: every instruction note is pulled into the folder's position
      ["#n1", "#n2", "#n4", "#n5", "#n7", "#n8"].forEach((s, i) => {
        const el = document.querySelector(s);
        const dx = 540 - (parseFloat(el.style.left) + 320), dy = 750 - (parseFloat(el.style.top) + 85);
        tl.to(s, { x: dx, y: dy, scale: .15, rotation: 0, opacity: 0, duration: .5, ease: "power3.in" }, 16.05 + i * .04);
      });
      tl.to("#lost", { opacity: 0, scale: .4, duration: .3 }, 16.1);
      tl.to("#typing", { y: -60, opacity: 0, duration: .3 }, 16.1);
      // S3 -> S4: SKILL.md shrinks into the glowing book slot
      tl.to("#paper", { y: -350, scale: .14, duration: .55, ease: "power3.in" }, 27.75);
      tl.to(["#fFront", "#fBack", "#fTab", "#spark3", "#wire3", "#exp3", "#t3"], { opacity: 0, y: 40, duration: .35, ease: "power2.in", stagger: .03 }, 27.7);
      // S6 -> S7: everything orbits into the centre before the comparison
      ["#o1", "#o2", "#o3"].forEach((s, i) => tl.to(s, { x: [85, -240, 410][i], y: [415, -165, -165][i], scale: .2, opacity: 0, duration: .5, ease: "back.in(1.4)" }, 63.95 + i * .05));
      tl.to("#folder6", { scale: 1.3, opacity: 0, duration: .4, ease: "power2.in" }, 64.1);
      tl.to("#t6", { y: -40, opacity: 0, duration: .3 }, 64.0);

      // ---------- Outro (64.4 – end) ----------
      tl.set("#black", { opacity: 1 }, 0);
      tl.set(["#eSplit", "#lockF", "#soon", "#logoE", "#flash", "#eLabL", "#eLabR", "#team"], { opacity: 0 }, 0);
      tl.to("#black", { opacity: 0, duration: 1.3, ease: "sine.inOut" }, 65.55);
      tl.fromTo("#eSplit", { opacity: 0, scale: 1.06, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.6, ease: "power2.out" }, 65.5);
      tl.fromTo("#eLabL", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .5 }, 69.03);
      for (let i = 0; i < 10; i++) {
        const t0 = 66.2 + i * .45;
        tl.to("#eL .mess", { x: (i % 2 ? -8 : 10), duration: .04, ease: "none" }, t0);
        tl.to("#eL .mess", { x: 0, duration: .04, ease: "none" }, t0 + .06);
      }
      // the beginner half fades; the expert half takes the whole frame on the bass hit
      tl.to(["#eL", "#eLabL"], { opacity: 0, x: -80, filter: "blur(14px)", duration: .9, ease: "power2.in" }, 70.2);
      tl.to("#eR", { x: -255, y: 120, scale: 1.75, duration: .55, ease: "expo.out" }, 71.85);
      tl.fromTo("#flash", { opacity: .85 }, { opacity: 0, duration: .45, ease: "power2.out" }, 71.85);
      [[18, -10], [-14, 8], [8, -4], [0, 0]].forEach(([x, y], i) => tl.to("#eSplit", { x, y, duration: .05, ease: "none" }, 71.86 + i * .05));
      tl.fromTo("#eR", { boxShadow: "0 40px 70px -24px rgba(34,29,51,.5)" }, { boxShadow: "0 0 120px 30px rgba(255,190,150,.7)", duration: .8, yoyo: true, repeat: 3, ease: "sine.inOut" }, 72.3);
      tl.to("#team", { opacity: 1, duration: .01 }, 73.0);
      tl.fromTo("#team .tm", { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: .3, ease: "back.out(2.4)", stagger: .18 }, 73.0);
      tl.fromTo("#eLabR", { opacity: 0, y: 20 }, { opacity: 0, y: 0, duration: .01 }, 70);
      // into the locked skill
      tl.to("#eSplit", { scale: 1.4, opacity: 0, filter: "blur(18px)", duration: .5, ease: "power3.in" }, 76.2);
      tl.fromTo("#lockF", { opacity: 0, scale: .5, y: 80 }, { opacity: 1, scale: 1, y: 0, duration: .6, ease: "back.out(1.7)" }, 76.55);
      tl.fromTo("#lockF .lfFront", { boxShadow: "0 0 0 rgba(0,0,0,0)" }, { boxShadow: "0 0 100px 26px rgba(255,180,140,.85)", duration: .9, yoyo: true, repeat: 5, ease: "sine.inOut" }, 76.89999999999999);
      [[-10], [10], [-6], [0]].forEach(([r], i) => tl.to("#lock", { rotation: r, duration: .07, ease: "none" }, 77.89999999999999 + i * .07));
      tl.to("#lock .shackle", { y: -14, duration: .25, yoyo: true, repeat: 1, ease: "power2.out" }, 78.19999999999999);
      tl.fromTo("#soon", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .4, ease: "back.out(2)" }, 80.97999999999999);
      // logo with a soft light sweep, one follow pulse
      tl.to(["#lockF", "#soon"], { opacity: 0, scale: .9, filter: "blur(12px)", duration: .4, ease: "power2.in" }, 83.64999999999999);
      tl.fromTo("#logoE", { opacity: 0 }, { opacity: 1, duration: .01 }, 83.89999999999999);
      tl.fromTo("#logoTile", { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .55, ease: "back.out(1.6)" }, 83.89999999999999);
      tl.fromTo("#sheen", { x: 0, rotation: 20 }, { x: 760, duration: .9, ease: "power2.inOut" }, 84.3);
      tl.fromTo("#logoTxt", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .4 }, 84.19999999999999);
      tl.fromTo("#followE", { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .35, ease: "back.out(2.4)" }, 84.5);
      tl.to("#followE", { scale: 1.12, duration: .22, yoyo: true, repeat: 1, ease: "sine.inOut" }, 84.94999999999999);
      // final frame: hard cut back to the opening split (loops into the start)
      for (let i = 0; i < 6; i++) {
        tl.to("#loopCut .mess", { x: (i % 2 ? -10 : 12), duration: .04, ease: "none" }, 85.5 + i * .35);
        tl.to("#loopCut .mess", { x: 0, duration: .04, ease: "none" }, 85.56 + i * .35);
      }

      // ---------- captions ----------
      /*CAPTION_TWEENS*/

      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
