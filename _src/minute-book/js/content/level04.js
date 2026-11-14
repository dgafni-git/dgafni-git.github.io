MB.level({
  n: 4, title: 'The Capital Stack', rank: 'Asset Manager', pass: 0.7, draw: { authored: 4, numeric: 2 }, numerics: ['ltv', 'dscr', 'dilution'],
  topics: 'Debt, equity, capital calls and raising money from people you know',
  role: 'You work for the sponsor that raises the money and runs the project.',
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
      id: 'l4-hat', role: 'You are helping your partners raise money for a deal.', title: 'Passing the hat',
      builds: ['Governing documents'],
      make: function (g) {
        var a = g.person(), amt = g.m(3, 9, 0.5), n = g.int(9, 18);
        return {
          scene: `A distressed loan can be bought for ${MB.usd(amt)} within three weeks. ${a}, a partner, wants to raise it from ${n} friends and relatives. "They trust us. Collect the wires and paper it after closing."`,
          who: `${a.first}`,
          behind: `${a.first} fears losing the deal to the deadline, and friends rarely ask for documents. That is what makes them the investors most likely to feel misled later.`,
          deep: [
            [`Why it counts as selling securities`, `Investors hand over money expecting profit from someone else's efforts. That is the test, whatever the units are called.`],
            [`What an exemption requires`, `Usually that each investor qualifies, by wealth or by relationship, and that certain filings are made on time.`],
            [`What goes wrong`, `An investor sold without an exemption who then loses money may be entitled to it back from the people who raised it.`]
          ],
          options: [
            ['s', `Confirm an exemption for each investor, sign subscriptions, and disclose risks and conflicts first.`, `Selling partnership units is selling securities, even to friends.`],
            ['g', `Take the money on a one-page receipt, with terms to follow.`, `Investors paid for something undefined, and an exemption cannot be confirmed after the sale.`],
            ['p', `Collect the wires and sort the paper later.`, `An undocumented securities sale. Investors may be entitled to their money back.`]
          ],
          deal: {
            setup: `The friends and relatives are in and the paper is clean. Nobody has yet discussed what the sponsors earn for finding and running the deal.`,
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
      id: 'l4-loan-or-equity', role: 'You manage the project company and are writing its funding policy.', burn: 0, title: 'Was that a loan?',
      make: function (g) {
        var a = g.person(), amt = g.m(0.3, 1.2, 0.05);
        return {
          scene: `Last spring ${a} wired ${MB.usd(amt)} into a cash-short project. Nothing was signed. The project sold at a profit. ${a.first} says it was equity. The others say it was a loan. Nobody can prove either. What rule stops this happening again?`,
          behind: `${a.first} wants equity now because the project made money. Had it lost money, ${a.first} would be calling it a loan. Unlabelled money lets everyone choose the label afterward.`,
          deep: [
            [`Debt`, `Repaid first, with interest, whatever the result. No share of the upside.`],
            [`Equity`, `Paid last, from what is left. All of the upside and all of the risk.`],
            [`Why it must be settled early`, `On $500,000 put into a project that doubles, the gap between 8% interest and a share of the profit can run to hundreds of thousands.`]
          ],
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
      id: 'l4-call', twist: true, burn: 2, title: 'Calling capital from the friendly ones',
      builds: ['Duty of loyalty'],
      make: function (g) {
        var a = g.person(), amt = g.m(0.8, 2.4, 0.2);
        if (g.twist) return {
          burn: 0,
          twist: `The agreement expressly allowed a partner loan here. A full call was the slow option.`,
          scene: `The partnership needs ${MB.usd(amt)} within days or the contractor leaves the site. The agreement lets the general partner accept loans from partners at up to 10% when a capital call would take too long, with notice to all partners.`,
          options: [
            ['s', `Take a partner loan within the cap and notify every partner.`, `The agreement provides this route for exactly this case.`],
            ['g', `Make a full capital call anyway.`, `Valid, but the notice period means the contractor has gone before the money arrives.`],
            ['p', `Call only friendly partners and issue them extra units.`, `Still a quiet dilution of everyone not asked.`]
          ],
          rule: `Use the tools the agreement gives you. A partner loan is fine where it is permitted and disclosed.`
        };
        return {
          scene: `The partnership needs ${MB.usd(amt)} for an overrun. The agreement requires capital calls from all partners in proportion. ${a}, who runs the general partner, says: "Call it from the four we know best and give them extra units."`,
          who: `${a.first}`,
          behind: `${a.first} wants to avoid telling every investor about the overrun. Calling only friendly partners hides the bad news and rewards them with extra units, taken from everyone not asked.`,
          deep: [
            [`What a capital call is`, `A demand that every owner put in more money, in proportion to what they hold.`],
            [`What a selective call does`, `Say ten partners own 10% each. If four fund everything and receive new units, the other six shrink without ever being asked.`],
            [`The honest version`, `Call everyone. Those who do not fund are reduced by the formula they agreed to.`]
          ],
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
          who: `${b.first}`,
          behind: `${b.first} is protecting a friend. But every partner who funded on time did so partly because the penalty for not funding was real. A quiet exception takes that from them.`,
          deep: [
            [`The usual remedies`, `A reduced percentage, a forced loan at a high rate, loss of votes, or a forced sale at a discount. The agreement picks.`],
            [`Why everyone must be treated alike`, `Partners fund on time partly because not funding is costly. One quiet exception removes that for all of them.`],
            [`Who can forgive`, `The partners whose protection it is, by whatever vote the agreement requires.`]
          ],
          options: [
            ['s', `Apply the formula, or put a waiver to the other partners.`, `The six who funded relied on the remedy. Leniency is theirs to give.`],
            ['g', `Quietly give ${a.first} sixty more days.`, `A private favour to a friend, paid for by the partners who funded on time.`],
            ['p', `Declare the whole interest forfeited to the general partner.`, `The agreement gives dilution, not forfeiture. That is taking a partner's property.`]
          ],
          deal: {
            setup: `${a.first}, the partner who missed the call, takes the dilution notice badly, then phones back. "I cannot fund. Would anyone just buy me out?"`,
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
      id: 'l4-mezz', role: 'You handle financing for the developer that owns the project.', title: 'A second layer of debt',
      make: function (g) {
        var a = g.person(), amt = g.m(1.5, 5, 0.5);
        return {
          scene: `Your project needs ${MB.usd(amt)} more to finish. Its main loan forbids any new borrowing without that lender's consent. ${a} suggests calling the money preferred equity, with a fixed repayment date and takeover rights. "Then we do not need to ask."`,
          who: `${a.first}`,
          behind: `${a.first} wants the money without a slow conversation with the main lender. Renaming the debt as equity is meant to step around the ban on new borrowing. The lender wrote the ban to prevent exactly that.`,
          deep: [
            [`Why main lenders ban new debt`, `More debt means less cushion, and another creditor with rights if things go wrong.`],
            [`What second-layer debt is secured on`, `Ownership of the borrowing company, not the property. Its remedy is to take the company over.`],
            [`Why relabelling fails`, `Lenders also restrict changes of control and equity that behaves like debt. A breach can make the guarantor personally liable.`]
          ],
          options: [
            ['s', `Ask the senior lender for consent and negotiate an intercreditor agreement.`, `The covenant gives the senior lender a say. Consent makes the new money safe.`],
            ['g', `Use the preferred equity structure and stay quiet.`, `Equity with a repayment date and takeover rights behaves like debt, and may breach anyway.`],
            ['p', `Take a mezzanine loan and say nothing.`, `A knowing covenant breach, and often a trigger for the guarantor's liability.`]
          ],
          deal: {
            setup: `You call the lender that holds the main loan. They are not thrilled about more debt, but they are listening.`,
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
      id: 'l4-sideletter', twist: true, title: 'A letter on the side',
      builds: ['Disclosure and recusal'],
      make: function (g) {
        var a = g.person(), amt = g.m(2, 6, 0.5);
        if (g.twist) return {
          twist: `Here the agreement required equal fees for everyone. A side letter could not change that.`,
          scene: `${a} will invest ${MB.usd(amt)} but wants a lower management fee. The partnership agreement says every limited partner pays the same fee, and says nothing about side letters.`,
          options: [
            ['s', `Decline, or propose amending the agreement by the required vote.`, `The agreement promises equal fees. Only the partners can change that promise.`],
            ['g', `Grant it in a side letter and disclose the letter.`, `Disclosure does not help. The term itself breaks the agreement.`],
            ['p', `Grant it quietly.`, `A secret breach of a promise made to every other investor.`]
          ],
          rule: `A side letter cannot grant what the main agreement forbids.`
        };
        return {
          scene: `${a} will invest ${MB.usd(amt)} but wants a side letter with a lower fee. The agreement permits side letters and lets two other investors elect any better terms granted.`,
          who: `${a.first}`,
          behind: `${a.first} is the biggest investor and wants a better price for size. That is normal. The catch is the two investors who were promised any better terms given to anyone else.`,
          deep: [
            [`What a side letter is`, `A private agreement giving one investor different terms from the rest.`],
            [`The matching right`, `A promise to certain investors that they may take any better terms given to someone else.`],
            [`When it is fine`, `When the main agreement permits it, it is in writing, and it is offered to those holding the matching right.`]
          ],
          options: [
            ['s', `Document it and offer the same terms to the two investors.`, `Side letters are normal when authorized, written and disclosed to those entitled.`],
            ['g', `Agree verbally so the election right is not triggered.`, `An unwritten term is still a term. Dodging the others' rights makes it a breach.`],
            ['p', `Sign a secret letter that also puts ${a.first} first for distributions.`, `A secret priority changes the deal every other partner signed.`]
          ],
          rule: `Special terms are fine when permitted, written and disclosed. Secret ones never are.`
        };
      }
    },
    {
      id: 'l4-senior-units', title: 'Ahead of everyone else',
      make: function (g) {
        var a = g.person(), amt = g.m(2, 6, 0.5);
        return {
          scene: `The project company needs ${MB.usd(amt)}. A new investor will provide it for units paying 12% a year ahead of all existing owners. The operating agreement requires the existing owners' consent to issue anything ranking ahead of them. ${a} suggests calling it a "member loan."`,
          who: `${a.first}`,
          behind: `${a.first} wants the money without a vote that might fail. Whatever it is called, the new money is paid first. The existing owners' consent right exists so nobody can be pushed down the line without agreeing.`,
          deep: [
            [`What ranking ahead means`, `If the project earns less than hoped, the new investor is paid in full before the others see anything.`],
            [`The size of it`, `12% on $4 million is $480,000 a year that now comes out before any existing owner is paid.`],
            [`Why owners often agree`, `If the alternative is a stalled project, senior money can still be the best deal for them.`]
          ],
          options: [
            ['s', `Ask the existing owners for the consent the agreement requires.`, `They decide whether the project needs the money enough to step back.`],
            ['g', `Issue it as a member loan to avoid the vote.`, `A loan with the same priority has the same effect. A relabel does not remove the consent right.`],
            ['p', `Issue the units and tell the owners afterward.`, `That subordinates them without their agreement, in breach of the agreement.`]
          ],
          rule: `Nobody is moved down the line of payment without the consent they were promised.`,
          deal: {
            setup: `The owners understand the project needs the money. They ask whether the terms can be improved before they vote.`,
            asks: [
              ['m', `Offer every existing owner the right to take part of the new units.`, `Those who can invest keep their position. An easy yes.`],
              ['r', `Ask the new investor to drop to 10% in return for a faster closing.`, `Worth asking. The investor knows you need the money.`],
              ['x', `Tell owners the lender will foreclose next week unless they consent today.`, `If that is not true, you have obtained a consent by misrepresentation.`],
              ['n', `Put the terms to a vote as they are.`, `Straightforward. Some will vote no.`]
            ],
            rule: `Improve the terms for the people being asked to step back.`
          }
        };
      }
    },
    {
      id: 'l4-carveout', burn: 2, title: 'The guarantee that sleeps',
      make: function (g) {
        var a = g.person(), amt = g.m(0.5, 1.5, 0.1);
        return {
          scene: `The project loan cannot reach the sponsor personally, except for listed "bad acts," which include putting any other debt on the property. Cash is tight. ${a}, the sponsor's principal, wants to borrow ${MB.usd(amt)} against the property from a friend. "It is small. Nobody will notice."`,
          who: `${a.first}`,
          behind: `${a.first} sees a small bridge loan. The loan documents see a listed act that makes the sponsor personally liable for the entire loan. A cash problem becomes a personal one.`,
          deep: [
            [`How these guarantees work`, `The lender agrees to look only to the property, unless the borrower does one of a list of things within its control.`],
            [`What is usually on the list`, `Other debt on the property, transfers without consent, misuse of rents, and a voluntary bankruptcy filing.`],
            [`The scale`, `A $1 million second loan can trigger liability for a $30 million first one.`]
          ],
          options: [
            ['s', `Read the list, and ask the lender's consent before any new debt.`, `Lenders often consent to small, subordinated money. They never forgive not being asked.`],
            ['g', `Borrow it unsecured in the company's name without checking.`, `Many lists include any other debt at all, secured or not.`],
            ['p', `Register the friend's loan against the property.`, `That is a listed act. The whole loan may now be the sponsor's personal debt.`]
          ],
          rule: `Before doing anything to a financed property, read what turns the loan into personal liability.`
        };
      }
    },
    {
      id: 'l4-cure', title: 'A convenient prepayment',
      make: function (g) {
        var a = g.person(), amt = g.pick([180000, 240000, 310000]);
        return {
          scene: `The property will miss its income covenant by ${MB.usd(amt)} this year. The loan lets the owners fix a miss by putting in cash, at most twice. ${a}, the finance lead, would rather have an affiliated tenant "prepay" next year's rent in December.`,
          who: `${a.first}`,
          behind: `${a.first} wants to pass the test without using a cure or admitting a miss. Rent paid a year early by a related tenant is not this year's income. It is the owners' money dressed as revenue.`,
          deep: [
            [`What the covenant measures`, `Whether the property's own income covers its loan payments.`],
            [`What a cure right is`, `A negotiated way to fix a shortfall with new cash, openly, a limited number of times.`],
            [`Why disguise is worse than a miss`, `A miss is a business problem. A false compliance report is a misrepresentation.`]
          ],
          options: [
            ['s', `Use the cure right as written, or report the miss.`, `Both are honest, and the lender expects one or the other.`],
            ['g', `Take the prepayment and count it.`, `Income pulled forward from a related party overstates what the property earns.`],
            ['p', `Book the prepayment and certify compliance.`, `A certificate you know to be misleading is the serious breach here.`]
          ],
          rule: `A covenant test is passed with real results or cured in the open.`
        };
      }
    },
    {
      id: 'l4-recap', title: 'Borrowing to pay yourselves',
      make: function (g) {
        var a = g.person(), amt = g.m(4, 10, 1);
        return {
          scene: `A finished property can be refinanced to release ${MB.usd(amt)} of cash. ${a}, who controls the majority owner, wants it paid to the majority as a "management fee," skipping the minority.`,
          who: `${a.first}`,
          behind: `Cash taken out by refinancing belongs to all the owners in their shares. Calling it a fee to one owner moves the minority's share to the majority. It may also dodge the lender's limits on payouts.`,
          deep: [
            [`What a refinancing payout is`, `New debt replaces old, and the difference is paid out to the owners.`],
            [`The three checks`, `Can the company still pay its debts? Does the loan allow the payout? Is it shared as the agreement requires?`],
            [`The relabel`, `On $8 million, a 25% minority would lose $2 million if it is paid as a fee to the majority.`]
          ],
          options: [
            ['s', `Check solvency and the loan terms, then pay all owners in their shares.`, `Everyone gets what they own of it, after the creditors are safe.`],
            ['g', `Pay it out in shares without checking the loan's limits.`, `Fair between owners, and possibly a breach of the loan.`],
            ['p', `Pay it to the majority as a management fee.`, `That takes the minority's share by renaming it.`]
          ],
          rule: `Cash taken out of a company goes to its owners in their shares, after its creditors are safe.`
        };
      }
    },
    {
      id: 'l4-equity-in', title: 'What counts as equity?',
      make: function (g) {
        var a = g.person(), amt = g.m(5, 12, 1);
        return {
          scene: `The construction lender requires ${MB.usd(amt)} of owners' money in the project before it advances. ${a}, the developer, proposes counting a deferred developer fee and a marked-up land value toward that figure.`,
          who: `${a.first}`,
          behind: `${a.first} wants the loan without finding more cash. The lender wants real money at risk ahead of its own. A fee not yet paid and a markup on paper put nothing at risk.`,
          deep: [
            [`Why lenders want owners' money in first`, `It absorbs the first losses and keeps the owner committed.`],
            [`Cash versus paper`, `Land at what was paid for it is real. Land at a higher appraised value, and fees owed to yourself, are not cash.`],
            [`The right way to count them`, `Ask. Lenders sometimes accept part of an appraised increase, knowingly.`]
          ],
          options: [
            ['s', `Show the lender exactly what makes up the figure and let it decide.`, `If it accepts non-cash items, it does so knowing what they are.`],
            ['g', `Count the land at appraised value without saying how.`, `Nothing false is said. The lender is left believing cash went in.`],
            ['p', `State it all as cash invested.`, `That is a false statement made to obtain a loan.`]
          ],
          rule: `Tell a lender what your equity is made of. Let it decide what counts.`
        };
      }
    },
    {
      id: 'l4-own-loan', title: 'Lending to your own deal',
      make: function (g) {
        var a = g.person(), amt = g.m(3, 8, 0.5);
        return {
          scene: `The partnership needs ${MB.usd(amt)} quickly. A bank will lend at 9% in six weeks. An affiliate of the general partner will lend at 13% tomorrow. ${a}, who runs the general partner, prefers the affiliate. "Speed has a price."`,
          who: `${a.first}`,
          behind: `Speed may be worth paying for. But ${a.first} is choosing the lender and owns the lender. Four points on the loan is money moving from the investors to the general partner's side.`,
          deep: [
            [`The spread`, `Four points on $5 million is $200,000 a year.`],
            [`What makes it defensible`, `Evidence that the bank really cannot move in time, a rate checked against other fast lenders, and approval by the advisory committee.`],
            [`A middle path`, `A short affiliate loan at a fair rate, repaid when the bank loan arrives.`]
          ],
          options: [
            ['s', `Test the rate against other fast lenders and ask the advisory committee.`, `If speed is worth 13%, someone independent can agree.`],
            ['g', `Take the affiliate loan now and disclose it afterward.`, `Investors learn of a related-party loan once it cannot be refused.`],
            ['p', `Take it, and add an arrangement fee for the affiliate.`, `A premium rate and a fee, both decided by the party being paid.`]
          ],
          rule: `A sponsor may lend to its own deal on terms someone else has checked.`,
          deal: {
            setup: `The advisory committee accepts the need for speed. It asks what terms the affiliate proposes.`,
            asks: [
              ['m', `Lend at the bank's rate plus one point, repayable when the bank funds.`, `A fair price for speed that nobody will question.`],
              ['r', `Lend at 12% with a three-month minimum.`, `Defensible for fast money. The committee may think it rich.`],
              ['x', `Lend at 13% and take a share of the project's profit as well.`, `Taking upside on top of a premium rate, from a deal you control, is self-dealing.`],
              ['n', `Wait six weeks for the bank.`, `Cheapest money. The delay has its own cost.`]
            ],
            rule: `When you are both lender and manager, price it so a stranger would call it fair.`
          }
        };
      }
    }
  ]
});
