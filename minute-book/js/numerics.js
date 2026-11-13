/* Minute Book: generated figure questions. Each returns a fresh problem from the seeded generator. */
(function () {
  'use strict';
  var N = MB.numerics, usd = MB.usd, fix = MB.fix;
  function M(n) { return n / 1e6; }

  N.vote = function (g) {
    var n = g.pick([5, 7, 9]), quorum = Math.floor(n / 2) + 1;
    var present = g.int(quorum, n), conflicted = g.int(1, Math.min(2, present - 2));
    var voting = present - conflicted, need = Math.floor(voting / 2) + 1;
    var spe = g.spe('Inc.');
    return {
      title: 'Counting the vote',
      scene: 'The board of ' + spe + ' has ' + n + ' directors. Its by-laws set quorum at a majority of the directors in office. A resolution passes with a majority of the votes cast by directors who are present and entitled to vote. A director with a declared conflict counts toward quorum and must not vote.\n\n' +
        'Tonight ' + present + ' directors attend. ' + (conflicted === 1 ? 'One of them has' : 'Two of them have') + ' declared a conflict on a contract with a related company. Every director entitled to vote will vote.',
      ask: 'What is the smallest number of votes in favour that carries the resolution?',
      unit: 'count', answer: need,
      work: [
        'Quorum is a majority of ' + n + ', so ' + quorum + '. With ' + present + ' present, the meeting can act.',
        'Entitled to vote: ' + present + ' present less ' + conflicted + ' conflicted = ' + voting + '.',
        'A majority of ' + voting + ' is ' + need + '.'
      ],
      rule: 'Check quorum first, then work out who may vote, then count. Minutes should record who declared a conflict and that they did not vote, so anyone reading later can redo this arithmetic.',
      us: 'Delaware lets interested directors count toward quorum. Whether their votes count is a question for the by-laws and for how much protection the approval gives.',
      ca: 'Federal and Ontario corporate statutes generally bar a conflicted director from voting on the contract, with narrow exceptions, and require the disclosure to be recorded.'
    };
  };

  N.ltv = function (g) {
    var useCost = g.rnd() < 0.5;
    var base = g.m(8, 24, 2), cap = useCost ? g.pick([70, 75, 80]) : g.pick([60, 65, 70]);
    var loan = Math.round(base * g.pick([0.55, 0.6, 0.625, 0.675, 0.7, 0.725, 0.775, 0.8]) / 5e4) * 5e4;
    var ratio = loan / base * 100, over = ratio > cap + 1e-9;
    var c = g.city();
    return {
      title: useCost ? 'Loan to cost' : 'Loan to value',
      scene: 'A borrower asks ' + g.fund + ' for a ' + usd(loan) + ' loan on a project in ' + c + '. ' +
        (useCost ? 'The total project budget, land included, is ' + usd(base) + '. Credit policy caps loan-to-cost at ' + cap + '%.'
          : 'An independent appraisal puts the value at ' + usd(base) + '. Credit policy caps loan-to-value at ' + cap + '%.'),
      ask: 'What is the ' + (useCost ? 'loan-to-cost' : 'loan-to-value') + ' ratio?',
      unit: 'pct', answer: ratio,
      work: [
        (useCost ? 'Loan-to-cost' : 'Loan-to-value') + ' = loan ÷ ' + (useCost ? 'total cost' : 'appraised value') + '.',
        usd(loan) + ' ÷ ' + usd(base) + ' = ' + fix(ratio, 1) + '%.',
        over ? 'That is over the ' + cap + '% cap. The loan needs a documented policy exception from the credit committee, or a smaller advance.' : 'That is within the ' + cap + '% cap.'
      ],
      rule: 'Leverage ratios are governance tools as much as credit tools. A policy limit means something only if exceptions are approved by the right body and written down, never waved through by the deal team.'
    };
  };

  N.dscr = function (g) {
    var ds = g.m(0.6, 1.8, 0.1), cov = g.pick([1.15, 1.2, 1.25]);
    var noi = Math.round(ds * g.pick([0.95, 1.05, 1.1, 1.18, 1.22, 1.3, 1.4]) / 1e4) * 1e4;
    var r = noi / ds, breach = r < cov - 1e-9;
    return {
      title: 'Testing the coverage covenant',
      scene: 'A loan agreement requires the borrower to keep a debt service coverage ratio of at least ' + fix(cov, 2) + 'x, tested each year. This year the property produced net operating income of ' + usd(noi) + '. Scheduled principal and interest came to ' + usd(ds) + '.',
      ask: 'What is the debt service coverage ratio?',
      unit: 'x', answer: r,
      work: [
        'Coverage = net operating income ÷ debt service.',
        usd(noi) + ' ÷ ' + usd(ds) + ' = ' + fix(r, 2) + 'x.',
        breach ? 'That is below ' + fix(cov, 2) + 'x. The covenant is breached, and the agreement decides what follows: notice, a cure period, perhaps a cash sweep.' : 'That meets the ' + fix(cov, 2) + 'x covenant.'
      ],
      rule: 'A covenant test is a report of fact. The borrower reports it accurately, and the lender responds in writing. Adjusting income to get over the line, or noticing a breach and saying nothing, both create problems far larger than the breach.'
    };
  };

  N.dilution = function (g) {
    var c = g.m(2, 6, 1), x = Math.round(c * g.pick([0.1, 0.2, 0.25]));
    var a = g.person(), b = g.person();
    var aAdj = c + x + 1.5 * x, total = aAdj + c, pct = c / total * 100;
    return {
      title: 'The squeeze-down',
      scene: a + ' and ' + b + ' each put ' + usd(c) + ' into a project company and each hold 50%. Costs run over, and the company makes a capital call of ' + usd(x) + ' from each partner. ' + b.first + ' does not fund.\n\n' +
        'The agreement lets the other partner cover the shortfall. The covering amount is credited at 150% when the percentage interests are recalculated. ' + a.first + ' funds both shares of the call.',
      ask: 'What is ' + b.first + '’s percentage interest after the recalculation?',
      unit: 'pct', answer: pct,
      work: [
        a.first + ' is credited with ' + usd(c) + ' + ' + usd(x) + ' + (150% × ' + usd(x) + ') = ' + usd(aAdj) + '.',
        b.first + ' stays at ' + usd(c) + '. Total credited capital is ' + usd(total) + '.',
        usd(c) + ' ÷ ' + usd(total) + ' = ' + fix(pct, 1) + '%.'
      ],
      rule: 'Dilution for a missed capital call is a contractual remedy. It applies only as the agreement writes it: proper notice of the call, any cure period, and the stated formula, applied the same way to every partner.'
    };
  };

  function wfBase(g) {
    var c = g.pick([4, 5, 6, 8, 10]), r = g.pick([8, 10]), yrs = g.pick([2, 3]);
    var pref = c * r * yrs / 100, excess = g.pick([1, 1.5, 2, 2.5, 3]);
    return { c: c, r: r, yrs: yrs, pref: pref, excess: excess, p: c + pref + excess };
  }

  N.waterfall = function (g) {
    var w = wfBase(g), split = g.pick([20, 30]);
    var gp = w.excess * split / 100;
    return {
      title: 'Running the waterfall',
      scene: 'Limited partners put ' + usd(w.c * 1e6) + ' into a project partnership. ' + w.yrs + ' years later the property sells and ' + usd(Math.round(w.p * 1e6)) + ' is available to distribute.\n\n' +
        'The agreement distributes in this order. First, capital back to the limited partners. Second, a preferred return to them of ' + w.r + '% a year, simple and not compounded. Third, the rest is split ' + (100 - split) + '% to the limited partners and ' + split + '% to the general partner as its promote.',
      ask: 'How much does the general partner receive as promote?',
      unit: 'musd', answer: gp,
      work: [
        'Tier 1, return of capital: ' + usd(w.c * 1e6) + '.',
        'Tier 2, preferred return: ' + usd(w.c * 1e6) + ' × ' + w.r + '% × ' + w.yrs + ' years = ' + usd(Math.round(w.pref * 1e6)) + '.',
        'Left for tier 3: ' + usd(Math.round(w.p * 1e6)) + ' − ' + usd(w.c * 1e6) + ' − ' + usd(Math.round(w.pref * 1e6)) + ' = ' + usd(Math.round(w.excess * 1e6)) + '.',
        'Promote: ' + split + '% × ' + usd(Math.round(w.excess * 1e6)) + ' = ' + usd(Math.round(gp * 1e6)) + '.'
      ],
      rule: 'A waterfall runs strictly in order. Nothing reaches a lower tier until every tier above it is paid in full. The general partner calculates its own pay here, which is why the working should go to the investors with every distribution.'
    };
  };

  N.catchup = function (g) {
    var w = wfBase(g);
    var catchup = w.pref * 0.25, rest = w.excess - catchup, gp = catchup + rest * 0.2;
    return {
      title: 'The catch-up tier',
      scene: 'Limited partners put ' + usd(w.c * 1e6) + ' into a fund vehicle. ' + w.yrs + ' years later ' + usd(Math.round(w.p * 1e6)) + ' is available to distribute.\n\n' +
        'The order is: capital back to the limited partners; then a preferred return to them of ' + w.r + '% a year, simple; then 100% to the general partner until it has received 20% of all profit distributed so far; then 80% to the limited partners and 20% to the general partner.',
      ask: 'How much does the general partner receive in total?',
      unit: 'musd', answer: gp,
      work: [
        'Return of capital: ' + usd(w.c * 1e6) + '. Preferred return: ' + usd(Math.round(w.pref * 1e6)) + '.',
        'Catch-up: the general partner needs 20% of (preferred return + catch-up). That is ' + usd(Math.round(w.pref * 1e6)) + ' × 20 ÷ 80 = ' + usd(Math.round(catchup * 1e6)) + '.',
        'Remainder: ' + usd(Math.round(w.excess * 1e6)) + ' − ' + usd(Math.round(catchup * 1e6)) + ' = ' + usd(Math.round(rest * 1e6)) + ', of which 20% is ' + usd(Math.round(rest * 0.2 * 1e6)) + '.',
        'Total to the general partner: ' + usd(Math.round(gp * 1e6)) + '. Check: that is 20% of the whole profit of ' + usd(Math.round((w.pref + w.excess) * 1e6)) + '.'
      ],
      rule: 'A full catch-up means that once the preferred return is met, the general partner ends up with its promote percentage of all the profit, not only the profit above the hurdle. Whether a catch-up exists, and at what rate, moves a great deal of money, so read the tier carefully.'
    };
  };

  N.clawback = function (g) {
    var p1 = g.pick([4, 5, 6, 8]), l2 = g.pick([1, 1.5, 2, 2.5, 3]);
    var paid = p1 * 0.2, entitled = (p1 - l2) * 0.2, cb = paid - entitled;
    return {
      title: 'The clawback',
      scene: 'A fund pays its promote deal by deal: the general partner takes 20% of the profit on each investment as it is sold. The first sale made a profit of ' + usd(p1 * 1e6) + ', and the general partner took its 20%.\n\n' +
        'The second and last investment has now sold at a loss of ' + usd(l2 * 1e6) + '. The agreement has a clawback: across the life of the fund, the general partner may keep no more than 20% of the total net profit. Ignore the preferred return and taxes.',
      ask: 'How much must the general partner return?',
      unit: 'musd', answer: cb,
      work: [
        'Promote already taken: 20% × ' + usd(p1 * 1e6) + ' = ' + usd(Math.round(paid * 1e6)) + '.',
        'Net profit of the whole fund: ' + usd(p1 * 1e6) + ' − ' + usd(l2 * 1e6) + ' = ' + usd(Math.round((p1 - l2) * 1e6)) + '.',
        'Promote allowed: 20% of that = ' + usd(Math.round(entitled * 1e6)) + '.',
        'Clawback: ' + usd(Math.round(paid * 1e6)) + ' − ' + usd(Math.round(entitled * 1e6)) + ' = ' + usd(Math.round(cb * 1e6)) + '.'
      ],
      rule: 'Deal-by-deal promotes pay the general partner early, before the fund’s final result is known. The clawback is the investors’ protection. It is only as good as the general partner’s ability to pay it back, which is why agreements add escrows, holdbacks or personal guarantees.'
    };
  };

  N.payoff = function (g) {
    var p = g.pick([4, 6, 8, 12]), r = g.pick([8, 9, 10, 12]), d = g.pick([4, 5, 6]), mo = g.pick([3, 6, 9]);
    var fee = g.pick([1, 1.5, 2]), legal = g.pick([25000, 40000, 60000]);
    var interest = p * (r + d) / 100 * mo / 12, feeAmt = p * fee / 100, total = p + interest + feeAmt + legal / 1e6;
    return {
      title: 'The payoff figure',
      scene: 'A borrower in default asks ' + g.fund + ' for a payoff figure under a proposed forbearance agreement. Principal is ' + usd(p * 1e6) + '. No interest has been paid since the default ' + mo + ' months ago.\n\n' +
        'The note carries ' + r + '% a year, and the loan agreement adds ' + d + '% a year after default. The forbearance fee is ' + fee + '% of principal. The lender’s legal costs, recoverable under the loan agreement, are ' + usd(legal) + '. Use simple interest.',
      ask: 'What is the total payoff?',
      unit: 'musd', answer: total,
      work: [
        'Interest since default: ' + usd(p * 1e6) + ' × (' + r + '% + ' + d + '%) × ' + mo + '/12 = ' + usd(Math.round(interest * 1e6)) + '.',
        'Forbearance fee: ' + fee + '% × ' + usd(p * 1e6) + ' = ' + usd(Math.round(feeAmt * 1e6)) + '.',
        'Legal costs: ' + usd(legal) + '.',
        'Total: ' + usd(p * 1e6) + ' + ' + usd(Math.round(interest * 1e6)) + ' + ' + usd(Math.round(feeAmt * 1e6)) + ' + ' + usd(legal) + ' = ' + usd(Math.round(total * 1e6)) + '.'
      ],
      rule: 'Every line of a payoff statement must trace to a clause in the loan documents. A lender that adds charges the documents do not support, or cannot show its arithmetic, hands the borrower a defence and sometimes a claim.',
      us: 'Default interest and fees are generally enforceable if the documents provide for them and they are not penalties or usurious under state law.',
      ca: 'The federal Interest Act restricts charging a higher rate on arrears for mortgages on real property, and the Criminal Code caps the effective annual rate. Default-rate clauses need careful drafting and advice.'
    };
  };

  N.deficiency = function (g) {
    var pr = g.pick([6, 8, 10, 12]), intr = g.pick([0.4, 0.6, 0.75, 0.9]), costs = g.pick([0.1, 0.15, 0.2]);
    var debt = pr + intr + costs, bid = pr * g.pick([0.7, 0.75, 0.8, 0.85]);
    var def = debt - bid, c = g.city('us');
    return {
      title: 'Credit bid and deficiency',
      scene: g.fund + ' forecloses on a property in ' + c + '. At the sale date the borrower owes principal of ' + usd(pr * 1e6) + ', accrued interest of ' + usd(Math.round(intr * 1e6)) + ' and enforcement costs of ' + usd(Math.round(costs * 1e6)) + ', all recoverable under the loan documents.\n\n' +
        'No one else bids. The lender bids ' + usd(Math.round(bid * 1e6)) + ' of its own debt and takes the property. A guarantor stands behind the loan.',
      ask: 'Before any legal limit on deficiencies, what shortfall remains to claim from the guarantor?',
      unit: 'musd', answer: def,
      work: [
        'Total debt: ' + usd(pr * 1e6) + ' + ' + usd(Math.round(intr * 1e6)) + ' + ' + usd(Math.round(costs * 1e6)) + ' = ' + usd(Math.round(debt * 1e6)) + '.',
        'The credit bid pays down the debt by ' + usd(Math.round(bid * 1e6)) + '.',
        'Deficiency: ' + usd(Math.round(debt * 1e6)) + ' − ' + usd(Math.round(bid * 1e6)) + ' = ' + usd(Math.round(def * 1e6)) + '.'
      ],
      rule: 'A credit bid is a payment. Whatever the lender bids is treated as received, so the bid decides how much debt survives. Bid too high and the deficiency claim disappears. Bid too low and a court may refuse the deficiency or measure it against fair value instead.',
      us: 'Many states limit deficiency judgments, bar them after non-judicial sales, or reduce them to the gap between the debt and the property’s fair value.',
      ca: 'A lender selling under power of sale generally cannot buy the property itself. Taking title usually means foreclosure, which in most provinces ends the claim for any shortfall, or a court-supervised sale.'
    };
  };

  N.reo = function (g) {
    var a = g.pick([5, 6, 8, 10]), k = g.pick([1, 2, 3]), i = g.pick([6, 8, 10]), t = g.pick([1, 2]);
    var owed = (a + k) * (1 + i * t / 100), surplus = g.pick([0.25, 0.5, 0.75, 1, 1.5]), s = owed + surplus;
    var spe = g.spe('LLC');
    return {
      title: 'Repaying the parent',
      scene: 'After a foreclosure, ' + g.fund + ' places the property in ' + spe + '. The entity gives the lender a note for the independently appraised value of ' + usd(a * 1e6) + '. The lender advances a further ' + usd(k * 1e6) + ' under the same note to finish construction.\n\n' +
        'The note carries simple interest of ' + i + '% a year. Treat the whole amount as outstanding for ' + t + (t === 1 ? ' year' : ' years') + '. The finished project then sells, netting ' + usd(Math.round(s * 1e6)) + ' after closing costs.',
      ask: 'How much is left in the entity after it repays the note in full?',
      unit: 'musd', answer: surplus,
      work: [
        'Principal: ' + usd(a * 1e6) + ' + ' + usd(k * 1e6) + ' = ' + usd((a + k) * 1e6) + '.',
        'Interest: ' + usd((a + k) * 1e6) + ' × ' + i + '% × ' + t + ' = ' + usd(Math.round((a + k) * i * t / 100 * 1e6)) + '.',
        'Owed to the parent: ' + usd(Math.round(owed * 1e6)) + '.',
        'Surplus: ' + usd(Math.round(s * 1e6)) + ' − ' + usd(Math.round(owed * 1e6)) + ' = ' + usd(Math.round(surplus * 1e6)) + '.'
      ],
      rule: 'The note between parent and entity sets the bar the project is measured against. If the opening value comes from an independent appraisal and the terms are written and at market, the result means something. If the opening value is whatever avoids booking a loss, every later figure is fiction.'
    };
  };

  N.basket = function (g) {
    var loss = g.pick([0.9, 1.2, 1.6, 2, 2.4, 3]), basket = g.pick([0.1, 0.15, 0.2, 0.25]), cap = g.pick([1, 1.5, 2]);
    var tipping = g.rnd() < 0.5;
    var gross = tipping ? loss : loss - basket, rec = Math.min(gross, cap);
    return {
      title: 'Basket and cap',
      scene: 'A buyer acquires a loan servicing company. Six months after closing it finds losses of ' + usd(Math.round(loss * 1e6)) + ' from breaches of the seller’s representations.\n\n' +
        'The purchase agreement has ' + (tipping ? 'a tipping basket of ' + usd(Math.round(basket * 1e6)) + ': once losses pass that amount, the buyer recovers from the first dollar.' : 'a deductible basket of ' + usd(Math.round(basket * 1e6)) + ': the buyer bears that amount and recovers only the excess.') +
        ' The seller’s total liability is capped at ' + usd(cap * 1e6) + '.',
      ask: 'How much can the buyer recover?',
      unit: 'musd', answer: rec,
      work: [
        tipping ? 'Losses of ' + usd(Math.round(loss * 1e6)) + ' exceed the basket, so the whole amount counts.' : 'Losses less the deductible: ' + usd(Math.round(loss * 1e6)) + ' − ' + usd(Math.round(basket * 1e6)) + ' = ' + usd(Math.round(gross * 1e6)) + '.',
        'The cap is ' + usd(cap * 1e6) + '.',
        gross > cap ? 'The claim is over the cap, so recovery stops at ' + usd(cap * 1e6) + '.' : 'That is under the cap, so the buyer recovers ' + usd(Math.round(rec * 1e6)) + '.'
      ],
      rule: 'Representations are only worth what the indemnity behind them will pay. A board approving a deal should know the basket, the cap, how long claims survive, and whether there is an escrow or insurance to collect from.'
    };
  };
})();
