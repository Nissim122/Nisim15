/* =======================================================
 * ANIMATIONS FLOW ENGINE — Alpha / P1 Hero Intro
 * File: assets/animations/animations.js
 * Covers legacy expectations: enabled flag, isInitialized,
 * cardReady wait + fallback, BFCache, visibilitychange,
 * and Parallax BG init.
 * ======================================================= */
(function () {
  try {
    // ---------- Legacy compatibility flags ----------
    const enabled = (window.cardData?.features?.animationsEnabled === true);
    if (!enabled) return;

    const START_DELAY_MS = Number(window.cardData?.features?.animationStartDelayMs ?? 0); // legacy global delay (kept)
    const fx  = (window.cardData?.features?.animations) || {};
    const PROCESS        = fx.process || 'Alpha';
    const OPEN_DELAY     = Number(fx.openDelay ?? 250);   // Flow P1 open delay
    const STAGGER        = Number(fx.stagger ?? 120);
    const RUN_ONCE       = (fx.runOnce !== false);
    const MOBILE_MOTION  = Number(fx.mobileMotionScale ?? 0.75);
    const THRESHOLDS     = Object.assign({ P2:0.15, P3:0.15, P4:0.15, P5:0.15, P6:0.10 }, fx.thresholds || {});
    const DEBUG = false;
    const log = (...a) => DEBUG && console.log('[Flow]', ...a);

    // ---------- Utilities ----------
    function waitFor(pred, { interval = 60, timeout = 15000 } = {}) {
      return new Promise((resolve, reject) => {
        const t0 = Date.now();
        const id = setInterval(() => {
          try {
            if (pred()) { clearInterval(id); resolve(true); }
            else if (Date.now() - t0 > timeout) { clearInterval(id); reject(new Error("timeout")); }
          } catch (e) { clearInterval(id); reject(e); }
        }, interval);
      });
    }
    const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
    const delay = (ms) => new Promise(r => setTimeout(r, Math.max(0, ms|0)));

    // Reduce-motion: CSS already renders final state, so no JS animations.
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      // עדיין נאתחל פרלקסה כדי שתאפס מצב (היא כבר מכבדת reduce)
      armParallaxInit();
      return;
    }

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    function setDelay(el, ms){ el.style.animationDelay = `${Math.max(0, ms|0)}ms`; }
    function setDuration(el, ms){ if (ms) el.style.animationDuration = `${Math.max(1, ms|0)}ms`; }

    function runBatch(list, { baseDelay=0, stagger=STAGGER, effect, duration, mobileVariant } = {}){
      list.forEach((el, i) => {
        const eff = isMobile && mobileVariant ? mobileVariant : effect;
        if (eff) el.setAttribute('data-effect', eff);
        setDelay(el, baseDelay + (i * stagger));
        setDuration(el, duration);
        requestAnimationFrame(() => el.classList.add('anim-run'));
      });
    }

    // ---------- P1 (Hero Intro) role maps ----------
    const P1_ROLES = {
      logo:         (root) => $$('[data-role="logo"]', root),
      profileImage: (root) => $$('[data-role="profileImage"]', root),
      title:        (root) => $$('[data-role="title"]', root),
      role:         (root) => $$('[data-role="role"]', root),
      heroCTA:      (root) => $$('[data-role="heroCTA"]', root),
    };
    const P1_EFFECTS = {
      logo:         { effect: 'drop-elegant', mobileVariant: 'drop-elegant-m', duration: 800 },
      profileImage: { effect: 'drop-elegant', mobileVariant: 'drop-elegant-m', duration: 800 },
      title:        { effect: 'rise-soft',    mobileVariant: 'rise-soft-m',    duration: 600 },
      role:         { effect: 'fade-up',      mobileVariant: 'fade-up-m',      duration: 520 },
      heroCTA:      { effect: 'pop-in',       mobileVariant: 'pop-in-m',       duration: 520 },
    };
    const P1_ORDER = ['logo','profileImage','title','role','heroCTA'];

    function collectPhaseEls_P1(phaseRoot){
      const bundles = [];
      P1_ORDER.forEach(role => {
        const getter = P1_ROLES[role];
        if (!getter) return;
        let nodes = getter(phaseRoot);
        if (!nodes.length) return;
        nodes = nodes.sort((a,b) => {
          const ai = Number(a.getAttribute('data-order') ?? 0);
          const bi = Number(b.getAttribute('data-order') ?? 0);
          return ai - bi;
        });
        bundles.push({ role, nodes });
      });
      return bundles;
    }

    async function runP1(){
      const root = document.querySelector('[data-phase="P1"]');
      if (!root) return;

      // Flow open delay
      if (OPEN_DELAY > 0) await delay(OPEN_DELAY);

      // Legacy global start delay (kept)
      if (START_DELAY_MS > 0) await delay(START_DELAY_MS);

      const bundles = collectPhaseEls_P1(root);
      if (!bundles || !bundles.length) return;

      if (typeof window.gtag === 'function') {
        try { window.gtag('event', 'flow_phase_started', { process: PROCESS, phase: 'P1' }); } catch(_){}
      }

      let base = 0;
      bundles.forEach(({ role, nodes }) => {
        const preset = P1_EFFECTS[role] || {};
        runBatch(nodes, {
          baseDelay: base,
          stagger: STAGGER,
          effect: preset.effect,
          mobileVariant: preset.mobileVariant,
          duration: preset.duration
        });
        base += STAGGER;
      });

      if (typeof window.gtag === 'function') {
        const approx = Math.max(1200, OPEN_DELAY + START_DELAY_MS + (P1_ORDER.length * STAGGER) + 600);
        setTimeout(() => {
          try { window.gtag('event', 'flow_phase_done', { process: PROCESS, phase: 'P1' }); } catch(_){}
        }, approx);
      }
    }

    // ---------- Scroll Phases skeleton (P2..P6) ----------
    const IO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        const phase = el.getAttribute('data-phase');
        const th = Number(THRESHOLDS[phase] ?? 0.15);

        if (entry.isIntersecting && entry.intersectionRatio >= th) {
          // TODO: runPhase(phase, el) when maps/effects for P2..P6 are defined
          if (RUN_ONCE) IO.unobserve(el);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: [0, 0.1, 0.15, 0.25, 0.5, 0.75, 1]
    });

    function watchScrollPhases(){
      ['P2','P3','P4','P5','P6'].forEach(p => {
        const root = document.querySelector(`[data-phase="${p}"]`);
        if (root) IO.observe(root);
      });
    }

    // ---------- Parallax BG (unchanged API; cardReady-friendly) ----------
    function initParallaxBG() {
      try {
        const cfg  = (window.cardData && window.cardData.theme && window.cardData.theme.bg) || {};
        const root = document.documentElement;
        const bg   = document.querySelector(".card .parallax-bg");
        if (!bg) return;

        if (cfg.url)             root.style.setProperty("--card-bg-image", `url("${cfg.url}")`);
        if (cfg.positionX)       root.style.setProperty("--card-bg-position-x", String(cfg.positionX));
        if (cfg.positionY)       root.style.setProperty("--card-bg-position-y", String(cfg.positionY));
        if (cfg.size)            root.style.setProperty("--card-bg-size", String(cfg.size));
        if (cfg.repeat)          root.style.setProperty("--card-bg-repeat", String(cfg.repeat));
        if (cfg.opacity != null) root.style.setProperty("--card-bg-opacity", String(cfg.opacity));
        if (cfg.blur)            root.style.setProperty("--card-bg-blur", String(cfg.blur));
        if (cfg.scrollFactor != null) bg.style.setProperty("--scroll-factor", String(cfg.scrollFactor));

        if (bg.__parallaxBound) {
          requestAnimationFrame(apply);
          return;
        }

        const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const getFactor = () => {
          if (prefersReduced) return 0;
          const v = parseFloat(getComputedStyle(bg).getPropertyValue("--scroll-factor"));
          return Number.isFinite(v) ? v : 0.3;
        };

        let rafId = null;
        function apply() {
          const offset = window.scrollY * getFactor();
          bg.style.backgroundPosition = `center ${offset}px`;
          rafId = null;
        }
        function onScroll() { if (rafId == null) rafId = requestAnimationFrame(apply); }

        apply();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", () => requestAnimationFrame(apply), { passive: true });
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") requestAnimationFrame(apply);
        });

        bg.__parallaxBound = true;
      } catch (e) {
        console.warn("Anim BG Parallax init error:", e);
      }
    }

    function armParallaxInit(){
      // If cardReady already fired, init now; otherwise wait for it.
      if (window.__cardReadyFired) {
        initParallaxBG();
      } else {
        document.addEventListener("cardReady", initParallaxBG, { once: true });
      }
    }

    // ---------- Legacy: capture cardReady if dispatched before listeners ----------
    const _origDispatch = document.dispatchEvent.bind(document);
    document.dispatchEvent = function (ev) {
      if (ev && ev.type === "cardReady") { window.__cardReadyFired = true; }
      return _origDispatch(ev);
    };

    // ---------- Main arming (keeps legacy waits) ----------
    async function armOnce(){
      try {
        // 1) DOM ready
        await waitFor(() => document.readyState !== "loading", { timeout: 10000 });
        // 2) isInitialized === true
        await waitFor(() => window.isInitialized === true, { timeout: 15000 });

        // 3) wait for cardReady or fallback after 3s
        if (!window.__cardReadyFired) {
          await new Promise(res => {
            const to = setTimeout(res, 3000);
            document.addEventListener("cardReady", () => { clearTimeout(to); res(); }, { once: true });
          });
        }

    // Parallax init (same timing as before)
armParallaxInit();

// --- Force background init (in case cardReady wasn't dispatched)
if (window.cardData?.theme?.bg?.url) {
  const bg = window.cardData.theme.bg;
  document.documentElement.style.setProperty("--card-bg-image", `url("${bg.url}")`);
}

// Run Flow P1 + prepare scroll phases
runP1();
watchScrollPhases();
} catch (e) {
  console.warn("Flow arm error:", e.message);
  // In case of failure, at least init parallax
  armParallaxInit();
}

    }

    // BFCache: re-run when returning to the page
    window.addEventListener("pageshow", (ev) => {
      if (ev.persisted) {
        // Re-run P1 and observers so flow appears consistent
        runP1();
        watchScrollPhases();
      }
    });

    // If tab becomes visible again and nothing ran (rare), arm again
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        // lightweight re-arm
        runP1();
      }
    });

    // Kickoff once
    armOnce();

  } catch (e) {
    console.warn("Animations init error:", e);
  }
})();
