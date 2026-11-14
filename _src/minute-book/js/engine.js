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
  /* Goodwill a first choice costs or earns. A sound choice burns more the harder someone pushed. */
  var BURN = [0, -1, -4];
  var GW = { g: 1, p: 2, due: -6, pass: 6, gold: 10 };
  /* The asks in a deal beat. pay is a multiple of the meeting's stake. */
  var ASK = {
    m: { label: 'Fair ask', tone: 's', pay: [0.4, 0.7], gw: 5 },
    r: { label: 'Strong ask', tone: 's', pay: [1.3, 2.2], gw: -1, gwNo: -5 },
    x: { label: 'Overreach', tone: 'p', pay: [1.8, 3.0], gw: -8, chance: 0.7, times: 3 },
    t: { label: 'Tone-deaf', tone: 'g', pay: [0.3, 0.6], gw: -7 },
    v: { label: 'A gift', tone: 's', pay: [0.25, 0.45], gw: 10 },
    n: { label: 'No ask', tone: 'n', pay: [0, 0], gw: 1, gwRight: 3 }
  };
  var RUN_V = 4;
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

  /* Words in a situation that the Registers define. Tapping one shows the definition. */
  var ALIAS = [
    ['special purpose entity', 'Special purpose entity'], ['good standing', 'Good standing'], ['fiduciar(?:y|ies)', 'Fiduciary'],
    ['quorum', 'Quorum'], ['written resolution', 'Written resolution'], ['ratif(?:y|ies|ied|ication)', 'Ratification'],
    ['mezzanine', 'Senior and mezzanine debt'], ['preferred equity', 'Preferred equity'], ['loan-to-value|loan-to-cost', 'Loan-to-value and loan-to-cost'],
    ['debt service coverage', 'Debt service coverage'], ['capital calls?', 'Capital call'], ['dilut(?:e|es|ed|ion)', 'Dilution'],
    ['waterfall', 'Waterfall'], ['preferred return', 'Preferred return'], ['promotes?', 'Promote'], ['catch-up', 'Catch-up'], ['clawback', 'Clawback'],
    ['general partner', 'General partner'], ['limited partners?', 'Limited partner'], ['advisory committees?', 'Advisory committee'], ['key person', 'Key person clause'],
    ['assign(?:ment|ed)?', 'Assignment'], ['novation', 'Novation'], ['termination fee', 'Termination fee'], ['change[- ]of[- ]control', 'Change of control'],
    ['contingency', 'Contingency'], ['change order', 'Change order'], ['holdback|lien', 'Lien and holdback'], ['cost to complete', 'Cost to complete'], ['builder.s risk', 'Builder\'s risk insurance'],
    ['covenant', 'Covenant'], ['forbearance', 'Forbearance agreement'], ['guarant(?:ee|or)s?', 'Guarantee'], ['intercreditor', 'Intercreditor agreement'],
    ['power of sale', 'Power of sale'], ['credit bid', 'Credit bid'], ['receiver', 'Receiver'], ['letter of intent', 'Letter of intent'],
    ['right of first refusal', 'Right of first refusal'], ['drag', 'Drag-along and tag-along'], ['side letters?', null], ['insolven(?:t|cy)', 'Insolvency'],
    ['register', 'Registers']
  ];
  var DEFS = null;
  function defs() {
    if (DEFS) return DEFS;
    DEFS = {};
    MB.levels.forEach(function (L) { L.concepts.forEach(function (c) { DEFS[c[0]] = c[1]; }); });
    DEFS['Side letter'] = 'A private agreement giving one investor terms the others do not have. Acceptable when the main agreement permits it and those entitled are told.';
    return DEFS;
  }
  function tipify(html) {
    var d = defs(), used = 0, taken = {};
    ALIAS.forEach(function (al) {
      var term = al[1] || 'Side letter';
      if (used >= 3 || taken[term] || !d[term]) return;
      var re = new RegExp('(^|[^A-Za-z<>/])(' + al[0] + ')(?![A-Za-z])(?![^<]*>)', 'i');
      if (!re.test(html)) return;
      html = html.replace(re, function (m, pre, word) { return pre + '<button type="button" class="tip" data-act="tip" data-term="' + term.replace(/"/g, '&quot;') + '">' + word + '</button>'; });
      taken[term] = 1; used++;
    });
    return html;
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
  function fresh() { return { passed: {}, seen: {}, bestEquity: null, unlockAll: false, run: null }; }

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
  function clamp(v) { return Math.max(0, Math.min(100, v)); }
  /* Goodwill is what partners, borrowers and vendors think of dealing with you. It starts at 50. */
  function goodwill() {
    var gw = 50;
    Object.keys(S.passed).forEach(function (k) { gw += S.passed[k].gw || 0; });
    return clamp(gw);
  }
  function runGw(run) {
    return run.answers.reduce(function (t, a) { return t + (a.gw || 0) + (a.ask ? a.ask.gw : 0); }, 0);
  }
  function liveGoodwill(run) { return clamp(goodwill() + runGw(run)); }
  function reachOdds(gw) { return Math.max(0.1, Math.min(0.95, 0.15 + 0.008 * gw)); }
  /* An overreach in the deal beat costs the item a governance point. */
  function eff(a) { return a.ask && a.ask.k === 'x' && a.g === 's' ? 'g' : a.g; }
  function stake(n) { return round2(20000 * Math.pow(1.4, n - 1)); }

  /* ---------- runs ---------- */

  var cache = { key: '', items: [] };

  function buildItems(run) {
    var key = run.n + ':' + run.seed + ':' + run.trust + ':' + RUN_V + ':' + (run.ids ? run.ids.join(',') : '');
    if (cache.key === key) return cache.items;
    var L = level(run.n), g0 = makeGen(run.seed), B = stake(run.n), trust = run.trust || 1;
    var authored = L.fixed ? L.scenarios.slice() : g0.shuffle(L.scenarios).slice(0, L.draw.authored);
    if (!L.fixed && run.ids) {
      var byId = {};
      L.scenarios.forEach(function (sc) { byId[sc.id] = sc; });
      var chosen = run.ids.map(function (id) { return byId[id]; }).filter(Boolean);
      if (chosen.length === L.draw.authored) authored = chosen;
    }
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
      made.role = made.role || o.def.role || L.role || '';
      made.options = gc.shuffle(made.options.map(function (a) {
        var range = PAY[a[0]], m = range[0] + gm.rnd() * (range[1] - range[0]);
        var cash = round2(B * m * (a[0] === 's' ? trust : 1));
        var gw = a[0] === 's' ? BURN[o.def.burn === undefined ? 1 : o.def.burn] : GW[a[0]];
        return { g: a[0], t: a[1], why: a[2], cash: cash, gw: gw, risk: a[0] === 's' ? 0 : round2(cash * GRADE[a[0]].times) };
      }));
      if (made.deal) {
        var ga = makeGen(run.seed ^ hash('ask:' + o.def.id));
        made.deal.roll = ga.rnd();
        var asks = ga.shuffle(made.deal.asks.map(function (a) {
          var R = ASK[a[0]], c = round2(B * (R.pay[0] + ga.rnd() * (R.pay[1] - R.pay[0])));
          return { k: a[0], t: a[1], why: a[2], cash: a[0] === 'n' ? 0 : a[0] === 'v' ? -c : c, risk: a[0] === 'x' ? round2(c * R.times) : 0 };
        }));
        made.deal.asks = asks.filter(function (a) { return a.k !== 'n'; }).concat(asks.filter(function (a) { return a.k === 'n'; }));
      }
      return made;
    });
    cache = { key: key, items: items };
    return items;
  }
  MB._buildItems = buildItems;

  /* Deal the situations this player has not met yet before any they have. */
  function pickIds(n, seed) {
    var L = level(n);
    if (L.fixed) return null;
    var g = makeGen(seed ^ hash('pick')), seen = S.seen[n] || [], need = L.draw.authored;
    var fresh_ = g.shuffle(L.scenarios.filter(function (sc) { return seen.indexOf(sc.id) < 0; }));
    var old = g.shuffle(L.scenarios.filter(function (sc) { return seen.indexOf(sc.id) >= 0; }));
    if (fresh_.length < need) S.seen[n] = [];
    return g.shuffle(fresh_.concat(old).slice(0, need)).map(function (sc) { return sc.id; });
  }
  function markSeen(n, id) {
    if (!S.seen) S.seen = {};
    var list = S.seen[n] || (S.seen[n] = []);
    if (list.indexOf(id) < 0) list.push(id);
  }

  function startRun(n) {
    if (!S.seen) S.seen = {};
    var seed0 = (Math.random() * 4294967296) >>> 0;
    S.run = { v: RUN_V, n: n, seed: seed0, ids: pickIds(n, seed0), trust: trustOf(standing()), practice: !!S.passed[n], phase: 'brief', step: 0, sub: null, answers: [], result: null };
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
    var t = { cash: 0, open: 0, risk: 0, gw: runGw(run) };
    run.answers.forEach(function (a) {
      t.cash += a.cash; if (a.risk) { t.open++; t.risk += a.risk; }
      if (a.ask) { t.cash += a.ask.cash; if (a.ask.risk) { t.open++; t.risk += a.ask.risk; } }
    });
    return t;
  }

  function finishRun() {
    var run = S.run, items = buildItems(run), L = level(run.n);
    var pts = run.answers.reduce(function (t, a) { return t + GRADE[eff(a)].pts; }, 0);
    var max = items.length * 2, pct = pts / max;
    var passed = pct >= L.pass - 1e-9;
    var before = rank(), first = false, gross = 0, losses = 0, reckon = [], gw = runGw(run);
    run.answers.forEach(function (a, i) {
      gross += a.cash + (a.ask ? a.ask.cash : 0);
      if (!passed) return;
      if (a.risk) {
        var due = makeGen(run.seed ^ hash('reckon:' + i)).rnd() < GRADE[a.g].chance;
        if (due) { losses += a.risk; gw += GW.due; }
        reckon.push({ i: i, due: due, cost: a.risk, what: 'the ' + GRADE[a.g].name });
      }
      if (a.ask && a.ask.risk) {
        var due2 = makeGen(run.seed ^ hash('reckon-ask:' + i)).rnd() < ASK.x.chance;
        if (due2) { losses += a.ask.risk; gw += GW.due; }
        reckon.push({ i: i, due: due2, cost: a.ask.risk, what: 'the overreach' });
      }
    });
    if (passed) gw += pct === 1 ? GW.gold : GW.pass;
    var net = passed ? gross - losses : 0;
    if (passed && !S.passed[run.n]) {
      first = true;
      S.passed[run.n] = { pct: pct, net: net, gw: gw, gold: pct === 1 };
      if (passedCount() === MB.levels.length) S.bestEquity = Math.max(S.bestEquity === null ? -Infinity : S.bestEquity, equity());
    }
    var parts = { choices: 0, asks: 0, due: 0, pass: passed ? (pct === 1 ? GW.gold : GW.pass) : 0 };
    run.answers.forEach(function (a) { parts.choices += a.gw || 0; if (a.ask) parts.asks += a.ask.gw; });
    reckon.forEach(function (r) { if (r.due) parts.due += GW.due; });
    run.phase = 'done'; run.sub = null;
    run.result = { pts: pts, max: max, pct: pct, passed: passed, first: first, gross: gross, losses: losses, net: net, gw: passed ? gw : 0, gwParts: parts, reckon: reckon, promoted: rank() !== before ? rank() : null };
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
      '<p class="lede">A corporate equity and governance game. Thirteen meetings, a few decisions each. Every decision pays today. Some come back for the money later. Stay clean, and find the deal anyway.</p>' +
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
      var cls = a ? 'g-' + eff(a) : (i === run.step ? 'now' : '');
      return '<li class="' + cls + '"><span class="vh">Item ' + (i + 1) + (a ? ': ' + GRADE[eff(a)].label : i === run.step ? ': current' : '') + '</span></li>';
    }).join('') + '</ol>';
  }

  function tallyRow(run) {
    var t = tally(run);
    return '<div class="tally"><span><span class="label">On the table</span> <b>' + plus(t.cash) + '</b></span>' +
      '<span class="' + (t.open ? 'has-risk' : '') + '"><span class="label">Loose ends</span> <b>' + t.open + '</b>' + (t.open ? ' <span class="at-risk">' + MB.cash(t.risk) + ' at risk</span>' : '') + '</span>' +
      '<span><span class="label">Goodwill</span> <b>' + liveGoodwill(run) + '</b>' + (t.gw ? ' <span class="gw-delta">' + (t.gw > 0 ? '+' : MINUS) + Math.abs(t.gw) + '</span>' : '') + '</span></div>';
  }

  var MINUS = String.fromCharCode(8722), DOT = String.fromCharCode(183), TIMES = String.fromCharCode(215);
  function gwText(n) { return n ? ' Goodwill ' + (n > 0 ? '+' : MINUS) + Math.abs(n) + '.' : ''; }
  /* Says whose goodwill moved and why, so the meter is never a mystery. */
  function gwWhy(o, who) {
    if (!o.gw) return '';
    var n = ' <span class="gw-why">Goodwill ' + (o.gw > 0 ? '+' : MINUS) + Math.abs(o.gw);
    if (!who) return n + '.</span>';
    if (o.g === 's') return n + ': ' + who + ' wanted a different answer.</span>';
    return n + ': ' + who + (o.g === 'g' ? ' got most of what was wanted.' : ' got exactly what was wanted.') + '</span>';
  }

  function moneyLine(o, mine, who) {
    if (mine) {
      if (o.g === 's') return '<b>' + plus(o.cash) + '</b> banked. Nothing follows you.' + gwWhy(o, who);
      return '<b>' + plus(o.cash) + '</b> today, and a ' + GRADE[o.g].name + ' that could cost <b>' + MB.cash(o.risk) + '</b>.' + gwWhy(o, who);
    }
    if (o.g === 's') return 'Would have paid <b>' + plus(o.cash) + '</b>, with nothing to follow.' + gwWhy(o, who);
    return 'Would have paid <b>' + plus(o.cash) + '</b>, with a ' + GRADE[o.g].name + ' of up to <b>' + MB.cash(o.risk) + '</b>.' + gwWhy(o, who);
  }

  function moreBlock(it) {
    var parts = '';
    if (it.us) parts += '<div class="juris-one"><span class="label">United States</span><p>' + it.us + '</p></div>';
    if (it.ca) parts += '<div class="juris-one"><span class="label">Canada</span><p>' + it.ca + '</p></div>';
    return parts ? '<details class="more"><summary>Country notes</summary>' + parts + '</details>' : '';
  }

  function viewPlay(L, run) {
    var items = buildItems(run), it = items[run.step], ans = run.answers[run.step];
    if (run.sub === 'ask' && it.deal && ans) return viewAsk(L, run, items, it, ans);
    var last = run.step === items.length - 1;
    var pending = ans && it.deal && ans.g === 's' && !ans.ask;
    var body = '', ruling = '';
    if (it.kind === 'choice') {
      body = '<div class="opts" role="group" aria-label="Motions">' + it.options.map(function (o, i) {
        var letter = 'abcdef'.charAt(i);
        var pay = '<span class="opt-pay">' + plus(o.cash) + '</span>';
        if (!ans) return '<button class="opt" data-act="choose" data-i="' + i + '"><span class="opt-l">(' + letter + ')</span><span class="opt-t">' + o.t + '</span>' + pay + '</button>';
        var mine = ans.pick === i;
        return doneCard(mine, o.g, letter, o.t, moneyLine(o, mine, it.who), o.why, chip(o.g) + (mine ? '<span class="yours">Your motion</span>' : ''));
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
      (it.role ? '<p class="role"><span class="label">You</span> ' + it.role + '</p>' : '') +
      '<div class="scene">' + tipify(paras(it.scene)) + '</div><div class="tip-box" id="tip-box" hidden></div>' + (it.ask ? '<p class="ask">' + it.ask + '</p>' : '') + body +
      (ans ? '<div class="review" id="review" tabindex="-1">' + ruling +
        (it.behind ? '<div class="behind"><span class="label">What was going on</span><p>' + it.behind + '</p>' +
          (it.deep ? '<details class="deep"><summary>Go deeper</summary><ul>' + it.deep.map(function (d) { return '<li><b>' + d[0] + '.</b> ' + d[1] + '</li>'; }).join('') + '</ul></details>' : '') + '</div>' : '') +
        '<p class="rule-line"><span class="label">The principle</span> ' + it.rule + '</p>' +
        '<div class="actions"><button class="btn" data-act="next">' + (pending ? 'One more thing' : last ? 'Adjourn the meeting' : 'Next item') + '</button></div>' +
        moreBlock(it) + '</div>' : '');
  }

  function doneCard(mine, tone, letter, text, money, why, tags) {
    var inner = '<span class="opt-l">(' + letter + ')</span><span class="opt-t">' + text +
      '<span class="opt-more"><span class="opt-money">' + money + '</span><span class="opt-why">' + why + '</span></span></span>' +
      '<span class="opt-tags">' + tags + (mine ? '' : '<span class="peek-hint">See why</span>') + '</span>';
    if (mine) return '<div class="opt done chosen g-' + tone + '" id="outcome" tabindex="-1">' + inner + '</div>';
    return '<button type="button" class="opt done peek g-' + tone + '" data-act="peek" aria-expanded="false">' + inner + '</button>';
  }

  function askChip(k) {
    var A = ASK[k];
    return '<span class="chip g-' + A.tone + '">' + A.label + '</span>';
  }

  function askLine(a, mine, res, deal) {
    var R = ASK[a.k];
    if (a.k === 'n') return mine ? 'Nothing asked.' + gwText(res.gw) : 'Nothing gained, nothing risked.';
    if (a.k === 'm') return (mine ? 'Agreed. <b>' + plus(a.cash) + '</b>.' : 'Would have been agreed, for <b>' + plus(a.cash) + '</b>.') + gwText(R.gw);
    if (a.k === 'v') return (mine ? 'Done. <b>' + MB.cash(a.cash) + '</b>.' : 'Would have cost <b>' + MB.cash(-a.cash) + '</b>.') + gwText(R.gw);
    if (a.k === 't') return (mine ? 'Refused, and remembered.' : 'Would have been refused, and remembered.') + gwText(R.gw);
    if (a.k === 'x') return (mine ? 'They signed. <b>' + plus(a.cash) + '</b> today, and a liability that could cost <b>' + MB.cash(a.risk) + '</b>. It also costs you a governance point.' : 'They would have signed for <b>' + plus(a.cash) + '</b>, leaving a liability of up to <b>' + MB.cash(a.risk) + '</b>.') + gwText(R.gw);
    var ok = deal.roll < res.p;
    if (mine) return (res.ok ? 'Agreed. <b>' + plus(a.cash) + '</b>.' : 'Refused. Nothing gained.') + gwText(res.gw);
    return (ok ? 'Would have been agreed, for <b>' + plus(a.cash) + '</b>.' : 'Would have been refused at your goodwill.') + gwText(ok ? R.gw : R.gwNo);
  }

  function viewAsk(L, run, items, it, ans) {
    var d = it.deal, res = ans.ask, last = run.step === items.length - 1;
    var body = '<div class="opts" role="group" aria-label="Asks">' + d.asks.map(function (a, i) {
      var letter = 'abcdef'.charAt(i);
      var pay = '<span class="opt-pay">' + (a.k === 'n' ? '$0' : a.k === 'v' ? MB.cash(a.cash) : plus(a.cash) + ' if agreed') + '</span>';
      if (!res) return '<button class="opt" data-act="ask" data-i="' + i + '"><span class="opt-l">(' + letter + ')</span><span class="opt-t">' + a.t + '</span>' + pay + '</button>';
      var mine = res.pick === i, tone = ASK[a.k].tone;
      var stamp = mine && (a.k === 'r' || a.k === 'm' || a.k === 't') ? '<span class="stamp ' + (res.ok ? 'yes' : 'no') + '">' + (res.ok ? 'Agreed' : 'Refused') + '</span>' : '';
      return doneCard(mine, tone, letter, a.t, askLine(a, mine, res, d), a.why, askChip(a.k) + (mine ? '<span class="yours">Your ask</span>' : '') + stamp);
    }).join('') + '</div>';
    return folio('Meeting ' + ROMAN[L.n] + ' ' + DOT + ' ' + L.title, 'Item ' + (run.step + 1) + ' of ' + items.length + ' ' + DOT + ' the ask') + pips(items, run) + tallyRow(run) +
      '<h1 class="item-title">What do you ask for?</h1>' +
      '<p class="role"><span class="label">You chose</span> ' + it.options[ans.pick].t + '</p>' +
      '<div class="scene">' + tipify(paras(d.setup)) + '</div><div class="tip-box" id="tip-box" hidden></div>' + body +
      (res ? '<div class="review">' + (d.rule ? '<p class="rule-line"><span class="label">The line</span> ' + d.rule + '</p>' : '') +
        '<div class="actions"><button class="btn" data-act="next">' + (last ? 'Adjourn the meeting' : 'Next item') + '</button></div></div>'
        : '<p class="note">Your goodwill is <b>' + liveGoodwill(run) + '</b>. At that level a strong ask is agreed about <b>' + Math.round(reachOdds(liveGoodwill(run)) * 100) + '%</b> of the time. A fair ask always is. An overreach is the one that crosses a legal line, and not every opening is a deal.</p>');
  }

  function sgn(n) { return n ? (n > 0 ? '+' : MINUS) + Math.abs(n) : '0'; }
  function gwBreak(res, run) {
    var p = res.gwParts || { choices: res.gw, asks: 0, due: 0, pass: 0 };
    return '<h2 class="section">Goodwill</h2><dl class="ledger">' +
      '<div><dt>Choices that disappointed or pleased someone</dt><dd>' + sgn(p.choices) + '</dd></div>' +
      '<div><dt>What you asked for</dt><dd>' + sgn(p.asks) + '</dd></div>' +
      '<div><dt>Loose ends that came due</dt><dd>' + sgn(p.due) + '</dd></div>' +
      '<div><dt>Delivering the meeting' + (res.pct === 1 ? ' without dissent' : '') + '</dt><dd>' + sgn(p.pass) + '</dd></div>' +
      '<div class="total"><dt>Goodwill this meeting</dt><dd>' + sgn(res.gw) + '</dd></div>' +
      (run.practice ? '' : '<div><dt>Your goodwill</dt><dd>' + goodwill() + ' of 100</dd></div>') + '</dl>';
  }

  function viewDone(L, run) {
    var items = buildItems(run), res = run.result;
    var minutes = items.map(function (it, i) {
      var a = run.answers[i];
      return '<li><span class="min-n">' + (i + 1) + '.</span><span class="min-body">' + it.title + (a.ask ? '<span class="min-ask">' + ASK[a.ask.k].label + (a.ask.k === 'r' ? (a.ask.ok ? ', agreed' : ', refused') : '') + '</span>' : '') + '</span><span class="min-cash">' + plus(a.cash + (a.ask ? a.ask.cash : 0)) + '</span>' + chip(eff(a)) + '</li>';
    }).join('');
    var nxt = L.n < MB.levels.length ? L.n + 1 : null;
    var head, sub, money = '';
    if (res.passed) {
      head = res.pct === 1 ? 'Carried without dissent.' : 'Motion carried.';
      sub = res.pts + ' of ' + res.max + ' points. ' +
        (run.practice ? 'A practice sitting. Nothing is banked.' : (res.promoted ? 'You now sit as <b>' + res.promoted + '</b>.' : ''));
      var reck = res.reckon.length
        ? '<ul class="reckon">' + res.reckon.map(function (r, k) {
          return '<li class="' + (r.due ? 'due' : 'quiet') + '" style="animation-delay:' + (0.5 + k * 0.45) + 's"><span>Item ' + (r.i + 1) + ', ' + (r.what || 'the loose end') + '</span><b>' + (r.due ? 'Came due ' + MB.cash(-r.cost) : 'Never surfaced') + '</b></li>';
        }).join('') + '</ul>'
        : '<p class="note">No loose ends. Nothing came back.</p>';
      money = '<h2 class="section">The reckoning</h2>' + reck +
        '<dl class="ledger"><div><dt>Taken at the table</dt><dd>' + plus(res.gross) + '</dd></div><div><dt>Came due</dt><dd>' + MB.cash(-res.losses) + '</dd></div>' +
        '<div class="total"><dt>Net for the meeting</dt><dd>' + plus(res.net) + '</dd></div>' +
        (run.practice ? '' : '<div><dt>Your equity</dt><dd>' + MB.cash(equity()) + '</dd></div>') +
        '</dl>' + gwBreak(res, run);
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
      '<h2 class="section">Goodwill</h2>' +
      '<p>Goodwill is what the people across the table think of dealing with you: partners, borrowers, vendors, colleagues. It runs from 0 to 100 and starts at 50. Every change names the person and the reason.</p>' +
      '<ul class="rules">' +
      '<li><b>' + MINUS + '1 to ' + MINUS + '4</b> when a sound choice refuses someone. More when they are powerful. Nothing when nobody is put out.</li>' +
      '<li><b>+1 or +2</b> when a grey or poor choice gives someone what they wanted. It is cheap goodwill, and it is lost if the loose end comes due.</li>' +
      '<li><b>' + MINUS + '6</b> each time a loose end or liability comes due.</li>' +
      '<li><b>+6</b> for passing a meeting, <b>+10</b> for a perfect one.</li>' +
      '<li><b>+5</b> for a fair ask, <b>+10</b> for a gift, <b>' + MINUS + '1</b> for a strong ask that lands, <b>' + MINUS + '5</b> for one refused, <b>' + MINUS + '7</b> for a tone-deaf ask, <b>' + MINUS + '8</b> for an overreach.</li>' +
      '</ul>' +
      '<h2 class="section">The ask</h2>' +
      '<p>After some sound choices an opening appears and you choose what to ask for. A fair ask always lands and pays a little. A strong ask pays well and can be refused. The chance it lands is shown before you choose, and rises with goodwill: about 30% at 20, 55% at 50, 80% at 80. An overreach pays most, crosses a legal line and comes back on you. Sometimes there is no deal to be had, and the right ask is none.</p>' +
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
    var gwv = S.run && S.run.phase !== 'done' && !S.run.practice ? liveGoodwill(S.run) : goodwill();
    standingEl.innerHTML =
      '<div class="who"><span class="label">Seat</span><b>' + rank() + '</b></div>' +
      '<div class="who"><span class="label">Equity</span><b class="eq">' + MB.cash(equity()) + '</b></div>' +
      '<div class="meter"><span class="label">Standing</span><span class="bar"><i style="width:' + st + '%"></i></span><span class="meter-v">' + label + ' ' + DOT + ' pays ' + TIMES + MB.fix(trustOf(st), 2) + '</span></div>' +
      '<div class="meter goodwill"><span class="label">Goodwill</span><span class="bar"><i style="width:' + gwv + '%"></i></span><span class="meter-v">' + gwv + ' ' + DOT + ' ' + (gwv >= 70 ? 'doors open' : gwv >= 40 ? 'on speaking terms' : 'bridges smoking') + '</span></div>';
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
      run.answers[run.step] = { pick: i, g: o.g, cash: o.cash, risk: o.risk, gw: o.gw };
      markSeen(run.n, buildItems(run)[run.step].id);
      save(); render('outcome');
    }
    else if (act === 'ask' && run && run.phase === 'play' && run.sub === 'ask' && run.answers[run.step] && !run.answers[run.step].ask) {
      var d = buildItems(run)[run.step].deal, k = parseInt(el.getAttribute('data-i'), 10), a = d.asks[k], R = ASK[a.k];
      var res = { pick: k, k: a.k, ok: true, cash: 0, risk: 0, gw: R.gw, p: reachOdds(liveGoodwill(run)) };
      if (a.k === 'm' || a.k === 'v') res.cash = a.cash;
      else if (a.k === 'x') { res.cash = a.cash; res.risk = a.risk; }
      else if (a.k === 't') res.ok = false;
      else if (a.k === 'n') res.gw = d.none ? R.gwRight : R.gw;
      else if (a.k === 'r') { res.ok = d.roll < res.p; res.cash = res.ok ? a.cash : 0; res.gw = res.ok ? R.gw : R.gwNo; }
      run.answers[run.step].ask = res;
      save(); render('outcome');
    }
    else if (act === 'next' && run && run.answers[run.step]) {
      var cur = buildItems(run)[run.step], an = run.answers[run.step];
      if (cur.deal && an.g === 's' && !an.ask && run.sub !== 'ask') { run.sub = 'ask'; save(); render(); return; }
      run.sub = null;
      if (run.step >= buildItems(run).length - 1) finishRun(); else { run.step++; save(); }
      render();
    }
    else if (act === 'again' && run) { startRun(run.n); render(); }
    else if (act === 'unlock') { S.unlockAll = el.checked; save(); }
    else if (act === 'peek') {
      var open = !el.classList.contains('open'), hint = el.querySelector('.peek-hint');
      el.classList.toggle('open', open); el.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (hint) hint.textContent = open ? 'Hide' : 'See why';
    }
    else if (act === 'tip') {
      var box = document.getElementById('tip-box'), term = el.getAttribute('data-term');
      if (!box) return;
      if (!box.hidden && box.getAttribute('data-term') === term) { box.hidden = true; return; }
      box.innerHTML = '<b>' + term + '.</b> ' + defs()[term];
      box.setAttribute('data-term', term); box.hidden = false;
    }
    else if (act === 'career-ask') {
      document.getElementById('career-zone').innerHTML = '<p class="confirm">Close the book on this career and start again at ' + MB.cash(SEED_EQUITY) + '?</p><div class="actions"><button class="btn danger" data-act="career-yes">Yes, start again</button><button class="btn quiet" data-act="career-no">Keep this career</button></div>';
    }
    else if (act === 'career-no') { render(false); }
    else if (act === 'career-yes') {
      var keep = { bestEquity: S.bestEquity, unlockAll: S.unlockAll, seen: S.seen || {} };
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
    run.answers[run.step] = { value: res.value, g: res.g, cash: cash, risk: 0, gw: 0 };
    save(); render('review');
  }

  function boot(data) {
    sheet = document.getElementById('sheet');
    standingEl = document.getElementById('standing');
    MB.levels.sort(function (a, b) { return a.n - b.n; });
    if (data && data.state) S = Object.assign(fresh(), data.state); else load();
    if (S.run && (!level(S.run.n) || S.run.v !== RUN_V)) S.run = null;
    document.addEventListener('click', onClick);
    document.addEventListener('submit', onSubmit);
    window.addEventListener('hashchange', function () { render(); });
    render(false);
  }

  MB._state = function () { return S; };
  MB._equity = equity;
  MB._goodwill = goodwill;

  /* Called once, after every content script has registered its level. */
  MB.start = function () {
    var hot = window.claude && window.claude.hot;
    if (hot && hot.snapshot) hot.snapshot(function () { return { state: S }; });
    if (hot && hot.ready) hot.ready(boot); else boot((hot && hot.data) || {});
  };
})();
