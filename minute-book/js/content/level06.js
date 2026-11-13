MB.level({
  n: 6, title: 'Partnerships', rank: 'Principal', pass: 0.7, draw: { authored: 5 },
  topics: 'General partners, limited partners and the agreement between them',
  blurb: 'Most real estate funds and joint ventures are limited partnerships or built like them. One party has control and unlimited responsibility. The others have money at risk and very little say. The agreement is the whole relationship.',
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
        var lp = g.spe('LP'), a = g.person(), pct = g.pick([28, 35, 40]);
        return {
          scene: `${a} holds ${pct}% of the limited partnership units in ${lp} and is unhappy with the pace of construction. ${a.first} now wants to approve every contract over $50,000, attend the weekly site meetings, and tell the contractor directly what to prioritize.`,
          ask: `You act for the general partner. How do you respond?`,
          options: [
            ['s', `Offer what the agreement provides: fuller reporting, a seat on the advisory committee, and the consent rights limited partners already hold. Explain that directing the work could cost ${a.first} limited liability.`, `The investor gets real information and a real voice through a channel built for it, and the line between investing and managing stays where it protects everyone.`],
            ['g', `Let ${a.first} join the weekly management calls and "weigh in" informally, without changing anything on paper.`, `It keeps the peace, but one limited partner now influences decisions the others cannot see, and each instruction the contractor follows is evidence that ${a.first} was managing.`],
            ['p', `Give ${a.first} co-signing authority on contracts to restore confidence.`, `A limited partner with signing authority is managing the business. That risks ${a.first}'s limited liability and hands part of the general partner's job to someone with no duties to the other partners.`]
          ],
          rule: `Limited partners influence a partnership through the rights the agreement gives them: information, consents, the advisory committee, removal. Managing the business is the general partner's job and the general partner's liability.`,
          us: `Delaware lists many activities a limited partner can carry out without being treated as taking part in control, and limits liability to people who reasonably believed the limited partner was a general partner.`,
          ca: `Provincial statutes are stricter. In Ontario a limited partner who takes part in the control of the business can be liable as a general partner, so the line needs more care.`
        };
      }
    },
    {
      id: 'l6-affiliate-sale', title: 'Selling to your other fund',
      builds: ['Conflict of interest', 'Disclosure and recusal'],
      make: function (g) {
        var lp = g.spe('LP'), a = g.person(), amt = g.m(9, 28, 1);
        return {
          scene: `${lp} is near the end of its term and must sell its last property. ${a}, who runs the general partner, also manages a newer fund that would like to buy it for ${MB.usd(amt)}. "No broker fees, a quick close, and we know the asset. Everyone wins."`,
          ask: `How should the sale be approved?`,
          options: [
            ['s', `Disclose the conflict to the advisory committees of both funds, obtain an independent valuation, and close only with the approval the agreement requires from people who are not on both sides.`, `The general partner is seller and buyer at once. Independent pricing and disinterested approval are what turn a suspect transaction into a sound one.`],
            ['g', `Get one broker's opinion of value, close at that price, and report the sale in the next investor letter.`, `There is some price support, but it was chosen by the conflicted party and the investors learn of the deal only after it is done. If the property later sells for more, the general partner has no defence beyond its own judgment.`],
            ['p', `Close it. The agreement gives the general partner sole discretion over sales.`, `Discretion over sales to third parties is not permission to deal with yourself. A general partner on both sides of a sale carries the burden of proving it was fair, and here it has nothing to show.`]
          ],
          rule: `When the general partner or its affiliate is on the other side of a deal, the price needs an independent source and the approval needs to come from someone else. Most partnership agreements give the advisory committee that role.`,
          us: `Registered fund advisers must disclose and obtain consent for principal transactions with funds they manage.`,
          ca: `Registered fund managers must act honestly and in good faith in the best interests of their funds, and must address material conflicts in the fund's best interest.`
        };
      }
    },
    {
      id: 'l6-discretion', title: 'In its sole discretion',
      make: function (g) {
        var a = g.person(), amt = g.m(0.4, 1.4, 0.1);
        return {
          scene: `The general partner runs three partnerships from one office. Shared costs for staff, insurance and software come to ${MB.usd(amt)} a year. Each partnership agreement lets the general partner allocate shared costs "in its sole discretion."\n\nThe general partner earns a promote in two of the partnerships and none in the third. ${a}, the controller, proposes loading most of the shared cost onto the third.`,
          ask: `How should the costs be allocated?`,
          options: [
            ['s', `On a reasonable basis applied consistently, such as time spent or assets managed, written into a policy and disclosed to the investors in all three partnerships.`, `Discretion lets the general partner choose among reasonable methods. It does not let it choose the method that moves money to itself.`],
            ['g', `Load the third partnership, and describe the allocation method in the notes to its financial statements.`, `The disclosure is there for anyone who reads the notes, but the method was picked for the general partner's benefit. Disclosing a self-serving choice does not make it a good-faith one.`],
            ['p', `Load the third partnership. Sole discretion means the general partner need not explain itself.`, `Every contract carries an obligation to exercise its powers in good faith. Using a discretion to enrich yourself at one group of investors' expense is the standard example of breaching it.`]
          ],
          rule: `"Sole discretion" widens the range of choices. It never removes the requirement to choose honestly and for the purpose the power was given.`,
          us: `Delaware lets partnership agreements narrow or remove fiduciary duties, but the implied covenant of good faith and fair dealing cannot be waived.`,
          ca: `The Supreme Court of Canada has held that contractual discretion must be exercised in good faith, meaning reasonably in light of the purpose for which it was granted.`
        };
      }
    },
    {
      id: 'l6-removal', title: 'They want the partner list',
      make: function (g) {
        var lp = g.spe('LP'), a = g.person(), b = g.person();
        return {
          scene: `Several limited partners in ${lp} are unhappy. The agreement lets holders of two-thirds of the units remove the general partner for cause, and gives every partner the right to a current list of partners on request. ${a} writes asking for the list.\n\n${b}, the general partner's principal, tells you: "They are organizing against us. Take your time."`,
          ask: `You are the general partner's compliance officer. What do you do?`,
          options: [
            ['s', `Provide the list within the time the agreement and statute allow, exactly as they require, and advise ${b.first} to respond to the investors' concerns directly.`, `The information right belongs to the partners. A general partner confident in its record answers the criticism instead of blocking the people making it.`],
            ['g', `Acknowledge the request, then ask for clarifications and let the deadline drift by a few weeks.`, `Delay may buy time, but the right is clear and the motive is plain. It will be the first exhibit when the limited partners argue there is cause for removal.`],
            ['p', `Refuse, and warn ${a.first} that contacting other investors breaches confidentiality.`, `That denies a contractual right and threatens a partner for using it. It converts unhappy investors into plaintiffs.`]
          ],
          rule: `Investor rights to information and to act together are what hold a general partner accountable. A general partner that obstructs them is using its position to protect itself, which is disloyal.`
        };
      }
    },
    {
      id: 'l6-keyperson', title: 'The key person leaves',
      make: function (g) {
        var a = g.person(), b = g.person(), amt = g.m(6, 18, 1);
        return {
          scene: `${a} is named as a key person in the partnership agreement of a fund sponsored by ${g.fund}. If ${a.first} stops devoting substantially all working time to the fund, the general partner must notify investors within ten days and may make no new investments until they approve a replacement.\n\n${a.first} resigned last week. A ${MB.usd(amt)} acquisition is due to sign in twelve days. ${b}, the remaining principal, wants to close it first and "tell investors in the quarterly report."`,
          ask: `What does the general partner do?`,
          options: [
            ['s', `Give the key person notice now, stop new investments, and ask investors promptly to approve a replacement and, if it is justified, this acquisition.`, `Investors committed their money on the strength of named people. The clause is their agreed protection when one of them goes, and it tells the general partner exactly what to do.`],
            ['g', `Sign the acquisition, since it was negotiated while ${a.first} was still here, then send the notice.`, `There is an argument that the deal predates the departure, but the agreement says no new investments once the event has happened. The general partner would be deciding a question in its own favour that belongs to the investors.`],
            ['p', `Close the acquisition and mention the departure in the quarterly report.`, `That breaches the notice deadline and the investment freeze, and it conceals a fact investors were promised they would be told. It is likely cause for removal.`]
          ],
          rule: `When an agreement says what happens on a trigger, the party in control does it, on time, even when it is inconvenient. That is the whole point of the trigger.`
        };
      }
    },
    {
      id: 'l6-reporting', title: 'The late audit',
      make: function (g) {
        var lp = g.spe('LP'), a = g.person(), pct = g.pick([18, 22, 30]);
        return {
          scene: `The agreement for ${lp} requires audited financial statements within 120 days of year end. The audit is running a month late because the auditors will not sign off without a ${pct}% writedown of the main property. ${a}, head of investor relations, drafts an upbeat spring newsletter that mentions neither the delay nor the writedown.`,
          ask: `What do investors hear, and when?`,
          options: [
            ['s', `A notice before the deadline that the audit is late and why, including the expected writedown, with unaudited figures now and the audited statements when they are ready.`, `Bad news delivered on time and by the sponsor costs some comfort. The same news discovered later costs the sponsor its credibility.`],
            ['g', `Send the newsletter as drafted and deliver the audited statements whenever they are finished.`, `Nothing in the newsletter is false, but it leaves a misleading picture while the general partner knows of a large writedown. Investors making decisions in the meantime are doing so on bad information.`],
            ['p', `Hold the statements back until a refinancing closes and the story is better.`, `That is deliberately withholding material information the agreement requires the partners to have. If any of them buys, sells or funds a capital call in the meantime, it is also a securities problem.`]
          ],
          rule: `Reporting duties run on the agreement's timetable, and they matter most when the news is bad. A sponsor's letters must not leave an impression its own numbers contradict.`
        };
      }
    }
  ]
});
