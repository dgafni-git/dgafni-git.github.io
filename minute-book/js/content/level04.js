MB.level({
  n: 4, title: 'The Capital Stack', rank: 'Asset Manager', pass: 0.7, draw: { authored: 4, numeric: 2 }, numerics: ['ltv', 'dscr', 'dilution'],
  topics: 'Debt, equity, capital calls and raising money from people you know',
  blurb: 'Money enters a project in layers, and each layer comes with rights. Governance problems begin when money arrives before anyone has written down which layer it is in.',
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
        var a = g.person(), amt = g.m(3, 9, 0.5), n = g.int(9, 18), c = g.city();
        return {
          scene: `A distressed loan on ${g.asset()} in ${c} can be bought for ${MB.usd(amt)} if the money is in place within three weeks. ${a}, a partner at ${g.fund}, proposes raising it from ${n} friends, relatives and colleagues, who would own the investment through a new limited partnership.\n\n"They all trust us. Collect the wires and we will paper it after closing."`,
          ask: `How should the money be raised?`,
          options: [
            ['s', `Treat it as a securities offering. Confirm an exemption for each investor, use subscription agreements, and give everyone a written summary of the terms, the risks and the sponsors' own interests before any money moves.`, `Selling partnership units is selling securities, even to friends. Papering it first protects the investors, and it protects the sponsors from the claims friends bring when deals disappoint.`],
            ['g', `Take the money against a one-page receipt promising units "on terms to follow," and finalize the partnership agreement after closing.`, `Investors have paid for something undefined. Any term they dislike later becomes a dispute, and an exemption cannot be confirmed after the sale.`],
            ['p', `Collect the wires now and sort out the paperwork once the loan is bought.`, `That is an undocumented sale of securities with no exemption checked and no disclosure. Investors may be entitled to their money back, and regulators can pursue the people who raised it.`]
          ],
          rule: `Raising money from people you know is still raising money from the public as far as securities law is concerned. Find the exemption, document the subscription and disclose the conflicts before the money arrives.`,
          us: `Most private real estate raises rely on Regulation D, which limits sales to non-accredited investors, restricts advertising, and requires a notice filing within 15 days of the first sale.`,
          ca: `Common prospectus exemptions cover accredited investors and close family, friends and business associates. Some provinces require a signed risk acknowledgement, and most sales must be reported to the regulator within days.`
        };
      }
    },
    {
      id: 'l4-loan-or-equity', title: 'Was that a loan?',
      make: function (g) {
        var spe = g.spe('LLC'), a = g.person(), amt = g.m(0.3, 1.2, 0.05);
        return {
          scene: `${spe} was short of cash last spring, and ${a}, a member, wired in ${MB.usd(amt)}. Nothing was signed. The project has now sold at a profit. ${a.first} says the money bought a larger ownership share. The other members say it was a loan to be repaid with modest interest.`,
          ask: `You are setting policy so this never happens again. What is the rule?`,
          options: [
            ['s', `No money is accepted from an owner until a signed document says what it is: a note with a rate and a maturity, or a subscription for a stated interest, approved as the operating agreement requires.`, `Debt and equity carry opposite rights. The only time everyone agrees on which it is, is before the outcome is known.`],
            ['g', `Accounting will classify each advance when it arrives and email the owner to confirm the treatment.`, `An email is evidence, which helps. It is not an agreement on rate, repayment or dilution, and accounting staff are not the body that can issue new equity.`],
            ['p', `Take the money when it is needed and settle the terms at the end, when the numbers are clear.`, `At the end, each person argues for whichever label pays them more. That is the dispute in front of you now.`]
          ],
          rule: `Every dollar that enters an entity should be labelled when it arrives: whose it is, whether it is debt or equity, and on what terms. Unlabelled money becomes a lawsuit when the result comes in.`
        };
      }
    },
    {
      id: 'l4-call', title: 'Calling capital from the friendly ones',
      builds: ['Duty of loyalty'],
      make: function (g) {
        var lp = g.spe('LP'), a = g.person(), amt = g.m(0.8, 2.4, 0.2);
        return {
          scene: `${lp} needs ${MB.usd(amt)} to cover a cost overrun. The partnership agreement allows capital calls from all partners, in proportion to their interests, on ten business days' notice.\n\n${a}, who runs the general partner, would rather not alarm everyone. "Call it from the four partners we know best and issue them extra units. Faster, and no awkward questions."`,
          ask: `How is the money raised?`,
          options: [
            ['s', `Issue the call to every partner in proportion, with the notice the agreement requires and an explanation of the overrun. Apply the agreement's remedies to anyone who does not fund.`, `Every partner gets the same chance to protect their percentage. The awkward questions are the partners exercising rights they paid for.`],
            ['g', `Skip the call and borrow the money from one friendly partner at 15% on a short-term note, without checking what the agreement says about loans from partners.`, `A partner loan may be allowed and may even be sensible, but it is a related-party deal at a high rate that ranks ahead of everyone's equity. Whether it is allowed is in the agreement, and nobody looked.`],
            ['p', `Call capital from the four friendly partners only and issue them the extra units.`, `That dilutes the other partners without their knowledge and outside the agreement. It is a breach of contract and of the general partner's duty to treat partners even-handedly.`]
          ],
          rule: `A capital call follows the agreement to the letter: who is called, in what proportion, on what notice. Selective calls are a quiet transfer of ownership from the uninformed to the favoured.`
        };
      }
    },
    {
      id: 'l4-default', title: 'A friend misses the call',
      make: function (g) {
        var a = g.person(), b = g.person(), lp = g.spe('LP');
        return {
          scene: `Six partners in ${lp} funded last month's capital call. ${a} did not, and the cure period ended Friday. The agreement says a defaulting partner's interest is diluted under a stated formula. ${a.first} is an old friend of ${b}, who runs the general partner.\n\n${b.first} says: "Leave it. ${a.first} is good for it eventually."`,
          ask: `What should the general partner do?`,
          options: [
            ['s', `Send the default notice and apply the dilution formula as written, or put a proposed waiver to the other partners with the reasons, if the agreement lets them grant one.`, `The six who funded relied on the remedy applying to everyone. If leniency is right, it is theirs to give, in the open.`],
            ['g', `Quietly give ${a.first} another sixty days and tell no one.`, `Extra time is sometimes sensible. Granted in private to a friend, it is a favour paid for by the partners who funded on time, and it weakens the remedy the next time someone defaults.`],
            ['p', `Declare ${a.first}'s whole interest forfeited and reallocate it to the general partner.`, `The agreement gives a dilution formula, not forfeiture, and certainly not forfeiture to the general partner. That is taking a partner's property with no right to it.`]
          ],
          rule: `Remedies for a missed capital call come from the agreement and apply the same way to every partner. The general partner may neither waive them for friends nor invent harsher ones.`
        };
      }
    },
    {
      id: 'l4-mezz', title: 'A second layer of debt',
      make: function (g) {
        var spe = g.spe('LLC'), a = g.person(), amt = g.m(1.5, 5, 0.5);
        return {
          scene: `${spe} needs ${MB.usd(amt)} more to finish its project. A mezzanine lender will provide it, secured by a pledge of the ownership interests in ${spe}. The senior loan agreement prohibits further debt and any pledge of ownership interests without the senior lender's consent.\n\n${a}, the developer's finance lead, suggests calling it preferred equity instead, with a fixed redemption date and the right to take over the company if it is not redeemed. "Then it is not debt, and we do not need to ask."`,
          ask: `How do you proceed?`,
          options: [
            ['s', `Ask the senior lender for consent, and expect to negotiate an intercreditor agreement between the two lenders.`, `The covenant exists to give the senior lender a say over who else has claims on the project. Consent, once given, makes the new money safe for everyone.`],
            ['g', `Use the preferred equity structure and do not raise it with the senior lender.`, `Equity with a hard repayment date and takeover rights behaves like debt, and loan agreements usually restrict transfers of control as well. The structure may breach the covenant anyway, discovered at the worst moment.`],
            ['p', `Take the mezzanine loan as offered and say nothing.`, `That is a knowing covenant breach. It is an event of default on the senior loan and, in many loan documents, a trigger for the guarantor's personal liability.`]
          ],
          rule: `Before adding a layer to the capital stack, read what the layers already there were promised. Relabelling an instrument does not change what a covenant was written to prevent.`,
          us: `Mezzanine lenders enforce against pledged ownership interests under the Uniform Commercial Code, which is faster than a mortgage foreclosure. Senior lenders insist on an intercreditor agreement for that reason.`,
          ca: `Pledges of shares or partnership units are enforced under provincial personal property security statutes. Subordinate financing is often done as a second mortgage instead, with a priority agreement.`
        };
      }
    },
    {
      id: 'l4-sideletter', title: 'A letter on the side',
      builds: ['Disclosure and recusal'],
      make: function (g) {
        var a = g.person(), amt = g.m(2, 6, 0.5), lp = g.spe('LP');
        return {
          scene: `${a} will invest ${MB.usd(amt)} in ${lp}, the largest single commitment, but wants a side letter: a lower management fee and quarterly calls with the project team. The partnership agreement permits side letters and gives two other investors a right to elect any better terms granted to anyone else.`,
          ask: `How do you handle the request?`,
          options: [
            ['s', `Have counsel confirm what the agreement allows, document the side letter, and offer the same terms to the investors who hold the election right.`, `Side letters are normal. What makes them safe is that they are authorized, written, and disclosed to the people the agreement says must be told.`],
            ['g', `Agree to the fee break verbally and keep it out of the documents so the election right is not triggered.`, `An unwritten term is still a term. Structuring it to dodge the other investors' rights turns an ordinary accommodation into a breach waiting to be found.`],
            ['p', `Sign a confidential letter that also puts ${a.first} first in line for distributions.`, `A secret priority changes the economics every other partner signed up for. It breaches the agreement and misleads every investor who was not told.`]
          ],
          rule: `Special terms for one investor are acceptable when the agreement permits them, they are written down, and everyone entitled to know is told. A secret term that moves money between investors never is.`
        };
      }
    }
  ]
});
