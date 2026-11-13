MB.level({
  n: 12, title: 'Distress', rank: 'Independent Director', pass: 0.7, draw: { authored: 5 },
  topics: 'Insolvency, creditors, personal liability and preserving the record',
  blurb: 'When an entity cannot pay everyone, each decision picks a winner and a loser, and the law starts looking over the directors\' shoulders. This is where personal liability becomes real.',
  concepts: [
    ['Insolvency', 'Being unable to pay debts as they fall due, or owing more than the assets are worth. Either test can apply.'],
    ['Creditors\' interests', 'Once an entity is insolvent, its creditors are the ones with money at risk. Directors must take their interests into account, and creditors gain ways to hold directors to account.'],
    ['Preference', 'A payment that favours one creditor over the others shortly before an insolvency filing. It can be undone, with a longer look-back for insiders.'],
    ['Transfer at undervalue', 'Moving assets out of an insolvent entity for less than they are worth. Also called a fraudulent transfer. Courts can reverse it and pursue the people involved.'],
    ['Trust funds', 'Money the entity holds for others, such as payroll tax withheld from wages, sales tax collected and purchasers\' deposits. Directors can be personally liable when it goes missing.'],
    ['Indemnity and insurance', 'The entity\'s promise to cover its directors\' and officers\' legal costs, backed by an insurance policy. Policies require prompt notice of claims.'],
    ['Litigation hold', 'An instruction to preserve all documents once a dispute is reasonably expected. Destroying records after that point is treated severely.']
  ],
  scenarios: [
    {
      id: 'l12-insider-first', title: 'Pay the parent first',
      builds: ['Duty of loyalty'],
      make: function (g) {
        var spe = g.spe('Inc.'), a = g.person(), cash = g.m(0.6, 1.8, 0.1), trade = g.m(0.9, 2.4, 0.1);
        return {
          scene: `${spe} has ${MB.usd(cash)} in the bank. It owes ${MB.usd(trade)} to contractors and suppliers and a larger sum to ${g.fund}, its parent, under an unsecured intercompany note. It cannot pay both and has no prospect of new money. You are a director.\n\n${a}, the fund's chief financial officer, calls. "Send the cash up against our note today, before the trades start suing."`,
          ask: `What do you do?`,
          options: [
            ['s', `Do not make the payment. Get insolvency advice for the entity straight away, preserve the cash, and deal with creditors according to their legal priorities.`, `The entity is insolvent, and its directors must now consider all its creditors. A payment to the parent ahead of them is the transaction the law most readily reverses.`],
            ['g', `Split the cash: half to the fund, half spread across the trades.`, `It feels even-handed, but it is still a large payment to an insider by an insolvent company, decided by a director the insider appointed. A trustee would seek to recover it.`],
            ['p', `Send the cash to the fund as instructed.`, `That is a preference to an insider. It can be clawed back for a year or more, and directors who approve it can face personal claims and disqualification.`]
          ],
          rule: `In insolvency, insiders are paid last or in their proper rank, never first. Directors stop taking instructions from the shareholder and take advice for the entity.`,
          us: `Preferential payments to insiders can be recovered if made within one year before a bankruptcy filing. For other creditors the period is 90 days.`,
          ca: `Preferences to parties not at arm's length can be attacked if made within twelve months before bankruptcy. For arm's-length creditors the period is three months.`
        };
      }
    },
    {
      id: 'l12-undervalue', title: 'Moving the good asset',
      builds: ['Piercing the veil'],
      make: function (g) {
        var spe = g.spe('LLC'), a = g.person(), val = g.m(2, 6, 0.5);
        return {
          scene: `${spe} is being sued by a contractor and will probably lose. Its one valuable asset is a parcel of surplus land worth about ${MB.usd(val)}. ${a}, who controls the entity, proposes transferring the parcel to a sister company at its book value, which is a fraction of that, "to keep it out of the litigation."`,
          ask: `Can the land be moved?`,
          options: [
            ['s', `No. If the land is to be sold, it is sold at market value through a documented process, and the proceeds stay in the entity for its creditors.`, `The entity may deal with its assets for proper value. It may not move them out of a creditor's reach, and saying that this is the purpose makes it worse.`],
            ['g', `Transfer it at a price somewhat above book value, supported by a memo from management.`, `It is closer to defensible but still an insider transfer below market by an entity facing a judgment, with no independent valuation. The price difference and the timing would both be attacked.`],
            ['p', `Transfer it at book value before judgment is entered.`, `That is a transfer at undervalue made to defeat a creditor. A court can reverse it, pursue the sister company, and hold the people who arranged it personally liable.`]
          ],
          rule: `An entity facing claims may still sell assets, but only for fair value and never to put them beyond its creditors' reach. Intent to defeat a creditor turns an ordinary transfer into a reversible one.`,
          us: `Fraudulent transfer law reaches back two years under the Bankruptcy Code and generally four years under state statutes.`,
          ca: `Transfers at undervalue to related parties can be challenged for up to five years before a bankruptcy, and provincial fraudulent conveyance statutes have no fixed limit.`
        };
      }
    },
    {
      id: 'l12-trust', title: 'Borrowing from the tax account',
      make: function (g) {
        var a = g.person(), amt = g.pick([64000, 88000, 115000]), spe = g.spe('Inc.');
        return {
          scene: `${spe} is two weeks from closing a sale that will solve its cash problem. Until then it cannot cover both this month's payroll tax remittance of ${MB.usd(amt)} and the concrete supplier, who will stop deliveries if unpaid. ${a}, the controller, suggests paying the supplier and remitting the tax after the sale. "The government will not notice two weeks."`,
          ask: `You are a director. What do you decide?`,
          options: [
            ['s', `Remit the tax on time. Find the supplier's payment elsewhere: negotiate terms, ask the owners for a short advance, or accept the delay.`, `Withheld payroll tax was never the company's money. It is the one debt that can follow the directors home if the sale falls through.`],
            ['g', `Delay the remittance, with a board resolution recording the plan to pay it from the sale proceeds.`, `The resolution shows the board was thoughtful. It also proves the directors knowingly used trust money to fund operations, which is the evidence a tax authority needs.`],
            ['p', `Pay the supplier and tell no one about the tax until after the sale.`, `If the sale slips, the tax debt grows with penalties, and each director is exposed personally for a decision that was never even brought to the board.`]
          ],
          rule: `Money held for employees, tax authorities and customers is not working capital. Using it to get through a tight month is the most common way directors become personally liable.`,
          us: `Responsible persons who wilfully fail to remit withheld payroll taxes are personally liable for the full amount.`,
          ca: `Directors are personally liable for unremitted source deductions and sales tax, and for up to six months of unpaid wages, subject to a due diligence defence.`
        };
      }
    },
    {
      id: 'l12-resign', title: 'Time to get off the board?',
      builds: ['Duty of care'],
      make: function (g) {
        var spe = g.spe('Inc.'), a = g.person();
        return {
          scene: `You are an outside director of ${spe}. The company is insolvent, management has stopped sending board materials, and your questions go unanswered. ${a}, a friend who is a lawyer, says over lunch: "Just stop going to meetings. If you are not there, you did not approve anything."`,
          ask: `What do you do?`,
          options: [
            ['s', `Put your concerns and requests in writing to the board, take your own legal advice, and insist on proper information. If you cannot do the job, resign formally in writing, effective the day you deliver it.`, `While you hold the seat you have its duties. A written record of what you asked for, followed by a proper resignation if nothing changes, is how a director leaves with their position intact.`],
            ['g', `Stay on the board but stop attending, so that your name is on nothing.`, `An absent director is still a director. Liability for unpaid wages and taxes, and for failing to supervise, continues to build while you are away.`],
            ['p', `Sign a resignation letter dated three months ago.`, `A falsified date is fraud, and it fails anyway: the public record and the company's own emails will show when you actually resigned.`]
          ],
          rule: `A director's protection comes from doing the job and documenting it, or from leaving properly. Staying on the board and going quiet protects no one.`,
          ca: `Some statutory liabilities continue for two years after a director resigns, so the date and proof of resignation matter.`
        };
      }
    },
    {
      id: 'l12-hold', title: 'Cleaning up the inbox',
      make: function (g) {
        var a = g.person(), b = g.person();
        return {
          scene: `A letter arrives from lawyers for a group of investors alleging that fees were overcharged on a fund sponsored by ${g.fund}, and threatening a claim against the fund's directors and officers. That afternoon ${a}, a colleague, mentions they are "finally clearing out old email on that file." ${b}, the chief operating officer, wonders aloud whether the insurer really needs to know yet.`,
          ask: `What needs to happen today?`,
          options: [
            ['s', `Issue a written litigation hold to everyone involved, suspend automatic deletion, brief counsel, and give notice of the claim to the directors' and officers' insurer.`, `The duty to preserve records began when the letter arrived. Insurance policies are strict about prompt notice, and late notice is a common reason claims are denied.`],
            ['g', `Keep your own files safe and wait to see whether a claim is actually filed before involving the technology team or the insurer.`, `Your files survive, but others' may not, and automatic deletion keeps running. Waiting may also breach the policy's notice condition.`],
            ['p', `Say nothing. What ${a.first} deletes from their own mailbox is their affair.`, `Destroying documents after a claim is threatened can lead a court to assume the worst about what they said, and can be an offence in itself. You knew and did nothing.`]
          ],
          rule: `When a claim is reasonably expected, stop all deletion, tell counsel and notify the insurer, all in writing and all the same day.`
        };
      }
    },
    {
      id: 'l12-trading', title: 'One more round of deposits',
      builds: ['Limited liability'],
      make: function (g) {
        var spe = g.spe('Inc.'), a = g.person(), n = g.int(14, 30);
        return {
          scene: `${spe}, a condominium developer, has run out of construction financing and its lender has declined to advance more. Management knows the project cannot be finished without a new investor, and none is in sight. ${a}, the sales director, has ${n} buyers ready to sign and pay deposits this weekend. "That money keeps the lights on while we look."`,
          ask: `The board meets tonight. What does it decide?`,
          options: [
            ['s', `Pause new sales unless deposits go into a protected trust or insured account and buyers are told the project's status. Take restructuring advice now.`, `The board must not take money from people who would not hand it over if they knew the facts. Protecting deposits and being candid is both the legal position and the decent one.`],
            ['g', `Stop taking deposits but keep ordering materials on credit from suppliers, to preserve the project's value for a rescue.`, `Preserving value is a legitimate aim. But suppliers extending credit to a company that knows it cannot pay are being made to fund the search for a rescuer without having agreed to.`],
            ['p', `Take the deposits and use them for operating costs.`, `That is taking purchasers' money under a false impression and spending it. Where deposits are trust money by statute, it is also a breach of trust for which directors answer personally.`]
          ],
          rule: `An entity that cannot see how it will pay must not take on new obligations to people who do not know that. Directors who let it happen can lose the protection of limited liability.`,
          us: `State laws commonly require purchaser deposits to be held in escrow, and misuse can be both a civil and a criminal matter.`,
          ca: `Provincial condominium and construction statutes make purchaser deposits and certain project funds trust money, and directors who allow a breach of trust are personally liable.`
        };
      }
    }
  ]
});
