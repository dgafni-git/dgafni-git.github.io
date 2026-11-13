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
      scene: 'A board has ' + n + ' directors. Quorum is a majority. A resolution needs a majority of votes cast. Conflicted directors count toward quorum but may not vote.\n\n' +
        'Tonight ' + present + ' attend, and ' + (conflicted === 1 ? 'one has' : 'two have') + ' declared a conflict. Everyone else votes.',
      ask: 'What is the smallest number of votes in favour that carries the resolution?',
      unit: 'count', answer: need,
      work: [
        'Quorum is a majority of ' + n + ', so ' + quorum + '. With ' + present + ' present, the meeting can act.',
        'Entitled to vote: ' + present + ' present less ' + conflicted + ' conflicted = ' + voting + '.',
        'A majority of ' + voting + ' is ' + need + '.'
      ],
      rule: 'Check quorum, then who may vote, then count. Minutes should let a reader redo the arithmetic.',
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
      scene: 'A borrower asks for a ' + usd(loan) + ' loan. ' +
        (useCost ? 'Total project cost is ' + usd(base) + '. Policy caps loan-to-cost at ' + cap + '%.'
          : 'The appraised value is ' + usd(base) + '. Policy caps loan-to-value at ' + cap + '%.'),
      ask: 'What is the ' + (useCost ? 'loan-to-cost' : 'loan-to-value') + ' ratio?',
      unit: 'pct', answer: ratio,
      work: [
        (useCost ? 'Loan-to-cost' : 'Loan-to-value') + ' = loan ÷ ' + (useCost ? 'total cost' : 'appraised value') + '.',
        usd(loan) + ' ÷ ' + usd(base) + ' = ' + fix(ratio, 1) + '%.',
        over ? 'That is over the ' + cap + '% cap. The loan needs a documented policy exception from the credit committee, or a smaller advance.' : 'That is within the ' + cap + '% cap.'
      ],
      rule: 'A policy limit means something only if exceptions are approved by the right body, in writing.'
    };
  };

  N.dscr = function (g) {
    var ds = g.m(0.6, 1.8, 0.1), cov = g.pick([1.15, 1.2, 1.25]);
    var noi = Math.round(ds * g.pick([0.95, 1.05, 1.1, 1.18, 1.22, 1.3, 1.4]) / 1e4) * 1e4;
    var r = noi / ds, breach = r < cov - 1e-9;
    return {
      title: 'Testing the coverage covenant',
      scene: 'The loan requires debt service coverage of at least ' + fix(cov, 2) + 'x. This year net operating income was ' + usd(noi) + ' and loan payments were ' + usd(ds) + '.',
      ask: 'What is the debt service coverage ratio?',
      unit: 'x', answer: r,
      work: [
        'Coverage = net operating income ÷ debt service.',
        usd(noi) + ' ÷ ' + usd(ds) + ' = ' + fix(r, 2) + 'x.',
        breach ? 'That is below ' + fix(cov, 2) + 'x. The covenant is breached, and the agreement decides what follows: notice, a cure period, perhaps a cash sweep.' : 'That meets the ' + fix(cov, 2) + 'x covenant.'
      ],
      rule: 'A covenant test is a report of fact. Report it accurately and respond in writing.'
    };
  };

  N.dilution = function (g) {
    var c = g.m(2, 6, 1), x = Math.round(c * g.pick([0.1, 0.2, 0.25]));
    var a = g.person(), b = g.person();
    var aAdj = c + x + 1.5 * x, total = aAdj + c, pct = c / total * 100;
    return {
      title: 'The squeeze-down',
      scene: a.first + ' and ' + b.first + ' each put in ' + usd(c) + ' and hold 50%. A capital call asks ' + usd(x) + ' from each. ' + b.first + ' does not fund, so ' + a.first + ' pays both shares.\n\n' +
        'Under the agreement, the amount ' + a.first + ' covers for ' + b.first + ' is credited at 150%.',
      ask: 'What is ' + b.first + '’s percentage interest after the recalculation?',
      unit: 'pct', answer: pct,
      work: [
        a.first + ' is credited with ' + usd(c) + ' + ' + usd(x) + ' + (150% × ' + usd(x) + ') = ' + usd(aAdj) + '.',
        b.first + ' stays at ' + usd(c) + '. Total credited capital is ' + usd(total) + '.',
        usd(c) + ' ÷ ' + usd(total) + ' = ' + fix(pct, 1) + '%.'
      ],
      rule: 'Dilution for a missed call applies only as the agreement writes it, the same for every partner.'
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
      scene: 'Investors put in ' + usd(w.c * 1e6) + '. After ' + w.yrs + ' years, ' + usd(Math.round(w.p * 1e6)) + ' is available to distribute.\n\n' +
        'Order: capital back to investors, then a ' + w.r + '% simple annual preferred return, then ' + (100 - split) + '/' + split + ' between investors and the general partner.',
      ask: 'How much does the general partner receive as promote?',
      unit: 'musd', answer: gp,
      work: [
        'Tier 1, return of capital: ' + usd(w.c * 1e6) + '.',
        'Tier 2, preferred return: ' + usd(w.c * 1e6) + ' × ' + w.r + '% × ' + w.yrs + ' years = ' + usd(Math.round(w.pref * 1e6)) + '.',
        'Left for tier 3: ' + usd(Math.round(w.p * 1e6)) + ' − ' + usd(w.c * 1e6) + ' − ' + usd(Math.round(w.pref * 1e6)) + ' = ' + usd(Math.round(w.excess * 1e6)) + '.',
        'Promote: ' + split + '% × ' + usd(Math.round(w.excess * 1e6)) + ' = ' + usd(Math.round(gp * 1e6)) + '.'
      ],
      rule: 'A waterfall runs strictly in order, and the working should go to investors with every distribution.'
    };
  };

  N.catchup = function (g) {
    var w = wfBase(g);
    var catchup = w.pref * 0.25, rest = w.excess - catchup, gp = catchup + rest * 0.2;
    return {
      title: 'The catch-up tier',
      scene: 'Investors put in ' + usd(w.c * 1e6) + '. After ' + w.yrs + ' years, ' + usd(Math.round(w.p * 1e6)) + ' is available to distribute.\n\n' +
        'Order: capital back, then a ' + w.r + '% simple annual preferred return, then 100% to the general partner until it has 20% of all profit paid so far, then 80/20.',
      ask: 'How much does the general partner receive in total?',
      unit: 'musd', answer: gp,
      work: [
        'Return of capital: ' + usd(w.c * 1e6) + '. Preferred return: ' + usd(Math.round(w.pref * 1e6)) + '.',
        'Catch-up: the general partner needs 20% of (preferred return + catch-up). That is ' + usd(Math.round(w.pref * 1e6)) + ' × 20 ÷ 80 = ' + usd(Math.round(catchup * 1e6)) + '.',
        'Remainder: ' + usd(Math.round(w.excess * 1e6)) + ' − ' + usd(Math.round(catchup * 1e6)) + ' = ' + usd(Math.round(rest * 1e6)) + ', of which 20% is ' + usd(Math.round(rest * 0.2 * 1e6)) + '.',
        'Total to the general partner: ' + usd(Math.round(gp * 1e6)) + '. Check: that is 20% of the whole profit of ' + usd(Math.round((w.pref + w.excess) * 1e6)) + '.'
      ],
      rule: 'A full catch-up gives the general partner its promote share of all the profit, not only the excess.'
    };
  };

  N.clawback = function (g) {
    var p1 = g.pick([4, 5, 6, 8]), l2 = g.pick([1, 1.5, 2, 2.5, 3]);
    var paid = p1 * 0.2, entitled = (p1 - l2) * 0.2, cb = paid - entitled;
    return {
      title: 'The clawback',
      scene: 'The general partner takes 20% of the profit on each deal as it sells. The first deal made ' + usd(p1 * 1e6) + ', and it took its 20%. The last deal lost ' + usd(l2 * 1e6) + '.\n\n' +
        'Under the clawback it may keep no more than 20% of the fund\u2019s total net profit. Ignore the preferred return.',
      ask: 'How much must the general partner return?',
      unit: 'musd', answer: cb,
      work: [
        'Promote already taken: 20% × ' + usd(p1 * 1e6) + ' = ' + usd(Math.round(paid * 1e6)) + '.',
        'Net profit of the whole fund: ' + usd(p1 * 1e6) + ' − ' + usd(l2 * 1e6) + ' = ' + usd(Math.round((p1 - l2) * 1e6)) + '.',
        'Promote allowed: 20% of that = ' + usd(Math.round(entitled * 1e6)) + '.',
        'Clawback: ' + usd(Math.round(paid * 1e6)) + ' − ' + usd(Math.round(entitled * 1e6)) + ' = ' + usd(Math.round(cb * 1e6)) + '.'
      ],
      rule: 'A clawback is only as good as the general partner\u2019s ability to pay it back.'
    };
  };

  N.payoff = function (g) {
    var p = g.pick([4, 6, 8, 12]), r = g.pick([8, 9, 10, 12]), d = g.pick([4, 5, 6]), mo = g.pick([3, 6, 9]);
    var fee = g.pick([1, 1.5, 2]), legal = g.pick([25000, 40000, 60000]);
    var interest = p * (r + d) / 100 * mo / 12, feeAmt = p * fee / 100, total = p + interest + feeAmt + legal / 1e6;
    return {
      title: 'The payoff figure',
      scene: 'A borrower in default asks for a payoff figure. Principal is ' + usd(p * 1e6) + ', with no interest paid for ' + mo + ' months.\n\n' +
        'The rate is ' + r + '% a year plus ' + d + '% after default, simple. Add a forbearance fee of ' + fee + '% of principal and ' + usd(legal) + ' of legal costs.',
      ask: 'What is the total payoff?',
      unit: 'musd', answer: total,
      work: [
        'Interest since default: ' + usd(p * 1e6) + ' × (' + r + '% + ' + d + '%) × ' + mo + '/12 = ' + usd(Math.round(interest * 1e6)) + '.',
        'Forbearance fee: ' + fee + '% × ' + usd(p * 1e6) + ' = ' + usd(Math.round(feeAmt * 1e6)) + '.',
        'Legal costs: ' + usd(legal) + '.',
        'Total: ' + usd(p * 1e6) + ' + ' + usd(Math.round(interest * 1e6)) + ' + ' + usd(Math.round(feeAmt * 1e6)) + ' + ' + usd(legal) + ' = ' + usd(Math.round(total * 1e6)) + '.'
      ],
      rule: 'Every line of a payoff statement must trace to a clause in the loan documents.',
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
      scene: 'At a foreclosure sale in ' + c + ', the borrower owes ' + usd(pr * 1e6) + ' of principal, ' + usd(Math.round(intr * 1e6)) + ' of interest and ' + usd(Math.round(costs * 1e6)) + ' of costs.\n\n' +
        'Nobody else bids. The lender bids ' + usd(Math.round(bid * 1e6)) + ' of its debt and takes the property.',
      ask: 'Before any legal limit, what shortfall is left to claim from the guarantor?',
      unit: 'musd', answer: def,
      work: [
        'Total debt: ' + usd(pr * 1e6) + ' + ' + usd(Math.round(intr * 1e6)) + ' + ' + usd(Math.round(costs * 1e6)) + ' = ' + usd(Math.round(debt * 1e6)) + '.',
        'The credit bid pays down the debt by ' + usd(Math.round(bid * 1e6)) + '.',
        'Deficiency: ' + usd(Math.round(debt * 1e6)) + ' − ' + usd(Math.round(bid * 1e6)) + ' = ' + usd(Math.round(def * 1e6)) + '.'
      ],
      rule: 'A credit bid is a payment. The bid decides how much debt survives.',
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
      scene: 'A foreclosed property sits in ' + spe + ', which owes the lender a note for the appraised value of ' + usd(a * 1e6) + ' plus ' + usd(k * 1e6) + ' advanced to finish construction.\n\n' +
        'Simple interest is ' + i + '% a year for ' + t + (t === 1 ? ' year' : ' years') + ' on the whole amount. The project then sells for a net ' + usd(Math.round(s * 1e6)) + '.',
      ask: 'How much is left in the entity after it repays the note in full?',
      unit: 'musd', answer: surplus,
      work: [
        'Principal: ' + usd(a * 1e6) + ' + ' + usd(k * 1e6) + ' = ' + usd((a + k) * 1e6) + '.',
        'Interest: ' + usd((a + k) * 1e6) + ' × ' + i + '% × ' + t + ' = ' + usd(Math.round((a + k) * i * t / 100 * 1e6)) + '.',
        'Owed to the parent: ' + usd(Math.round(owed * 1e6)) + '.',
        'Surplus: ' + usd(Math.round(s * 1e6)) + ' − ' + usd(Math.round(owed * 1e6)) + ' = ' + usd(Math.round(surplus * 1e6)) + '.'
      ],
      rule: 'The opening note sets the bar the project is measured against, so its value must be independent.'
    };
  };

  N.basket = function (g) {
    var loss = g.pick([0.9, 1.2, 1.6, 2, 2.4, 3]), basket = g.pick([0.1, 0.15, 0.2, 0.25]), cap = g.pick([1, 1.5, 2]);
    var tipping = g.rnd() < 0.5;
    var gross = tipping ? loss : loss - basket, rec = Math.min(gross, cap);
    return {
      title: 'Basket and cap',
      scene: 'After buying a company, the buyer finds ' + usd(Math.round(loss * 1e6)) + ' of losses from the seller\u2019s broken promises.\n\n' +
        'The agreement has ' + (tipping ? 'a tipping basket of ' + usd(Math.round(basket * 1e6)) + ': past that amount, the buyer recovers from the first dollar.' : 'a deductible basket of ' + usd(Math.round(basket * 1e6)) + ': the buyer recovers only the excess.') +
        ' The seller\u2019s liability is capped at ' + usd(cap * 1e6) + '.',
      ask: 'How much can the buyer recover?',
      unit: 'musd', answer: rec,
      work: [
        tipping ? 'Losses of ' + usd(Math.round(loss * 1e6)) + ' exceed the basket, so the whole amount counts.' : 'Losses less the deductible: ' + usd(Math.round(loss * 1e6)) + ' − ' + usd(Math.round(basket * 1e6)) + ' = ' + usd(Math.round(gross * 1e6)) + '.',
        'The cap is ' + usd(cap * 1e6) + '.',
        gross > cap ? 'The claim is over the cap, so recovery stops at ' + usd(cap * 1e6) + '.' : 'That is under the cap, so the buyer recovers ' + usd(Math.round(rec * 1e6)) + '.'
      ],
      rule: 'Representations are worth only what the indemnity behind them will pay.'
    };
  };
})();
