/* Minute Book: engine. State, seeded scenario generation, money, rendering. */
(function () {
  'use strict';

  var MB = window.MB = { levels: [], numerics: {} };
  MB.level = function (def) { MB.levels.push(def); };

  var ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];
  var GRADE = {
    s: { label: 'Sound', pts: 2, mark: '✓' },
    g: { label: 'Grey', pts: 1, mark: '~', chance: 0.35, times: 2.5, name: 'loose end' },
    p: { label: 'Poor', pts: 0, mark: '✕', chance: 0.7, times: 4, name: 'liability' }
  };
  /* What a decision pays today, as a multiple of the meeting's stake. Ranges overlap on purpose. */
  var PAY = { s: [0.7, 1.3], g: [0.9, 1.7], p: [1.1, 2.4] };
  var START_RANK = 'Analyst';
  var SEED_EQUITY = 100000;
  var KEY = 'minute-book-v2';

  /* ---------- formatting ---------- */

  MB.usd = function (n) {
    var a = Math.abs(n), sign = n < 0 ? '-' : '';
    if (a >= 1e6) return sign + '$' + String(Math.round(a / 1e3) / 1e3) + ' million';
    return sign + '$' + Math.round(a).toLocaleString('en-US');
  };
  MB.cash = function (n) {
    var a = Math.abs(n), sign = n < 0 ? '−' : '';
    if (a >= 1e6) return sign + '$' + String(Math.round(a / 1e4) / 100) + 'M';
    return sign + '$' + Math.round(a).toLocaleString('en-US');
  };
  function plus(n) { return (n >= 0 ? '+' : '') + MB.cash(n); }
  MB.fix = function (n, dp) { return (Math.round(n * Math.pow(10, dp)) / Math.pow(10, dp)).toFixed(dp); };
  function round2(x) {
    if (!x) return 0;
    var a = Math.abs(x), p = Math.pow(10, Math.floor(Math.log(a) / Math.LN10 + 1e-9) - 1);
    return (x < 0 ? -1 : 1) * Math.round(a / p) * p;
  }

  function paras(text) {
    return String(text).split(/\n\s*\n/).map(function (p) { return '<p>' + p.trim() + '</p>'; }).join('');
  }

  /* ---------- seeded generation ---------- */

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  var FIRST = ['Amara', 'Dev', 'Priya', 'Marcus', 'Elena', 'Tomás', 'Wei', 'Nadia', 'Owen', 'Farah', 'Jonah', 'Ingrid', 'Kofi', 'Renée', 'Mateo', 'Sunita', 'Callum', 'Leila', 'Hiro', 'Beatrice', 'Andre', 'Yasmin', 'Graham', 'Odile'];
  var LAST = ['Okafor', 'Lindqvist', 'Batra', 'Moreau', 'Castellanos', 'Nakamura', 'Whitlock', 'Haddad', 'Brennan', 'Kowalski', 'Achebe', 'Tremblay', 'Ferreira', 'Sandhu', 'MacLeod', 'Rosen', 'Vasquez', 'Chen', 'Abernathy', 'Dubois', 'Petrov', 'Hollis', 'Iyer', 'Quint'];
  var FUNDS = ['Halyard & Pine Lending', 'Tallgrass Bridge Credit', 'Portage Row Capital', 'Cinder Lane Mortgage Fund', 'Larkmoor Credit', 'Stonewake Lending'];
  var STREETS = ['Alder Street', 'Tannery Row', 'Canal Road', 'Quarry Lane', 'Foundry Street', 'Orchard Line', 'Harbour Road', 'Wren Avenue', 'Larch Street', 'Mill Race', 'Depot Street', 'Ferry Lane'];
  var CITIES = [
    { name: 'Phoenix, Arizona', short: 'Phoenix', ca: false }, { name: 'Columbus, Ohio', short: 'Columbus', ca: false },
    { name: 'Tampa, Florida', short: 'Tampa', ca: false }, { name: 'Denver, Colorado', short: 'Denver', ca: false },
    { name: 'Nashville, Tennessee', short: 'Nashville', ca: false }, { name: 'Austin, Texas', short: 'Austin', ca: false },
    { name: 'Hamilton, Ontario', short: 'Hamilton', ca: true }, { name: 'Kelowna, British Columbia', short: 'Kelowna', ca: true },
    { name: 'Calgary, Alberta', short: 'Calgary', ca: true }, { name: 'Halifax, Nova Scotia', short: 'Halifax', ca: true },
    { name: 'Ottawa, Ontario', short: 'Ottawa', ca: true }, { name: 'Winnipeg, Manitoba', short: 'Winnipeg', ca: true }
  ];
  var ASSETS = ['a half-built townhouse site', 'a stalled condominium project', 'a serviced subdivision', 'a vacant retail plaza', 'a rental conversion', 'a mixed-use infill site'];

  function makeGen(seed) {
    var r = mulberry32(seed >>> 0);
    var usedF = {}, usedL = {}, usedS = {};
    function uniq(list, used) {
      var v, guard = 0;
      do { v = list[Math.floor(r() * list.length)]; guard++; } while (used[v] && guard < 60);
      used[v] = 1; return v;
    }
    var g = {
      rnd: r,
      int: function (lo, hi) { return lo + Math.floor(r() * (hi - lo + 1)); },
      pick: function (a) { return a[Math.floor(r() * a.length)]; },
      shuffle: function (a) {
        a = a.slice();
        for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
        return a;
      },
      /* dollars, chosen on a step in $ millions */
      m: function (lo, hi, step) {
        var k = Math.round((hi - lo) / step);
        return Math.round((lo + step * g.int(0, k)) * 1e6);
      },
      person: function () {
        var f = uniq(FIRST, usedF), l = uniq(LAST, usedL);
        return { first: f, last: l, full: f + ' ' + l, toString: function () { return f + ' ' + l; } };
      },
      city: function (which) {
        var pool = CITIES.filter(function (c) { return which === 'ca' ? c.ca : which === 'us' ? !c.ca : true; });
        var c = g.pick(pool);
        return { name: c.name, short: c.short, ca: c.ca, toString: function () { return c.short; } };
      },
      asset: function () { return g.pick(ASSETS); },
      street: function () { return uniq(STREETS, usedS); },
      spe: function (suffix) {
        return g.street().replace(/ (Street|Road|Lane|Avenue|Line)$/, '') + ' ' + g.pick(['Holdings', 'Developments', 'Lands', 'Residences']) + ' ' + (suffix || g.pick(['LP', 'LLC', 'Inc.']));
      }
    };
    g.fund = g.pick(FUNDS);
    return g;
  }

  /* ---------- state ---------- */

  var S = fresh();
  function fresh() { return { passed: {}, bestEquity: null, unlockAll: false, run: null }; }

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) { var d = JSON.parse(raw); if (d && typeof d === 'object') S = Object.assign(fresh(), d); }
    } catch (e) { /* storage may be unavailable; play on without it */ }
  }
  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
  }

  function level(n) { return MB.levels[n - 1]; }
  function isOpen(n) { return n === 1 || S.unlockAll || !!S.passed[n - 1] || !!S.passed[n]; }
  function rank() {
    var r = START_RANK;
    for (var i = 1; i <= MB.levels.length; i++) { if (S.passed[i]) r = level(i).rank; else break; }
    return r;
  }
  function nextLevel() {
    for (var i = 1; i <= MB.levels.length; i++) if (!S.passed[i]) return i;
    return null;
  }
  function passedCount() { return Object.keys(S.passed).length; }
  function equity() {
    var e = SEED_EQUITY;
    Object.keys(S.passed).forEach(function (k) { e += S.passed[k].net || 0; });
    return e;
  }
  /* Standing is the average quality of the sittings on record. It starts unproven at 50. */
  function standing() {
    var ks = Object.keys(S.passed);
    if (!ks.length) return 50;
    return Math.round(ks.reduce(function (t, k) { return t + S.passed[k].pct; }, 0) / ks.length * 100);
  }
  function trustOf(st) { return 0.75 + st / 200; }
  function stake(n) { return round2(20000 * Math.pow(1.4, n - 1)); }

  /* ---------- runs ---------- */

  var cache = { key: '', items: [] };

  function buildItems(run) {
    var key = run.n + ':' + run.seed + ':' + run.trust;
    if (cache.key === key) return cache.items;
    var L = level(run.n), g0 = makeGen(run.seed), B = stake(run.n), trust = run.trust || 1;
    var authored = L.fixed ? L.scenarios.slice() : g0.shuffle(L.scenarios).slice(0, L.draw.authored);
    var nums = g0.shuffle(L.numerics || []).slice(0, L.draw.numeric || 0);
    var order = authored.map(function (sc) { return { kind: 'choice', def: sc }; });
    nums.forEach(function (k) {
      var at = g0.int(1, order.length);
      order.splice(at, 0, { kind: 'numeric', key: k });
    });
    var story = L.story ? L.story(makeGen(run.seed ^ hash('story'))) : null;
    var items = order.map(function (o) {
      if (o.kind === 'numeric') {
        var gn = makeGen(run.seed ^ hash('n:' + o.key));
        var inst = MB.numerics[o.key](gn);
        inst.kind = 'numeric'; inst.id = o.key; inst.stake = round2(B * trust);
        return inst;
      }
      var gc = makeGen(run.seed ^ hash(o.def.id));
      gc.story = story;
      var made = o.def.make(gc);
      var gm = makeGen(run.seed ^ hash('cash:' + o.def.id));
      made.kind = 'choice'; made.id = o.def.id; made.title = o.def.title; made.builds = o.def.builds || [];
      made.options = gc.shuffle(made.options.map(function (a) {
        var range = PAY[a[0]], m = range[0] + gm.rnd() * (range[1] - range[0]);
        var cash = round2(B * m * (a[0] === 's' ? trust : 1));
        return { g: a[0], t: a[1], why: a[2], cash: cash, risk: a[0] === 's' ? 0 : round2(cash * GRADE[a[0]].times) };
      }));
      return made;
    });
    cache = { key: key, items: items };
    return items;
  }
  MB._buildItems = buildItems;

  function startRun(n) {
    S.run = { n: n, seed: (Math.random() * 4294967296) >>> 0, trust: trustOf(standing()), practice: !!S.passed[n], phase: 'brief', step: 0, answers: [], result: null };
    save();
  }

  function gradeNumeric(item, raw) {
    var txt = String(raw).replace(/[$,%x×\s]/gi, '').replace(/million|m$/i, '');
    var v = parseFloat(txt);
    if (!isFinite(v)) return null;
    var a = item.answer;
    if (item.unit === 'musd' && Math.abs(v) >= 10000) v = v / 1e6;
    var tol = item.unit === 'pct' ? 0.15 : item.unit === 'x' ? 0.011 : item.unit === 'count' ? 0.001 : Math.max(0.002, Math.abs(a) * 0.006);
    var diff = Math.abs(v - a);
    var k = diff <= tol ? 's' : (item.unit !== 'count' && diff <= Math.abs(a) * 0.05) ? 'g' : 'p';
    return { value: v, g: k };
  }
  MB._gradeNumeric = gradeNumeric;

  function fmtAnswer(item, v) {
    if (item.unit === 'pct') return MB.fix(v, 1) + '%';
    if (item.unit === 'x') return MB.fix(v, 2) + 'x';
    if (item.unit === 'count') return String(Math.round(v));
    return MB.usd(Math.round(v * 1e6));
  }
  var UNIT_HINT = {
    pct: 'A percentage to one decimal, for example 62.5',
    x: 'A ratio to two decimals, for example 1.25',
    musd: 'In $ millions, for example 1.25',
    count: 'A whole number'
  };

  function tally(run) {
    var t = { cash: 0, open: 0, risk: 0 };
    run.answers.forEach(function (a) { t.cash += a.cash; if (a.risk) { t.open++; t.risk += a.risk; } });
    return t;
  }

  function finishRun() {
    var run = S.run, items = buildItems(run), L = level(run.n);
    var pts = run.answers.reduce(function (t, a) { return t + GRADE[a.g].pts; }, 0);
    var max = items.length * 2, pct = pts / max;
    var passed = pct >= L.pass - 1e-9;
    var before = rank(), first = false, gross = 0, losses = 0, reckon = [];
    run.answers.forEach(function (a, i) {
      gross += a.cash;
      if (passed && a.risk) {
        var due = makeGen(run.seed ^ hash('reckon:' + i)).rnd() < GRADE[a.g].chance;
        if (due) losses += a.risk;
        reckon.push({ i: i, g: a.g, due: due, cost: a.risk });
      }
    });
    var net = passed ? gross - losses : 0;
    if (passed && !S.passed[run.n]) {
      first = true;
      S.passed[run.n] = { pct: pct, net: net, gold: pct === 1 };
      if (passedCount() === MB.levels.length) S.bestEquity = Math.max(S.bestEquity === null ? -Infinity : S.bestEquity, equity());
    }
    run.phase = 'done';
    run.result = { pts: pts, max: max, pct: pct, passed: passed, first: first, gross: gross, losses: losses, net: net, reckon: reckon, promoted: rank() !== before ? rank() : null };
    save();
  }

  /* ---------- views ---------- */

  function chip(k) { return '<span class="chip g-' + k + '"><span aria-hidden="true">' + GRADE[k].mark + '</span> ' + GRADE[k].label + '</span>'; }

  function sealSVG(n, gold) {
    var pts = [], lobes = 28, R = 92, r2 = 86, i;
    for (i = 0; i < lobes * 2; i++) {
      var ang = Math.PI * i / lobes, rad = i % 2 ? r2 : R;
      pts.push((100 + rad * Math.cos(ang)).toFixed(1) + ',' + (100 + rad * Math.sin(ang)).toFixed(1));
    }
    return '<svg class="seal ' + (gold ? 'gold' : 'wax') + '" viewBox="0 0 200 200" role="img" aria-label="' + (gold ? 'Gold seal' : 'Seal') + ' for Meeting ' + ROMAN[n] + '">' +
      '<polygon class="seal-edge" points="' + pts.join(' ') + '"/>' +
      '<circle class="seal-ring" cx="100" cy="100" r="74"/><circle class="seal-ring" cx="100" cy="100" r="46"/>' +
      '<defs><path id="arc-t-' + n + '" d="M 40 100 A 60 60 0 0 1 160 100"/><path id="arc-b-' + n + '" d="M 33 100 A 67 67 0 0 0 167 100"/></defs>' +
      '<text class="seal-text"><textPath href="#arc-t-' + n + '" startOffset="50%" text-anchor="middle">MINUTE BOOK</textPath></text>' +
      '<text class="seal-text"><textPath href="#arc-b-' + n + '" startOffset="50%" text-anchor="middle">' + (gold ? 'WITHOUT DISSENT' : 'DULY PASSED') + '</textPath></text>' +
      '<text class="seal-num" x="100" y="100" text-anchor="middle" dominant-baseline="central">' + ROMAN[n] + '</text></svg>';
  }

  function folio(left, right) {
    return '<div class="folio"><span>' + left + '</span><span>' + (right || '') + '</span></div>';
  }

  function viewContents() {
    var nx = nextLevel(), run = S.run, done = passedCount();
    var cta;
    if (run && run.phase !== 'done') cta = '<a class="btn" href="#meeting-' + run.n + '">Return to Meeting ' + ROMAN[run.n] + '</a>';
    else if (nx) cta = '<a class="btn" href="#meeting-' + nx + '">' + (done ? 'Attend Meeting ' + ROMAN[nx] : 'Attend your first meeting') + '</a>';
    else cta = '<button class="btn" data-act="career-ask">Start a new career</button>';
    var rows = MB.levels.map(function (L) {
      var p = S.passed[L.n], open = isOpen(L.n);
      var st = p ? '<span class="m-status passed">' + plus(p.net) + '</span>'
        : open ? '<span class="m-status open">Open</span>' : '<span class="m-status locked">Locked</span>';
      var inner = '<span class="m-num">' + ROMAN[L.n] + '</span><span class="m-main"><span class="m-title">' + L.title + '</span><span class="m-topics">' + L.topics + '</span></span>' + st;
      return open ? '<li class="meeting"><a href="#meeting-' + L.n + '">' + inner + '</a></li>'
        : '<li class="meeting is-locked"><div aria-disabled="true">' + inner + '</div></li>';
    }).join('');
    var best = S.bestEquity !== null ? '<span class="career-best">Best career ' + MB.cash(S.bestEquity) + '</span>' : '';
    return folio('Contents', done + ' of ' + MB.levels.length + ' meetings on record') +
      '<h1 class="display">Get rich. Stay out of court.</h1>' +
      '<p class="lede">A corporate equity and governance game. Thirteen meetings, a few decisions each. Every decision pays today. Some come back for the money later.</p>' +
      '<div class="career"><div><span class="label">Your equity</span><span class="career-rank">' + MB.cash(equity()) + '</span>' + best + '</div><div id="career-zone">' + cta + '</div></div>' +
      '<ol class="meetings">' + rows + '</ol>';
  }

  function viewBrief(L, run) {
    var terms = L.concepts.map(function (c) { return '<div class="term"><dt>' + c[0] + '</dt><dd>' + c[1] + '</dd></div>'; }).join('');
    var n = (L.fixed ? L.scenarios.length : L.draw.authored + (L.draw.numeric || 0));
    return folio('Meeting ' + ROMAN[L.n], run.practice ? 'Practice sitting' : 'Before the meeting') +
      '<h1 class="display">' + L.title + '</h1>' +
      '<p class="lede">' + L.blurb + '</p>' +
      '<ul class="stakes"><li><b>' + n + '</b> decisions</li><li>about <b>' + MB.cash(stake(L.n)) + '</b> each</li><li>pass at <b>' + Math.round(L.pass * 100) + '%</b></li></ul>' +
      (run.practice ? '<p class="note">This meeting is already on your record. Sit it again for practice. Nothing is banked.</p>' : '') +
      '<div class="actions"><button class="btn" data-act="order">Call the meeting to order</button><a class="btn quiet" href="#contents">Back to contents</a></div>' +
      '<details class="more"><summary>Terms for this meeting (' + L.concepts.length + ')</summary><dl class="terms">' + terms + '</dl></details>';
  }

  function pips(items, run) {
    return '<ol class="pips" aria-label="Agenda progress">' + items.map(function (it, i) {
      var a = run.answers[i];
      var cls = a ? 'g-' + a.g : (i === run.step ? 'now' : '');
      return '<li class="' + cls + '"><span class="vh">Item ' + (i + 1) + (a ? ': ' + GRADE[a.g].label : i === run.step ? ': current' : '') + '</span></li>';
    }).join('') + '</ol>';
  }

  function tallyRow(run) {
    var t = tally(run);
    return '<div class="tally"><span><span class="label">On the table</span> <b>' + plus(t.cash) + '</b></span>' +
      '<span class="' + (t.open ? 'has-risk' : '') + '"><span class="label">Loose ends</span> <b>' + t.open + '</b>' + (t.open ? ' <span class="at-risk">' + MB.cash(t.risk) + ' at risk</span>' : '') + '</span></div>';
  }

  function moneyLine(o, mine) {
    if (mine) {
      if (o.g === 's') return '<b>' + plus(o.cash) + '</b> banked. Nothing follows you.';
      return '<b>' + plus(o.cash) + '</b> today, and a ' + GRADE[o.g].name + ' that could cost <b>' + MB.cash(o.risk) + '</b>.';
    }
    if (o.g === 's') return 'Would have paid <b>' + plus(o.cash) + '</b>, with nothing to follow.';
    return 'Would have paid <b>' + plus(o.cash) + '</b>, with a ' + GRADE[o.g].name + ' of up to <b>' + MB.cash(o.risk) + '</b>.';
  }

  function moreBlock(it) {
    var parts = '';
    if (it.us) parts += '<div class="juris-one"><span class="label">United States</span><p>' + it.us + '</p></div>';
    if (it.ca) parts += '<div class="juris-one"><span class="label">Canada</span><p>' + it.ca + '</p></div>';
    return parts ? '<details class="more"><summary>Country notes</summary>' + parts + '</details>' : '';
  }

  function viewPlay(L, run) {
    var items = buildItems(run), it = items[run.step], ans = run.answers[run.step];
    var last = run.step === items.length - 1;
    var body = '', ruling = '';
    if (it.kind === 'choice') {
      body = '<div class="opts"' + (ans ? ' id="outcome" tabindex="-1"' : '') + ' role="group" aria-label="Motions">' + it.options.map(function (o, i) {
        var letter = 'abcdef'.charAt(i);
        var pay = '<span class="opt-pay">' + plus(o.cash) + '</span>';
        if (!ans) return '<button class="opt" data-act="choose" data-i="' + i + '"><span class="opt-l">(' + letter + ')</span><span class="opt-t">' + o.t + '</span>' + pay + '</button>';
        var mine = ans.pick === i;
        return '<div class="opt done g-' + o.g + (mine ? ' chosen' : '') + '"><span class="opt-l">(' + letter + ')</span><span class="opt-t">' + o.t +
          '<span class="opt-money">' + moneyLine(o, mine) + '</span><span class="opt-why">' + o.why + '</span></span>' +
          '<span class="opt-tags">' + chip(o.g) + (mine ? '<span class="yours">Your motion</span>' : '') + '</span></div>';
      }).join('') + '</div>';
    } else if (!ans) {
      body = '<form class="ledger-form" data-act="figure" novalidate><label for="figure">Your figure <span class="opt-pay">' + plus(it.stake) + ' if right</span></label>' +
        '<div class="ledger-row"><input id="figure" name="figure" inputmode="decimal" autocomplete="off" aria-describedby="figure-hint figure-err"><button class="btn" type="submit">Enter in the ledger</button></div>' +
        '<p class="hint" id="figure-hint">' + UNIT_HINT[it.unit] + '</p><p class="err" id="figure-err" role="alert"></p></form>';
    } else {
      ruling = '<div class="ruling g-' + ans.g + '"><p class="ruling-money">' + chip(ans.g) + ' <b>' + plus(ans.cash) + '</b>. You entered ' + fmtAnswer(it, ans.value) + '. The figure is <b>' + fmtAnswer(it, it.answer) + '</b>.</p>' +
        '<ol class="work">' + it.work.map(function (w) { return '<li>' + w + '</li>'; }).join('') + '</ol></div>';
    }
    return folio('Meeting ' + ROMAN[L.n] + ' · ' + L.title, 'Item ' + (run.step + 1) + ' of ' + items.length + (run.practice ? ' · practice' : '')) + pips(items, run) + tallyRow(run) +
      '<h1 class="item-title">' + it.title + '</h1>' +
      '<div class="scene">' + paras(it.scene) + '</div>' + (it.ask ? '<p class="ask">' + it.ask + '</p>' : '') + body +
      (ans ? '<div class="review" id="review" tabindex="-1">' + ruling +
        '<p class="rule-line"><span class="label">The principle</span> ' + it.rule + '</p>' +
        '<div class="actions"><button class="btn" data-act="next">' + (last ? 'Adjourn the meeting' : 'Next item') + '</button></div>' +
        moreBlock(it) + '</div>' : '');
  }

  function viewDone(L, run) {
    var items = buildItems(run), res = run.result;
    var minutes = items.map(function (it, i) {
      var a = run.answers[i];
      return '<li><span class="min-n">' + (i + 1) + '.</span><span class="min-body">' + it.title + '</span><span class="min-cash">' + plus(a.cash) + '</span>' + chip(a.g) + '</li>';
    }).join('');
    var nxt = L.n < MB.levels.length ? L.n + 1 : null;
    var head, sub, money = '';
    if (res.passed) {
      head = res.pct === 1 ? 'Carried without dissent.' : 'Motion carried.';
      sub = res.pts + ' of ' + res.max + ' points. ' +
        (run.practice ? 'A practice sitting. Nothing is banked.' : (res.promoted ? 'You now sit as <b>' + res.promoted + '</b>.' : ''));
      var reck = res.reckon.length
        ? '<ul class="reckon">' + res.reckon.map(function (r) {
          return '<li class="' + (r.due ? 'due' : 'quiet') + '"><span>Item ' + (r.i + 1) + ', ' + items[r.i].title + '</span><b>' + (r.due ? 'Came due ' + MB.cash(-r.cost) : 'Never surfaced') + '</b></li>';
        }).join('') + '</ul>'
        : '<p class="note">No loose ends. Nothing came back.</p>';
      money = '<h2 class="section">The reckoning</h2>' + reck +
        '<dl class="ledger"><div><dt>Taken at the table</dt><dd>' + plus(res.gross) + '</dd></div><div><dt>Came due</dt><dd>' + MB.cash(-res.losses) + '</dd></div>' +
        '<div class="total"><dt>Net for the meeting</dt><dd>' + plus(res.net) + '</dd></div>' +
        (run.practice ? '' : '<div><dt>Your equity</dt><dd>' + MB.cash(equity()) + '</dd></div>') + '</dl>';
      if (!run.practice && L.n === MB.levels.length && passedCount() === MB.levels.length) {
        sub += ' Your career closes at <b>' + MB.cash(equity()) + '</b>.';
      }
    } else {
      head = 'The motion failed.';
      sub = res.pts + ' of ' + res.max + ' points, and you needed ' + Math.ceil(L.pass * res.max - 1e-9) + '. The deals died with the vote, so nothing is banked. Sit it again.';
    }
    var acts = '';
    if (res.passed && nxt) acts += '<a class="btn" href="#meeting-' + nxt + '">Go to Meeting ' + ROMAN[nxt] + '</a>';
    acts += '<button class="btn ' + (res.passed && nxt ? 'quiet' : '') + '" data-act="again">' + (res.passed ? 'Sit it again for practice' : 'Sit this meeting again') + '</button><a class="btn quiet" href="#contents">Contents</a>';
    return folio('Meeting ' + ROMAN[L.n] + ' · ' + L.title, 'Adjourned') +
      '<div class="verdict' + (res.passed ? ' passed' : '') + '">' + (res.passed ? sealSVG(L.n, res.pct === 1) : '') +
      '<div><h1 class="display small">' + head + '</h1><p class="lede">' + sub + '</p></div></div>' + money +
      '<h2 class="section">Minutes</h2><ol class="minutes">' + minutes + '</ol>' +
      '<div class="actions">' + acts + '</div>';
  }

  function viewRegisters() {
    var count = 0;
    var groups = MB.levels.map(function (L) {
      var has = !!S.passed[L.n] || S.unlockAll;
      if (has) count += L.concepts.length;
      var inner = has
        ? '<dl class="terms">' + L.concepts.map(function (c) { return '<div class="term"><dt>' + c[0] + '</dt><dd>' + c[1] + '</dd></div>'; }).join('') + '</dl>'
        : '<p class="blank">' + L.concepts.length + ' terms are entered here when you pass Meeting ' + ROMAN[L.n] + '.</p>';
      return '<section class="reg"><h2 class="section"><span class="m-num">' + ROMAN[L.n] + '</span> ' + L.title + '</h2>' + inner + '</section>';
    }).join('');
    return folio('Registers', count + ' terms entered') +
      '<h1 class="display small">What the book now holds.</h1>' +
      '<p class="lede">Each meeting you pass enters its terms here.</p>' + groups;
  }

  function viewAbout() {
    return folio('About', 'How the book works') +
      '<h1 class="display small">How the book works.</h1>' +
      '<div class="prose">' +
      '<p>Minute Book is a corporate equity and governance game set in real estate lending, development and private equity. Finish with as much equity as you can.</p>' +
      '<h2 class="section">Money</h2>' +
      '<p>You start with ' + MB.cash(SEED_EQUITY) + '. Every motion shows what it pays today. ' + chip('s') + ' motions pay and nothing follows you. ' + chip('g') + ' motions leave a loose end: about one in three comes due, at two and a half times what you took. ' + chip('p') + ' motions leave a liability: most come due, at four times. You are not told which is which until you choose.</p>' +
      '<p>The reckoning happens when the meeting adjourns. The stakes grow with every meeting.</p>' +
      '<h2 class="section">Standing</h2>' +
      '<p>Standing is the quality of the sittings on your record. The better it is, the more your sound work pays, up to a quarter more. Trust compounds.</p>' +
      '<h2 class="section">Passing</h2>' +
      '<p>A meeting passes at 70% of its points: 2 for sound, 1 for grey, 0 for poor. The last needs 80%. Fail and nothing is banked. Your first passed sitting goes on the record for good. After that, a meeting can only be sat for practice. To try for a better number, start a new career.</p>' +
      '<h2 class="section">What this is not</h2>' +
      '<p>It is not legal advice. The law differs by state, province and country, and the agreement in front of you usually matters more than the general rule. All names and entities are invented.</p>' +
      '<h2 class="section">Settings</h2>' +
      '<div class="settings">' +
      '<label class="check" for="unlock-all"><input type="checkbox" id="unlock-all" data-act="unlock"' + (S.unlockAll ? ' checked' : '') + '> Open every meeting and the full Registers, skipping the progression</label>' +
      '<div id="career-zone"><button class="btn quiet" data-act="career-ask">Start a new career</button></div>' +
      (window.MB_LOCK ? '<button class="btn quiet" data-act="lock">Lock the book on this device</button>' : '') +
      '</div></div>';
  }

  /* ---------- shell ---------- */

  var sheet, standingEl;

  function renderStanding() {
    var st = standing(), label = !passedCount() ? 'Unproven' : st >= 85 ? 'Relied upon' : 'Trusted';
    standingEl.innerHTML =
      '<div class="who"><span class="label">Seat</span><b>' + rank() + '</b></div>' +
      '<div class="who"><span class="label">Equity</span><b class="eq">' + MB.cash(equity()) + '</b></div>' +
      '<div class="meter"><span class="label">Standing</span><span class="bar"><i style="width:' + st + '%"></i></span><span class="meter-v">' + label + ' · sound work pays ×' + MB.fix(trustOf(st), 2) + '</span></div>';
  }

  function route() {
    var h = (window.location.hash || '').replace(/^#/, '');
    var m = /^meeting-(\d+)$/.exec(h);
    if (m) { var n = parseInt(m[1], 10); if (level(n)) return { view: 'meeting', n: n }; }
    if (h === 'registers' || h === 'about') return { view: h };
    return { view: 'contents' };
  }

  function render(focusId) {
    var r = route(), html, tab = r.view === 'meeting' ? 'contents' : r.view;
    if (r.view === 'meeting') {
      if (!isOpen(r.n)) { window.location.hash = 'contents'; return; }
      if (!S.run || S.run.n !== r.n) startRun(r.n);
      var L = level(r.n), run = S.run;
      html = run.phase === 'brief' ? viewBrief(L, run) : run.phase === 'play' ? viewPlay(L, run) : viewDone(L, run);
    } else if (r.view === 'registers') html = viewRegisters();
    else if (r.view === 'about') html = viewAbout();
    else html = viewContents();
    sheet.innerHTML = html;
    Array.prototype.forEach.call(document.querySelectorAll('.tabs a'), function (a) {
      if (a.getAttribute('data-tab') === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    renderStanding();
    var target = focusId ? document.getElementById(focusId) : null;
    if (target) { target.focus({ preventScroll: true }); target.scrollIntoView({ block: 'nearest', behavior: 'auto' }); }
    else if (focusId !== false) { window.scrollTo(0, 0); }
  }

  function onClick(e) {
    var el = e.target.closest('[data-act]');
    if (!el || el.tagName === 'FORM') return;
    var act = el.getAttribute('data-act'), run = S.run;
    if (act === 'order' && run) { run.phase = 'play'; save(); render(); }
    else if (act === 'choose' && run && run.phase === 'play' && !run.answers[run.step]) {
      var i = parseInt(el.getAttribute('data-i'), 10), o = buildItems(run)[run.step].options[i];
      run.answers[run.step] = { pick: i, g: o.g, cash: o.cash, risk: o.risk };
      save(); render('outcome');
    }
    else if (act === 'next' && run && run.answers[run.step]) {
      if (run.step >= buildItems(run).length - 1) finishRun(); else { run.step++; save(); }
      render();
    }
    else if (act === 'again' && run) { startRun(run.n); render(); }
    else if (act === 'unlock') { S.unlockAll = el.checked; save(); }
    else if (act === 'career-ask') {
      document.getElementById('career-zone').innerHTML = '<p class="confirm">Close the book on this career and start again at ' + MB.cash(SEED_EQUITY) + '?</p><div class="actions"><button class="btn danger" data-act="career-yes">Yes, start again</button><button class="btn quiet" data-act="career-no">Keep this career</button></div>';
    }
    else if (act === 'career-no') { render(false); }
    else if (act === 'career-yes') {
      var keep = { bestEquity: S.bestEquity, unlockAll: S.unlockAll };
      S = Object.assign(fresh(), keep); cache = { key: '', items: [] }; save();
      if (route().view !== 'contents') window.location.hash = 'contents'; else render();
    }
    else if (act === 'lock') {
      try { window.localStorage.removeItem('minute-book-key-v1'); } catch (err) { /* ignore */ }
      window.location.reload();
    }
  }

  function onSubmit(e) {
    var form = e.target.closest('form[data-act="figure"]');
    if (!form) return;
    e.preventDefault();
    var run = S.run;
    if (!run || run.phase !== 'play' || run.answers[run.step]) return;
    var it = buildItems(run)[run.step];
    var res = gradeNumeric(it, form.elements.figure.value);
    if (!res) {
      document.getElementById('figure-err').textContent = 'Enter a number. ' + UNIT_HINT[it.unit] + '.';
      form.elements.figure.focus();
      return;
    }
    var cash = res.g === 's' ? it.stake : res.g === 'g' ? round2(it.stake / 2) : -round2(it.stake / 2);
    run.answers[run.step] = { value: res.value, g: res.g, cash: cash, risk: 0 };
    save(); render('review');
  }

  function boot(data) {
    sheet = document.getElementById('sheet');
    standingEl = document.getElementById('standing');
    MB.levels.sort(function (a, b) { return a.n - b.n; });
    if (data && data.state) S = Object.assign(fresh(), data.state); else load();
    if (S.run && (!level(S.run.n) || !S.run.trust)) S.run = null;
    document.addEventListener('click', onClick);
    document.addEventListener('submit', onSubmit);
    window.addEventListener('hashchange', function () { render(); });
    render(false);
  }

  MB._state = function () { return S; };
  MB._equity = equity;

  /* Called once, after every content script has registered its level. */
  MB.start = function () {
    var hot = window.claude && window.claude.hot;
    if (hot && hot.snapshot) hot.snapshot(function () { return { state: S }; });
    if (hot && hot.ready) hot.ready(boot); else boot((hot && hot.data) || {});
  };
})();
