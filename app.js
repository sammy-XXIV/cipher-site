const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
document.querySelectorAll('.grid,.steps').forEach(g => [...g.children].forEach((c, i) => c.style.transitionDelay = i * 80 + 'ms'));

const story = document.getElementById('agent');
if (story) {
  const stage = document.getElementById('stage'), tap = document.getElementById('tap');
  const title = document.getElementById('st-title'), ag = document.getElementById('ag');
  const rails = { t: document.getElementById('r-t'), e: document.getElementById('r-e'), s: document.getElementById('r-s') };
  const G = {
    Binance: '<path d="M12 3l2.5 2.5L12 8 9.5 5.5zM12 16l2.5 2.5L12 21l-2.5-2.5zM3 12l2.5-2.5L8 12l-2.5 2.5zM16 12l2.5-2.5L21 12l-2.5 2.5zM12 9.5l2.5 2.5-2.5 2.5L9.5 12z"/>',
    Bybit: '<path d="M7 4v16M7 4h6a3.5 3.5 0 010 7H7m0 0h7a4 4 0 010 8H7"/><path d="M18 4v7" stroke-dasharray="1 3"/>',
    OKX: '<rect x="3" y="3" width="6" height="6"/><rect x="15" y="3" width="6" height="6"/><rect x="9" y="9" width="6" height="6"/><rect x="3" y="15" width="6" height="6"/><rect x="15" y="15" width="6" height="6"/>',
    MEXC: '<path d="M3 19V5l9 9 9-9v14"/>',
    Hyperliquid: '<path d="M12 3c4 5 7 8 7 12a7 7 0 01-14 0c0-4 3-7 7-12z"/><path d="M9 15a3 3 0 003 3"/>',
    DexScreener: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M7 13l3-3 3 2 4-4"/>',
    CoinGecko: '<circle cx="12" cy="12" r="9"/><circle cx="15" cy="10" r="2.5"/><path d="M6 15c3 3 8 3 12 0"/>',
    'EMA 20/50': '<path d="M3 17c5 0 6-10 11-10 3 0 5 2 7 3"/><path d="M3 20c6 0 8-6 12-6 3 0 4 1 6 2" stroke-dasharray="3 2"/>',
    RSI: '<path d="M3 8h18M3 16h18" stroke-dasharray="2 3" opacity=".6"/><path d="M3 14l4-6 4 8 4-9 3 5 3-2"/>',
    MACD: '<path d="M5 20v-6M9 20v-10M13 20v-4M17 20v-8" stroke-width="3"/><path d="M3 8c4 4 8-4 18 2"/>',
    Bollinger: '<path d="M3 6c5 0 6 5 9 5s4-5 9-5M3 18c5 0 6-5 9-5s4 5 9 5"/><path d="M3 12h18" stroke-dasharray="2 3"/>',
    'Whale feed': '<path d="M2 13c0-4 4-7 9-7 3 0 5 1 6 3l4-3c0 3-1 5-3 6 0 3-3 6-8 6-5 0-8-2-8-5z"/><path d="M8 4c0 1 1 2 2 2M7 11h.01"/>'
  };
  const C = { Binance: '#F0B90B', Bybit: '#F7A600', OKX: '#FFFFFF', MEXC: '#2F7BF5', Hyperliquid: '#97FCE4', DexScreener: '#C9D3E0', CoinGecko: '#8DC63F', 'EMA 20/50': '#6bb7d6', RSI: '#a88bd9', MACD: '#e07a9b', Bollinger: '#d9915f', 'Whale feed': '#4DA3FF' };
  const items = [['Binance'], ['Bybit'], ['OKX'], ['MEXC'], ['Hyperliquid'], ['DexScreener'], ['CoinGecko'], ['EMA 20/50', 'ind'], ['RSI', 'ind'], ['MACD', 'ind'], ['Bollinger', 'ind'], ['Whale feed', 'wh']];
  const chips = items.map(([n, k], i) => {
    const el = Object.assign(document.createElement('span'), { className: 'chip ' + (k || ''), title: n, innerHTML: `<svg viewBox="0 0 24 24" aria-hidden="true">${G[n]}</svg><small>${n}</small>` });
    el.dataset.n = n; el.style.color = C[n];
    el.a = (i / items.length) * Math.PI * 2 - Math.PI / 2; el.r = i % 2 ? .42 : .3;
    stage.insertBefore(el, ag); return el;
  });
  const clamp = v => Math.min(1, Math.max(0, v)), ease = t => 1 - (1 - t) ** 3;
  let done = false;
  const setRail = on => { rails.t.style.top = on ? '10%' : '50%'; rails.e.style.top = '50%'; rails.s.style.top = on ? '90%' : '50%'; };
  setRail(false);
  const render = () => {
    if (done) return;
    const r = story.getBoundingClientRect();
    const p = reduce ? 1 : clamp(-r.top / (r.height - innerHeight));
    const W = stage.clientWidth, H = stage.clientHeight;
    let got = 0, last = '';
    chips.forEach((c, i) => {
      const t = clamp((p - .04 - i * .045) / .32), e = ease(t);
      const k = 1 - e, x = Math.cos(c.a) * c.r * W * k * .85, y = Math.sin(c.a) * c.r * H * k * 1.5;
      c.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${1 - .5 * e})`;
      c.style.opacity = t > .92 ? 0 : 1;
      if (t >= .92) got++; else if (t > 0) last = c.dataset.n;
    });
    ag.style.setProperty('--g', got / chips.length);
    const ready = got === chips.length;
    tap.classList.toggle('on', ready); tap.tabIndex = ready ? 0 : -1;
    title.textContent = ready ? 'Ready. Your call.' : p < .03 ? 'Scroll to wake the agent' : 'Gathering what it needs…';
  };
  addEventListener('scroll', render, { passive: true }); addEventListener('resize', render); render();
  tap.onclick = () => { done = true; stage.classList.add('done'); title.textContent = 'Signal ready'; requestAnimationFrame(() => setTimeout(() => setRail(true), 250)); };
  document.getElementById('replay').onclick = () => { done = false; stage.classList.remove('done'); setRail(false); render(); };
}

// stats: count-up when revealed
document.querySelectorAll('.stat b[data-to]').forEach(b => {
  const from = +(b.dataset.from ?? 0), to = +b.dataset.to, pre = b.dataset.pre || '';
  if (reduce) return;
  b.textContent = pre + from;
  new IntersectionObserver((es, o) => es.forEach(e => {
    if (!e.isIntersecting) return; o.disconnect();
    const t0 = performance.now(), d = 1400, tick = t => { const k = Math.min(1, (t - t0) / d); b.textContent = pre + Math.round(from + (to - from) * (1 - (1 - k) ** 3)); k < 1 && requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .6 }).observe(b);
});

// scroll line timeline: line fills with scroll, nodes light as it reaches them
document.querySelectorAll('.tl').forEach(tl => {
  const items = [...tl.children];
  const update = () => {
    const r = tl.getBoundingClientRect(), fill = reduce ? r.height : Math.min(r.height, Math.max(0, innerHeight * .6 - r.top));
    tl.style.setProperty('--fill', fill + 'px');
    items.forEach(li => li.classList.toggle('on', fill >= li.offsetTop + 22));
  };
  addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update();
});
