MB.level({
  n: 5, title: 'Waterfalls and Prefs', rank: 'Vice President', pass: 0.7, draw: { authored: 4, numeric: 2 }, numerics: ['waterfall', 'catchup', 'clawback'],
  topics: 'Who is paid, in what order, and who checks the arithmetic',
  role: 'You run finance for the general partner, which calculates everyone\'s share, including its own.',
  blurb: 'The waterfall decides who is paid and in what order. The party doing the maths is usually paid last.',
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
      id: 'l5-advance', burn: 2, title: 'An advance on the promote',
      builds: ['Duty of loyalty'],
      make: function (g) {
        var a = g.person(), amt = g.m(2, 6, 0.5);
        return {
          scene: `A refinancing leaves ${MB.usd(amt)} to distribute. The limited partners do not have their capital back yet. ${a}, who runs the general partner, wants a slice now. "We will be deep in the promote by the sale."`,
          who: `${a.first}`,
          behind: `${a.first} expects a large promote at the sale and would like some now. If it is paid early and the sale disappoints, the investors have been lending the general partner their money for nothing.`,
          deep: [
            [`The order`, `Investors get their capital back, then their preferred return. Only then does the general partner share in profit.`],
            [`What an early payment really is`, `An interest-free loan from the investors to the general partner, approved by the general partner.`],
            [`If the sale disappoints`, `The general partner owes it back, and the investors must collect from the party that controls the bank account.`]
          ],
          options: [
            ['s', `Pay the limited partners first, exactly as the waterfall says.`, `The promote is earned when the tiers above it are full. A projection is not a tier.`],
            ['g', `Pay the general partner an advance, booked as a receivable.`, `Recorded, but the agreement has no advance. The general partner lent itself the partners' money.`],
            ['p', `Take the general partner's share now.`, `If the sale disappoints, the partners were paid late so the general partner could be paid early.`]
          ],
          rule: `A waterfall runs in order, on actual results. Nobody is paid from a tier not yet reached.`
        };
      }
    },
    {
      id: 'l5-compound', title: 'Simple or compounded?',
      make: function (g) {
        var diff = g.m(0.2, 0.9, 0.05);
        return {
          scene: `The agreement gives investors "an 8% cumulative preferred return" and is silent on compounding. The two readings differ by ${MB.usd(diff)}, all of it out of the general partner's promote. The model has always used simple interest.`,
          who: `The general partner's principals`,
          behind: `The general partner is paid from what is left after the investors' preferred return. Simple interest makes that return smaller, so more is left. The general partner gains from the reading it has always used.`,
          deep: [
            [`The two readings`, `Simple interest is charged on capital only. Compound interest is charged on capital plus any unpaid return.`],
            [`The size of the gap`, `On $10 million at 8% for five years, simple gives $4 million and yearly compounding about $4.69 million. The difference comes out of the profit the general partner shares in.`],
            [`Who should decide`, `Not the party that gains. Counsel first, then the advisory committee.`]
          ],
          options: [
            ['s', `Get counsel's reading and put the question to the advisory committee.`, `The general partner is interpreting a contract where its own pay depends on the answer.`],
            ['g', `Use simple interest, as the model always has, and note why.`, `Consistent and honest on file, but the investors never learn there was a question.`],
            ['p', `Use simple interest and say nothing.`, `Quietly choosing the reading that pays you is what good-faith duties exist to catch.`]
          ],
          rule: `Whoever gains from one reading of an ambiguity should not decide it alone or in silence.`,
          us: `"Cumulative" means unpaid amounts carry forward. It does not by itself mean they compound.`,
          ca: `Courts read the whole agreement, and the Interest Act adds rules on stating annual rates.`
        };
      }
    },
    {
      id: 'l5-reserve', title: 'Everything out today',
      builds: ['Limited liability'],
      make: function (g) {
        var a = g.person(), net = g.m(4, 12, 0.5), owed = g.m(0.3, 0.9, 0.1);
        return {
          scene: `The project sold and the entity holds ${MB.usd(net)}. It still owes ${MB.usd(owed)} to contractors and gave the buyer a one-year warranty. ${a}, the largest investor, wants every dollar out this week.`,
          who: `${a.first}`,
          behind: `${a.first} wants cash now and sees an entity with no future. The contractors and the buyer holding a warranty have claims on that same cash. Paying it out first shifts the risk onto them.`,
          deep: [
            [`The rule`, `An entity may pay out only what it does not need to meet its debts.`],
            [`Recovery from investors`, `Many laws let creditors recover a wrongful payout from the people who received it, for years afterward.`],
            [`Good practice`, `Hold a stated reserve for a stated period, then release it.`]
          ],
          options: [
            ['s', `Pay or reserve for what is owed and the warranty, then distribute the rest.`, `An entity may distribute only what it does not need to meet its obligations.`],
            ['g', `Distribute it all, on investors' promise to send money back if needed.`, `In a year those promises must be collected from people who have spent the money.`],
            ['p', `Distribute it all. Contractors can chase an empty company.`, `Creditors can recover that money from those who received it and those who approved it.`]
          ],
          rule: `Liabilities come before distributions. Reserve first, release on a stated date.`,
          us: `Members who knowingly receive a distribution that leaves an LLC unable to pay its debts can be made to return it.`,
          ca: `Corporations may not pay dividends that leave them unable to meet liabilities, and limited partners can be required to return distributions.`
        };
      }
    },
    {
      id: 'l5-fee', title: 'A fee nobody agreed to',
      builds: ['Conflict of interest'],
      make: function (g) {
        var pct = g.pick(['1%', '1.25%', '1.5%']);
        return {
          scene: `An affiliate of the general partner starts charging an "asset management fee" of ${pct} of project cost. The agreement does not mention it. It is paid before investors get anything. The work is real. What should happen to the fee?`,
          who: `The affiliate`,
          behind: `The affiliate has the same owners as the general partner. A new fee moves money from the investors to those owners before any profit is shared, with no vote and no negotiation.`,
          deep: [
            [`Where the money goes`, `Out of the partnership before profit is calculated, so every partner's share shrinks.`],
            [`The size of it`, `1.25% of a $40 million project is $500,000.`],
            [`The rule`, `A general partner is paid what the agreement lists. A new fee to an affiliate needs investor approval before it is charged.`]
          ],
          options: [
            ['s', `Stop charging it and ask the advisory committee to approve it.`, `The general partner cannot add to its own pay under a contract that lists what it is paid.`],
            ['g', `Keep charging and disclose it in the annual statements.`, `Disclosure after the fact shows what was taken. It does not give the right to take it.`],
            ['p', `Record it inside "project costs."`, `Now an unauthorized related-party payment is also concealed.`]
          ],
          rule: `A sponsor takes only the fees the agreement grants. Anything new needs approval first.`,
          us: `Undisclosed fees charged to funds have been a leading source of enforcement actions against sponsors.`
        };
      }
    },
    {
      id: 'l5-clawback', burn: 0, title: 'When the last deal loses',
      make: function (g) {
        var a = g.person(), amt = g.m(0.3, 1.2, 0.1);
        return {
          scene: `The fund's third project sold at a loss. This year's clawback test says the general partner owes back ${MB.usd(amt)} of promote. ${a} proposes "netting it against future promotes."`,
          behind: `${a.first} would rather not write a cheque. Offsetting against future promotes means repaying only if the future is good. If it is not, the investors never see the money.`,
          deep: [
            [`Why it exists`, `Promote is often paid deal by deal. Early winners can be followed by losers, leaving the general partner overpaid on the fund as a whole.`],
            [`The promise`, `To return the excess, usually after allowing for tax already paid on it.`],
            [`The weakness`, `It is only as good as the general partner's ability to pay. Hence escrows and personal guarantees from the principals.`]
          ],
          options: [
            ['s', `Report the result and pay the clawback as the agreement requires.`, `The clawback is owed when the agreement says. Paying it keeps investors for the next fund.`],
            ['g', `Offset it informally and mention it next quarter.`, `Future promotes may never come. Meanwhile the general partner holds the partners' money.`],
            ['p', `Say nothing until final liquidation.`, `The agreement requires an annual test. Ignoring it is a breach, and hiding it is worse.`]
          ],
          rule: `A clawback is a debt the sponsor owes its investors, due when the agreement says.`
        };
      }
    },
    {
      id: 'l5-error', burn: 0, title: 'The formula was wrong',
      make: function (g) {
        var amt = g.pick([38000, 52000, 74000, 96000]);
        return {
          scene: `You find a model error. Two quarters ago the general partner was overpaid ${MB.usd(amt)} and the investors underpaid. Nobody else has noticed. Your manager suggests adjusting the next distribution.`,
          behind: `Your manager wants to avoid an awkward letter. The quiet fix returns the money but leaves two quarters of wrong statements, and a record that the sponsor knew.`,
          deep: [
            [`Why telling beats a quiet fix`, `Two quarters of investor statements were wrong, and the auditors will find the adjustment.`],
            [`What to send`, `What happened, the amount, the correction with interest, and what check now prevents it.`],
            [`What it earns`, `A sponsor that reports an error made in its own favour is believed the next time.`]
          ],
          options: [
            ['s', `Repay it now and tell the investors what happened.`, `Investors forgive a mistake that is reported. They do not forgive a quiet one.`],
            ['g', `Adjust the next distribution without comment.`, `The money comes out right, but in an audit a quiet fix looks like concealment.`],
            ['p', `Leave it. It is immaterial.`, `A known overpayment to the party doing the maths becomes a deliberate one.`]
          ],
          rule: `An error in your own favour gets fixed, disclosed and prevented. Size matters less than response.`
        };
      }
    }
  ]
});
