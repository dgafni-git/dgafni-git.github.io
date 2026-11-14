MB.level({
  n: 12, title: 'Distress', rank: 'Independent Director', pass: 0.7, draw: { authored: 5 },
  topics: 'Insolvency, creditors, personal liability and preserving the record',
  role: 'You are a director of a company that is running out of money.',
  blurb: 'When an entity cannot pay everyone, every decision picks a loser, and personal liability becomes real.',
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
      id: 'l12-insider-first', burn: 2, title: 'Pay the parent first',
      builds: ['Duty of loyalty'],
      make: function (g) {
        var a = g.person(), cash = g.m(0.6, 1.8, 0.1), trade = g.m(0.9, 2.4, 0.1);
        return {
          scene: `The entity has ${MB.usd(cash)}. It owes ${MB.usd(trade)} to trades and more to its parent, unsecured. It cannot pay both. ${a}, the parent's finance chief, calls: "Send the cash up today."`,
          who: `${a.first}`,
          options: [
            ['s', `Refuse, preserve the cash, and get insolvency advice for the entity.`, `An insolvent entity's directors must consider all its creditors.`],
            ['g', `Split it: half to the parent, half to the trades.`, `Still a large insider payment by an insolvent company. A trustee would recover it.`],
            ['p', `Send it to the parent.`, `A preference to an insider can be clawed back for a year or more.`]
          ],
          rule: `In insolvency, insiders are paid in their proper rank, never first.`,
          us: `Payments to insiders can be recovered if made within a year before bankruptcy. For others it is 90 days.`,
          ca: `Preferences to related parties reach back twelve months before bankruptcy. For others it is three.`
        };
      }
    },
    {
      id: 'l12-undervalue', title: 'Moving the good asset',
      builds: ['Piercing the veil'],
      make: function (g) {
        var a = g.person(), val = g.m(2, 6, 0.5);
        return {
          scene: `The entity will probably lose a contractor's lawsuit. ${a}, who controls it, wants to move its ${MB.usd(val)} land parcel to a sister company at book value, "to keep it out of the litigation."`,
          who: `${a.first}`,
          options: [
            ['s', `Refuse. Any sale is at market value, with proceeds kept in the entity.`, `An entity may sell for fair value. It may not put assets beyond a creditor's reach.`],
            ['g', `Transfer it a little above book, on a management memo.`, `Still an insider transfer below market by an entity facing judgment.`],
            ['p', `Transfer it at book value before judgment.`, `A court can reverse it and pursue the people who arranged it.`]
          ],
          rule: `An entity facing claims sells only for fair value, never to defeat a creditor.`,
          us: `Fraudulent transfer law reaches back two years in bankruptcy and about four under state law.`,
          ca: `Transfers at undervalue to related parties can be challenged for up to five years before bankruptcy.`
        };
      }
    },
    {
      id: 'l12-trust', title: 'Borrowing from the tax account',
      make: function (g) {
        var a = g.person(), amt = g.pick([64000, 88000, 115000]);
        return {
          scene: `A sale in two weeks will fix the cash problem. Until then the company cannot pay both ${MB.usd(amt)} of payroll tax and its concrete supplier. ${a} suggests paying the supplier. "Two weeks. Nobody will notice."`,
          who: `${a.first}`,
          options: [
            ['s', `Remit the tax. Find the supplier's money elsewhere.`, `Withheld tax was never the company's money. It can follow directors home.`],
            ['g', `Delay the tax, with a board resolution recording the plan.`, `The resolution proves the directors knowingly used trust money.`],
            ['p', `Pay the supplier and tell no one.`, `If the sale slips, each director is personally exposed, with penalties.`]
          ],
          rule: `Money held for employees and tax authorities is not working capital.`,
          us: `Responsible persons who wilfully fail to remit payroll taxes are personally liable.`,
          ca: `Directors are personally liable for unremitted deductions and sales tax, and up to six months of wages.`
        };
      }
    },
    {
      id: 'l12-resign', title: 'Time to get off the board?',
      builds: ['Duty of care'],
      make: function (g) {
        var a = g.person();
        return {
          scene: `You are a director of an insolvent company. Management ignores your questions. ${a}, a lawyer friend, says: "Stop going to meetings. If you are not there, you approved nothing."`,
          who: `${a.first}`,
          options: [
            ['s', `Put your concerns in writing, take advice, and resign formally if nothing changes.`, `While you hold the seat you have its duties. A record and a proper exit protect you.`],
            ['g', `Stay on but stop attending.`, `An absent director is still a director, and liability keeps building.`],
            ['p', `Sign a resignation dated three months ago.`, `A false date is fraud, and the emails will show when you really left.`]
          ],
          rule: `A director is protected by doing the job on record, or by leaving properly.`,
          ca: `Some statutory liabilities continue for two years after resignation, so the date matters.`
        };
      }
    },
    {
      id: 'l12-hold', burn: 0, title: 'Cleaning up the inbox',
      make: function (g) {
        var a = g.person();
        return {
          scene: `Investors' lawyers threaten a claim over fund fees. That afternoon ${a} mentions "clearing out old email on that file." Someone asks whether the insurer needs to know yet.`,
          options: [
            ['s', `Issue a litigation hold, brief counsel, and notify the insurer today.`, `The duty to preserve began with the letter, and insurers deny late-notified claims.`],
            ['g', `Keep your own files and wait to see if a claim is filed.`, `Others' files may vanish, and waiting may breach the policy.`],
            ['p', `Say nothing about ${a.first}'s mailbox.`, `A court can assume the worst about destroyed documents. You knew.`]
          ],
          rule: `When a claim is expected: stop deletion, tell counsel, notify the insurer, same day.`
        };
      }
    },
    {
      id: 'l12-trading', title: 'One more round of deposits',
      builds: ['Limited liability'],
      make: function (g) {
        var a = g.person(), n = g.int(14, 30);
        return {
          scene: `A condo developer has run out of financing and no investor is in sight. ${a}, the sales director, has ${n} buyers ready to pay deposits this weekend. "That keeps the lights on."`,
          who: `${a.first}`,
          options: [
            ['s', `Pause sales unless deposits are protected and buyers are told. Get restructuring advice.`, `Do not take money from people who would not pay if they knew the facts.`],
            ['g', `Stop deposits but keep ordering materials on credit.`, `Suppliers are funding the rescue search without having agreed to.`],
            ['p', `Take the deposits and spend them on operations.`, `Where deposits are trust money, directors answer for that personally.`]
          ],
          rule: `An entity that cannot see how it will pay must not take on new obligations in silence.`,
          us: `State laws commonly require purchaser deposits to be held in escrow.`,
          ca: `Provincial statutes make purchaser deposits trust money, and directors are liable for a breach.`
        };
      }
    }
  ]
});
