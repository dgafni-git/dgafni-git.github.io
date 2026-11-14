MB.level({
  n: 6, title: 'Partnerships', rank: 'Principal', pass: 0.7, draw: { authored: 5 },
  topics: 'General partners, limited partners and the agreement between them',
  role: 'You are an officer of the general partner, which runs the fund for its investors.',
  blurb: 'One partner has control. The others have money at risk. The agreement is the whole relationship.',
  concepts: [
    ['General partner', 'The partner that manages the partnership and is liable for its debts. Usually a company formed for the purpose. It owes fiduciary duties to the partnership unless the agreement validly narrows them.'],
    ['Limited partner', 'A passive investor whose liability stops at the capital it committed, provided it stays out of management.'],
    ['Partnership agreement', 'The contract that sets the general partner\'s powers and pay, the partners\' rights, and how the agreement itself can be changed.'],
    ['Control rule', 'The principle that a limited partner who takes part in running the business can lose limited liability. How strict it is depends on the jurisdiction.'],
    ['Advisory committee', 'A committee of limited partners that reviews conflicts, valuations and other matters the agreement sends to it. It lets investors approve conflicted decisions without managing the business.'],
    ['Removal rights', 'The limited partners\' power to replace the general partner by a stated vote, for cause or sometimes without it.'],
    ['Key person clause', 'A term that pauses new investing or gives investors an exit if named individuals stop devoting their time to the fund.'],
    ['Good faith', 'A baseline obligation that survives almost any drafting: a party given discretion must use it honestly and for the purpose it was given.']
  ],
  scenarios: [
    {
      id: 'l6-wheel', title: 'The investor who wants the wheel',
      builds: ['Limited liability'],
      make: function (g) {
        var a = g.person(), pct = g.pick([28, 35, 40]);
        return {
          scene: `${a} holds ${pct}% of the units and is unhappy with construction. ${a.first} wants to approve every contract and give the contractor instructions directly.`,
          who: `${a.first}`,
          behind: `${a.first} has the most money at risk and feels powerless, which is understandable. Taking control would make ${a.first} liable like a manager, and leave the other investors with a second boss they never chose.`,
          options: [
            ['s', `Offer fuller reporting and an advisory committee seat, and explain the liability risk.`, `A real voice through the channel built for it, and the investor stays an investor.`],
            ['g', `Let ${a.first} join management calls and weigh in informally.`, `One investor now steers decisions the others cannot see, and looks like a manager.`],
            ['p', `Give ${a.first} co-signing authority.`, `A limited partner who signs contracts is managing, and risks limited liability.`]
          ],
          deal: {
            setup: `${a.first}, the unhappy investor, calms down once the advisory seat is offered. "Fine. But I want to see you earn it."`,
            asks: [
              ['m', `Ask ${a.first} to be a reference for investors in your next raise.`, `An easy yes that turns a critic into an advocate.`],
              ['r', `Ask ${a.first} to commit capital to your next fund now.`, `A big ask of someone who was angry an hour ago.`],
              ['x', `Offer ${a.first} a private fee rebate to stay quiet.`, `A secret payment to one investor is unequal treatment of all the others.`],
              ['n', `Ask for nothing and get back to work.`, `The relationship is repaired, and that is all.`]
            ],
            rule: `Turn a critic into an ally with access and candour, never with a private payment.`
          },
          rule: `Limited partners act through the rights the agreement gives them. Managing is the general partner's job and liability.`,
          us: `Delaware lists many things a limited partner can do without being treated as taking part in control.`,
          ca: `Provincial statutes are stricter. In Ontario a limited partner who takes part in control can be liable as a general partner.`
        };
      }
    },
    {
      id: 'l6-affiliate-sale', title: 'Selling to your other fund',
      builds: ['Conflict of interest', 'Disclosure and recusal'],
      make: function (g) {
        var a = g.person(), amt = g.m(9, 28, 1);
        return {
          scene: `The fund must sell its last property. ${a}, who runs the general partner, also runs a newer fund that would pay ${MB.usd(amt)}. "No broker, quick close. Everyone wins."`,
          who: `${a.first}`,
          behind: `${a.first} controls both funds. A low price helps the buying fund, where the fees and promote ahead may be richer. A quick private sale also means nobody else can name a higher price.`,
          options: [
            ['s', `Disclose to both advisory committees, get an independent valuation, and seek approval.`, `The general partner is seller and buyer. Independent pricing makes the deal sound.`],
            ['g', `Close at one broker's opinion of value and report it afterward.`, `Some price support, but chosen by the conflicted party and disclosed too late.`],
            ['p', `Close it. The agreement gives sole discretion over sales.`, `Discretion over sales is not permission to deal with yourself.`]
          ],
          deal: {
            none: true,
            setup: `The independent valuation comes in as a range. You own more of the buying fund than the selling one, and nobody would notice a price at the low end.`,
            asks: [
              ['x', `Set the price at the bottom of the range.`, `You sit on both sides. Tilting the price toward your own pocket is the conflict itself.`],
              ['x', `Charge each fund a transaction fee for arranging the sale.`, `A fee from both sides of your own deal, unapproved, is double-dipping.`],
              ['t', `Ask both committees for a bonus for saving the broker's fee.`, `Legal to ask. It tells both committees where your attention is.`],
              ['n', `Take nothing. Let the committees settle the price.`, `When you are on both sides, there is nothing to ask for.`]
            ],
            rule: `When you are on both sides of a deal, you do not also get to bargain.`
          },
          rule: `When the general partner is on both sides, someone else sets the price and someone else approves.`,
          us: `Registered fund advisers must disclose and obtain consent for principal transactions with funds they manage.`,
          ca: `Registered fund managers must address material conflicts in the fund's best interest.`
        };
      }
    },
    {
      id: 'l6-discretion', title: 'In its sole discretion',
      make: function (g) {
        var a = g.person(), amt = g.m(0.4, 1.4, 0.1);
        return {
          scene: `The general partner runs three partnerships and splits ${MB.usd(amt)} of shared office costs among them "in its sole discretion." It earns a promote in two. ${a}, the controller, proposes charging most of the cost to the third, where it earns none.`,
          who: `${a.first}`,
          behind: `Costs charged to a partnership reduce its profit, and a promote is a share of profit. Loading costs onto the one partnership with no promote costs the general partner nothing, and raises its promote in the other two.`,
          options: [
            ['s', `Allocate on a consistent, reasonable basis and disclose the policy.`, `Discretion picks among reasonable methods. It does not pick the one that pays you.`],
            ['g', `Load the third and describe the method in its statement notes.`, `Disclosing a self-serving choice does not make it a good-faith one.`],
            ['p', `Load the third. Sole discretion needs no explanation.`, `Using a discretion to enrich yourself is the standard example of bad faith.`]
          ],
          rule: `"Sole discretion" widens the choices. It never removes the duty to choose honestly.`,
          us: `Delaware lets agreements remove fiduciary duties, but not the implied covenant of good faith and fair dealing.`,
          ca: `The Supreme Court of Canada requires contractual discretion to be exercised reasonably, in light of its purpose.`
        };
      }
    },
    {
      id: 'l6-removal', role: 'You are the general partner\'s compliance officer.', title: 'They want the partner list',
      make: function (g) {
        var a = g.person(), b = g.person();
        return {
          scene: `Unhappy investors can remove the general partner by a two-thirds vote. ${a} asks for the partner list, which the agreement entitles any partner to. ${b}, the principal, says: "They are organizing. Take your time."`,
          who: `${b.first}`,
          behind: `${b.first} wants to stay in control and sees the list as ammunition. Investors who cannot find each other cannot reach a two-thirds vote. Delay keeps them apart.`,
          options: [
            ['s', `Provide the list on time and tell ${b.first} to answer the concerns.`, `The right belongs to the partners. A confident general partner answers its critics.`],
            ['g', `Ask for clarifications and let the deadline drift.`, `The delay will be the first exhibit when investors argue there is cause.`],
            ['p', `Refuse and warn ${a.first} about confidentiality.`, `Denying a right and threatening a partner turns unhappy investors into plaintiffs.`]
          ],
          deal: {
            setup: `You send the list and call ${a.first}, the investor leading the push. The group is angry about delays, not out for blood. They want a reason to stand down.`,
            asks: [
              ['v', `Waive management fees until the project is back on schedule.`, `It costs real money and shows whose side you are on.`],
              ['m', `Ask for a 90-day standstill in return for monthly reporting and a recovery plan.`, `Time to fix it, on terms everyone can see.`],
              ['x', `Offer the lead investor a private payment to drop the campaign.`, `Buying off the organizer with a side payment betrays every other partner.`],
              ['n', `Ask for nothing. Let the vote happen.`, `Principled, and you may lose the mandate.`]
            ],
            rule: `Win investors back with terms offered to all of them, in the open.`
          },
          rule: `Investor rights to information and to organize are what hold a general partner accountable.`
        };
      }
    },
    {
      id: 'l6-keyperson', burn: 2, title: 'The key person leaves',
      make: function (g) {
        var a = g.person(), amt = g.m(6, 18, 1);
        return {
          scene: `${a}, a named key person, resigned last week. The agreement requires notice to investors in ten days and no new investments until they approve a replacement. A ${MB.usd(amt)} acquisition signs in twelve days.`,
          who: `Your remaining partners`,
          behind: `The remaining principals want the acquisition and the fees that come with it. Giving notice lets investors pause everything. Closing first turns their right to decide into a complaint after the fact.`,
          options: [
            ['s', `Give notice now, pause, and ask investors to approve the deal.`, `Investors backed named people. The clause is their agreed protection.`],
            ['g', `Sign the deal, since it predates the departure, then give notice.`, `Arguable, but the general partner is deciding the investors' question in its own favour.`],
            ['p', `Close and mention it in the quarterly report.`, `That breaches the notice and the freeze, and is likely cause for removal.`]
          ],
          deal: {
            setup: `You give the notice. Investors take the departure calmly. Several say they still like the acquisition and ask what you propose.`,
            asks: [
              ['m', `Ask them to approve this one acquisition, with a right to co-invest.`, `They keep control and share the upside. Easy to say yes to.`],
              ['r', `Ask them to approve your replacement and extend the investment period a year.`, `Much more than the clause contemplates. They may want to wait.`],
              ['x', `Say the deal dies unless they waive the clause by tomorrow.`, `Inventing a deadline to rush a consent misleads your own investors.`],
              ['n', `Ask only for what the clause requires.`, `By the book. The acquisition waits.`]
            ],
            rule: `Ask investors for more if you like. Never manufacture the urgency.`
          },
          rule: `When an agreement says what happens on a trigger, the party in control does it on time.`
        };
      }
    },
    {
      id: 'l6-reporting', burn: 0, title: 'The late audit',
      make: function (g) {
        var pct = g.pick([18, 22, 30]);
        return {
          scene: `Audited statements are due in 120 days. They will be a month late because the auditors insist on a ${pct}% writedown. Investor relations drafts an upbeat newsletter that mentions neither.`,
          behind: `Investor relations wants the bad number to arrive after some good news. The investors deciding whether to fund the next capital call are the ones who need it now.`,
          options: [
            ['s', `Tell investors now about the delay and the writedown.`, `Bad news from the sponsor, on time, costs comfort. Found later, it costs credibility.`],
            ['g', `Send the newsletter and deliver the audit when ready.`, `Nothing false, but investors are left with a picture the numbers contradict.`],
            ['p', `Hold the statements until a refinancing improves the story.`, `Deliberately withholding required information can be a securities problem too.`]
          ],
          rule: `Reporting runs on the agreement's timetable, and matters most when the news is bad.`
        };
      }
    },
    {
      id: 'l6-recycle', title: 'Reinvesting the proceeds',
      make: function (g) {
        var a = g.person(), amt = g.m(4, 12, 1);
        return {
          scene: `An early sale returns ${MB.usd(amt)} to the fund. The agreement lets the general partner reinvest sale proceeds only in the first three years. It is year four. ${a}, a principal, has a new deal and wants to use the money.`,
          who: `${a.first}`,
          behind: `The general partner's fee is charged on money that is invested. Returning capital shrinks the fee. Keeping it at work keeps the fee, and gives the promote more to grow on.`,
          options: [
            ['s', `Distribute it, or ask investors to approve the reinvestment.`, `The time limit is the investors' right to get their money back. Only they can extend it.`],
            ['g', `Reinvest and report it as within the spirit of the agreement.`, `The agreement set a date, not a spirit. Reporting it does not make it permitted.`],
            ['p', `Reinvest and describe it as a follow-on to an old deal.`, `Mislabelling a new investment to get around a limit is a breach dressed as bookkeeping.`]
          ],
          rule: `Limits on what a general partner may do with returned capital belong to the investors.`,
          deal: {
            setup: `You tell investors the money is coming back, and mention the new deal. Several ask whether they could take part in it.`,
            asks: [
              ['m', `Offer each investor the choice to reinvest their share in the new deal.`, `Those who want in opt in. Those who want cash get cash.`],
              ['r', `Ask for a vote to extend the reinvestment period by two years.`, `It needs the majority the agreement requires, and some investors want out.`],
              ['x', `Hold the distribution until enough investors agree to reinvest.`, `Withholding money they are owed to pressure a consent is a breach.`],
              ['n', `Distribute and say no more.`, `Clean. The new deal needs other money.`]
            ],
            rule: `Ask investors to choose. Never hold their money while they do.`
          }
        };
      }
    },
    {
      id: 'l6-transfer', title: 'The partner who wants out',
      make: function (g) {
        var a = g.person(), b = g.person();
        return {
          scene: `${b}, a limited partner, wants to sell their units. The general partner's consent is required and may not be unreasonably withheld. ${a}, who runs the general partner, dislikes the buyer, who "asks too many questions."`,
          who: `${a.first}`,
          behind: `${a.first} wants quiet investors. A buyer who asks questions is a buyer who reads the reports. That is not a ground for refusing, and ${b.first} is stuck holding units until someone agrees.`,
          options: [
            ['s', `Assess the buyer on proper grounds and answer promptly, with reasons.`, `Money, eligibility and real harm to the partnership are grounds. Being inconvenient is not.`],
            ['g', `Sit on the request until ${b.first} gives up.`, `Delay with no reason is a refusal with no reason. It is still unreasonable.`],
            ['p', `Agree only if ${b.first} pays a transfer fee the agreement does not mention.`, `Charging for a consent you owe is using your position to take money from a partner.`]
          ],
          rule: `A consent right is used for the partnership's reasons, never for the general partner's comfort.`,
          deal: {
            setup: `The buyer checks out. ${b.first} is keen to close and asks if there is anything you need.`,
            asks: [
              ['m', `Ask the buyer to sign the agreement and cover the partnership's legal costs.`, `The agreement allows cost recovery, and every new partner signs on.`],
              ['r', `Ask the buyer to prefund its share of the next capital call.`, `Useful certainty for the partnership. The buyer has no duty to give it.`],
              ['x', `Ask for a personal fee to speed things up.`, `A payment to you for doing your job is a bribe.`],
              ['n', `Consent and wish them both well.`, `Nothing gained, nothing owed.`]
            ],
            rule: `Ask on behalf of the partnership. Ask nothing for yourself.`
          }
        };
      }
    },
    {
      id: 'l6-valuation', burn: 2, title: 'Marking your own homework',
      make: function (g) {
        var a = g.person(), pct = g.pick([12, 15, 20]);
        return {
          scene: `The general partner values the fund's properties each year, and its fee is a percentage of that value. A sale process just failed with the best bid ${pct}% below last year's value. ${a}, a principal, wants to keep last year's number.`,
          who: `${a.first}`,
          behind: `A higher value means a higher fee this year. It also flatters the track record ${a.first} will show investors when raising the next fund. A real bid from a real buyer is better evidence than last year's estimate.`,
          options: [
            ['s', `Mark to the evidence, with an independent valuer, and disclose it.`, `The failed sale is the best evidence there is. Investors rely on the number.`],
            ['g', `Keep the value and add a cautious note to the report.`, `The note admits the doubt while the fee is still charged on the higher number.`],
            ['p', `Keep the value. One failed sale proves nothing.`, `Ignoring a market bid to protect your own fee is a self-serving valuation.`]
          ],
          rule: `When your fee depends on your valuation, someone independent should check it.`
        };
      }
    },
    {
      id: 'l6-coinvest', title: 'Who gets the extra?',
      make: function (g) {
        var a = g.person(), amt = g.m(5, 15, 1);
        return {
          scene: `A strong deal is too big for the fund, leaving ${MB.usd(amt)} for co-investors. The agreement says existing investors are offered it first, in proportion. ${a}, a principal, wants to give it to a prospect for the next fund, and to the principals.`,
          who: `${a.first}`,
          behind: `Co-investment usually carries low fees, so it is a gift. ${a.first} wants to spend that gift on winning a new investor and on the principals themselves, when it was promised to the people already in the fund.`,
          options: [
            ['s', `Offer it to existing investors in proportion, then to others.`, `They were promised first look. What is left can go where you like.`],
            ['g', `Give investors 48 hours over a holiday weekend to respond.`, `A window nobody can use is a refusal with paperwork.`],
            ['p', `Allocate it to the prospect and the principals.`, `That takes an opportunity the agreement gave the investors and hands it to insiders.`]
          ],
          rule: `An opportunity promised to investors is theirs to decline before anyone else gets it.`
        };
      }
    },
    {
      id: 'l6-expenses', title: 'Whose legal bill?',
      make: function (g) {
        var a = g.person(), amt = g.pick([180000, 240000, 320000]);
        return {
          scene: `A former employee is suing the general partner over a bonus. Legal fees have reached ${MB.usd(amt)}. The fund must cover claims arising from the fund's business, but not the general partner's own overhead. ${a}, the controller, wants the fund to pay.`,
          who: `${a.first}`,
          behind: `Every dollar the fund pays is a dollar the general partner keeps. An employment dispute is the general partner's own cost of doing business, so charging it to the fund moves it onto the investors.`,
          options: [
            ['s', `The general partner pays. If it is unclear, ask the advisory committee.`, `The agreement draws the line, and doubt is resolved by the investors.`],
            ['g', `Split it evenly with the fund without asking anyone.`, `Half of a charge you are not entitled to is still not yours to take.`],
            ['p', `Charge it all to the fund as "legal."`, `A vague label hides a general partner expense inside the fund's costs.`]
          ],
          rule: `Costs are split between a general partner and its fund as the agreement says. Doubt goes to the investors.`
        };
      }
    },
    {
      id: 'l6-extension', title: 'One more year',
      make: function (g) {
        var a = g.person();
        return {
          scene: `The fund's term ends next month with two properties unsold in a weak market. The agreement allows a one-year extension with the advisory committee's consent. ${a}, a principal, says: "Just keep going. Nobody wants a fire sale."`,
          who: `${a.first}`,
          behind: `Fees continue for as long as the fund does. ${a.first} is probably right that selling now is bad. But carrying on without consent means the general partner alone decides to keep being paid.`,
          options: [
            ['s', `Ask the committee for the extension, with a plan to sell.`, `The investors agreed to a term. Extending it is their decision.`],
            ['g', `Carry on "in wind-down" without a vote, citing the market.`, `Sensible reasoning, wrong decision-maker. The agreement said who decides.`],
            ['p', `Carry on and keep charging full fees.`, `An expired fund paying full fees with no consent is the general partner serving itself.`]
          ],
          rule: `A fund's term is a promise about when investors get their money back.`,
          deal: {
            setup: `The committee agrees that selling now would be a mistake. They ask what terms you propose for the extra year.`,
            asks: [
              ['m', `One year at half fees.`, `It shares the pain of the delay. Committees say yes to this.`],
              ['r', `Two years at full fees.`, `More time and no fee cut. They may think you are in no hurry.`],
              ['v', `One year with no fee at all.`, `It costs you real income and proves you want the properties sold.`],
              ['x', `Say the properties will be dumped unless they agree today.`, `Threatening to harm the fund to win a vote is a breach of your duty to it.`],
              ['n', `One year on the existing terms.`, `What the agreement provides, nothing more.`]
            ],
            rule: `Extra time is something to pay for, not something to extract.`
          }
        };
      }
    }
  ]
});
