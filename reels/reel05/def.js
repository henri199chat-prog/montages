      // what is a skill: folder -> SKILL.md -> only name+description read -> request matches -> full instructions open
      tl.set(["#dEye", "#dReq", "#dOk"], { opacity: 0 }, 0);
      tl.fromTo("#dT", { y: 220, opacity: 0, filter: "blur(16px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: .5, ease: "power3.out" }, 5.05);
      tl.fromTo("#dFold", { scale: .5, opacity: 0, transformOrigin: "50% 100%" }, { scale: 1, opacity: 1, duration: .45, ease: "back.out(1.6)" }, W(8) - .1);
      tl.fromTo("#dDoc", { y: 260, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: "back.out(1.4)" }, W(10) - .05);
      tl.fromTo("#dDoc", { boxShadow: "0 0 0 0 rgba(232,119,90,0)" }, { boxShadow: "0 0 0 10px rgba(232,119,90,.3)", duration: .3, yoyo: true, repeat: 1 }, W(12));
      tl.to("#dBody", { opacity: .35, filter: "blur(7px)", duration: .3 }, W(16));
      tl.to("#dMeta", { outline: "4px solid #e8775a", duration: .2 }, W(16));
      tl.fromTo("#dEye", { opacity: 0, y: 20, scale: .7 }, { opacity: 1, y: 0, scale: 1, duration: .3, ease: "back.out(2.4)" }, W(16));
      tl.fromTo("#dReq", { opacity: 0, y: 60, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .35, ease: "back.out(2)" }, W(20));
      tl.fromTo("#dOk", { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: .3, ease: "back.out(2)" }, W(22));
      tl.to("#dEye", { opacity: 0, y: -20, duration: .2 }, W(23));
      tl.to("#dMeta", { outline: "4px solid #4fb38a", duration: .2 }, W(23));
      tl.to("#dBody", { opacity: 1, filter: "blur(0px)", duration: .4 }, W(23));
      tl.fromTo("#dBody i", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: .25, stagger: .1 }, W(24));
      tl.to(["#dT", "#dFold", "#dDoc", "#dReq", "#dOk"], { y: -170, scale: .93, opacity: 0, filter: "blur(16px)", duration: .42, ease: "power3.in" }, S(4.95));
