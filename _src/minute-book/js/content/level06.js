MB.level({
  n: 6, title: 'Partnerships', rank: 'Principal', pass: 0.7, draw: { authored: 5 },
  topics: 'General partners, limited partners and the agreement between them',
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
          options: [
            ['s', `Offer fuller reporting and an advisory committee seat, and explain the liability risk.`, `A real voice through the channel built for it, and the investor stays an investor.`],
            ['g', `Let ${a.first} join management calls and weigh in informally.`, `One investor now steers decisions the others cannot see, and looks like a manager.`],
            ['p', `Give ${a.first} co-signing authority.`, `A limited partner who signs contracts is managing, and risks limited liability.`]
          ],
          deal: {
            setup: `${a.first} calms down once the advisory seat is offered. "Fine. But I want to see you earn it."`,
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
          scene: `Three partnerships share ${MB.usd(amt)} of office costs, allocated "in the general partner's sole discretion." It earns a promote in two of them. ${a}, the controller, proposes loading the third.`,
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
      id: 'l6-removal', title: 'They want the partner list',
      make: function (g) {
        var a = g.person(), b = g.person();
        return {
          scene: `Unhappy investors can remove the general partner by a two-thirds vote. ${a} asks for the partner list, which the agreement entitles any partner to. ${b}, the principal, says: "They are organizing. Take your time."`,
          options: [
            ['s', `Provide the list on time and tell ${b.first} to answer the concerns.`, `The right belongs to the partners. A confident general partner answers its critics.`],
            ['g', `Ask for clarifications and let the deadline drift.`, `The delay will be the first exhibit when investors argue there is cause.`],
            ['p', `Refuse and warn ${a.first} about confidentiality.`, `Denying a right and threatening a partner turns unhappy investors into plaintiffs.`]
          ],
          deal: {
            setup: `You send the list and call ${a.first}. The investors are angry about delays, not out for blood. They want a reason to stand down.`,
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
          options: [
            ['s', `Give notice now, pause, and ask investors to approve the deal.`, `Investors backed named people. The clause is their agreed protection.`],
            ['g', `Sign the deal, since it predates the departure, then give notice.`, `Arguable, but the general partner is deciding the investors' question in its own favour.`],
            ['p', `Close and mention it in the quarterly report.`, `That breaches the notice and the freeze, and is likely cause for removal.`]
          ],
          deal: {
            setup: `Investors take the news calmly. Several say they still like the acquisition and ask what you propose.`,
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
          options: [
            ['s', `Tell investors now about the delay and the writedown.`, `Bad news from the sponsor, on time, costs comfort. Found later, it costs credibility.`],
            ['g', `Send the newsletter and deliver the audit when ready.`, `Nothing false, but investors are left with a picture the numbers contradict.`],
            ['p', `Hold the statements until a refinancing improves the story.`, `Deliberately withholding required information can be a securities problem too.`]
          ],
          rule: `Reporting runs on the agreement's timetable, and matters most when the news is bad.`
        };
      }
    }
  ]
});
