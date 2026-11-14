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
  var GW = { g: 1, p: 2, due: -6, pass: 3, gold: 6 };
  /* The asks in a deal beat. pay is a multiple of the meeting's stake. */
  var ASK = {
    m: { label: 'Fair ask', tone: 's', pay: [0.4, 0.7], gw: 5 },
    r: { label: 'Strong ask', tone: 's', pay: [1.3, 2.2], gw: -1, gwNo: -5 },
    x: { label: 'Overreach', tone: 'p', pay: [1.8, 3.0], gw: -8, chance: 0.7, times: 3 },
    t: { label: 'Tone-deaf', tone: 'g', pay: [0.3, 0.6], gw: -7 },
    v: { label: 'A gift', tone: 's', pay: [0.25, 0.45], gw: 10 },
    o: { label: 'Free option', tone: 's', pay: [1.2, 2.4], gw: 1 },
    n: { label: 'No ask', tone: 'n', pay: [0, 0], gw: 1, gwRight: 3 }
  };
  var RUN_V = 7;
  /* Looking for a wider answer costs a little time. A free option pays off less than half the time, and never costs. */
  var LOOK = 0.2, WIDE = 1.7, OPT_CHANCE = 0.4;
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
    ['right of first refusal', 'Right of first refusal'], ['drag', 'Drag-along and tag-along'], ['side letters?', 'Side letter'], ['insolven(?:t|cy)', 'Insolvency'],
    ['register', 'Registers'],
    ['right of first offer|first offer|first[- ]offer right', 'Right of first offer'], ['matching right|right to match', 'Matching right'],
    ['option to extend|extension options?|right to extend|right to renew', 'Extension option'], ['share of (?:the )?(?:sale|resale) (?:proceeds|profit)|profit share', 'Profit share'],
    ['standstill', 'Standstill'], ['escrow', 'Escrow'], ['not to disturb|non-disturbance', 'Non-disturbance agreement'], ['bond', 'Bond'],
    ['interest reserve', 'Interest reserve'], ['consent fee', 'Consent fee'], ['co-invest(?:ment|ors?)?', 'Co-investment'],
    ['opening bid', 'Opening bid'], ['second charge|charge on', 'Charge'], ['earn-out', 'Earn-out'], ['liquidated damages', 'Liquidated damages'],
    ['density', 'Density'], ['allowances?', 'Allowance'], ['professional liability', 'Professional liability insurance'], ['letter of credit', 'Letter of credit']
  ];
  var EXTRA_DEFS = {
    'Side letter': 'A private agreement giving one investor terms the others do not have. Acceptable when the main agreement permits it and those entitled are told.',
    'Right of first offer': 'A promise that if they ever sell, or borrow, they come to you first. It costs them nothing unless that day arrives.',
    'Matching right': 'A right to take the same terms someone else is offered: a better price given to another customer, or a rival bid.',
    'Extension option': 'A right to add time at a price fixed today, used only if you need it.',
    'Profit share': 'A slice of any gain above an agreed level. If there is no gain, it costs the giver nothing.',
    'Standstill': 'An agreement to take no action for a set period while the parties talk.',
    'Escrow': 'Money or documents held by a neutral third party until a condition is met.',
    'Non-disturbance agreement': 'A lender\'s promise to a tenant that the lease survives if the lender takes over the property.',
    'Bond': 'A guarantee from an insurer, called a surety, that it will finish the work or pay if the contractor fails.',
    'Interest reserve': 'Money set aside up front to cover interest payments for a period.',
    'Consent fee': 'A payment for agreeing to something you had the right to refuse.',
    'Co-investment': 'A chance to invest directly in one deal alongside the fund, usually with little or no fee.',
    'Opening bid': 'A first firm bid that sets a floor for a sale, which others may still beat.',
    'Charge': 'Security over property, like a mortgage. A second charge ranks behind the first.',
    'Earn-out': 'Part of a purchase price paid later, only if the business performs.',
    'Liquidated damages': 'A sum fixed in advance for a breach, such as each day of delay.',
    'Density': 'How much may be built on a site under its zoning. Unused density can be built, sold or transferred.',
    'Allowance': 'A sum in a construction price set aside for an item not yet chosen. What is not spent should come back to the owner.',
    'Professional liability insurance': 'Insurance that pays when a consultant\'s advice or design is wrong.',
    'Letter of credit': 'A bank\'s promise to pay on demand, used as security in place of cash.'
  };
  var DEFS = null;
  function defs() {
    if (DEFS) return DEFS;
    DEFS = {};
    MB.levels.forEach(function (L) { L.concepts.forEach(function (c) { DEFS[c[0]] = c[1]; }); });
    Object.keys(EXTRA_DEFS).forEach(function (k) { DEFS[k] = EXTRA_DEFS[k]; });
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

  /* A row of tappable terms found in text that cannot hold a button itself, such as an option. */
  function termChips(texts) {
    var d = defs(), joined = texts.join(' \n '), out = [];
    ALIAS.forEach(function (al) {
      var term = al[1];
      if (!d[term] || out.indexOf(term) >= 0 || out.length >= 4) return;
      if (new RegExp('(^|[^A-Za-z])(' + al[0] + ')(?![A-Za-z])', 'i').test(joined)) out.push(term);
    });
    return out.length ? '<p class="terms-used"><span class="label">Terms</span> ' + out.map(function (t) {
      return '<button type="button" class="tip" data-act="tip" data-term="' + t.replace(/"/g, '&quot;') + '">' + t + '</button>';
    }).join(' ') + '</p>' : '';
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
  function fresh() { return { passed: {}, seen: {}, seenV: {}, bestEquity: null, unlockAll: false, run: null }; }

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
    var key = run.n + ':' + run.seed + ':' + run.trust + ':' + RUN_V + ':' + (run.ids ? run.ids.join(',') : '') + ':' + JSON.stringify(run.tw || 0) + (run.alt ? 'A' : '') + (run.twAll ? 'T' : '');
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
    g0.shuffle(L.spots || []).slice(0, L.draw.spot || 0).forEach(function (sp) {
      order.splice(g0.int(1, order.length), 0, { kind: 'spot', def: sp });
    });
    var story = L.story ? L.story(makeGen(run.seed ^ hash('story'))) : null;
    if (story) story.alt = !!run.alt;
    var items = order.map(function (o) {
      if (o.kind === 'numeric') {
        var gn = makeGen(run.seed ^ hash('n:' + o.key));
        var inst = MB.numerics[o.key](gn);
        inst.kind = 'numeric'; inst.id = o.key; inst.stake = round2(B * trust);
        return inst;
      }
      if (o.kind === 'spot') {
        var sp = o.def.make(makeGen(run.seed ^ hash(o.def.id)));
        sp.kind = 'spot'; sp.id = o.def.id; sp.title = o.def.title; sp.role = o.def.role || L.role || '';
        sp.stake = round2(B * 1.5);
        sp.parts = sp.parts.map(function (q) { return { t: q[0], k: q[1], why: q[2] }; });
        return sp;
      }
      var gc = makeGen(run.seed ^ hash(o.def.id));
      gc.story = story;
      gc.twist = !!(o.def.twist && (run.twAll || (run.tw && run.tw[o.def.id])));
      var made = o.def.make(gc);
      if ((gc.twist || (story && story.alt)) && (!made.deep || !made.behind)) {
        /* A twist changes one fact. It borrows whatever it does not restate from the plain version. */
        var gb = makeGen(run.seed ^ hash(o.def.id)); gb.twist = false;
        gb.story = story ? Object.assign({}, story, { alt: false }) : null;
        var plain = o.def.make(gb);
        made.deep = made.deep || plain.deep; made.behind = made.behind || plain.behind;
      }
      if (gc.twist || (story && story.alt)) made.who = null;
      var gm = makeGen(run.seed ^ hash('cash:' + o.def.id));
      made.kind = 'choice'; made.id = o.def.id; made.title = o.def.title; made.builds = o.def.builds || [];
      made.role = made.role || o.def.role || L.role || '';
      made.options = gc.shuffle(made.options.map(function (a) {
        var range = PAY[a[0]], m = range[0] + gm.rnd() * (range[1] - range[0]);
        var cash = round2(B * m * (a[0] === 's' ? trust : 1));
        var burnLevel = made.burn !== undefined ? made.burn : gc.twist ? 0 : (o.def.burn === undefined ? 1 : o.def.burn);
        var gw = a[0] === 's' ? BURN[burnLevel] : (gc.twist && a[0] === 'g') ? -1 : GW[a[0]];
        return { g: a[0], t: a[1], why: a[2], cash: cash, gw: gw, risk: a[0] === 's' ? 0 : round2(cash * GRADE[a[0]].times) };
      }));
      made.lookCost = round2(B * LOOK);
      if (made.wider && !gc.twist) {
        var sOpt = made.options.filter(function (x) { return x.g === 's'; })[0];
        made.wide = { g: 's', wide: true, t: made.wider[0], why: made.wider[1], cash: round2(sOpt.cash * WIDE), gw: 2, risk: 0 };
      }
      if (made.sheet) {
        var gs = makeGen(run.seed ^ hash('sheet:' + o.def.id));
        made.sheet.terms = gs.shuffle(made.sheet.terms.map(function (t) {
          var val = round2(B * t[4]);
          return { k: t[0], t: t[1], why: t[2], pain: t[3], val: val, risk: t[0] === 'x' ? round2(val * ASK.x.times) : 0 };
        }));
      }
      if (made.deal) {
        var ga = makeGen(run.seed ^ hash('ask:' + o.def.id));
        made.deal.roll = ga.rnd();
        var asks = ga.shuffle(made.deal.asks.map(function (a) {
          var R = ASK[a[0]], c = round2(B * (R.pay[0] + ga.rnd() * (R.pay[1] - R.pay[0])));
          var later = a[0] === 'o' || a[3] === 'later';
          return { k: a[0], t: a[1], why: a[2], later: later, show: c, opt: a[0] === 'o' ? c : 0,
            cash: a[0] === 'n' || later ? 0 : a[0] === 'v' ? -c : c, risk: a[0] === 'x' ? round2(c * R.times) : 0 };
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
  function markSeen(n, id, variant) {
    if (!S.seen) S.seen = {};
    if (!S.seenV) S.seenV = {};
    var list = S.seen[n] || (S.seen[n] = []);
    if (list.indexOf(id) < 0) list.push(id);
    var v = S.seenV[n] || (S.seenV[n] = {}), had = v[id] || '';
    if (had.indexOf(variant) < 0) v[id] = had + variant;
  }
  /* Plain version first as a rule, the twist once the plain one has been met. Never predictable. */
  function variantFor(n, id, g, first) {
    var had = ((S.seenV || {})[n] || {})[id] || '';
    var b = had.indexOf('b') >= 0, t = had.indexOf('t') >= 0;
    if (b && !t) return g.rnd() < 0.8;
    if (t && !b) return g.rnd() < 0.2;
    return g.rnd() < (b && t ? 0.5 : (first === undefined ? 0.25 : first));
  }
  function pickTwists(n, ids, seed) {
    var L = level(n), g = makeGen(seed ^ hash('twist')), tw = {};
    L.scenarios.forEach(function (sc) { if (sc.twist && ids.indexOf(sc.id) >= 0) tw[sc.id] = variantFor(n, sc.id, g); });
    return tw;
  }

  function startRun(n) {
    if (S.run && S.run.phase === 'reckon') commitRun();
    if (!S.seen) S.seen = {};
    var seed0 = (Math.random() * 4294967296) >>> 0;
    var L0 = level(n), ids0 = pickIds(n, seed0);
    var tw0 = L0.fixed ? null : pickTwists(n, ids0, seed0);
    var alt0 = L0.fixed ? variantFor(n, 'story', makeGen(seed0 ^ hash('alt')), 0) : false;
    S.run = { v: RUN_V, n: n, seed: seed0, ids: ids0, tw: tw0, alt: alt0, trust: trustOf(standing()), practice: !!S.passed[n], phase: 'brief', step: 0, sub: null, answers: [], result: null };
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
    var t = { cash: 0, open: 0, risk: 0, opts: 0, gw: runGw(run) };
    run.answers.forEach(function (a) {
      t.cash += a.cash; if (a.risk) { t.open++; t.risk += a.risk; }
      if (a.ask) { t.cash += a.ask.cash; if (a.ask.risk) { t.open++; t.risk += a.ask.risk; } t.opts += (a.ask.opts || []).length; }
    });
    return t;
  }
  function patience(gw) { return 2 + Math.floor(gw / 25); }

  /* The odds are never fixed. They move with what the player has done, in this meeting and before it. */
  function heat() {
    return Object.keys(S.passed).map(Number).sort(function (a, b) { return b - a; }).slice(0, 2)
      .reduce(function (t, k) { return t + (S.passed[k].dues || 0); }, 0);
  }
  function oddsRisk(kind, others, hot, st) {
    var base = kind === 'g' ? 30 : 60, p = base;
    var why = [(kind === 'g' ? 'A grey shortcut' : kind === 'p' ? 'A poor choice' : 'An overreach') + ': ' + base + '%'];
    if (others) { var o = Math.min(15, others * 5); p += o; why.push(others + ' other loose end' + (others > 1 ? 's' : '') + ' in this meeting: +' + o + '%'); }
    if (hot) { var h = Math.min(16, hot * 8); p += h; why.push('Something came due recently, so people are looking: +' + h + '%'); }
    if (st >= 85) { p -= 5; why.push('A strong record draws fewer questions: ' + MINUS + '5%'); }
    return { p: Math.max(10, Math.min(90, p)) / 100, why: why };
  }
  function oddsOpt(gw) {
    var add = Math.round(gw * 0.3);
    return { p: Math.min(60, 25 + add) / 100, why: ['Any free option: 25%', 'Your goodwill of ' + gw + ': +' + add + '%'] };
  }

  function finishRun() {
    var run = S.run, items = buildItems(run), L = level(run.n);
    var pts = run.answers.reduce(function (t, a) { return t + GRADE[eff(a)].pts; }, 0);
    var max = items.length * 2, pct = pts / max;
    var passed = pct >= L.pass - 1e-9;
    var gross = 0, reckon = [], open = 0, hot = heat(), st = standing(), gwNow = liveGoodwill(run);
    run.answers.forEach(function (a) { gross += a.cash + (a.ask ? a.ask.cash : 0); if (a.risk) open++; if (a.ask && a.ask.risk) open++; });
    if (passed) run.answers.forEach(function (a, i) {
      var it = items[i], od;
      if (a.risk) {
        od = oddsRisk(a.g, open - 1, hot, st);
        reckon.push({ i: i, cost: a.risk, what: 'the ' + GRADE[a.g].name, text: (it.options[a.pick] || {}).t || '', p: od.p, why: od.why, u: makeGen(run.seed ^ hash('reckon:' + i)).rnd() });
      }
      if (a.ask && a.ask.risk) {
        od = oddsRisk('x', open - 1, hot, st);
        reckon.push({ i: i, cost: a.ask.risk, what: 'the overreach', text: a.ask.riskText || '', p: od.p, why: od.why, u: makeGen(run.seed ^ hash('reckon-ask:' + i)).rnd() });
      }
      if (a.ask && a.ask.opts) a.ask.opts.forEach(function (v, j) {
        od = oddsOpt(gwNow);
        reckon.push({ i: i, opt: true, val: v, text: (a.ask.optTexts || [])[j] || '', p: od.p, why: od.why, u: makeGen(run.seed ^ hash('opt:' + i + ':' + j)).rnd() });
      });
    });
    reckon.forEach(function (r) { if (r.opt) r.paid = r.u < r.p; else r.due = r.u < r.p; });
    run.result = { pts: pts, max: max, pct: pct, passed: passed, gross: gross, reckon: reckon, spun: 0, committed: false, before: rank() };
    if (reckon.length) { run.phase = 'reckon'; run.sub = null; save(); }
    else commitRun();
  }

  /* Writes the sitting onto the record. Called once every wheel has been spun, or if the player walks away first. */
  function commitRun() {
    var run = S.run, res = run.result;
    if (!res || res.committed) return;
    var losses = 0, optGain = 0, dues = 0, gw = runGw(run);
    res.reckon.forEach(function (r) { if (r.opt) { if (r.paid) optGain += r.val; } else if (r.due) { losses += r.cost; dues++; gw += GW.due; } });
    if (res.passed) gw += res.pct === 1 ? GW.gold : GW.pass;
    var net = res.passed ? res.gross - losses + optGain : 0, first = false;
    if (res.passed && !S.passed[run.n]) {
      first = true;
      S.passed[run.n] = { pct: res.pct, net: net, gw: gw, gold: res.pct === 1, dues: dues };
      if (passedCount() === MB.levels.length) S.bestEquity = Math.max(S.bestEquity === null ? -Infinity : S.bestEquity, equity());
    }
    var parts = { choices: 0, asks: 0, due: dues * GW.due, pass: res.passed ? (res.pct === 1 ? GW.gold : GW.pass) : 0 };
    run.answers.forEach(function (a) { parts.choices += a.gw || 0; if (a.ask) parts.asks += a.ask.gw; });
    res.first = first; res.losses = losses; res.optGain = optGain; res.net = net; res.gw = res.passed ? gw : 0; res.gwParts = parts;
    res.promoted = rank() !== res.before ? rank() : null; res.spun = res.reckon.length; res.committed = true;
    run.phase = 'done'; run.sub = null;
    save();
  }

  /* What a careful dealmaker would also have taken, listed at adjournment. */
  function leftOnTable(items, run) {
    var out = [];
    items.forEach(function (it, i) {
      var a = run.answers[i];
      if (!a) return;
      if (it.kind === 'spot') { if (!a.found) out.push({ i: i, t: 'An opportunity in the document went unnoticed.', amt: it.stake }); return; }
      if (it.kind !== 'choice' || a.g !== 's') return;
      if (it.wide && !a.wide) out.push({ i: i, t: 'There was another way: ' + it.wide.t, amt: Math.max(0, it.wide.cash - (a.cash + (a.look || 0))) });
      if (it.deal && a.ask) {
        var mine = it.deal.asks[a.ask.pick], empty = mine.k === 'n' || mine.k === 't' || (mine.k === 'r' && !a.ask.ok);
        if (empty) it.deal.asks.forEach(function (q) {
          if (q.k === 'o') out.push({ i: i, t: 'A free option was there for the asking: ' + q.t, amt: q.opt, later: true });
          else if (q.k === 'm') out.push({ i: i, t: 'A fair ask would have been agreed: ' + q.t, amt: q.cash });
        });
      }
      if (it.sheet && a.ask) it.sheet.terms.forEach(function (t, j) {
        if (t.k !== 'x' && t.pain === 0 && a.ask.picks.indexOf(j) < 0) out.push({ i: i, t: 'It would have cost them nothing: ' + t.t, amt: t.val, later: t.k === 'o' });
      });
    });
    return out;
  }

  /* ---------- colour ---------- */

  /* Each meeting has its own colour and mark, like the colour groups on a set of property cards. */
  var TONE = [null,
    { c: '#8a5a2b', on: '#fff' }, { c: '#1f7a8c', on: '#fff' }, { c: '#b5477e', on: '#fff' }, { c: '#c4621a', on: '#fff' },
    { c: '#b53a2f', on: '#fff' }, { c: '#dcae1d', on: '#2a2105' }, { c: '#2f7d4f', on: '#fff' }, { c: '#284b8c', on: '#fff' },
    { c: '#6b4aa0', on: '#fff' }, { c: '#0f7b6c', on: '#fff' }, { c: '#9c2f52', on: '#fff' }, { c: '#4a5568', on: '#fff' },
    { c: '#14251d', on: '#cfae62' }];
  var MARK = [null,
    'M5 21V4h14v17M3 21h18M9 8h2M13 8h2M9 12h2M13 12h2M11 21v-4h2v4',
    'M12 3v18M7 21h10M4 7h16M4 7l-2.5 6a2.5 2.5 0 0 0 5 0L4 7M20 7l-2.5 6a2.5 2.5 0 0 0 5 0L20 7',
    'M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7M9 8h3',
    'M12 3l9 4.5-9 4.5-9-4.5zM3 12l9 4.5 9-4.5M3 16.5L12 21l9-4.5',
    'M3 5h6v5h6v5h6v5M6 13v2M6 17v1M12 18v2M18 3v2',
    'M4 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0M10 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0',
    'M4 20h16M6 16l10-10 3 3-10 10H6z',
    'M6 21V4M3 21h8M6 4h13M6 7l5-3M17 4v6M15.5 10h3v3h-3z',
    'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0M9 15l6-6M9.2 9.2h.01M14.8 14.8h.01',
    'M4 8a4 4 0 1 0 8 0a4 4 0 1 0-8 0M11 11l9 9M17 17l2-2M14 14l2-2',
    'M4 8h16v12H4zM9 8V5h6v3M4 13h16',
    'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0M5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6',
    'M7 3v10h10V3M7 13v8M17 13v8M5 13h14M7 7h10'];
  function tone(n) { return TONE[n] || TONE[13]; }
  function toneStyle(n) { var t = tone(n); return ' style="--m:' + t.c + ';--on:' + t.on + '"'; }
  function mark(n) { return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="' + (MARK[n] || MARK[1]) + '"/></svg>'; }

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
      var inner = '<span class="deed-band"><span class="m-num">' + ROMAN[L.n] + '</span>' + mark(L.n) + '</span>' +
        '<span class="m-main"><span class="m-title">' + L.title + '</span><span class="m-topics">' + L.topics + '</span></span>' +
        '<span class="deed-foot">' + st + (p ? '<span class="deed-won' + (p.gold ? ' gold' : '') + '">' + (p.gold ? 'Gold seal' : 'Sealed') + '</span>' : '') + '</span>';
      return open ? '<li class="meeting deed"' + toneStyle(L.n) + '><a href="#meeting-' + L.n + '">' + inner + '</a></li>'
        : '<li class="meeting deed is-locked"' + toneStyle(L.n) + '><div aria-disabled="true">' + inner + '</div></li>';
    }).join('');
    var best = S.bestEquity !== null ? '<span class="career-best">Best career ' + MB.cash(S.bestEquity) + '</span>' : '';
    return folio('Contents', done + ' of ' + MB.levels.length + ' meetings on record') +
      '<h1 class="display">Get rich. Stay out of court.</h1>' +
      '<p class="lede">A corporate equity and governance game. Thirteen meetings, a few decisions each. Every decision pays today. Some come back for the money later. Stay clean, and find the deal anyway.</p>' +
      '<div class="career"><div><span class="label">Your equity</span><span class="career-rank">' + MB.cash(equity()) + '</span>' + best + '</div><div id="career-zone">' + cta + '</div></div>' +
      '<ol class="meetings deeds">' + rows + '</ol>';
  }

  function viewBrief(L, run) {
    var terms = L.concepts.map(function (c) { return '<div class="term"><dt>' + c[0] + '</dt><dd>' + c[1] + '</dd></div>'; }).join('');
    var n = (L.fixed ? L.scenarios.length : L.draw.authored + (L.draw.numeric || 0));
    return folio('Meeting ' + ROMAN[L.n], run.practice ? 'Practice sitting' : 'Before the meeting') +
      '<div class="brief-mark"><span class="brief-badge">' + mark(L.n) + '</span><span class="brief-num">Meeting ' + ROMAN[L.n] + '</span></div>' +
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
      var cls = a ? 'g-' + (a.found === false ? 'n' : eff(a)) : (i === run.step ? 'now' : '');
      return '<li class="' + cls + '"><span class="vh">Item ' + (i + 1) + (a ? ': ' + GRADE[eff(a)].label : i === run.step ? ': current' : '') + '</span></li>';
    }).join('') + '</ol>';
  }

  function tallyRow(run) {
    var t = tally(run);
    return '<div class="tally"><span><span class="label">On the table</span> <b>' + plus(t.cash) + '</b></span>' +
      '<span class="' + (t.open ? 'has-risk' : '') + '"><span class="label">Loose ends</span> <b>' + t.open + '</b>' + (t.open ? ' <span class="at-risk">' + MB.cash(t.risk) + ' at risk</span>' : '') + '</span>' +
      (t.opts ? '<span><span class="label">Options held</span> <b>' + t.opts + '</b></span>' : '') +
      '<span><span class="label">Goodwill</span> <b>' + liveGoodwill(run) + '</b>' + (t.gw ? ' <span class="gw-delta">' + (t.gw > 0 ? '+' : MINUS) + Math.abs(t.gw) + '</span>' : '') + '</span></div>';
  }

  var MINUS = String.fromCharCode(8722), DOT = String.fromCharCode(183), TIMES = String.fromCharCode(215);
  function gwText(n) { return n ? ' Goodwill ' + (n > 0 ? '+' : MINUS) + Math.abs(n) + '.' : ''; }
  /* Says whose goodwill moved and why, so the meter is never a mystery. */
  function gwWhy(o, who) {
    if (!o.gw) return '';
    var n = ' <span class="gw-why">Goodwill ' + (o.gw > 0 ? '+' : MINUS) + Math.abs(o.gw);
    if (o.wide) return n + ': everyone left with something.</span>';
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
    if (run.sub === 'ask' && ans && it.sheet) return viewTerms(L, run, items, it, ans);
    if (run.sub === 'ask' && ans && it.deal) return viewAsk(L, run, items, it, ans);
    var last = run.step === items.length - 1;
    var pending = ans && (it.deal || it.sheet) && ans.g === 's' && !ans.ask;
    var body = '', ruling = '';
    if (it.kind === 'choice') {
      var looked = !!(run.look && run.look[run.step]);
      var list = it.options.slice();
      if (it.wide && (looked || ans)) list.push(it.wide);
      body = '<div class="opts" role="group" aria-label="Motions">' + list.map(function (o, i) {
        var letter = 'abcdef'.charAt(i);
        var pay = '<span class="opt-pay">' + plus(o.cash) + '</span>';
        if (!ans) return '<button class="opt' + (o.wide ? ' is-wide' : '') + '" data-act="choose" data-i="' + i + '"><span class="opt-l">(' + letter + ')</span><span class="opt-t">' + o.t + '</span>' + pay + '</button>';
        var mine = ans.pick === i;
        var tag = o.wide ? '<span class="chip g-s">Another way</span>' : chip(o.g);
        var money = moneyLine(o, mine, it.who) + (mine && ans.look ? ' Looking wider cost <b>' + MB.cash(ans.look) + '</b>.' : '') + (o.wide && !mine && !ans.look ? ' You did not look for it.' : '');
        return doneCard(mine, o.g, letter, o.t, money, o.why, tag + (mine ? '<span class="yours">Your motion</span>' : ''));
      }).join('') + '</div>';
      if (!ans) {
        body += looked
          ? '<p class="note">' + (it.wide ? 'You looked wider, and found another way. It is listed last.' : 'You looked wider. These are the only options here.') + ' That cost <b>' + MB.cash(it.lookCost) + '</b>.</p>'
          : '<div class="look"><button type="button" class="btn quiet" data-act="look">Is there another way?</button><span class="opt-pay">' + MB.cash(-it.lookCost) + ' to look</span></div>';
        body += termChips(list.map(function (o) { return o.t; }));
      }
    } else if (it.kind === 'spot') {
      body = '<p class="clause">' + it.parts.map(function (q, i) {
        if (!ans) return '<button type="button" class="part" data-act="spot" data-i="' + i + '">' + q.t + '</button>';
        return '<span class="part done' + (q.k === 'y' ? ' hit' : '') + (ans.pick === i ? ' mine' : '') + '">' + q.t + '</span>';
      }).join(' ') + '</p>';
      if (!ans) body += '<p class="note">Tap the phrase that hides an opportunity. <span class="opt-pay">' + plus(it.stake) + ' if you find one</span></p>' + termChips(it.parts.map(function (q) { return q.t; }));
      else {
        var picked = it.parts[ans.pick];
        ruling = '<div class="ruling g-' + (ans.found ? 's' : 'n') + '"><p class="ruling-money">' + (ans.found ? 'Found. <b>' + plus(ans.cash) + '</b>.' : 'Missed. It was hiding in plain sight.') + '</p><ul class="others">' +
          it.parts.filter(function (q) { return q.k === 'y'; }).map(function (q) { return '<li><span class="chip g-s">Opportunity</span><span><b>' + q.t + '</b> ' + tipify(q.why) + '</span></li>'; }).join('') +
          (ans.found ? '' : '<li><span class="chip g-n">Your pick</span><span><b>' + picked.t + '</b> ' + tipify(picked.why) + '</span></li>') + '</ul></div>';
      }
    } else if (!ans) {
      body = '<form class="ledger-form" data-act="figure" novalidate><label for="figure">Your figure <span class="opt-pay">' + plus(it.stake) + ' if right</span></label>' +
        '<div class="ledger-row"><input id="figure" name="figure" inputmode="decimal" autocomplete="off" aria-describedby="figure-hint figure-err"><button class="btn" type="submit">Enter in the ledger</button></div>' +
        '<p class="hint" id="figure-hint">' + UNIT_HINT[it.unit] + '</p><p class="err" id="figure-err" role="alert"></p></form>';
    } else {
      ruling = '<div class="ruling g-' + ans.g + '"><p class="ruling-money">' + chip(ans.g) + ' <b>' + plus(ans.cash) + '</b>. You entered ' + fmtAnswer(it, ans.value) + '. The figure is <b>' + fmtAnswer(it, it.answer) + '</b>.</p>' +
        '<ol class="work">' + it.work.map(function (w) { return '<li>' + w + '</li>'; }).join('') + '</ol></div>';
    }
    return folio('Meeting ' + ROMAN[L.n] + ' ' + DOT + ' ' + L.title, 'Item ' + (run.step + 1) + ' of ' + items.length + (run.practice ? ' ' + DOT + ' practice' : '')) + pips(items, run) + tallyRow(run) +
      '<h1 class="item-title">' + it.title + '</h1>' +
      (it.role ? '<p class="role"><span class="label">You</span> ' + it.role + '</p>' : '') +
      '<div class="scene">' + tipify(paras(it.scene)) + '</div>' + (it.ask ? '<p class="ask">' + it.ask + '</p>' : '') + body +
      (ans ? '<div class="review" id="review" tabindex="-1">' + ruling +
        (it.twist ? '<div class="twist-note"><span class="label">The twist</span><p>' + it.twist + '</p></div>' : '') +
        (it.behind ? '<div class="behind"><span class="label">What was going on</span><p>' + tipify(it.behind) + '</p>' +
          (it.deep ? '<details class="deep"><summary>Go deeper</summary><ul>' + it.deep.map(function (d) { return '<li><b>' + d[0] + '.</b> ' + d[1] + '</li>'; }).join('') + '</ul></details>' : '') + '</div>' : '') +
        '<p class="rule-line"><span class="label">The principle</span> ' + it.rule + '</p>' +
        '<div class="actions"><button class="btn" data-act="next">' + (pending ? 'One more thing' : last ? 'Adjourn the meeting' : 'Next item') + '</button></div>' +
        moreBlock(it) + '</div>' : '');
  }

  function doneCard(mine, tone, letter, text, money, why, tags) {
    var inner = '<span class="opt-l">(' + letter + ')</span><span class="opt-t">' + text +
      '<span class="opt-more"><span class="opt-money">' + money + '</span><span class="opt-why">' + tipify(why) + '</span></span></span>' +
      '<span class="opt-tags">' + tags + (mine ? '' : '<span class="peek-hint">See why</span>') + '</span>';
    if (mine) return '<div class="opt done chosen g-' + tone + '" id="outcome" tabindex="-1">' + inner + '</div>';
    return '<div role="button" tabindex="0" class="opt done peek g-' + tone + '" data-act="peek" aria-expanded="false">' + inner + '</div>';
  }

  function askChip(k) {
    var A = ASK[k];
    return '<span class="chip g-' + A.tone + '">' + A.label + '</span>';
  }

  function askLine(a, mine, res, deal) {
    var R = ASK[a.k];
    if (a.k === 'n') return mine ? 'Nothing asked.' + gwText(res.gw) : 'Nothing gained, nothing risked.';
    if (a.k === 'm') return (mine ? 'Agreed. <b>' + plus(a.cash) + '</b>.' : 'Would have been agreed, for <b>' + plus(a.cash) + '</b>.') + gwText(R.gw);
    if (a.k === 'o') return (mine ? 'Agreed. You hold a free option worth up to <b>' + plus(a.opt) + '</b>. It cost them nothing today, and you nothing ever.' : 'Would have been agreed: a free option worth up to <b>' + plus(a.opt) + '</b>, at no cost or risk.') + gwText(R.gw);
    if (a.k === 'v') return (mine ? 'Done. <b>' + MB.cash(a.cash) + '</b>.' : 'Would have cost <b>' + MB.cash(-a.cash) + '</b>.') + gwText(R.gw);
    if (a.k === 't') return (mine ? 'Refused, and remembered.' : 'Would have been refused, and remembered.') + gwText(R.gw);
    if (a.k === 'x') {
      var got = a.later ? 'a right worth up to <b>' + plus(a.show) + '</b>' : '<b>' + plus(a.cash) + '</b> today';
      return (mine ? 'They signed. You took ' + got + ', and a liability that could cost <b>' + MB.cash(a.risk) + '</b>. It also costs you a governance point.' : 'They would have signed, giving you ' + got + ' and a liability of up to <b>' + MB.cash(a.risk) + '</b>.') + gwText(R.gw);
    }
    var ok = deal.roll < res.p;
    if (mine) return (res.ok ? 'Agreed. <b>' + plus(a.cash) + '</b>.' : 'Refused. Nothing gained.') + gwText(res.gw);
    return (ok ? 'Would have been agreed, for <b>' + plus(a.cash) + '</b>.' : 'Would have been refused at your goodwill.') + gwText(ok ? R.gw : R.gwNo);
  }

  function viewAsk(L, run, items, it, ans) {
    var d = it.deal, res = ans.ask, last = run.step === items.length - 1;
    var body = '<div class="opts" role="group" aria-label="Asks">' + d.asks.map(function (a, i) {
      var letter = 'abcdef'.charAt(i);
      var pay = '<span class="opt-pay">' + (a.k === 'n' ? '$0' : a.k === 'v' ? MB.cash(a.cash) : a.later ? 'up to ' + plus(a.show) + ' later' : plus(a.cash) + ' if agreed') + '</span>';
      if (!res) return '<button class="opt" data-act="ask" data-i="' + i + '"><span class="opt-l">(' + letter + ')</span><span class="opt-t">' + a.t + '</span>' + pay + '</button>';
      var mine = res.pick === i, tone = ASK[a.k].tone;
      var stamp = mine && (a.k === 'r' || a.k === 'm' || a.k === 't' || a.k === 'o') ? '<span class="stamp ' + (res.ok ? 'yes' : 'no') + '">' + (res.ok ? 'Agreed' : 'Refused') + '</span>' : '';
      return doneCard(mine, tone, letter, a.t, askLine(a, mine, res, d), a.why, askChip(a.k) + (mine ? '<span class="yours">Your ask</span>' : '') + stamp);
    }).join('') + '</div>';
    return folio('Meeting ' + ROMAN[L.n] + ' ' + DOT + ' ' + L.title, 'Item ' + (run.step + 1) + ' of ' + items.length + ' ' + DOT + ' the ask') + pips(items, run) + tallyRow(run) +
      '<h1 class="item-title">What do you ask for?</h1>' +
      '<p class="role"><span class="label">You chose</span> ' + (it.options[ans.pick] || it.wide).t + '</p>' +
      '<div class="scene">' + tipify(paras(d.setup)) + '</div>' + body +
      (res ? '<div class="review">' + (d.rule ? '<p class="rule-line"><span class="label">The line</span> ' + d.rule + '</p>' : '') +
        '<div class="actions"><button class="btn" data-act="next">' + (last ? 'Adjourn the meeting' : 'Next item') + '</button></div></div>'
        : termChips(d.asks.map(function (a) { return a.t; })) + '<p class="note">Your goodwill is <b>' + liveGoodwill(run) + '</b>. At that level a strong ask is agreed about <b>' + Math.round(reachOdds(liveGoodwill(run)) * 100) + '%</b> of the time. A fair ask always is. Some asks cost the other side nothing. An overreach crosses a legal line, and not every opening is a deal.</p>');
  }

  /* The term sheet: tick every term you want. Each has a hidden cost to the other side. */
  function dots(n, of) { var o = ''; for (var i = 0; i < of; i++) o += i < n ? '\u25cf' : '\u25cb'; return o; }
  function viewTerms(L, run, items, it, ans) {
    var sh = it.sheet, res = ans.ask, last = run.step === items.length - 1, gwNow = liveGoodwill(run);
    var body;
    if (!res) {
      body = '<form class="sheet" data-act="terms" novalidate>' + sh.terms.map(function (t, i) {
        return '<label class="sheet-row" for="term-' + i + '"><input type="checkbox" id="term-' + i + '" name="term" value="' + i + '"><span class="opt-t">' + t.t + '</span>' +
          '<span class="opt-pay">' + (t.k === 'o' ? 'up to ' + plus(t.val) + ' later' : plus(t.val)) + '</span></label>';
      }).join('') +
        '<p class="note">Tick everything you want. Each term has a cost to them that you cannot see, from nothing to a lot. Your goodwill of <b>' + gwNow + '</b> buys patience of <b>' + dots(patience(gwNow), patience(gwNow)) + '</b>. Ask for more than that and they strike out the costliest.</p>' +
        '<div class="actions"><button class="btn" type="submit">Put it to them</button></div></form>' + termChips(sh.terms.map(function (t) { return t.t; }));
    } else {
      var agreed = res.picks.filter(function (i) { return res.struck.indexOf(i) < 0 && sh.terms[i].k !== 'x'; }).length;
      body = '<div class="ruling g-' + (res.k === 'x' ? 'p' : 's') + '" id="outcome" tabindex="-1"><p class="ruling-money">' +
        (res.picks.length ? 'They agreed to <b>' + agreed + '</b> of your <b>' + res.picks.length + '</b> terms. <b>' + plus(res.cash) + '</b> now' + (res.opts.length ? ', and <b>' + res.opts.length + '</b> option' + (res.opts.length > 1 ? 's' : '') + ' held' : '') + '.' : 'You asked for nothing.') +
        (res.struck.length ? ' They struck out the costliest.' : '') + (res.risk ? ' One term crossed the line and could cost <b>' + MB.cash(res.risk) + '</b>.' : '') + gwText(res.gw) + '</p>' +
        '<p>Their patience was ' + dots(res.tol, res.tol) + '. Each term below shows what it cost them.</p></div>' +
        '<div class="opts">' + sh.terms.map(function (t, i) {
          var picked = res.picks.indexOf(i) >= 0, struck = res.struck.indexOf(i) >= 0;
          var status = t.k === 'x' ? (picked ? 'Overreach' : 'Would have been an overreach') : !picked ? (t.pain === 0 ? 'Left on the table' : 'Not asked') : struck ? 'Struck out' : 'Agreed';
          var tone = t.k === 'x' ? 'p' : struck ? 'g' : picked ? 's' : t.pain === 0 ? 'g' : 'n';
          var money = t.k === 'x' ? 'Shown as ' + plus(t.val) + '. Not a cost to them so much as a wrong to them.' : 'Cost to them: <b>' + (t.pain ? dots(t.pain, 3) : 'nothing') + '</b>. Worth ' + (t.k === 'o' ? 'up to ' : '') + '<b>' + plus(t.val) + '</b>' + (t.k === 'o' ? ' later' : '') + ' to you.';
          return '<div class="opt done g-' + tone + (picked ? ' chosen' : '') + '"><span class="opt-l">' + (picked ? '\u2611' : '\u2610') + '</span><span class="opt-t">' + t.t +
            '<span class="opt-more"><span class="opt-money">' + money + '</span><span class="opt-why">' + tipify(t.why) + '</span></span></span><span class="opt-tags"><span class="chip g-' + tone + '">' + status + '</span></span></div>';
        }).join('') + '</div>';
    }
    return folio('Meeting ' + ROMAN[L.n] + ' ' + DOT + ' ' + L.title, 'Item ' + (run.step + 1) + ' of ' + items.length + ' ' + DOT + ' the terms') + pips(items, run) + tallyRow(run) +
      '<h1 class="item-title">Write the terms.</h1>' +
      '<p class="role"><span class="label">You chose</span> ' + (it.options[ans.pick] || it.wide).t + '</p>' +
      '<div class="scene">' + tipify(paras(sh.setup)) + '</div>' + body +
      (res ? '<div class="review">' + (sh.rule ? '<p class="rule-line"><span class="label">The line</span> ' + sh.rule + '</p>' : '') +
        '<div class="actions"><button class="btn" data-act="next">' + (last ? 'Adjourn the meeting' : 'Next item') + '</button></div></div>' : '');
  }

  function wheelSVG(r, k, spun) {
    var a = r.p * 360, rad = 52, x = 60 + rad * Math.sin(a * Math.PI / 180), y = 60 - rad * Math.cos(a * Math.PI / 180);
    var slice = '<path class="w-hit" d="M60 60 L60 8 A52 52 0 ' + (a > 180 ? 1 : 0) + ' 1 ' + x.toFixed(1) + ' ' + y.toFixed(1) + ' Z"/>';
    return '<svg class="wheel ' + (r.opt ? 'is-opt' : 'is-risk') + '" viewBox="0 0 120 120" role="img" aria-label="A wheel with ' + Math.round(r.p * 100) + ' percent marked">' +
      '<g class="w-spin" id="wheel-' + k + '" style="transform: rotate(' + (spun ? -(r.u * 360) : 180 - a / 2) + 'deg)"><circle class="w-base" cx="60" cy="60" r="52"/>' + slice + '<circle class="w-hub" cx="60" cy="60" r="7"/></g>' +
      '<path class="w-pointer" d="M60 16 L52 2 L68 2 Z"/></svg>';
  }

  function viewReckon(L, run) {
    var items = buildItems(run), res = run.result, n = res.reckon.length, all = res.spun >= n;
    var cards = res.reckon.map(function (r, k) {
      var spun = k < res.spun, next = k === res.spun;
      var pc = Math.round(r.p * 100);
      var outcome = !spun ? '' : r.opt
        ? '<span class="stamp ' + (r.paid ? 'yes' : 'no-quiet') + '">' + (r.paid ? 'Paid off ' + plus(r.val) : 'Expired, at no cost') + '</span>'
        : '<span class="stamp ' + (r.due ? 'no' : 'yes') + '">' + (r.due ? 'Came due ' + MB.cash(-r.cost) : 'Never surfaced') + '</span>';
      return '<div class="spin-card' + (spun ? ' is-spun' : next ? ' is-next' : '') + '"' + (next ? ' id="outcome" tabindex="-1"' : '') + '>' + wheelSVG(r, k, spun) +
        '<div class="spin-body"><p class="spin-head"><span class="label">Item ' + (r.i + 1) + ' ' + DOT + ' ' + (r.opt ? 'a free option' : r.what) + '</span></p>' +
        (r.text ? '<p class="spin-text">' + r.text + '</p>' : '') +
        '<p class="spin-odds"><b>' + pc + '%</b> ' + (r.opt ? 'chance it pays ' + plus(r.val) : 'chance it costs ' + MB.cash(r.cost)) + '</p>' +
        '<ul class="spin-why">' + r.why.map(function (w) { return '<li>' + w + '</li>'; }).join('') + '</ul>' +
        (spun ? outcome : next ? '<button class="btn" data-act="spin" data-k="' + k + '">Spin</button>' : '<span class="label">Waiting</span>') + '</div></div>';
    }).join('');
    return folio('Meeting ' + ROMAN[L.n] + ' ' + DOT + ' ' + L.title, 'The reckoning') +
      '<h1 class="display small">Now see what comes back.</h1>' +
      '<p class="lede">Shortcuts do not always come due, and options do not always pay. The odds are yours: they come from what you did in this meeting and before it. The coloured part of each wheel is the chance.</p>' +
      '<div class="spins">' + cards + '</div>' +
      '<div class="actions">' + (all ? '<button class="btn" data-act="reckoned">See the minutes</button>' : (n - res.spun > 1 ? '<button class="btn quiet" data-act="spin-all">Spin the rest at once</button>' : '')) + '</div>';
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
      var note = a.ask ? (a.ask.sheet ? 'Term sheet' + (a.ask.k === 'x' ? ', with an overreach' : '') : ASK[a.ask.k].label + (a.ask.k === 'r' ? (a.ask.ok ? ', agreed' : ', refused') : '')) : a.wide ? 'Another way' : '';
      var badge = it.kind === 'spot' ? '<span class="chip g-' + (a.found ? 's' : 'n') + '">' + (a.found ? 'Found' : 'Missed') + '</span>' : chip(eff(a));
      return '<li><span class="min-n">' + (i + 1) + '.</span><span class="min-body">' + it.title + (note ? '<span class="min-ask">' + note + '</span>' : '') + '</span><span class="min-cash">' + plus(a.cash + (a.ask ? a.ask.cash : 0)) + '</span>' + badge + '</li>';
    }).join('');
    var nxt = L.n < MB.levels.length ? L.n + 1 : null;
    var head, sub, money = '';
    if (res.passed) {
      head = res.pct === 1 ? 'Carried without dissent.' : 'Motion carried.';
      sub = res.pts + ' of ' + res.max + ' points. ' +
        (run.practice ? 'A practice sitting. Nothing is banked.' : (res.promoted ? 'You now sit as <b>' + res.promoted + '</b>.' : ''));
      var reck = res.reckon.length
        ? '<ul class="reckon">' + res.reckon.map(function (r, k) {
          if (r.opt) return '<li class="' + (r.paid ? 'paid' : 'quiet') + '" style="animation-delay:' + (0.5 + k * 0.45) + 's"><span>Item ' + (r.i + 1) + ', a free option</span><b>' + (r.paid ? 'Paid off ' + plus(r.val) : 'Expired, at no cost') + '</b></li>';
          return '<li class="' + (r.due ? 'due' : 'quiet') + '" style="animation-delay:' + (0.5 + k * 0.45) + 's"><span>Item ' + (r.i + 1) + ', ' + (r.what || 'the loose end') + '</span><b>' + (r.due ? 'Came due ' + MB.cash(-r.cost) : 'Never surfaced') + '</b></li>';
        }).join('') + '</ul>'
        : '<p class="note">No loose ends and no options. Nothing came back.</p>';
      var left = leftOnTable(items, run);
      var leftHtml = '<h2 class="section">Left on the table</h2>' + (left.length
        ? '<ul class="left">' + left.slice(0, 8).map(function (x) { return '<li><span>Item ' + (x.i + 1) + '. ' + x.t + '</span><b>' + (x.later ? 'up to ' : '') + plus(x.amt) + '</b></li>'; }).join('') + '</ul>'
        : '<p class="note">Nothing. You took what was there to take.</p>');
      money = '<h2 class="section">The reckoning</h2>' + reck +
        '<dl class="ledger"><div><dt>Taken at the table</dt><dd>' + plus(res.gross) + '</dd></div><div><dt>Came due</dt><dd>' + MB.cash(-res.losses) + '</dd></div>' +
        (res.optGain ? '<div><dt>Options that paid off</dt><dd>' + plus(res.optGain) + '</dd></div>' : '') +
        '<div class="total"><dt>Net for the meeting</dt><dd>' + plus(res.net) + '</dd></div>' +
        (run.practice ? '' : '<div><dt>Your equity</dt><dd>' + MB.cash(equity()) + '</dd></div>') +
        '</dl>' + leftHtml + gwBreak(res, run);
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
      '<p>You start with ' + MB.cash(SEED_EQUITY) + '. Every motion shows what it pays today. ' + chip('s') + ' motions pay and nothing follows you. ' + chip('g') + ' motions leave a loose end that could cost two and a half times what you took. ' + chip('p') + ' motions leave a liability that could cost four times. You are not told which is which until you choose. The stakes grow with every meeting.</p>' +
      '<h2 class="section">The reckoning</h2>' +
      '<p>When a meeting adjourns, you spin a wheel for each loose end and each option. The coloured part is the chance, and the chance depends on you.</p>' +
      '<ul class="rules">' +
      '<li>A grey shortcut starts at <b>30%</b>. A poor choice or an overreach starts at <b>60%</b>.</li>' +
      '<li><b>+5%</b> for every other loose end in the same meeting. A pattern gets noticed.</li>' +
      '<li><b>+8%</b> for each thing that came due in your last two meetings. Once caught, you are watched.</li>' +
      '<li><b>' + MINUS + '5%</b> if your standing is 85 or more. A clean record draws fewer questions.</li>' +
      '<li>A free option pays off <b>25%</b> of the time, plus <b>3%</b> for every ten points of goodwill.</li>' +
      '</ul>' +
      '<h2 class="section">Goodwill</h2>' +
      '<p>Goodwill is what the people across the table think of dealing with you: partners, borrowers, vendors, colleagues. It runs from 0 to 100 and starts at 50. Every change names the person and the reason.</p>' +
      '<ul class="rules">' +
      '<li><b>' + MINUS + '1 to ' + MINUS + '4</b> when a sound choice refuses someone. More when they are powerful. Nothing when nobody is put out.</li>' +
      '<li><b>+1 or +2</b> when a grey or poor choice gives someone what they wanted. It is cheap goodwill, and it is lost if the loose end comes due.</li>' +
      '<li><b>' + MINUS + '6</b> each time a loose end or liability comes due.</li>' +
      '<li><b>+3</b> for passing a meeting, <b>+6</b> for a perfect one.</li>' +
      '<li><b>+5</b> for a fair ask, <b>+1</b> for a free option, <b>+2</b> for finding another way, <b>+10</b> for a gift, <b>' + MINUS + '1</b> for a strong ask that lands, <b>' + MINUS + '5</b> for one refused, <b>' + MINUS + '7</b> for a tone-deaf ask, <b>' + MINUS + '8</b> for an overreach.</li>' +
      '</ul>' +
      '<h2 class="section">The ask</h2>' +
      '<p>After some sound choices an opening appears and you choose what to ask for. A fair ask always lands and pays a little. A strong ask pays well and can be refused. The chance it lands is shown before you choose, and rises with goodwill: about 30% at 20, 55% at 50, 80% at 80. An overreach pays most, crosses a legal line and comes back on you. Sometimes there is no deal to be had, and the right ask is none.</p>' +
      '<h2 class="section">Finding more in a deal</h2>' +
      '<p>The deal on the table is usually wider than it looks, and not every gain costs something.</p>' +
      '<ul class="rules">' +
      '<li><b>Free options.</b> Some asks cost the other side nothing today and may pay you later, such as a right of first offer. They are agreed, held, and settled at adjournment. They never cost you, and they pay off more often when your goodwill is high.</li>' +
      '<li><b>Term sheets.</b> Some openings let you tick several terms at once. Each has a hidden cost to the other side, from nothing to a lot. Find the ones that are cheap for them and valuable for you.</li>' +
      '<li><b>Another way.</b> When a choice is framed as either-or, you can pay a little to look wider. Sometimes there is a better structure. Sometimes there is not.</li>' +
      '<li><b>Spot it.</b> Some items show you a document. Tap the phrase that hides an opportunity.</li>' +
      '<li><b>Left on the table.</b> At adjournment the book lists what a careful dealmaker would also have taken.</li>' +
      '</ul>' +
      '<p>One rule sits over all of it. Taking a free option from someone across the table is good dealing. Taking one for yourself from people whose money you manage needs their informed agreement.</p>' +
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

  function renderShelf() {
    var el = document.getElementById('shelf');
    if (!el) return;
    el.innerHTML = MB.levels.map(function (L) {
      var p = S.passed[L.n], open = isOpen(L.n), now = S.run && S.run.n === L.n && S.run.phase !== 'done';
      var cls = 'token' + (p ? ' won' + (p.gold ? ' gold' : '') : open ? ' open' : ' locked') + (now ? ' now' : '');
      var label = 'Meeting ' + ROMAN[L.n] + ', ' + L.title + (p ? ', sealed' : open ? ', open' : ', locked');
      return open ? '<a class="' + cls + '"' + toneStyle(L.n) + ' href="#meeting-' + L.n + '" aria-label="' + label + '">' + ROMAN[L.n] + '</a>'
        : '<span class="' + cls + '"' + toneStyle(L.n) + ' aria-label="' + label + '">' + ROMAN[L.n] + '</span>';
    }).join('');
  }

  function renderStanding() {
    renderShelf();
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
      html = run.phase === 'brief' ? viewBrief(L, run) : run.phase === 'play' ? viewPlay(L, run) : run.phase === 'reckon' ? viewReckon(L, run) : viewDone(L, run);
    } else if (r.view === 'registers') html = viewRegisters();
    else if (r.view === 'about') html = viewAbout();
    else html = viewContents();
    sheet.innerHTML = html;
    if (r.view === 'meeting') { var tn = tone(r.n); sheet.style.setProperty('--m', tn.c); sheet.style.setProperty('--on', tn.on); sheet.classList.add('in-meeting'); }
    else { sheet.style.removeProperty('--m'); sheet.style.removeProperty('--on'); sheet.classList.remove('in-meeting'); }
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
    else if (act === 'spin' && run && run.phase === 'reckon') {
      var res0 = run.result, k0 = res0.spun, r0 = res0.reckon[k0];
      if (!r0 || el.disabled) return;
      el.disabled = true;
      var wheel = document.getElementById('wheel-' + k0);
      var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (wheel && !still) { wheel.classList.add('spinning'); wheel.style.transform = 'rotate(' + (-(r0.u * 360) - 1800) + 'deg)'; }
      res0.spun = k0 + 1;
      if (res0.spun >= res0.reckon.length) { commitRun(); run.phase = 'reckon'; }
      save();
      window.setTimeout(function () { render('outcome'); if (res0.spun >= res0.reckon.length) renderStanding(); }, still ? 0 : 2700);
    }
    else if (act === 'spin-all' && run && run.phase === 'reckon') {
      commitRun(); run.phase = 'reckon'; save(); render(false);
    }
    else if (act === 'reckoned' && run && run.phase === 'reckon') {
      run.phase = 'done'; save(); render();
    }
    else if (act === 'look' && run && run.phase === 'play' && !run.answers[run.step]) {
      if (!run.look) run.look = {};
      run.look[run.step] = 1; save(); render(false);
    }
    else if (act === 'choose' && run && run.phase === 'play' && !run.answers[run.step]) {
      var i = parseInt(el.getAttribute('data-i'), 10), itc = buildItems(run)[run.step];
      var looked = !!(run.look && run.look[run.step]);
      var o = i < itc.options.length ? itc.options[i] : (looked ? itc.wide : null);
      if (!o) return;
      var spent = looked ? itc.lookCost : 0;
      run.answers[run.step] = { pick: i, g: o.g, cash: o.cash - spent, risk: o.risk, gw: o.gw, look: spent, wide: !!o.wide };
      markSeen(run.n, itc.id, (run.tw && run.tw[itc.id]) ? 't' : 'b');
      if (level(run.n).fixed) markSeen(run.n, 'story', run.alt ? 't' : 'b');
      save(); render('outcome');
    }
    else if (act === 'spot' && run && run.phase === 'play' && !run.answers[run.step]) {
      var sp = buildItems(run)[run.step], si = parseInt(el.getAttribute('data-i'), 10), hit = sp.parts[si].k === 'y';
      run.answers[run.step] = { pick: si, g: 's', found: hit, cash: hit ? sp.stake : 0, risk: 0, gw: 0 };
      save(); render('review');
    }
    else if (act === 'ask' && run && run.phase === 'play' && run.sub === 'ask' && run.answers[run.step] && !run.answers[run.step].ask) {
      var d = buildItems(run)[run.step].deal, k = parseInt(el.getAttribute('data-i'), 10), a = d.asks[k], R = ASK[a.k];
      var res = { pick: k, k: a.k, ok: true, cash: 0, risk: 0, gw: R.gw, p: reachOdds(liveGoodwill(run)) };
      if (a.k === 'm' || a.k === 'v') res.cash = a.cash;
      else if (a.k === 'o') { res.opts = [a.opt]; res.optTexts = [a.t]; }
      else if (a.k === 'x') { res.cash = a.cash; res.risk = a.risk; res.riskText = a.t; }
      else if (a.k === 't') res.ok = false;
      else if (a.k === 'n') res.gw = d.none ? R.gwRight : R.gw;
      else if (a.k === 'r') { res.ok = d.roll < res.p; res.cash = res.ok ? a.cash : 0; res.gw = res.ok ? R.gw : R.gwNo; }
      run.answers[run.step].ask = res;
      save(); render('outcome');
    }
    else if (act === 'next' && run && run.answers[run.step]) {
      var cur = buildItems(run)[run.step], an = run.answers[run.step];
      if ((cur.deal || cur.sheet) && an.g === 's' && !an.ask && run.sub !== 'ask') { run.sub = 'ask'; save(); render(); return; }
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
      var term = el.getAttribute('data-term'), box = document.getElementById('tip-box');
      var host = el.closest('.opt, .sheet-row, .behind, .terms-used, .scene, .clause, .ruling') || el.parentNode;
      if (box && !box.hidden && box.getAttribute('data-term') === term && box.previousElementSibling === host) { box.hidden = true; return; }
      if (!box) { box = document.createElement('div'); box.id = 'tip-box'; box.className = 'tip-box'; }
      box.innerHTML = '<b>' + term + '.</b> ' + defs()[term];
      box.setAttribute('data-term', term); box.hidden = false;
      host.insertAdjacentElement('afterend', box);
    }
    else if (act === 'career-ask') {
      document.getElementById('career-zone').innerHTML = '<p class="confirm">Close the book on this career and start again at ' + MB.cash(SEED_EQUITY) + '?</p><div class="actions"><button class="btn danger" data-act="career-yes">Yes, start again</button><button class="btn quiet" data-act="career-no">Keep this career</button></div>';
    }
    else if (act === 'career-no') { render(false); }
    else if (act === 'career-yes') {
      var keep = { bestEquity: S.bestEquity, unlockAll: S.unlockAll, seen: S.seen || {}, seenV: S.seenV || {} };
      S = Object.assign(fresh(), keep); cache = { key: '', items: [] }; save();
      if (route().view !== 'contents') window.location.hash = 'contents'; else render();
    }
    else if (act === 'lock') {
      try { window.localStorage.removeItem('minute-book-key-v1'); } catch (err) { /* ignore */ }
      window.location.reload();
    }
  }

  function onTerms(form) {
    var run = S.run;
    if (!run || run.phase !== 'play' || run.sub !== 'ask' || !run.answers[run.step] || run.answers[run.step].ask) return;
    var terms = buildItems(run)[run.step].sheet.terms, tol = patience(liveGoodwill(run));
    var picks = Array.prototype.filter.call(form.querySelectorAll('input[name="term"]'), function (c) { return c.checked; }).map(function (c) { return parseInt(c.value, 10); });
    var legit = picks.filter(function (i) { return terms[i].k !== 'x'; }), xs = picks.filter(function (i) { return terms[i].k === 'x'; });
    var pain = legit.reduce(function (t, i) { return t + terms[i].pain; }, 0), struck = [];
    var byPain = legit.slice().sort(function (a, b) { return terms[b].pain - terms[a].pain || b - a; });
    while (pain > tol && byPain.length) { var out = byPain.shift(); struck.push(out); pain -= terms[out].pain; }
    var res = { sheet: true, k: xs.length ? 'x' : 's', ok: true, picks: picks, struck: struck, cash: 0, risk: 0, opts: [], tol: tol, gw: 0 };
    res.optTexts = [];
    legit.forEach(function (i) { if (struck.indexOf(i) >= 0) return; if (terms[i].k === 'o') { res.opts.push(terms[i].val); res.optTexts.push(terms[i].t); } else res.cash += terms[i].val; });
    xs.forEach(function (i) { res.cash += terms[i].val; res.risk += terms[i].risk; res.riskText = terms[i].t; });
    res.gw = (picks.length ? (struck.length ? -2 * struck.length : 2) : 1) + xs.length * ASK.x.gw;
    run.answers[run.step].ask = res;
    save(); render('outcome');
  }

  function onSubmit(e) {
    var tf = e.target.closest('form[data-act="terms"]');
    if (tf) { e.preventDefault(); onTerms(tf); return; }
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
    if (S.run && S.run.phase === 'reckon' && S.run.result && S.run.result.committed) S.run.phase = 'done';
    document.addEventListener('click', onClick);
    document.addEventListener('submit', onSubmit);
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[role="button"][data-act]')) { e.preventDefault(); e.target.click(); }
    });
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
