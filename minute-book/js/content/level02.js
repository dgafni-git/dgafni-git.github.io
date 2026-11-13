MB.level({
  n: 2, title: 'Duties', rank: 'Senior Associate', pass: 0.7, draw: { authored: 5 },
  topics: 'Care, loyalty, conflicts and whose interests come first',
  blurb: 'Directors, officers, managers and general partners hold power over other people\'s money. The law answers that with duties. Nearly every governance failure is a failure of one of them.',
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
        var spe = g.spe(), a = g.person(), amt = g.m(0.4, 1.6, 0.1);
        return {
          scene: `You sit on the management committee of ${spe}. Three firms bid on the site servicing contract, worth about ${MB.usd(amt)}. The lowest bid, by a clear margin, comes from a company owned by your brother-in-law, ${a}. Nobody else on the committee knows the connection.`,
          ask: `The vote is this afternoon. What do you do?`,
          options: [
            ['s', `Tell the committee about the relationship before the discussion starts, leave the room, and ask that the minutes record both.`, `The committee can still pick the best bid. What changes is that the decision is made by people with no stake, on full information, and the record proves it.`],
            ['g', `Mention the connection to the chair privately, then vote with everyone else since the bid is the lowest anyway.`, `One person knows, the rest do not, and you still voted on a contract with a relative. If the job goes badly, a fair price will not save the decision or you.`],
            ['p', `Say nothing. The bid is the cheapest, so nobody is harmed.`, `The harm is that the entity never got an untainted decision. An undisclosed conflict can make the contract voidable and exposes you to having to account for any benefit.`]
          ],
          rule: `A conflict is cured by disclosure and recusal, not by the deal being fair. Fairness is what you argue later if you failed to disclose, and it is a much harder argument.`,
          us: `Delaware protects an interested transaction that is approved by informed, disinterested directors or shareholders, or that is proven fair. The first route is far safer than the last.`,
          ca: `Corporate statutes require a director or officer to disclose in writing, or have minuted, any interest in a material contract, and generally to abstain from voting on it.`
        };
      }
    },
    {
      id: 'l2-nominee', title: 'The director who was sent',
      make: function (g) {
        var spe = g.spe('Inc.'), a = g.person(), amt = g.m(0.5, 2, 0.25);
        return {
          scene: `${g.fund} appointed you to the board of ${spe}, which holds a project the fund foreclosed on. ${a}, the fund's chief executive, calls before the board meeting. "We need ${MB.usd(amt)} sent up to the fund this week. Vote it through."\n\nYou know the entity has unpaid trade invoices and a tax instalment due.`,
          ask: `How do you vote?`,
          options: [
            ['s', `Decide as a director of the entity: check whether it can make the payment and still pay its debts as they fall due, and whether its loan documents allow it. Tell ${a.first} what you find.`, `Your duty runs to the entity whose board you sit on. The shareholder who appointed you can replace you, but it cannot tell you how to vote.`],
            ['g', `Vote yes, and ask the secretary to minute that you had reservations.`, `Minuted reservations do not undo a yes vote. If the payment was unlawful or left creditors short, you approved it knowingly.`],
            ['p', `Vote it through. The fund owns the entity, so the fund's wishes are the entity's interests.`, `They are not the same thing, and the gap is widest when money is short. A director who simply follows the parent's orders has stopped doing the job.`]
          ],
          rule: `A nominee director owes duties to the company, not to whoever nominated them. When the two pull apart, the company wins, and the director says so out loud.`,
          us: `Directors who approve a distribution that leaves a corporation insolvent can be personally liable for it.`,
          ca: `Corporate statutes bar dividends and similar payments when the corporation could not pay its liabilities as they come due afterward, and make directors who vote for them personally liable.`
        };
      }
    },
    {
      id: 'l2-opportunity', title: 'The lot next door',
      make: function (g) {
        var spe = g.spe(), a = g.person(), amt = g.m(0.6, 1.8, 0.1);
        return {
          scene: `You are an officer of ${spe}, which is assembling land for a larger project. ${a}, a broker you met through that work, calls you directly. The owner of the adjoining lot will sell quietly for ${MB.usd(amt)}. "I thought of you first. You could flip it to the project in a year."`,
          ask: `What do you do with the call?`,
          options: [
            ['s', `Take it to the entity's board with everything you were told. Pursue it yourself only if the board, without your vote, declines in writing.`, `The chance reached you because of your role and fits the entity's business. It is the entity's to accept or refuse.`],
            ['g', `Buy the lot yourself now so it is not lost, and offer it to the entity at your cost.`, `Your motive may be good, but you have taken the entity's opportunity and now sit across the table from it as a seller. If the price or terms are ever questioned, you start in the wrong.`],
            ['p', `Have your spouse's holding company buy it. The entity can pay market price later.`, `Routing it through a relative adds concealment to the breach. Courts strip the profit from deals like this and are unimpressed by the structure.`]
          ],
          rule: `If an opportunity comes to you because of your position, or is something the entity would want, offer it to the entity first, with full facts, and let people without a stake decide.`,
          us: `The corporate opportunity doctrine asks whether the business could afford the opportunity, whether it is in the company's line of business, and whether the company has an interest or expectancy in it.`,
          ca: `Canadian courts apply a strict version of the rule to senior officers and directors, and it can follow them even after they resign.`
        };
      }
    },
    {
      id: 'l2-informed', title: 'Sixty pages, sixty minutes',
      make: function (g) {
        var spe = g.spe('Inc.'), a = g.person(), amt = g.m(8, 30, 1);
        return {
          scene: `You are a director of ${spe}. An hour before the board meeting, management circulates a sixty-page package recommending that the board accept a ${MB.usd(amt)} offer for the company's main property. The offer expires at midnight.\n\n${a}, the chief executive, opens the meeting: "It is a good price. I need a motion."`,
          ask: `What do you do?`,
          options: [
            ['s', `Ask how the price was tested, what alternatives exist and why the deadline is real. Ask for the adviser to join the call, and for more time if the answers are thin. Then vote, with the discussion minuted.`, `A decision made quickly can still be an informed one. What protects it is evidence that the board asked, listened and weighed the answers.`],
            ['g', `Vote yes on the chief executive's assurance. Management knows the asset far better than the board.`, `Directors may rely on management, but the reliance has to be reasonable. Accepting a one-line assurance on the company's biggest decision, unread, is not.`],
            ['p', `Reply "fine by me" from your phone and skip the meeting.`, `You approved the sale of the main asset without reading or attending. No court will defer to a judgment that was never exercised.`]
          ],
          rule: `The business judgment rule protects the quality of the process, whatever the result turns out to be. Read, ask, take advice, and make sure the minutes show that you did.`,
          us: `Delaware directors have been held to breach the duty of care for approving a sale in a short meeting with no valuation and no documents, even at a premium price.`,
          ca: `Canadian courts give boards the same deference where the decision falls within a range of reasonable choices made honestly and on proper information.`
        };
      }
    },
    {
      id: 'l2-confidential', title: 'What you learned in the boardroom',
      make: function (g) {
        var spe = g.spe(), a = g.person();
        return {
          scene: `As a director of ${spe} you learn that its anchor tenant will stop paying rent next month and plans to file for creditor protection. That evening an old friend, ${a}, mentions over dinner that their family office is about to lend to another landlord whose biggest tenant is the same company.`,
          ask: `What do you say?`,
          options: [
            ['s', `Nothing about the tenant. The information belongs to the entity.`, `You hold it only because of your seat. Using it to help a friend is a breach of loyalty even if the entity loses nothing by it.`],
            ['g', `Say only, "I would look hard at your tenant list before you close."`, `A hint is a disclosure with deniability. ${a.first} will understand it exactly, and so would a court.`],
            ['p', `Tell ${a.first} what you know. The news will be public in a month anyway.`, `You have given away the entity's confidential information, and possibly the tenant's too. If either company's securities trade publicly, you may also have broken securities law.`]
          ],
          rule: `Information you receive as a director or officer is held for the entity. It is not yours to trade on, share, or signal, however good the reason feels.`
        };
      }
    },
    {
      id: 'l2-gift', title: 'Seats behind the bench',
      make: function (g) {
        var a = g.person(), spe = g.spe();
        return {
          scene: `You are running the tender for the general contract on ${spe}'s project. Bids close in ten days. ${a}, who owns one of the bidding firms, offers you two playoff tickets. "No strings. We have a box."`,
          ask: `What do you do?`,
          options: [
            ['s', `Decline while the tender is open, and note the offer in the tender file.`, `The decision you make next has to be yours alone and has to look that way. Declining costs you an evening and protects the award.`],
            ['g', `Go to the game and tell your manager about it the next morning.`, `Telling someone is better than silence, but the gift has already been accepted during a live bid. A losing bidder who learns of it has a ready complaint.`],
            ['p', `Accept, and mention to ${a.first} roughly where the other bids are landing.`, `That is a benefit taken in exchange for confidential bid information. It breaches your duty, corrupts the tender, and in many places is a criminal offence.`]
          ],
          rule: `A benefit from someone who wants a decision from you is a conflict, whatever its size. Decline during the decision, disclose under the policy, and never trade information for it.`,
          us: `Commercial bribery is a crime in many states, and kickbacks on federally related projects carry their own penalties.`,
          ca: `The Criminal Code makes it an offence for an agent to accept a secret benefit for acts relating to the principal's business.`
        };
      }
    }
  ]
});
