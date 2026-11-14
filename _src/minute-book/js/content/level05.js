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
      id: 'l5-reserve', twist: true, title: 'Everything out today',
      builds: ['Limited liability'],
      make: function (g) {
        var a = g.person(), net = g.m(4, 12, 0.5), owed = g.m(0.3, 0.9, 0.1);
        if (g.twist) return {
          twist: `Nothing was left to reserve for. Holding money back was the error.`,
          scene: `The project sold and the entity holds ${MB.usd(net)}. Every contractor is paid, with releases. The buyer took the building with no warranty, and final tax is paid. ${a}, the largest investor, wants the cash distributed. The controller wants to keep 10% back for a year, "just in case."`,
          options: [
            ['s', `Distribute it all, after confirming nothing is outstanding.`, `A reserve needs a reason. With none, the money is the investors'.`],
            ['g', `Hold 10% back for a year anyway.`, `Caution with other people's money, for a risk nobody can name.`],
            ['p', `Distribute it and dissolve without final filings.`, `The money was right. Skipping the filings leaves the directors exposed.`]
          ],
          rule: `Reserve for real liabilities. With none, investors are owed their money.`
        };
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
          wider: [`Buy insurance for the warranty, pay the contractors, and distribute the rest now.`, `A small premium replaces a large reserve. Investors get nearly everything a year sooner.`],
          rule: `Liabilities come before distributions. Reserve first, release on a stated date.`,
          us: `Members who knowingly receive a distribution that leaves an LLC unable to pay its debts can be made to return it.`,
          ca: `Corporations may not pay dividends that leave them unable to meet liabilities, and limited partners can be required to return distributions.`
        };
      }
    },
    {
      id: 'l5-fee', twist: true, title: 'A fee nobody agreed to',
      builds: ['Conflict of interest'],
      make: function (g) {
        var pct = g.pick(['1%', '1.25%', '1.5%']);
        if (g.twist) return {
          twist: `This fee was in the agreement and had been approved. Stopping it helped nobody.`,
          scene: `An affiliate of the general partner charges an asset management fee of ${pct} of project cost. The agreement permits it "as approved each year by the advisory committee," which approved it in January. A new analyst suggests stopping the fee to be safe.`,
          options: [
            ['s', `Keep charging it as approved, and show it in the reports.`, `It is authorized, approved by the right body, and disclosed.`],
            ['g', `Stop charging it, to be safe.`, `Nothing was wrong. The affiliate is now working unpaid for no reason.`],
            ['p', `Raise it above the approved rate.`, `Approval covers the rate approved, and no more.`]
          ],
          rule: `A related-party fee that is written down, approved and disclosed is simply a fee.`
        };
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
    },
    {
      id: 'l5-first-out', title: 'Whose capital comes back first?',
      make: function (g) {
        var a = g.person(), amt = g.m(1, 3, 0.5);
        return {
          scene: `A sale returns cash to a partnership. The agreement repays capital to all partners in proportion. The general partner put in ${MB.usd(amt)} late, calling it a "bridge." ${a}, its principal, wants that repaid in full before anyone else.`,
          who: `${a.first}`,
          behind: `${a.first} thinks of that money as temporary. Nothing in the agreement says so. Paying it back first puts the general partner ahead of the investors it is meant to stand beside.`,
          deep: [
            [`In proportion`, `Each dollar returned is shared by how much capital each partner still has in.`],
            [`A real bridge`, `It would be a loan, documented as one, with a rate and a repayment date agreed in advance.`],
            [`The effect`, `If the sale returns less than everyone's capital, going first means others bear the loss.`]
          ],
          options: [
            ['s', `Repay capital in proportion, as the agreement says.`, `The general partner invested alongside the investors, and is repaid alongside them.`],
            ['g', `Repay the bridge first, on the basis it was always meant to be temporary.`, `What was meant and what was documented are different things.`],
            ['p', `Repay the general partner in full and adjust the others later.`, `That jumps the queue with the investors' money.`]
          ],
          rule: `Capital is returned in the order written down when it went in.`
        };
      }
    },
    {
      id: 'l5-tax-advance', title: 'The tax advance',
      make: function (g) {
        var a = g.person(), amt = g.pick([220000, 340000, 460000]);
        return {
          scene: `The agreement lets the general partner take cash to pay tax on profit allocated to it, as an advance against its later promote. It has taken ${MB.usd(amt)}. At the sale, ${a} wants the full promote paid with no deduction.`,
          who: `${a.first}`,
          behind: `${a.first} would like to be paid twice. The tax advances were an early slice of the promote. Leaving them out of the final sum means the investors fund the same money again.`,
          deep: [
            [`Why tax advances exist`, `Partners can owe tax on profit allocated to them before any cash arrives.`],
            [`The condition`, `They are an advance. Later payments are reduced by what was already taken.`],
            [`What to show investors`, `The promote calculated, less advances, equals the amount paid.`]
          ],
          options: [
            ['s', `Deduct the advances from the promote, and show the working.`, `The general partner gets its promote once.`],
            ['g', `Deduct them only if an investor asks.`, `Doing the right sum only when challenged is the wrong sum by default.`],
            ['p', `Pay the full promote on top of the advances.`, `That pays part of the promote twice.`]
          ],
          rule: `An advance is repaid from what it was advanced against.`
        };
      }
    },
    {
      id: 'l5-in-kind', title: 'Paid in land',
      make: function (g) {
        var a = g.person(), amt = g.m(2, 6, 0.5);
        return {
          scene: `The fund's last asset is an awkward land parcel. ${a}, a principal, proposes giving it to the investors at a value of ${MB.usd(amt)}, set by the general partner, and taking the general partner's promote in cash.`,
          who: `${a.first}`,
          behind: `The higher the land is valued, the more profit the fund appears to have made, and the bigger the promote. Investors get an asset they cannot easily sell, and the general partner gets cash calculated on a number it chose.`,
          deep: [
            [`Why value drives the promote`, `Promote is a share of profit. Profit here depends on what the land is said to be worth.`],
            [`Who bears the risk`, `If the land later sells for less, the investors take the loss and the promote has already been paid.`],
            [`Fair versions`, `An independent valuation, the general partner taking its share in land too, or holding the promote until the land sells.`]
          ],
          options: [
            ['s', `Get an independent valuation, and take the promote in the same form as the investors.`, `The general partner shares the risk of the number it is paid on.`],
            ['g', `Use the general partner's value and disclose how it was reached.`, `Disclosed, and still set by the party it pays.`],
            ['p', `Go ahead as proposed.`, `Cash to the general partner on its own valuation, land to everyone else.`]
          ],
          wider: [`Put the land in a small company all partners own in the same shares, and pay promote only when it sells.`, `Nobody has to agree on a value today, and everyone is paid on the real one.`],
          rule: `If investors are paid in something hard to value, so is the sponsor.`
        };
      }
    },
    {
      id: 'l5-credit-line', title: 'Timing the hurdle',
      make: function (g) {
        var a = g.person();
        return {
          scene: `The promote starts once investors earn a set yearly return, measured from when their money is called. ${a}, the finance head, wants to buy deals on a bank line for a year before calling any capital. "Same profit, shorter clock, higher return."`,
          who: `${a.first}`,
          behind: `Return is profit measured against time. Borrowing first shortens the time the investors' money is counted as invested, so the same profit looks like a higher yearly return and clears the hurdle sooner.`,
          deep: [
            [`An illustration`, `A 30% gain over three years is roughly 9% a year. The same gain over two years of called capital is roughly 14%.`],
            [`Who pays`, `The investors pay the interest on the bank line, and a larger promote as well.`],
            [`What good practice is`, `Limits on how long the line may be used, and returns reported both with and without it.`]
          ],
          options: [
            ['s', `Use the line within the agreement's limits, and report returns both ways.`, `Investors can see what the property earned and what the timing added.`],
            ['g', `Use the line heavily. The agreement sets no limit.`, `Permitted, and it raises the general partner's pay in a way investors cannot see.`],
            ['p', `Record the capital as called later than it was.`, `That falsifies the dates the promote is calculated from.`]
          ],
          rule: `A return can be raised by performance or by timing. Investors are owed the difference.`
        };
      }
    },
    {
      id: 'l5-escrow', title: 'Half now, half held',
      make: function (g) {
        var a = g.person(), amt = g.m(0.6, 1.8, 0.1);
        return {
          scene: `The agreement holds back 30% of each promote payment in escrow until the fund ends, in case some must be returned. The escrow holds ${MB.usd(amt)}. ${a} and the other principals want it released now and offer personal promises to repay.`,
          who: `${a.first}`,
          behind: `The principals want their money, and their promises are sincere. The escrow exists because a promise from someone who has spent the money is hard to collect.`,
          deep: [
            [`What it secures`, `The general partner's duty to give back promote if later deals lose money.`],
            [`Cash versus a promise`, `Cash in escrow is there. A promise depends on what the person has in five years.`],
            [`Who can agree to change it`, `The investors, by the vote the agreement requires.`]
          ],
          options: [
            ['s', `Leave it in escrow, or ask the investors to approve a release.`, `It is their protection. Only they can give it up.`],
            ['g', `Release it against the principals' signed promises.`, `Security the investors bargained for is swapped for a weaker one without asking.`],
            ['p', `Release it. The fund is doing well.`, `Doing well so far is exactly when a clawback seems unnecessary.`]
          ],
          wider: [`Offer investors a bank letter of credit in place of the cash, and ask them to approve the swap.`, `Their protection stays as strong, and the principals get their money. It is their consent to give.`],
          rule: `Security held for investors is released by the investors.`
        };
      }
    },
    {
      id: 'l5-broken-deal', title: 'Who pays for the deal that died?',
      make: function (g) {
        var a = g.person(), amt = g.pick([260000, 380000, 520000]);
        return {
          scene: `A large acquisition fell through after ${MB.usd(amt)} of legal and study costs. Co-investors had committed to take half of it. ${a}, the controller, proposes charging all the cost to the fund. "Chasing the co-investors is awkward."`,
          who: `${a.first}`,
          behind: `The co-investors are relationships the general partner wants to keep sweet. Charging the fund spares them, and makes the fund's investors pay for a deal that was only half theirs.`,
          deep: [
            [`The principle`, `Costs follow the deal. Whoever would have shared the profit shares the cost of pursuing it.`],
            [`What agreements say`, `Good ones state how failed-deal costs are split with co-investors.`],
            [`Why it draws attention`, `Regulators have penalized sponsors for loading these costs onto funds.`]
          ],
          options: [
            ['s', `Split the cost with the co-investors as the agreements provide, and disclose it.`, `Each party pays for the share of the deal it had signed up to.`],
            ['g', `Charge it all to the fund, for simplicity.`, `Simple for the general partner, at the fund investors' expense.`],
            ['p', `Charge the fund and fold it into another deal's costs.`, `Now the misallocation is hidden as well.`]
          ],
          rule: `The cost of a failed deal is shared by those who would have shared the deal.`,
          us: `Misallocating failed-deal costs between funds and co-investors has led to enforcement actions against sponsors.`
        };
      }
    }
  ]
});
