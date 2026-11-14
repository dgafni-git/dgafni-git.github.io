MB.level({
  n: 2, title: 'Duties', rank: 'Senior Associate', pass: 0.7, draw: { authored: 5 },
  topics: 'Care, loyalty, conflicts and whose interests come first',
  role: 'You hold a seat where other people\'s money depends on your judgment.',
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
      id: 'l2-family', role: 'You sit on the committee that awards the project\'s contracts.', title: 'The low bidder is family',
      make: function (g) {
        var a = g.person(), amt = g.m(0.4, 1.6, 0.1);
        return {
          scene: `Your committee votes this afternoon on a ${MB.usd(amt)} servicing contract. The lowest bid is from a company owned by your brother-in-law, ${a}. Nobody else knows.`,
          who: `Your brother-in-law`,
          behind: `Your brother-in-law wants the contract, and you would like him to have it. The bid may truly be the best. Nobody can know that once a decision-maker's relative wins in silence.`,
          deep: [
            [`What counts as a conflict`, `A financial or family interest that could pull your judgment. Close relatives count under most rules.`],
            [`Why a fair price is not enough`, `Fairness can save the contract, but only after an expensive argument. Disclosure avoids the argument.`],
            [`What stepping aside looks like`, `Say it, leave the room, have both minuted. The committee then decides as if you were not there.`]
          ],
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
      id: 'l2-nominee', twist: true, role: 'You are a director of the project company, appointed by the lender that owns it.', burn: 2, title: 'The director who was sent',
      make: function (g) {
        var spe = g.spe('Inc.'), a = g.person(), amt = g.m(0.5, 2, 0.25);
        if (g.twist) return {
          burn: 0,
          twist: `This time the entity could plainly afford it. Refusing was not independence.`,
          scene: `${g.fund} put you on the board of ${spe}. Its chief executive, ${a}, calls: "Send ${MB.usd(amt)} up to the fund this week." The entity has sold its project, paid every creditor, filed its taxes and holds three times that amount in cash.`,
          options: [
            ['s', `Confirm the entity can pay it and stay solvent, then vote yes.`, `A director's job is to check, and then to let the owner have what is properly its own.`],
            ['g', `Vote no, to show the board is independent.`, `Independence means judging the facts. Refusing a proper payment is not judgment.`],
            ['p', `Vote yes without looking at the numbers.`, `The answer happens to be right. The process would have been wrong on any other day.`]
          ],
          rule: `Independence is checking for yourself, not saying no.`
        };
        return {
          scene: `${g.fund} put you on the board of ${spe}. Its chief executive, ${a}, calls: "Send ${MB.usd(amt)} up to the fund this week. Vote it through." The entity has unpaid trades and tax due.`,
          who: `${a.first}`,
          behind: `${a.first} needs cash at the fund. The fund owns the entity, so it feels like moving money between pockets. But the entity's unpaid trades and tax bill are owed from that pocket first.`,
          deep: [
            [`Who a director serves`, `The company on whose board they sit, even when the shareholder who appointed them wants something else.`],
            [`The test before paying an owner`, `Directors must be satisfied the company can still pay its debts as they fall due afterward.`],
            [`Personal exposure`, `Directors who approve an unlawful payment to owners can be made to repay it themselves.`]
          ],
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
      id: 'l2-opportunity', twist: true, role: 'You are an officer of the project company.', title: 'The lot next door',
      make: function (g) {
        var spe = g.spe(), amt = g.m(0.6, 1.8, 0.1);
        if (g.twist) return {
          burn: 0,
          twist: `The board had already turned this lot down in writing. It was yours to take, openly.`,
          scene: `You are an officer of ${spe}. A broker calls you personally: a lot beside the project is for sale at ${MB.usd(amt)}. Last year you put this same lot to the board, which declined it in writing as too small, without your vote.`,
          options: [
            ['s', `Tell the board you intend to buy it yourself, then go ahead.`, `The company refused it with full knowledge. A short notice keeps the record current.`],
            ['g', `Buy it without mentioning it. They already said no.`, `Probably defensible, but a year has passed and things may have changed.`],
            ['p', `Buy it and sell it to the project later at a profit you do not disclose.`, `A secret profit made from your own company is a fresh breach.`]
          ],
          rule: `Once the company has knowingly declined an opportunity, you may take it, in the open.`
        };
        return {
          scene: `You are an officer of ${spe}, which is assembling land. A broker calls you personally: the adjoining lot is quietly for sale at ${MB.usd(amt)}. "You could flip it to the project in a year."`,
          who: `The broker`,
          behind: `The broker wants a quick sale to a buyer who will not shop the price. Offering it to you personally, with a resale to the project built in, hands you a profit the project would pay for.`,
          deep: [
            [`The questions courts ask`, `Did it come to you through your role? Is it in the company's line of business? Could the company have taken it?`],
            [`The safe path`, `Tell the board everything. If it declines in writing, without your vote, you are free to go ahead.`],
            [`If you skip that`, `A court can hand the whole profit to the company, even if the company could not have afforded the deal.`]
          ],
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
      id: 'l2-informed', role: 'You are a director of the company that owns the property.', title: 'Sixty pages, sixty minutes',
      make: function (g) {
        var a = g.person(), amt = g.m(8, 30, 1);
        return {
          scene: `An hour before the board meets, management sends sixty pages recommending a ${MB.usd(amt)} sale of the main property. The offer expires at midnight. "It is a good price," says ${a}, the chief executive. "I need a motion."`,
          who: `${a.first}`,
          behind: `${a.first} negotiated the deal and wants it closed before the offer lapses. A short fuse also stops the board testing the price. Deadlines are sometimes real and sometimes a tactic.`,
          deep: [
            [`What the rule protects`, `Decisions made in good faith, on reasonable information, by people with no personal stake. Courts will not second-guess those.`],
            [`What it does not protect`, `A decision nobody actually considered. Approving unread fails the test of reasonable information.`],
            [`Three questions for ten minutes`, `How was the price tested? Who else was approached? What happens if we say no tonight?`]
          ],
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
      id: 'l2-confidential', role: 'You are a director of a landlord company.', burn: 0, title: 'What you learned in the boardroom',
      make: function (g) {
        var a = g.person();
        return {
          scene: `As a director you learn the anchor tenant is about to stop paying rent. At dinner an old friend, ${a}, mentions lending to another landlord with the same tenant.`,
          behind: `${a.first} wants nothing from you, and that is the trap. Saving a friend from a loss feels harmless. The information is not yours to give, and it has value.`,
          deep: [
            [`Whose information it is`, `The company's. Directors hold it only so they can do their job.`],
            [`The problem with a hint`, `A signal is a disclosure. Courts look at what the listener understood.`],
            [`The securities angle`, `If any company involved is publicly traded, passing on undisclosed information that would move its price can be an offence.`]
          ],
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
      id: 'l2-gift', role: 'You run the tender for the project company.', title: 'Seats behind the bench',
      make: function (g) {
        var a = g.person();
        return {
          scene: `You are running a construction tender that closes in ten days. ${a}, who owns one of the bidders, offers you two playoff tickets. "No strings."`,
          who: `${a.first}`,
          behind: `${a.first} wants the contract and knows you decide. Tickets buy warmth, a longer conversation, and perhaps a hint about the other bids. 'No strings' is the string.`,
          deep: [
            [`Why small gifts work`, `They create a sense of obligation far larger than their cost. That is why they are given.`],
            [`What a tender needs`, `Every bidder believing the result was decided on the bids. One story about hospitality can undo an award.`],
            [`What most policies say`, `Nothing from a bidder while a tender is open, and every offer logged.`]
          ],
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
    },
    {
      id: 'l2-two-boards', role: 'You are a director of two companies that are about to deal with each other.', title: 'Both sides of the table',
      make: function (g) {
        var a = g.person(), amt = g.m(3, 9, 0.5);
        return {
          scene: `You sit on the boards of a lender and of a developer. The developer now wants a ${MB.usd(amt)} loan from the lender. ${a}, the developer's chair, says: "Perfect. You can explain each side to the other."`,
          who: `${a.first}`,
          behind: `${a.first} sees a helpful go-between. Each board is owed your undivided judgment, and each wants the opposite thing on rate, security and terms. You cannot give both.`,
          deep: [
            [`The conflict`, `A higher rate is good for one company and bad for the other. Any view you give helps one at the other's expense.`],
            [`Confidential information`, `You know each side's limits. Using either set breaks your duty to the company it came from.`],
            [`The clean answer`, `Tell both boards, and take no part on either side for this transaction.`]
          ],
          options: [
            ['s', `Disclose to both boards and step out on both sides.`, `Neither company's decision is shaped by someone who owes the other the opposite.`],
            ['g', `Take part for the lender only, without telling the developer.`, `The developer's board does not know its director is across the table.`],
            ['p', `Take part on both sides to help them agree.`, `You would be negotiating with yourself, with both companies' secrets.`]
          ],
          rule: `A director of both parties to a deal belongs on neither side of it.`
        };
      }
    },
    {
      id: 'l2-expert', title: 'The expert said so',
      make: function (g) {
        var a = g.person();
        return {
          scene: `The board is about to buy a site, relying on a valuation. You notice the valuer is paid a bonus by the seller's broker if the deal closes. ${a}, the chair, says: "We are entitled to rely on experts. That is what they are for."`,
          who: `${a.first}`,
          behind: `${a.first} wants the comfort of an expert report without reopening the deal. An expert paid only if the deal closes has a reason to produce the number that closes it.`,
          deep: [
            [`Reliance`, `Directors may rely on experts, provided the reliance is reasonable and the expert was chosen with care.`],
            [`What undoes it`, `Knowing the expert is conflicted, or outside their field, or that the report makes no sense.`],
            [`The fix`, `A second valuer paid a fixed fee by the buyer.`]
          ],
          options: [
            ['s', `Raise it, and get a valuation from someone with no stake in closing.`, `Reliance on an expert protects directors only if the expert is independent.`],
            ['g', `Note it privately and vote yes.`, `You knew the report was compromised and relied on it anyway.`],
            ['p', `Say nothing. A valuation is a valuation.`, `Not when its author is paid for one answer.`]
          ],
          rule: `You may rely on an expert only if you have no reason to doubt them.`
        };
      }
    },
    {
      id: 'l2-side-business', burn: 0, role: 'You are an officer of a company that buys development sites.', title: 'The side business',
      make: function (g) {
        var c = g.city();
        return {
          scene: `On your own time you have started buying small lots in ${c}, the same market your employer buys in. You have told nobody. This week a lot comes up that either you or the company could buy.`,
          behind: `You want something of your own, and the lots are small. But you see the company's deal flow every day, and it is now impossible to show which ideas were yours.`,
          deep: [
            [`The duty`, `An officer does not compete with the company or take what it might want.`],
            [`Why disclosure works`, `The company can clear you for lots it has no interest in, and the line is drawn in advance.`],
            [`Without it`, `Every purchase you make can be challenged later as the company's opportunity.`]
          ],
          options: [
            ['s', `Disclose the side business and get written clearance on what you may buy.`, `With a line agreed in advance, you can invest without looking over your shoulder.`],
            ['g', `Keep it small and unreported.`, `Small does not cure the conflict, and silence makes it look worse.`],
            ['p', `Use what you see at work to pick your lots.`, `That is taking the company's information and its opportunities.`]
          ],
          rule: `An officer who invests in the company's own market tells the company first.`
        };
      }
    },
    {
      id: 'l2-leaving', role: 'You are an officer leaving to start your own firm.', title: 'What you take with you',
      make: function (g) {
        var a = g.person();
        return {
          scene: `You are leaving in a month to start your own firm. ${a}, your future partner, asks you to bring the investor list and the financial models. "You built those relationships and those spreadsheets."`,
          who: `${a.first}`,
          behind: `${a.first} wants a running start. You did build them, while being paid to. The list and the models belong to the company, and your duties continue until your last day and beyond.`,
          deep: [
            [`What you may take`, `Your skill, your reputation, and what is in your head.`],
            [`What you may not`, `Documents, lists and files, and the company's opportunities while you are still there.`],
            [`How it is proved`, `Downloads and forwarded emails in the final weeks are the first thing a former employer checks.`]
          ],
          options: [
            ['s', `Take nothing. Tell investors where you have gone after you leave.`, `Relationships follow people lawfully. Files do not.`],
            ['g', `Export only "your own contacts" from the company system.`, `An export from the company's system is the company's data, whoever entered it.`],
            ['p', `Copy the list and the models before giving notice.`, `That is taking confidential property, with a timestamp.`]
          ],
          rule: `You leave with what you know, not with what the company owns.`,
          ca: `Canadian courts hold senior officers to these duties for a reasonable period after they leave.`
        };
      }
    },
    {
      id: 'l2-dissent', burn: 2, title: 'The lone no',
      make: function (g) {
        var a = g.person(), amt = g.m(1, 4, 0.5);
        return {
          scene: `The board is voting to pay owners ${MB.usd(amt)}. You doubt the company can afford it. Everyone else is in favour. ${a}, the chair, asks you to make it unanimous. "A split vote worries the lender."`,
          who: `${a.first}`,
          behind: `${a.first} wants a tidy record. If the payment proves unlawful, every director who voted for it shares the liability. Your recorded no is your only protection.`,
          deep: [
            [`Why the record matters`, `Many statutes treat a director who was present as having agreed, unless their dissent is recorded.`],
            [`What a dissent is not`, `Disloyalty. Boards are meant to disagree sometimes.`],
            [`An abstention`, `It often counts as going along. Say no, and have it written down.`]
          ],
          options: [
            ['s', `Vote no and ask for your dissent to be minuted.`, `If the payment was unlawful, you are not among those who approved it.`],
            ['g', `Abstain quietly.`, `Silence in the room is often treated as consent.`],
            ['p', `Vote yes to keep the board united.`, `You approved a payment you believed the company could not afford.`]
          ],
          rule: `A director who disagrees says so, and makes sure the minutes do too.`,
          us: `In Delaware a director who is absent or dissents on the record can avoid liability for an unlawful dividend.`,
          ca: `A director present at a meeting is deemed to have consented unless the dissent is recorded or sent promptly afterward.`
        };
      }
    },
    {
      id: 'l2-oversight', title: 'No news is good news',
      make: function (g) {
        var a = g.person();
        return {
          scene: `The board handed all lending decisions to the chief executive a year ago. Since then it has received no loan reports at all. ${a}, the chair, says: "No news is good news. Let management manage."`,
          who: `${a.first}`,
          behind: `${a.first} wants short meetings and trusts the chief executive. A board may delegate decisions. It cannot delegate knowing what is happening.`,
          deep: [
            [`The duty to monitor`, `Directors must have a reasonable system for information to reach them, and must pay attention to it.`],
            [`What a system looks like`, `Regular reports on loans made, arrears, exceptions to policy, and anything unusual.`],
            [`The exposure`, `When losses surface, the question is what the board asked for, and when.`]
          ],
          options: [
            ['s', `Require regular written reports on loans, arrears and exceptions.`, `Delegation with reporting is management. Without it, it is abdication.`],
            ['g', `Ask the chief executive informally over lunch.`, `A chat is not a system, and leaves no record that the board was watching.`],
            ['p', `Leave it. The chair is right.`, `A board that asks for nothing learns of problems last.`]
          ],
          rule: `A board can delegate the work. It cannot delegate the watching.`,
          us: `Delaware directors can be liable for failing to set up any system for monitoring the company's key risks.`
        };
      }
    }
  ]
});
