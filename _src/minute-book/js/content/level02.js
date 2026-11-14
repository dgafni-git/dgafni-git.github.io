MB.level({
  n: 2, title: 'Duties', rank: 'Senior Associate', pass: 0.7, draw: { authored: 5 },
  topics: 'Care, loyalty, conflicts and whose interests come first',
  blurb: 'People who hold power over other people\'s money owe duties. Most failures are a breach of one.',
  concepts: [
    ['Fiduciary', 'Someone who holds power on behalf of another and must use it for that other\'s benefit. Directors, officers, managing members and general partners are fiduciaries of the entity they serve.'],
    ['Duty of care', 'The duty to be informed and attentive: read the materials, ask questions, take the time and advice a reasonable person would.'],
    ['Duty of loyalty', 'The duty to put the entity\'s interests ahead of your own and ahead of anyone else you answer to.'],
    ['Business judgment rule', 'Courts will not second-guess a decision made in good faith, on reasonable information, by people with no personal stake in it. Lose any of the three and the protection goes.'],
    ['Conflict of interest', 'Any personal, financial or family interest that could pull your judgment away from the entity. Having one is not misconduct. Hiding one is.'],
    ['Disclosure and recusal', 'The cure for a conflict: tell the board the full facts, then stay out of the discussion and the vote.'],
    ['Corporate opportunity', 'A business chance that belongs to the entity because it came through your role or fits the entity\'s business. You may not take it for yourself unless the entity knowingly turns it down.']
  ],
  scenarios: [
    {
      id: 'l2-family', title: 'The low bidder is family',
      make: function (g) {
        var a = g.person(), amt = g.m(0.4, 1.6, 0.1);
        return {
          scene: `Your committee votes this afternoon on a ${MB.usd(amt)} servicing contract. The lowest bid is from a company owned by your brother-in-law, ${a}. Nobody else knows.`,
          options: [
            ['s', `Disclose the relationship, leave the room, and have both minuted.`, `The committee can still pick the best bid, and the record shows the decision was untainted.`],
            ['g', `Tell the chair privately, then vote. It is the lowest bid anyway.`, `One person knows, the rest do not, and you voted on a relative's contract.`],
            ['p', `Say nothing. The cheapest bid harms no one.`, `An undisclosed conflict can make the contract voidable and you liable for any benefit.`]
          ],
          rule: `A conflict is cured by disclosure and recusal, not by the deal being fair.`,
          us: `Delaware protects an interested deal approved by informed, disinterested directors or shareholders, or proven fair. The first route is far safer.`,
          ca: `Corporate statutes require directors and officers to disclose an interest in a material contract and generally to abstain from voting on it.`
        };
      }
    },
    {
      id: 'l2-nominee', burn: 2, title: 'The director who was sent',
      make: function (g) {
        var spe = g.spe('Inc.'), a = g.person(), amt = g.m(0.5, 2, 0.25);
        return {
          scene: `${g.fund} put you on the board of ${spe}. Its chief executive, ${a}, calls: "Send ${MB.usd(amt)} up to the fund this week. Vote it through." The entity has unpaid trades and tax due.`,
          options: [
            ['s', `Check whether the entity can pay it and still meet its debts. Tell ${a.first} what you find.`, `Your duty runs to the entity whose board you sit on, not to whoever appointed you.`],
            ['g', `Vote yes and minute your reservations.`, `Reservations do not undo a yes vote. You approved it knowingly.`],
            ['p', `Vote it through. The fund owns the entity.`, `Owner and entity are not the same, least of all when money is short.`]
          ],
          rule: `A nominee director owes duties to the company, not to the shareholder who nominated them.`,
          us: `Directors who approve a distribution that leaves a corporation insolvent can be personally liable for it.`,
          ca: `Statutes bar dividends that would leave a corporation unable to pay its debts, and make directors who vote for them personally liable.`
        };
      }
    },
    {
      id: 'l2-opportunity', title: 'The lot next door',
      make: function (g) {
        var spe = g.spe(), amt = g.m(0.6, 1.8, 0.1);
        return {
          scene: `You are an officer of ${spe}, which is assembling land. A broker calls you personally: the adjoining lot is quietly for sale at ${MB.usd(amt)}. "You could flip it to the project in a year."`,
          options: [
            ['s', `Take it to the board. Buy it yourself only if the board declines in writing.`, `The chance came through your role and fits the entity's business. It is the entity's to refuse.`],
            ['g', `Buy it now so it is not lost, and offer it to the entity at cost.`, `Good motive, but you took the entity's opportunity and now sit across the table as seller.`],
            ['p', `Have your spouse's company buy it.`, `That adds concealment to the breach. Courts strip the profit from deals like this.`]
          ],
          rule: `An opportunity that comes through your position belongs to the entity first.`,
          us: `Courts ask whether the company could afford the opportunity, whether it is in its line of business, and whether it had an expectancy in it.`,
          ca: `Canadian courts apply a strict version to senior officers and directors, and it can follow them after they resign.`
        };
      }
    },
    {
      id: 'l2-informed', title: 'Sixty pages, sixty minutes',
      make: function (g) {
        var a = g.person(), amt = g.m(8, 30, 1);
        return {
          scene: `An hour before the board meets, management sends sixty pages recommending a ${MB.usd(amt)} sale of the main property. The offer expires at midnight. "It is a good price," says ${a}, the chief executive. "I need a motion."`,
          options: [
            ['s', `Ask how the price was tested and why the deadline is real, then vote.`, `A fast decision can still be an informed one. The record of questions is what protects it.`],
            ['g', `Vote yes on the chief executive's assurance.`, `Directors may rely on management, but not blindly on the company's biggest decision.`],
            ['p', `Reply "fine by me" from your phone and skip the meeting.`, `No court defers to a judgment that was never exercised.`]
          ],
          rule: `The business judgment rule protects the process. Read, ask, and make sure the minutes show it.`,
          us: `Delaware directors have been found in breach for approving a sale in a short meeting with no valuation, even at a premium.`,
          ca: `Canadian courts defer to decisions within a range of reasonable choices, made honestly and on proper information.`
        };
      }
    },
    {
      id: 'l2-confidential', burn: 0, title: 'What you learned in the boardroom',
      make: function (g) {
        var a = g.person();
        return {
          scene: `As a director you learn the anchor tenant is about to stop paying rent. At dinner an old friend, ${a}, mentions lending to another landlord with the same tenant.`,
          options: [
            ['s', `Say nothing about the tenant.`, `You hold the information only because of your seat. It belongs to the entity.`],
            ['g', `Say, "I would look hard at your tenant list."`, `A hint is a disclosure with deniability. A court would read it as plainly as your friend does.`],
            ['p', `Tell ${a.first}. It will be public in a month.`, `You gave away confidential information, and possibly broke securities law.`]
          ],
          rule: `Board information is held for the entity. It is not yours to share or signal.`
        };
      }
    },
    {
      id: 'l2-gift', title: 'Seats behind the bench',
      make: function (g) {
        var a = g.person();
        return {
          scene: `You are running a construction tender that closes in ten days. ${a}, who owns one of the bidders, offers you two playoff tickets. "No strings."`,
          options: [
            ['s', `Decline while the tender is open and note the offer in the file.`, `Your decision has to be yours alone, and has to look that way.`],
            ['g', `Go, and tell your manager the next morning.`, `Better than silence, but a losing bidder who hears of it has a ready complaint.`],
            ['p', `Accept, and mention where the other bids are landing.`, `That is a benefit traded for bid information, and in many places a crime.`]
          ],
          rule: `A benefit from someone who wants a decision from you is a conflict, whatever its size.`,
          us: `Commercial bribery is a crime in many states.`,
          ca: `The Criminal Code makes it an offence for an agent to accept a secret benefit relating to the principal's business.`
        };
      }
    }
  ]
});
