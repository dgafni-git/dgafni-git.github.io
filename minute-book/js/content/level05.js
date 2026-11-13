MB.level({
  n: 5, title: 'Waterfalls and Prefs', rank: 'Vice President', pass: 0.7, draw: { authored: 4, numeric: 2 }, numerics: ['waterfall', 'catchup', 'clawback'],
  topics: 'Who is paid, in what order, and who checks the arithmetic',
  blurb: 'A distribution waterfall decides how profit is shared between the people who put up the money and the people who ran the project. The party doing the calculation is usually the one paid last, which is why it needs governing.',
  concepts: [
    ['Waterfall', 'The ordered tiers through which cash is distributed. Each tier must be paid in full before the next receives anything.'],
    ['Return of capital', 'The first tier in most waterfalls: investors get back what they contributed before anyone shares profit.'],
    ['Preferred return', 'A priority return to investors, stated as an annual rate on their unreturned capital. Whether it compounds, and how often, is a drafting point worth a great deal.'],
    ['Promote', 'The sponsor\'s share of profit above the preferred return, out of proportion to its capital. Also called carried interest.'],
    ['Catch-up', 'A tier that pays the sponsor all or most of the cash until it has its promote percentage of the total profit, not only of the profit above the hurdle.'],
    ['Clawback', 'The sponsor\'s promise to return promote that, measured over the whole life of the fund, it turned out not to have earned.'],
    ['Reserves', 'Cash held back from distribution to meet known and reasonably expected liabilities. Distributing it away does not make the liabilities disappear.']
  ],
  scenarios: [
    {
      id: 'l5-advance', title: 'An advance on the promote',
      builds: ['Duty of loyalty'],
      make: function (g) {
        var lp = g.spe('LP'), a = g.person(), amt = g.m(2, 6, 0.5);
        return {
          scene: `${lp} refinances its property and has ${MB.usd(amt)} of proceeds to distribute. The limited partners have not yet had all their capital back. ${a}, who runs the general partner, points to the projected sale next year. "We will be deep in the promote by then. Take a slice for the general partner now and true it up at the sale."`,
          ask: `How are the proceeds distributed?`,
          options: [
            ['s', `Exactly as the waterfall says: to the limited partners until their capital and preferred return are paid. Send the calculation with the distribution notice.`, `The promote is earned only when the tiers above it are full. A projection, however confident, is not a tier.`],
            ['g', `Pay the general partner an "advance on promote," recorded as a receivable to be offset at the sale.`, `Recording it is better than hiding it, but the agreement has no such advance. The general partner has lent itself the partnership's money, on its own approval, against a profit that may never arrive.`],
            ['p', `Take the general partner's share now. It will all come out the same in the end.`, `If the sale disappoints, it will not come out the same, and the limited partners will have been paid late so the general partner could be paid early. That is a breach of the agreement and of loyalty.`]
          ],
          rule: `Cash moves through a waterfall in order, on actual results. The general partner cannot pay itself from a tier it has not reached.`
        };
      }
    },
    {
      id: 'l5-compound', title: 'Simple or compounded?',
      make: function (g) {
        var lp = g.spe('LP'), a = g.person(), diff = g.m(0.2, 0.9, 0.05);
        return {
          scene: `The agreement for ${lp} gives limited partners "an 8% cumulative preferred return." It does not say whether unpaid amounts compound. After five years with no distributions, the two readings differ by ${MB.usd(diff)}, all of it coming out of the general partner's promote if compounding applies.\n\n${a}, the general partner's controller, has always modelled it as simple interest.`,
          ask: `The sale has closed. How is the preferred return calculated?`,
          options: [
            ['s', `Get counsel's reading of the agreement as a whole, look at what the offering materials and past statements told investors, and put the question and the proposed answer to the advisory committee before distributing.`, `The general partner is interpreting an ambiguity in a contract where its own pay depends on the answer. Independent advice and disclosure are what make its answer defensible.`],
            ['g', `Use simple interest because the model always has, and note the reasoning in the file.`, `Consistency is a fair argument, and a file note is honest. But the limited partners never learn there was a question, and the general partner resolved it in its own favour.`],
            ['p', `Use simple interest and say nothing. If an investor asks, deal with it then.`, `Knowingly choosing the reading that pays you, and staying quiet about it, is the kind of conduct good-faith obligations exist to catch.`]
          ],
          rule: `When an agreement is ambiguous and the person interpreting it gains from one reading, that person should not decide alone or in silence. Take advice, disclose, and let a disinterested body weigh in.`,
          us: `"Cumulative" means unpaid amounts carry forward. It does not by itself mean they compound. Courts read the whole agreement, and ambiguity is often construed against the drafter.`,
          ca: `Courts apply the same approach, and the Interest Act adds its own rules about stating annual rates where interest is calculated over shorter periods.`
        };
      }
    },
    {
      id: 'l5-reserve', title: 'Everything out today',
      builds: ['Limited liability'],
      make: function (g) {
        var spe = g.spe('LLC'), a = g.person(), net = g.m(4, 12, 0.5), owed = g.m(0.3, 0.9, 0.1);
        return {
          scene: `${spe} has sold its project and holds ${MB.usd(net)}. It still owes about ${MB.usd(owed)} in final contractor payments and taxes, and it gave the buyer a one-year warranty on the building systems. ${a}, the largest investor, wants every dollar distributed this week. "The entity is finished. Why would it need cash?"`,
          ask: `What do you distribute?`,
          options: [
            ['s', `Pay or reserve for the known liabilities, hold a reasonable reserve for the warranty period, distribute the rest, and tell investors when the reserve will be released.`, `An entity may distribute only what it does not need to meet its obligations. The reserve is the investors' money, held for a stated reason and returned on a stated date.`],
            ['g', `Distribute everything, on the investors' informal promise to send money back if a claim comes in.`, `A year from now those promises have to be collected from a dozen people, some of whom have spent the money. Meanwhile the entity could not pay its bills, and the people who approved the distribution knew it.`],
            ['p', `Distribute everything. Unpaid contractors can pursue an empty company.`, `Distributing an entity's cash while it has unpaid debts is exactly what the law lets creditors undo. They can recover from the people who received the money and from those who approved it.`]
          ],
          rule: `Liabilities come before distributions. Reserve for what is owed and what is reasonably foreseeable, say how long the reserve will be held, and release it on time.`,
          us: `Members who knowingly receive a distribution that leaves an LLC unable to pay its debts can be required to return it, generally within three years in Delaware.`,
          ca: `Corporations may not pay dividends that would leave them unable to meet liabilities as they fall due, and partnership statutes can require limited partners to return distributions needed to pay earlier creditors.`
        };
      }
    },
    {
      id: 'l5-fee', title: 'A fee nobody agreed to',
      builds: ['Conflict of interest'],
      make: function (g) {
        var lp = g.spe('LP'), a = g.person(), pct = g.pick(['1%', '1.25%', '1.5%']);
        return {
          scene: `${lp} pays its general partner the fees listed in the partnership agreement. This year an affiliate of the general partner begins charging an "asset management fee" of ${pct} of project cost, which the agreement does not mention. It is paid before the waterfall, so it reduces what every partner receives.\n\n${a}, the general partner's principal, says the work is real and the rate is market.`,
          ask: `How should the new fee be handled?`,
          options: [
            ['s', `Stop charging it. Propose the fee to the advisory committee or the limited partners with support for the rate, and charge it only from the date they approve.`, `The work may be real and the rate fair. The general partner still cannot add to its own pay under a contract that lists what it is paid.`],
            ['g', `Keep charging it and disclose it in a note to the annual financial statements.`, `Disclosure after the fact tells the partners what was taken. It does not give the general partner the right to take it, and silence from investors who skim a footnote is not consent.`],
            ['p', `Record it within "project costs" so it does not appear as a separate line.`, `Now an unauthorized related-party payment is also concealed. That is the pattern regulators and plaintiffs look for first.`]
          ],
          rule: `A sponsor may take only the fees the agreement grants. Anything new is a related-party transaction that needs disclosure and approval from someone other than the sponsor, before it is charged.`,
          us: `Undisclosed fees and expenses charged to funds have been a leading source of securities enforcement actions against private fund sponsors.`
        };
      }
    },
    {
      id: 'l5-clawback', title: 'When the last deal loses',
      make: function (g) {
        var a = g.person(), amt = g.m(0.3, 1.2, 0.1);
        return {
          scene: `A fund sponsored by ${g.fund} paid its general partner promote on two early sales. The third project has now sold at a loss. The partnership agreement requires a clawback test each year end, and this year's test shows the general partner owes ${MB.usd(amt)} back.\n\n${a}, a principal, proposes "netting it against future promotes" from the two projects still in the fund.`,
          ask: `What does the general partner do?`,
          options: [
            ['s', `Report the test result to the limited partners and pay the clawback as the agreement requires, then consider an escrow of future promote.`, `The clawback is the investors' protection against exactly this. It is owed when the agreement says, and paying it promptly is what preserves trust for the next fund.`],
            ['g', `Offset it informally against future promotes and mention it in the next quarterly letter.`, `The future promotes may never come. Until they do, the general partner is holding money the agreement says belongs to the partners, on terms it granted itself.`],
            ['p', `Say nothing and revisit it at final liquidation. The two remaining projects should cover it.`, `The agreement requires an annual test and payment. Ignoring it is a breach, and concealing the result makes it a breach of trust as well.`]
          ],
          rule: `A clawback is a debt the sponsor owes its investors, due when the agreement says. A sponsor that pays it without being chased keeps its investors. One that has to be chased does not.`
        };
      }
    },
    {
      id: 'l5-error', title: 'The formula was wrong',
      make: function (g) {
        var lp = g.spe('LP'), amt = g.pick([38000, 52000, 74000, 96000]), a = g.person();
        return {
          scene: `Reviewing the distribution model for ${lp}, you find a formula error. Two quarters ago the general partner was overpaid by ${MB.usd(amt)} and the limited partners underpaid by the same amount. No one else has noticed. ${a}, your manager, says the next distribution could simply be adjusted to even things out.`,
          ask: `What do you recommend?`,
          options: [
            ['s', `Correct it now: the general partner repays the amount, the limited partners are paid what they were short, and they are told what happened and how the model is now checked.`, `Errors happen. Investors forgive a mistake that is reported and repaired. They do not forgive learning that the sponsor knew and kept quiet.`],
            ['g', `Adjust the next distribution to make the limited partners whole, without drawing attention to it.`, `The money comes out right, but the partners' statements for two quarters were wrong and nobody told them. If it surfaces in an audit, a quiet fix looks like concealment.`],
            ['p', `Leave it. The amount is immaterial and reopening it will only raise questions.`, `It is a known overpayment to the party doing the calculation. Leaving it turns an innocent error into a deliberate one.`]
          ],
          rule: `When you find an error in your own favour, fix it, disclose it, and say what has changed so it does not recur. The size of the error matters less than what you did on finding it.`
        };
      }
    }
  ]
});
