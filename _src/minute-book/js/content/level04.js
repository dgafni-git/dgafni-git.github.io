MB.level({
  n: 4, title: 'The Capital Stack', rank: 'Asset Manager', pass: 0.7, draw: { authored: 4, numeric: 2 }, numerics: ['ltv', 'dscr', 'dilution'],
  topics: 'Debt, equity, capital calls and raising money from people you know',
  blurb: 'Money enters a project in layers, and each layer has rights. Write down which layer before it arrives.',
  concepts: [
    ['Capital stack', 'The layers of money in a project, ranked by who is paid first: senior debt, then mezzanine debt, then preferred equity, then common equity.'],
    ['Senior and mezzanine debt', 'Senior debt is secured on the property and paid first. Mezzanine debt ranks behind it and is usually secured on the ownership interests in the borrower, not on the land.'],
    ['Preferred equity', 'An ownership interest with a priority return ahead of common equity. It ranks behind all debt and has no mortgage.'],
    ['Loan-to-value and loan-to-cost', 'The loan divided by the appraised value, or by the total project cost. Lenders cap both.'],
    ['Debt service coverage', 'Net operating income divided by the loan payments due. Below 1.0x the property cannot pay its debt from its own income.'],
    ['Capital call', 'A demand under the agreement for owners to contribute more money, usually in proportion to their interests and on a set notice period.'],
    ['Dilution', 'The reduction of an owner\'s percentage when others put in money and they do not. The agreement sets the formula.'],
    ['Exempt offering', 'A sale of securities allowed without a prospectus or registration because it fits an exemption, such as sales to accredited investors. The exemption has conditions, and someone must check them.']
  ],
  scenarios: [
    {
      id: 'l4-hat', title: 'Passing the hat',
      builds: ['Governing documents'],
      make: function (g) {
        var a = g.person(), amt = g.m(3, 9, 0.5), n = g.int(9, 18);
        return {
          scene: `A distressed loan can be bought for ${MB.usd(amt)} within three weeks. ${a}, a partner, wants to raise it from ${n} friends and relatives. "They trust us. Collect the wires and paper it after closing."`,
          options: [
            ['s', `Confirm an exemption for each investor, sign subscriptions, and disclose risks and conflicts first.`, `Selling partnership units is selling securities, even to friends.`],
            ['g', `Take the money on a one-page receipt, with terms to follow.`, `Investors paid for something undefined, and an exemption cannot be confirmed after the sale.`],
            ['p', `Collect the wires and sort the paper later.`, `An undocumented securities sale. Investors may be entitled to their money back.`]
          ],
          deal: {
            setup: `The investors are in and the paper is clean. Nobody has yet discussed what the sponsors earn for finding and running the deal.`,
            asks: [
              ['m', `Take a standard fee and promote, written into the partnership agreement.`, `Disclosed sponsor pay is how this business works. Investors expect it.`],
              ['r', `Ask for a larger promote above a higher return hurdle, fully disclosed.`, `More upside only if investors do well first. Some will push back.`],
              ['x', `Take a finder's fee from the loan seller and keep it to yourselves.`, `A secret commission from the other side of your investors' deal is a breach, and in places a crime.`],
              ['n', `Take nothing on this one.`, `Generous, and friends will remember. You also worked for free.`]
            ],
            rule: `Sponsors may be paid well. Every dollar of it must be in the documents.`
          },
          rule: `Raising money from people you know is still a securities offering. Paper it before the money arrives.`,
          us: `Most private raises rely on Regulation D, which limits non-accredited investors, restricts advertising, and requires a filing within 15 days of the first sale.`,
          ca: `Common exemptions cover accredited investors and close family, friends and business associates. Some provinces require a signed risk acknowledgement and a report of the sale.`
        };
      }
    },
    {
      id: 'l4-loan-or-equity', burn: 0, title: 'Was that a loan?',
      make: function (g) {
        var a = g.person(), amt = g.m(0.3, 1.2, 0.05);
        return {
          scene: `Last spring ${a} wired ${MB.usd(amt)} into a cash-short project. Nothing was signed. The project sold at a profit. ${a.first} says it was equity. The others say it was a loan. Set the rule for next time.`,
          options: [
            ['s', `No owner money is accepted until a signed note or subscription says what it is.`, `The only time everyone agrees on debt or equity is before the outcome is known.`],
            ['g', `Accounting classifies each advance and emails the owner.`, `An email is evidence. It is not an agreement on rate, repayment or dilution.`],
            ['p', `Take the money when needed and settle terms at the end.`, `At the end, everyone argues for the label that pays them more.`]
          ],
          rule: `Label every dollar when it arrives: whose, debt or equity, on what terms.`
        };
      }
    },
    {
      id: 'l4-call', burn: 2, title: 'Calling capital from the friendly ones',
      builds: ['Duty of loyalty'],
      make: function (g) {
        var a = g.person(), amt = g.m(0.8, 2.4, 0.2);
        return {
          scene: `The partnership needs ${MB.usd(amt)} for an overrun. The agreement requires capital calls from all partners in proportion. ${a}, who runs the general partner, says: "Call it from the four we know best and give them extra units."`,
          options: [
            ['s', `Call every partner in proportion, with the required notice.`, `Every partner gets the same chance to protect their percentage.`],
            ['g', `Borrow it from one friendly partner at 15% instead.`, `Possibly allowed, but it is a related-party loan ranking ahead of everyone, and nobody checked the agreement.`],
            ['p', `Call the four friendly partners and issue the units.`, `That dilutes the others without their knowledge, in breach of the agreement.`]
          ],
          rule: `A capital call follows the agreement to the letter: who, how much, on what notice.`
        };
      }
    },
    {
      id: 'l4-default', title: 'A friend misses the call',
      make: function (g) {
        var a = g.person(), b = g.person();
        return {
          scene: `Six partners funded the capital call. ${a} did not, and the cure period has ended. The agreement dilutes a defaulting partner by formula. ${b}, who runs the general partner, says: "Leave it. ${a.first} is good for it."`,
          options: [
            ['s', `Apply the formula, or put a waiver to the other partners.`, `The six who funded relied on the remedy. Leniency is theirs to give.`],
            ['g', `Quietly give ${a.first} sixty more days.`, `A private favour to a friend, paid for by the partners who funded on time.`],
            ['p', `Declare the whole interest forfeited to the general partner.`, `The agreement gives dilution, not forfeiture. That is taking a partner's property.`]
          ],
          deal: {
            setup: `${a.first} takes the dilution notice badly, then calls back. "I cannot fund. Would anyone just buy me out?"`,
            asks: [
              ['m', `Arrange a buyout at an independent valuation, offered to every partner pro rata.`, `Everyone gets the same chance at a fair price, and ${a.first} exits cleanly.`],
              ['r', `Offer to fund ${a.first}'s share as a loan at the agreement's default rate, with the partners' approval.`, `A real return, properly approved. ${a.first} may prefer to sell.`],
              ['x', `Buy the interest yourself at a discount before the other partners hear of it.`, `An insider using inside knowledge to buy cheap from a distressed partner is self-dealing.`],
              ['n', `Leave it at the dilution formula.`, `The agreement is applied, and nothing more.`]
            ],
            rule: `You can buy a partner out. You cannot do it quietly, cheaply and first.`
          },
          rule: `Default remedies come from the agreement and apply to every partner alike.`
        };
      }
    },
    {
      id: 'l4-mezz', title: 'A second layer of debt',
      make: function (g) {
        var a = g.person(), amt = g.m(1.5, 5, 0.5);
        return {
          scene: `The project needs ${MB.usd(amt)} more. The senior loan bars new debt without consent. ${a} suggests calling the money preferred equity, with a fixed repayment date and takeover rights. "Then we do not need to ask."`,
          options: [
            ['s', `Ask the senior lender for consent and negotiate an intercreditor agreement.`, `The covenant gives the senior lender a say. Consent makes the new money safe.`],
            ['g', `Use the preferred equity structure and stay quiet.`, `Equity with a repayment date and takeover rights behaves like debt, and may breach anyway.`],
            ['p', `Take a mezzanine loan and say nothing.`, `A knowing covenant breach, and often a trigger for the guarantor's liability.`]
          ],
          deal: {
            setup: `The senior lender takes your call. They are not thrilled about more debt, but they are listening.`,
            asks: [
              ['m', `Offer a consent fee and monthly reporting in return for consent.`, `Cheap for you, and the lender is paid for the extra risk.`],
              ['r', `Ask the senior lender to advance the extra money itself at a blended rate.`, `One lender, no intercreditor fight, lower cost. It is a lot to ask.`],
              ['x', `Say the new loan closes Friday with or without consent.`, `Threatening a breach to force consent is bad faith, and now it is in writing.`],
              ['n', `Just ask for the consent.`, `A plain request. It may come with conditions.`]
            ],
            rule: `Offer value for consent. Never threaten the breach you are asking permission to avoid.`
          },
          rule: `Before adding a layer, read what the existing layers were promised. Relabelling changes nothing.`,
          us: `Mezzanine lenders enforce pledges of ownership interests under the Uniform Commercial Code, which is faster than foreclosure.`,
          ca: `Pledges are enforced under provincial personal property security statutes. Subordinate money is often a second mortgage with a priority agreement.`
        };
      }
    },
    {
      id: 'l4-sideletter', title: 'A letter on the side',
      builds: ['Disclosure and recusal'],
      make: function (g) {
        var a = g.person(), amt = g.m(2, 6, 0.5);
        return {
          scene: `${a} will invest ${MB.usd(amt)} but wants a side letter with a lower fee. The agreement permits side letters and lets two other investors elect any better terms granted.`,
          options: [
            ['s', `Document it and offer the same terms to the two investors.`, `Side letters are normal when authorized, written and disclosed to those entitled.`],
            ['g', `Agree verbally so the election right is not triggered.`, `An unwritten term is still a term. Dodging the others' rights makes it a breach.`],
            ['p', `Sign a secret letter that also puts ${a.first} first for distributions.`, `A secret priority changes the deal every other partner signed.`]
          ],
          rule: `Special terms are fine when permitted, written and disclosed. Secret ones never are.`
        };
      }
    }
  ]
});
