MB.level({
  n: 11, title: 'Deals', rank: 'Partner', pass: 0.7, draw: { authored: 5, numeric: 1 }, numerics: ['basket'],
  topics: 'Letters of intent, diligence, approvals and selling to insiders',
  blurb: 'A deal concentrates every earlier lesson into a few weeks. The process must survive being read aloud later.',
  concepts: [
    ['Letter of intent', 'A short document setting out proposed deal terms. It should say plainly which parts bind, usually confidentiality and exclusivity, and which do not.'],
    ['Due diligence', 'The buyer\'s investigation of what it is buying. What it cannot verify, it covers with representations, indemnities, price or walking away.'],
    ['Representations and warranties', 'Statements of fact the seller makes in the agreement. If one is untrue, the buyer has a claim.'],
    ['Indemnity, basket and cap', 'The seller\'s promise to cover losses from breaches, usually only above a threshold and only up to a limit.'],
    ['Fundamental change', 'A transaction so significant, such as a merger or a sale of substantially all the assets, that the owners must approve it and not only the board.'],
    ['Right of first refusal', 'A right to match a third party\'s offer before the seller can accept it. It must be honoured by formal notice or waived in writing.'],
    ['Drag-along and tag-along', 'Rights that let a majority force a minority to join a sale, or let a minority join a sale the majority has arranged, on the same terms.'],
    ['Special committee', 'A committee of independent directors given the power and advisers to negotiate a deal in which management or a controlling owner has an interest.'],
    ['Fairness opinion', 'An independent financial adviser\'s written view that the price is fair. It is evidence for the board\'s process and does not replace it.']
  ],
  scenarios: [
    {
      id: 'l11-loi', title: 'A letter of intent, or a deal?',
      builds: ['Authority to bind'],
      make: function (g) {
        var a = g.person(), amt = g.m(12, 40, 2);
        return {
          scene: `A buyer offers ${MB.usd(amt)} for a loan portfolio in a two-page letter with 60 days of exclusivity. It does not say what is binding. ${a} replies to the broker: "We have a deal."`,
          options: [
            ['s', `Have counsel mark what binds, subject to board approval, before signing.`, `Both sides know what they committed to, and the price stays negotiable.`],
            ['g', `Sign the form as drafted. It is only a letter of intent.`, `Courts decide whether a document binds by reading it, not by its title.`],
            ['p', `Let the email stand and move to closing documents.`, `"We have a deal" is the email a disappointed buyer shows a judge.`]
          ],
          rule: `A letter of intent says plainly what binds and what does not.`,
          ca: `Canadian courts also expect honest performance while negotiating under a signed letter of intent.`
        };
      }
    },
    {
      id: 'l11-rofr', title: 'The right of first refusal',
      make: function (g) {
        var a = g.person(), b = g.person(), amt = g.m(3, 9, 0.5);
        return {
          scene: `${a} is selling a partnership interest for ${MB.usd(amt)}. The other partners have 30 days to match after written notice. The buyer wants ten days. "${b.first} told me at dinner they are not interested."`,
          options: [
            ['s', `Deliver the notice, or get every partner's signed waiver.`, `The right is exercised or released the way the agreement says. A waiver takes a day.`],
            ['g', `Close in ten days and send the notice afterward.`, `If ${b.first} remembers dinner differently, the sale breached the agreement.`],
            ['p', `Close without notice.`, `A plain breach. The partners can seek to unwind the transfer.`]
          ],
          rule: `Pre-emptive rights are honoured by formal notice or released in writing.`
        };
      }
    },
    {
      id: 'l11-buyout', title: 'The chief executive wants to buy',
      builds: ['Duty of loyalty', 'Disclosure and recusal'],
      make: function (g) {
        var a = g.person(), amt = g.m(30, 90, 5);
        return {
          scene: `${a}, the chief executive, leads a group offering ${MB.usd(amt)} for the company, and offers to "run the process" using the company's usual lawyers.`,
          options: [
            ['s', `Form a committee of independent directors with its own advisers.`, `The person who knows the company best is trying to buy it cheaply.`],
            ['g', `The full board negotiates, with ${a.first} present but not voting.`, `${a.first} hears the board's position, and the lawyers work with ${a.first} daily.`],
            ['p', `Let ${a.first} run the process.`, `The buyer would be running the seller's side of the sale.`]
          ],
          rule: `When management is the buyer, the company needs negotiators who are independent in fact.`,
          us: `Delaware applies its strictest review to conflicted sales unless an independent committee or disinterested vote approves.`,
          ca: `Public company rules require a valuation and minority approval for insider bids. Private practice borrows from them.`
        };
      }
    },
    {
      id: 'l11-diligence', title: 'The locked data room',
      builds: ['Duty of care', 'Business judgment rule'],
      make: function (g) {
        var a = g.person(), amt = g.m(10, 28, 2);
        return {
          scene: `The board is asked to buy a management company for ${MB.usd(amt)}. The seller, ${a}, will not show its ten largest contracts until after signing. "They are all in good order."`,
          options: [
            ['s', `See them through counsel, or get specific promises backed by an escrow.`, `Those contracts are the business. Verify them or shift the risk back.`],
            ['g', `Sign on standard representations, with no escrow.`, `A claim on paper. Without an escrow, the buyer is trusting the assurance.`],
            ['p', `Sign "as is" to beat other bidders.`, `Full price for unseen assets, with no remedy. No process supports that.`]
          ],
          rule: `What a buyer cannot verify, it must price, protect against, or decline.`
        };
      }
    },
    {
      id: 'l11-substantially', title: 'Board approval is enough, surely',
      builds: ['Resolution'],
      make: function (g) {
        var a = g.person(), pct = g.pick([85, 90, 95]);
        return {
          scene: `The company's one property is ${pct}% of its assets. Management has a buyer. Two of eleven shareholders object. ${a}, the president, says the board can approve the sale alone.`,
          options: [
            ['s', `Get board approval, then a shareholder vote at the required level.`, `Selling nearly everything changes what shareholders own. The law gives them the vote.`],
            ['g', `Close on board approval and ratify at the annual meeting.`, `If the vote was required, the sale closed without it and can be challenged.`],
            ['p', `Close. The objectors would lose a vote anyway.`, `Skipping a required vote also takes away their right to be bought out.`]
          ],
          rule: `Some decisions belong to the owners. Check which approvals a major deal needs.`,
          us: `Delaware requires a majority of outstanding stock to approve a sale of substantially all assets.`,
          ca: `Federal and Ontario statutes require two-thirds of votes cast, and give dissenters a right to fair value.`
        };
      }
    },
    {
      id: 'l11-drag', title: 'Dragged to the majority\'s own buyer',
      builds: ['Good faith', 'Arm\'s length'],
      make: function (g) {
        var a = g.person(), b = g.person(), pct = g.pick([15, 20, 25]);
        return {
          scene: `${a} owns 70% and may drag ${b}'s ${pct}% into "a sale to a third party on the same terms." The buyer is ${a.first}'s family trust, at a price well below last year's valuation.`,
          options: [
            ['s', `Refuse. An affiliate sale needs independent valuation and ${b.first}'s agreement.`, `A family trust is not a third party. The right is being used for the wrong purpose.`],
            ['g', `Allow it with a valuation from the company's accountants.`, `Some support, but the valuers answer to ${a.first}.`],
            ['p', `Register the transfers. The agreement gives the right.`, `The board would be helping squeeze out a minority at an undervalue.`]
          ],
          rule: `Rights over other owners' interests are read for their purpose.`,
          us: `Controlling stockholders owe duties to the minority when they stand on both sides.`,
          ca: `The oppression remedy lets a court undo conduct that unfairly disregards a minority's reasonable expectations.`
        };
      }
    }
  ]
});
