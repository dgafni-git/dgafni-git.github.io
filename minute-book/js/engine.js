/* Minute Book: engine. State, seeded scenario generation, rendering. */
(function () {
  'use strict';

  var MB = window.MB = { levels: [], numerics: {} };
  MB.level = function (def) { MB.levels.push(def); };

  var ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];
  var GRADE = {
    s: { label: 'Sound', pts: 2, mark: '✓', standing: 3, exposure: -2 },
    g: { label: 'Grey', pts: 1, mark: '~', standing: -1, exposure: 5 },
    p: { label: 'Poor', pts: 0, mark: '✕', standing: -6, exposure: 10 }
  };
  var START_RANK = 'Analyst';
  var KEY = 'minute-book-v1';

  /* ---------- formatting ---------- */

  MB.usd = function (n) {
    var a = Math.abs(n), sign = n < 0 ? '-' : '';
    if (a >= 1e6) return sign + '$' + String(Math.round(a / 1e3) / 1e3) + ' million';
    return sign + '$' + Math.round(a).toLocaleString('en-US');
  };
  MB.fix = function (n, dp) { return (Math.round(n * Math.pow(10, dp)) / Math.pow(10, dp)).toFixed(dp); };

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
  var ASSETS = ['a half-built 48-unit townhouse site', 'a stalled six-storey condominium project', 'a 12-acre serviced subdivision', 'a vacant retail plaza slated for redevelopment', 'a 90-unit rental conversion', 'a mixed-use infill site with an approved site plan'];

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
        return { name: c.name, short: c.short, ca: c.ca, toString: function () { return c.name; } };
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
  MB._makeGen = makeGen;

  /* ---------- state ---------- */

  var S = fresh();
  function fresh() { return { passed: {}, standing: 50, exposure: 10, unlockAll: false, run: null }; }

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
  function clamp(v) { return Math.max(0, Math.min(100, v)); }

  /* ---------- runs ---------- */

  var cache = { key: '', items: [] };

  function buildItems(run) {
    var key = run.n + ':' + run.seed;
    if (cache.key === key) return cache.items;
    var L = level(run.n), g0 = makeGen(run.seed);
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
        inst.kind = 'numeric'; inst.id = o.key;
        return inst;
      }
      var gc = makeGen(run.seed ^ hash(o.def.id));
      gc.story = story;
      var made = o.def.make(gc);
      made.kind = 'choice'; made.id = o.def.id; made.title = o.def.title; made.builds = o.def.builds || [];
      made.options = gc.shuffle(made.options.map(function (a) { return { g: a[0], t: a[1], why: a[2] }; }));
      return made;
    });
    cache = { key: key, items: items };
    return items;
  }
  MB._buildItems = buildItems;

  function startRun(n) {
    S.run = { n: n, seed: (Math.random() * 4294967296) >>> 0, phase: 'brief', step: 0, answers: [], result: null };
    save();
  }

  function applyGrade(k) {
    S.standing = clamp(S.standing + GRADE[k].standing);
    S.exposure = clamp(S.exposure + GRADE[k].exposure);
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

  function finishRun() {
    var run = S.run, items = buildItems(run), L = level(run.n);
    var pts = run.answers.reduce(function (t, a) { return t + GRADE[a.g].pts; }, 0);
    var max = items.length * 2, pct = pts / max;
    var passed = pct >= L.pass - 1e-9;
    var before = rank(), first = false;
    if (passed) {
      var prev = S.passed[run.n];
      first = !prev;
      S.passed[run.n] = { best: Math.max(prev ? prev.best : 0, pct), gold: (prev && prev.gold) || pct === 1 };
    }
    run.phase = 'done';
    run.result = { pts: pts, max: max, pct: pct, passed: passed, first: first, promoted: rank() !== before ? rank() : null };
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
    var nx = nextLevel(), run = S.run;
    var done = Object.keys(S.passed).length;
    var cta;
    if (run && run.phase !== 'done') {
      cta = '<a class="btn" href="#meeting-' + run.n + '">Return to Meeting ' + ROMAN[run.n] + '</a>';
    } else if (nx) {
      cta = '<a class="btn" href="#meeting-' + nx + '">' + (done ? 'Attend Meeting ' + ROMAN[nx] : 'Attend your first meeting') + '</a>';
    } else {
      cta = '<span class="held">You hold the chair. Every meeting is open for another sitting.</span>';
    }
    var rows = MB.levels.map(function (L) {
      var p = S.passed[L.n], open = isOpen(L.n);
      var st = p ? '<span class="m-status passed">' + (p.gold ? 'Gold seal' : 'Sealed') + ' · ' + Math.round(p.best * 100) + '%</span>'
        : open ? '<span class="m-status open">Open</span>' : '<span class="m-status locked">Locked</span>';
      var inner = '<span class="m-num">' + ROMAN[L.n] + '</span><span class="m-main"><span class="m-title">' + L.title + '</span><span class="m-topics">' + L.topics + '</span></span>' + st;
      return open ? '<li class="meeting"><a href="#meeting-' + L.n + '">' + inner + '</a></li>'
        : '<li class="meeting is-locked"><div aria-disabled="true">' + inner + '</div></li>';
    }).join('');
    return folio('Contents', done + ' of ' + MB.levels.length + ' meetings sealed') +
      '<h1 class="display">Thirteen meetings between you and the chair.</h1>' +
      '<p class="lede">Each meeting puts real decisions from lending, development and private equity on the agenda. Every item has a sound course, a grey one and a poor one. Choose, see what follows, and the book records it. Pass a meeting and the next one opens.</p>' +
      '<div class="career"><div><span class="label">Your seat</span><span class="career-rank">' + rank() + '</span></div>' + cta + '</div>' +
      '<ol class="meetings">' + rows + '</ol>';
  }

  function viewBrief(L) {
    var terms = L.concepts.map(function (c) { return '<div class="term"><dt>' + c[0] + '</dt><dd>' + c[1] + '</dd></div>'; }).join('');
    var n = (L.fixed ? L.scenarios.length : L.draw.authored + (L.draw.numeric || 0));
    return folio('Meeting ' + ROMAN[L.n], 'Before the meeting') +
      '<h1 class="display">' + L.title + '</h1>' +
      '<p class="lede">' + L.blurb + '</p>' +
      '<p class="terms-line"><span class="label">On the agenda</span> ' + n + ' items. Pass with ' + Math.round(L.pass * 100) + '% of the points to take the seat of <b>' + L.rank + '</b>.</p>' +
      '<h2 class="section">Terms you will need</h2><dl class="terms">' + terms + '</dl>' +
      '<div class="actions"><button class="btn" data-act="order">Call the meeting to order</button><a class="btn quiet" href="#contents">Back to contents</a></div>';
  }

  function pips(items, run) {
    return '<ol class="pips" aria-label="Agenda progress">' + items.map(function (it, i) {
      var a = run.answers[i];
      var cls = a ? 'g-' + a.g : (i === run.step ? 'now' : '');
      return '<li class="' + cls + '"><span class="vh">Item ' + (i + 1) + (a ? ': ' + GRADE[a.g].label : i === run.step ? ': current' : '') + '</span></li>';
    }).join('') + '</ol>';
  }

  function notes(it) {
    var out = '<div class="rule-box"><span class="label">The principle</span>' + paras(it.rule) + '</div>';
    if (it.us || it.ca) {
      out += '<div class="juris">' +
        (it.us ? '<div><span class="label">United States</span><p>' + it.us + '</p></div>' : '') +
        (it.ca ? '<div><span class="label">Canada</span><p>' + it.ca + '</p></div>' : '') + '</div>';
    }
    return out;
  }

  function viewPlay(L, run) {
    var items = buildItems(run), it = items[run.step], ans = run.answers[run.step];
    var last = run.step === items.length - 1;
    var body = '';
    if (it.kind === 'choice') {
      body = '<div class="opts" role="group" aria-label="Motions">' + it.options.map(function (o, i) {
        var letter = 'abcdef'.charAt(i);
        if (!ans) return '<button class="opt" data-act="choose" data-i="' + i + '"><span class="opt-l">(' + letter + ')</span><span class="opt-t">' + o.t + '</span></button>';
        var mine = ans.pick === i;
        return '<div class="opt done g-' + o.g + (mine ? ' chosen' : '') + '"><span class="opt-l">(' + letter + ')</span><span class="opt-t">' + o.t +
          '<span class="opt-why">' + o.why + '</span></span><span class="opt-tags">' + chip(o.g) + (mine ? '<span class="yours">Your motion</span>' : '') + '</span></div>';
      }).join('') + '</div>';
    } else if (!ans) {
      body = '<form class="ledger-form" data-act="figure" novalidate><label for="figure">Your figure</label>' +
        '<div class="ledger-row"><input id="figure" name="figure" inputmode="decimal" autocomplete="off" aria-describedby="figure-hint figure-err"><button class="btn" type="submit">Enter in the ledger</button></div>' +
        '<p class="hint" id="figure-hint">' + UNIT_HINT[it.unit] + '</p><p class="err" id="figure-err" role="alert"></p></form>';
    } else {
      body = '<div class="worked g-' + ans.g + '"><p class="worked-head">' + chip(ans.g) + ' You entered <b>' + fmtAnswer(it, ans.value) + '</b>. The figure is <b>' + fmtAnswer(it, it.answer) + '</b>.' +
        (ans.g === 'g' ? ' Close, but a step or a rounding went astray.' : '') + '</p><ol class="work">' + it.work.map(function (w) { return '<li>' + w + '</li>'; }).join('') + '</ol></div>';
    }
    var builds = it.builds && it.builds.length ? '<p class="builds"><span class="label">Draws on</span> ' + it.builds.join(' · ') + '</p>' : '';
    return folio('Meeting ' + ROMAN[L.n] + ' · ' + L.title, 'Item ' + (run.step + 1) + ' of ' + items.length) + pips(items, run) +
      '<h1 class="item-title">' + it.title + '</h1>' + builds +
      '<div class="scene">' + paras(it.scene) + '</div><p class="ask">' + it.ask + '</p>' + body +
      (ans ? '<div class="review" id="review" tabindex="-1">' + notes(it) + '<div class="actions"><button class="btn" data-act="next">' + (last ? 'Adjourn the meeting' : 'Next item') + '</button></div></div>' : '');
  }

  function viewDone(L, run) {
    var items = buildItems(run), res = run.result;
    var minutes = items.map(function (it, i) {
      var a = run.answers[i], extra = '';
      if (it.kind === 'choice') {
        if (a.g !== 's') {
          var sound = it.options.filter(function (o) { return o.g === 's'; })[0];
          extra = '<span class="min-sound"><span class="label">Sound course</span> ' + sound.t + '</span>';
        }
      } else if (a.g !== 's') {
        extra = '<span class="min-sound"><span class="label">The figure</span> ' + fmtAnswer(it, it.answer) + '</span>';
      }
      return '<li><span class="min-n">' + (i + 1) + '.</span><span class="min-body"><b>' + it.title + '</b>' + extra + '</span>' + chip(a.g) + '</li>';
    }).join('');
    var nxt = L.n < MB.levels.length ? L.n + 1 : null;
    var head, sub;
    if (res.passed) {
      head = res.pct === 1 ? 'Carried without dissent.' : 'The meeting is adjourned. Motion carried.';
      sub = 'You took ' + res.pts + ' of ' + res.max + ' points. ' +
        (res.promoted ? 'You now sit as <b>' + res.promoted + '</b>. ' : '') +
        (res.first ? 'The terms from this meeting are entered in your Registers.' : '') +
        (L.n === MB.levels.length ? ' You have chaired the hardest meeting in the book.' : '');
    } else {
      head = 'The meeting is adjourned. The motion failed.';
      sub = 'You took ' + res.pts + ' of ' + res.max + ' points and needed ' + Math.ceil(L.pass * res.max - 1e-9) + '. Read the minutes below, then sit the meeting again. The agenda will not be the same.';
    }
    var acts = '';
    if (res.passed && nxt) acts += '<a class="btn" href="#meeting-' + nxt + '">Go to Meeting ' + ROMAN[nxt] + '</a>';
    acts += '<button class="btn ' + (res.passed && nxt ? 'quiet' : '') + '" data-act="again">Sit this meeting again</button><a class="btn quiet" href="#contents">Contents</a>';
    return folio('Meeting ' + ROMAN[L.n] + ' · ' + L.title, 'Adjourned') +
      '<div class="verdict' + (res.passed ? ' passed' : '') + '">' + (res.passed ? sealSVG(L.n, res.pct === 1) : '') +
      '<div><h1 class="display small">' + head + '</h1><p class="lede">' + sub + '</p></div></div>' +
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
      '<p class="lede">A minute book keeps registers of directors, officers and securities. This one keeps a register of what you have learned. Each meeting you pass enters its terms here.</p>' + groups;
  }

  function viewAbout() {
    return folio('About', 'How the book works') +
      '<h1 class="display small">How the book works.</h1>' +
      '<div class="prose">' +
      '<p>Minute Book is a learning game about corporate governance in real estate lending, development and private equity. It starts with what a legal entity is and ends with you chairing a board through a related-party investigation.</p>' +
      '<h2 class="section">Scoring</h2>' +
      '<p>Each agenda item offers motions. ' + chip('s') + ' is the course a careful board and its counsel would take and earns 2 points. ' + chip('g') + ' is common practice that leaves a gap and earns 1. ' + chip('p') + ' earns nothing. Some items ask for a figure instead, and the book shows the working. A meeting passes at 70% of its points. The last one needs 80%.</p>' +
      '<p>Scenarios are drawn and filled in fresh each sitting, so names, places, amounts and the order of the motions change.</p>' +
      '<h2 class="section">Standing and exposure</h2>' +
      '<p><b>Standing</b> is how far investors, partners and regulators trust you. <b>Exposure</b> is the legal risk you have left lying around. Sound choices raise the first and lower the second. Neither one blocks your progress, but they are the two things a governance career is measured by.</p>' +
      '<h2 class="section">What this is not</h2>' +
      '<p>It is not legal advice. The law differs by state, province and country, and the agreement in front of you usually matters more than the general rule. The notes for the United States and Canada point to common differences and leave out a great deal. Use the game to learn what to ask, then ask a lawyer.</p>' +
      '<h2 class="section">Settings</h2>' +
      '<div class="settings">' +
      '<label class="check" for="unlock-all"><input type="checkbox" id="unlock-all" data-act="unlock"' + (S.unlockAll ? ' checked' : '') + '> Open every meeting and the full Registers, skipping the progression</label>' +
      '<div id="reset-zone"><button class="btn quiet" data-act="reset-ask">Erase my progress</button></div>' +
      '</div></div>';
  }

  /* ---------- shell ---------- */

  var sheet, standingEl;

  function band(v, labels) { return labels[v <= 25 ? 0 : v <= 50 ? 1 : v <= 75 ? 2 : 3]; }

  function renderStanding() {
    var st = band(S.standing, ['Doubted', 'Unproven', 'Trusted', 'Relied upon']);
    var ex = band(S.exposure, ['Clean file', 'Loose ends', 'Counsel is uneasy', 'Claims are likely']);
    standingEl.innerHTML =
      '<div class="who"><span class="label">Seat</span><b>' + rank() + '</b></div>' +
      '<div class="meter"><span class="label">Standing</span><span class="bar"><i style="width:' + S.standing + '%"></i></span><span class="meter-v">' + st + '</span></div>' +
      '<div class="meter exposure"><span class="label">Exposure</span><span class="bar"><i style="width:' + S.exposure + '%"></i></span><span class="meter-v">' + ex + '</span></div>';
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
      html = run.phase === 'brief' ? viewBrief(L) : run.phase === 'play' ? viewPlay(L, run) : viewDone(L, run);
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
      var i = parseInt(el.getAttribute('data-i'), 10), it = buildItems(run)[run.step];
      var k = it.options[i].g;
      run.answers[run.step] = { pick: i, g: k };
      applyGrade(k); save(); render('review');
    }
    else if (act === 'next' && run && run.answers[run.step]) {
      if (run.step >= buildItems(run).length - 1) finishRun(); else { run.step++; save(); }
      render();
    }
    else if (act === 'again' && run) { startRun(run.n); render(); }
    else if (act === 'unlock') { S.unlockAll = el.checked; save(); renderStanding(); }
    else if (act === 'reset-ask') {
      document.getElementById('reset-zone').innerHTML = '<p class="confirm">Erase every seal, register entry and score?</p><div class="actions"><button class="btn danger" data-act="reset-yes">Yes, erase it all</button><button class="btn quiet" data-act="reset-no">Keep my progress</button></div>';
    }
    else if (act === 'reset-no') { render(false); }
    else if (act === 'reset-yes') { S = fresh(); cache = { key: '', items: [] }; save(); window.location.hash = 'contents'; render(); }
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
    run.answers[run.step] = { value: res.value, g: res.g };
    applyGrade(res.g); save(); render('review');
  }

  function boot(data) {
    sheet = document.getElementById('sheet');
    standingEl = document.getElementById('standing');
    MB.levels.sort(function (a, b) { return a.n - b.n; });
    if (data && data.state) S = Object.assign(fresh(), data.state); else load();
    if (S.run && !level(S.run.n)) S.run = null;
    document.addEventListener('click', onClick);
    document.addEventListener('submit', onSubmit);
    window.addEventListener('hashchange', function () { render(); });
    render(false);
  }

  MB._state = function () { return S; };

  document.addEventListener('DOMContentLoaded', function () {
    var hot = window.claude && window.claude.hot;
    if (hot && hot.snapshot) hot.snapshot(function () { return { state: S }; });
    if (hot && hot.ready) hot.ready(boot); else boot((hot && hot.data) || {});
  });
})();
