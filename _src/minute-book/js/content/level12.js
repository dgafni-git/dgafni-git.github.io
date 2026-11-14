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
      id: 'l12-insider-first', twist: true, burn: 2, title: 'Pay the parent first',
      builds: ['Duty of loyalty'],
      make: function (g) {
        var a = g.person(), cash = g.m(0.6, 1.8, 0.1), trade = g.m(0.9, 2.4, 0.1);
        if (g.twist) return {
          twist: `The parent held valid security registered two years earlier. It ranked first by right.`,
          scene: `The entity has ${MB.usd(cash)} from selling equipment. It owes ${MB.usd(trade)} to trades and more to its parent. The parent's loan is secured by a charge over that equipment, registered two years ago for new money. ${a}, a director, wants the trades paid first.`,
          options: [
            ['s', `Have the security checked, then pay the proceeds to the parent as secured creditor.`, `Valid security, given for real value long ago, ranks ahead by law.`],
            ['g', `Pay the trades first, out of sympathy.`, `Paying unsecured creditors with a secured creditor's collateral exposes the directors.`],
            ['p', `Pay the parent more than the equipment fetched.`, `Security covers what it covers. The excess is a preference.`]
          ],
          rule: `Being an insider does not cancel a valid security interest.`
        };
        return {
          scene: `The entity has ${MB.usd(cash)}. It owes ${MB.usd(trade)} to trades and more to its parent, unsecured. It cannot pay both. ${a}, the parent's finance chief, calls: "Send the cash up today."`,
          who: `${a.first}`,
          behind: `${a.first} wants the fund repaid before other creditors act. For an insolvent company, paying its owner ahead of the trades is the payment courts are quickest to reverse.`,
          deep: [
            [`What changes at insolvency`, `There is not enough for everyone, so every payment chooses a winner.`],
            [`Preference`, `A payment favouring one creditor shortly before a filing can be recovered. For insiders the look-back is longer, often a year.`],
            [`Director exposure`, `Those who authorize it can face personal claims.`]
          ],
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
          behind: `${a.first} wants the land out of the contractor's reach before a judgment. Book value makes the transfer look ordinary. The timing shows what it is for.`,
          deep: [
            [`The principle`, `Creditors are entitled to be paid from the debtor's assets. Moving assets out cheaply takes that away.`],
            [`What courts examine`, `The price against real value, the relationship between the parties, and the timing against the claim.`],
            [`The result`, `The transfer can be reversed and the recipient pursued.`]
          ],
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
          behind: `${a.first} wants the concrete poured and treats the tax money as a short loan. That money was taken from employees' pay to hand to the government. Directors answer for it personally.`,
          deep: [
            [`Why this money is different`, `Tax withheld from wages is held in trust for the government from the moment it is withheld.`],
            [`Personal liability`, `Directors can be assessed personally for amounts not handed over.`],
            [`The defence`, `Showing real effort to prevent the failure. Choosing not to pay defeats it.`]
          ],
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
      id: 'l12-resign', twist: true, title: 'Time to get off the board?',
      builds: ['Duty of care'],
      make: function (g) {
        var a = g.person();
        if (g.twist) return {
          twist: `You had already written, asked and taken advice for three months. It was time to go.`,
          scene: `You are a director of an insolvent company. For three months you have put your concerns in writing, asked for information and taken legal advice. Nothing has changed. ${a}, a friend, says: "Stay on. At least you can keep an eye on things."`,
          options: [
            ['s', `Resign formally in writing, giving your reasons.`, `You have done what a director can. Staying without information only adds exposure.`],
            ['g', `Stay on to keep an eye on things.`, `You cannot watch what you are not shown, and liability keeps building.`],
            ['p', `Resign with a letter dated three months ago.`, `A false date is fraud, and your own letters show when you were still there.`]
          ],
          rule: `When a director cannot do the job despite trying, the right step is to leave properly.`
        };
        return {
          scene: `You are a director of an insolvent company. Management ignores your questions. ${a}, a lawyer friend, says: "Stop going to meetings. If you are not there, you approved nothing."`,
          who: `${a.first}`,
          behind: `${a.first} means well and is wrong. Absence is no defence. Directors answer for what they should have known and prevented, whether or not they were in the room.`,
          deep: [
            [`The duty continues`, `A director is responsible for as long as they hold office, present or not.`],
            [`The record`, `Written requests for information and written objections show what you did.`],
            [`Leaving properly`, `A dated written resignation delivered to the company, and the public register updated.`]
          ],
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
          behind: `${a.first} may only be tidying up. After a claim letter, intent stops mattering. Missing documents are assumed to have been damaging, and an insurer can refuse a claim reported late.`,
          deep: [
            [`When the duty starts`, `When a lawsuit is reasonably expected. A lawyer's letter is enough.`],
            [`What to stop`, `Automatic deletion, device wipes and personal clear-outs.`],
            [`The insurance`, `Directors' policies usually cover only claims reported during the policy period. Late notice can lose the cover.`]
          ],
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
          behind: `${a.first} is paid on sales and wants the company alive. The buyers would be lending to a company that already knows it cannot finish, without being told.`,
          deep: [
            [`The problem`, `Taking money or credit from people who do not know the company cannot deliver.`],
            [`Deposits`, `Often required by law to be held in trust. Spending them is a breach of trust.`],
            [`Director exposure`, `Claims for misleading buyers, for breach of trust, and in some places for trading while insolvent.`]
          ],
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
    },
    {
      id: 'l12-rescue-loan', title: 'The rescue loan',
      make: function (g) {
        var a = g.person(), amt = g.m(0.5, 2, 0.25);
        return {
          scene: `The company is insolvent. Its parent offers ${MB.usd(amt)} of new money, secured on everything, and wants the same security to cover its old unsecured loans too. ${a}, the parent's lawyer, calls it "tidying up."`,
          who: `${a.first}`,
          behind: `New money can fairly be secured. Bundling the old loans in turns the parent from an unsecured creditor, sharing with the trades, into a secured one ahead of them, on the eve of a collapse.`,
          deep: [
            [`New money`, `Security given for fresh value is generally fine. The company received something for it.`],
            [`Old money`, `Security given for an existing debt gives the company nothing and prefers that creditor.`],
            [`The look-back`, `Security granted to a related party shortly before a filing can be set aside.`]
          ],
          options: [
            ['s', `Secure the new money only, with independent approval and advice.`, `The company gets cash, and no existing creditor is moved ahead of the rest.`],
            ['g', `Secure the new and old loans together, to keep it simple.`, `Simple for the parent. The trades just dropped behind it.`],
            ['p', `Sign security for all of it, dated last year.`, `Backdating security to defeat creditors is fraud.`]
          ],
          rule: `Security is given for new value. It is not a way to improve an old debt's place in line.`
        };
      }
    },
    {
      id: 'l12-loud-vendor', title: 'Paying the one who shouts',
      make: function (g) {
        var a = g.person(), amt = g.pick([140000, 210000, 290000]);
        return {
          scene: `The company cannot pay all its suppliers. ${a}, who supplies a key material, is owed ${MB.usd(amt)} and threatens to stop deliveries unless every old invoice is paid at once.`,
          who: `${a.first}`,
          behind: `${a.first} is using the only leverage a supplier has. Paying one creditor's old debt in full means the quiet ones get less. Those who did not shout have the same rights.`,
          deep: [
            [`Old debt and new supply`, `Paying cash for new deliveries keeps the business going and prefers nobody.`],
            [`Why paying old debt is different`, `It moves that creditor from sharing a shortfall to being paid in full.`],
            [`In a formal process`, `Courts can approve paying an essential supplier, openly, when it truly benefits everyone.`]
          ],
          options: [
            ['s', `Offer cash on delivery from now on, and treat the old debt like everyone else's.`, `The supplier is protected for the future without being preferred for the past.`],
            ['g', `Pay half the old invoices to keep deliveries coming.`, `Half a preference is still a preference.`],
            ['p', `Pay the old invoices in full.`, `One creditor paid out at the expense of all the others.`]
          ],
          rule: `In insolvency, creditors of the same rank are treated alike, however loud.`
        };
      }
    },
    {
      id: 'l12-bonus', burn: 2, title: 'Bonuses before the filing',
      make: function (g) {
        var a = g.person(), amt = g.pick([300000, 450000, 600000]);
        return {
          scene: `The company will file for court protection in two weeks. ${a}, the chief executive, proposes ${MB.usd(amt)} of "retention bonuses" for the top five managers, paid now. "We need these people."`,
          who: `${a.first}`,
          behind: `Keeping key people through a restructuring is a real need. Paying insiders just before a filing, on their own proposal, takes money from creditors by a decision the recipients made.`,
          deep: [
            [`The legitimate version`, `Modest amounts, earned by staying and by hitting milestones, approved by people who do not receive them.`],
            [`The scrutiny`, `Payments to insiders before a filing are among the first things a court or monitor examines.`],
            [`In a formal process`, `Retention plans can be approved by the court in the open, which protects everyone.`]
          ],
          options: [
            ['s', `Have independent directors design a modest plan tied to milestones.`, `The people the company needs stay, and nobody approved their own pay.`],
            ['g', `Pay smaller bonuses now, without fuss.`, `Smaller, and still insiders paying themselves on the eve of a filing.`],
            ['p', `Pay the bonuses as proposed.`, `Expect them to be clawed back, and the directors asked why.`]
          ],
          rule: `Insiders may be paid to stay, by a decision they did not make themselves.`
        };
      }
    },
    {
      id: 'l12-midnight', title: 'Out by morning',
      make: function (g) {
        var a = g.person();
        return {
          scene: `The company is months behind on rent. The lease gives the landlord a claim over equipment on the premises. ${a}, the operations head, plans to move everything out overnight. "What is not there, they cannot take."`,
          who: `${a.first}`,
          behind: `${a.first} wants to save the equipment for the business or for other creditors. Removing property to defeat a creditor with rights over it is the kind of act the law reverses.`,
          deep: [
            [`The landlord's rights`, `Leases and statutes often give a landlord a claim over goods on the premises for unpaid rent.`],
            [`What is truly not caught`, `Equipment owned by someone else, such as leased machinery, whose owner can remove it.`],
            [`The negotiated exit`, `Landlords often prefer an agreed surrender to an empty unit and a lawsuit.`]
          ],
          options: [
            ['s', `Negotiate a surrender with the landlord, and take advice on what it can claim.`, `An agreed exit usually leaves more for everyone.`],
            ['g', `Move out only the equipment you believe is leased from others.`, `Possibly right, but done on your own say-so and at night.`],
            ['p', `Clear the premises overnight.`, `Removing goods to defeat a creditor's rights can be reversed and can be an offence.`]
          ],
          rule: `A creditor's rights over property are not defeated by moving the property.`
        };
      }
    },
    {
      id: 'l12-whose-lawyer', title: 'Whose lawyer?',
      make: function (g) {
        var a = g.person();
        return {
          scene: `The board must decide whether to repay a loan from the controlling shareholder. The company's lawyer, ${a}, also acts for that shareholder, and advises that repaying is fine.`,
          who: `${a.first}`,
          behind: `${a.first} may be right. But the advice favours the lawyer's other client, on a question where the company's interests and the shareholder's are opposed. Directors who rely on it are relying on the other side's adviser.`,
          deep: [
            [`The conflict`, `The shareholder wants to be repaid. The company's creditors want it not to be. One lawyer cannot serve both.`],
            [`Why reliance fails`, `Advice protects directors only when the adviser is independent on that question.`],
            [`The cost`, `A second opinion from another firm costs little next to a claim against directors personally.`]
          ],
          options: [
            ['s', `Get independent advice for the board on this decision.`, `The board is advised by someone who owes it, and only it, a duty.`],
            ['g', `Ask ${a.first} to advise "wearing the company's hat."`, `A lawyer cannot take off a client.`],
            ['p', `Follow the advice and repay the loan.`, `The directors relied on the lawyer of the party being paid.`]
          ],
          rule: `When the company and its controlling owner want different things, the board needs its own lawyer.`
        };
      }
    },
    {
      id: 'l12-one-more-month', title: 'One more month',
      make: function (g) {
        var a = g.person(), burn = g.pick([180000, 260000, 340000]);
        return {
          scene: `The company loses ${MB.usd(burn)} a month. A sale has been "nearly agreed" for five months. ${a}, the chief executive, asks the board for one more month. There is no written offer.`,
          who: `${a.first}`,
          behind: `${a.first} believes in the sale, and stopping means losing the company. Each month of losses comes out of what creditors would otherwise recover. They are funding the wait without having agreed to.`,
          deep: [
            [`Whose money is being spent`, `Once a company cannot pay everyone, further losses reduce what creditors receive.`],
            [`What a responsible board does`, `Sets a dated milestone, such as a signed offer by a named day, with a cash forecast and advice.`],
            [`The record`, `Minutes showing why continuing was reasonable, and what would end it.`]
          ],
          options: [
            ['s', `Set a deadline for a signed offer, with a cash forecast. File if it is missed.`, `Hope gets a date, and creditors' losses get a limit.`],
            ['g', `Agree to one more month, as before.`, `A sixth month on the same assurance, with nothing to measure it by.`],
            ['p', `Continue, and stop paying taxes to stretch the cash.`, `That adds personal liability to mounting losses.`]
          ],
          rule: `A board may wait for a rescue, with a deadline and a reason it can defend.`
        };
      }
    }
  ]
});
