MB.level({
  n: 11, title: 'Deals', rank: 'Partner', pass: 0.7, draw: { authored: 5, numeric: 1 }, numerics: ['basket'],
  topics: 'Letters of intent, diligence, approvals and selling to insiders',
  blurb: 'Buying or selling a company, a portfolio or a partner\'s interest concentrates every earlier lesson into a few weeks. The board\'s job is to make sure the process would survive being read aloud later.',
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
          scene: `${g.fund} is negotiating to sell a portfolio of loans for ${MB.usd(amt)}. The buyer's broker sends a two-page letter of intent with a 60-day exclusivity period, and none of it says whether it is binding. ${a}, the head of the sale team, wants to sign tonight to "lock them in," and replies to the broker: "We have a deal."`,
          ask: `What should happen before anything is signed?`,
          options: [
            ['s', `Have counsel mark which terms bind, normally confidentiality and exclusivity, and state that everything else is subject to a definitive agreement and board approval. Then have it signed by someone with authority.`, `Both sides know what they have committed to. The seller gets its exclusivity period without accidentally agreeing a price it cannot later negotiate around.`],
            ['g', `Sign the broker's form as drafted. It is only a letter of intent.`, `Courts decide whether a document binds by reading it, not by its title. An unqualified letter with a price and key terms can be enforced, and the exclusivity ties the seller's hands for sixty days regardless.`],
            ['p', `Leave ${a.first}'s email as the confirmation and move straight to closing documents.`, `"We have a deal," sent by a senior person with the price already settled, is the email a disappointed buyer puts in front of a judge.`]
          ],
          rule: `A letter of intent should say in plain words what binds and what does not, and should be subject to board approval. Until then, nobody announces a deal.`,
          ca: `Canadian courts have also held parties to a duty of honest performance in negotiating under a signed letter of intent, so stringing a counterparty along carries risk.`
        };
      }
    },
    {
      id: 'l11-rofr', title: 'The right of first refusal',
      make: function (g) {
        var a = g.person(), b = g.person(), amt = g.m(3, 9, 0.5);
        return {
          scene: `${a} is selling a 30% interest in a development partnership to an outside buyer for ${MB.usd(amt)}. The partnership agreement gives the other partners a right of first refusal: they must receive written notice of the offer and have 30 days to match it. The buyer wants to close in ten days.\n\n${a.first} says ${b}, the other main partner, "already told me at dinner they are not interested."`,
          ask: `How does the sale proceed?`,
          options: [
            ['s', `Deliver the formal notice with the offer attached. Close after the 30 days expire, or sooner if every partner entitled to the right signs a written waiver.`, `The right belongs to the partners and is exercised or given up in the way the agreement says. A signed waiver takes a day to obtain and makes the buyer's title secure.`],
            ['g', `Close in ten days on the strength of the dinner conversation, and send the notice afterward for the record.`, `If ${b.first} remembers the dinner differently, or another partner wanted to match, the sale breached the agreement. The buyer's interest is open to challenge and ${a.first} to a damages claim.`],
            ['p', `Close without notice. Rights nobody intends to use do not need to be offered.`, `That is a plain breach of the agreement. The other partners can seek to unwind the transfer, and the general partner should refuse to register it.`]
          ],
          rule: `Pre-emptive rights are honoured by formal notice or released by written waiver. A casual indication that someone is not interested is neither.`
        };
      }
    },
    {
      id: 'l11-buyout', title: 'The chief executive wants to buy',
      builds: ['Duty of loyalty', 'Disclosure and recusal'],
      make: function (g) {
        var a = g.person(), amt = g.m(30, 90, 5);
        return {
          scene: `${a}, chief executive of a private lending company, tells the board that a group led by ${a.first} and backed by an outside investor would like to buy the company for ${MB.usd(amt)}. ${a.first} offers to "run the process" to save the board time, using the company's usual law firm.`,
          ask: `How does the board respond?`,
          options: [
            ['s', `Form a special committee of independent directors with its own legal and financial advisers and the power to say no or seek other buyers. ${a.first} is kept out of the board's deliberations and the company's sale-side information.`, `The person who knows the company best is now trying to buy it cheaply. The committee replaces that conflicted judgment with an independent one and creates the record that the price was tested.`],
            ['g', `Let the full board negotiate with ${a.first}'s group, with ${a.first} present but not voting, advised by the company's usual counsel.`, `The abstention is something. But ${a.first} hears the board's negotiating position, and the lawyers work with ${a.first} every day. The process is not independent in fact, and a court would say so.`],
            ['p', `Accept ${a.first}'s offer to run the process.`, `The buyer would be running the seller's side of the sale. Any price that results is tainted, and the directors who allowed it have breached their duties.`]
          ],
          rule: `When management or a controlling owner is the buyer, the company needs negotiators who are independent in fact, with their own advisers and real authority, and often a vote of the owners who are not on the buying side.`,
          us: `Delaware courts apply their strictest review, entire fairness, to conflicted sales unless independent committee approval or a vote of disinterested stockholders restores deference.`,
          ca: `Securities rules for public companies require a formal valuation and minority approval for insider bids and related-party transactions, and private company practice borrows from them.`
        };
      }
    },
    {
      id: 'l11-diligence', title: 'The locked data room',
      builds: ['Duty of care', 'Business judgment rule'],
      make: function (g) {
        var a = g.person(), amt = g.m(10, 28, 2);
        return {
          scene: `The board is asked to approve buying a property management company for ${MB.usd(amt)}. The seller will not show its ten largest client contracts until after signing, citing confidentiality. ${a}, the seller's principal, offers a general assurance that "the contracts are all in good order."`,
          ask: `What does the board do?`,
          options: [
            ['s', `Insist on seeing the contracts under a confidentiality agreement or through outside counsel only. Failing that, require specific representations, an escrow of part of the price, and a right to walk away. Minute the reasoning.`, `Those contracts are the business. The board either verifies them or shifts the risk back to the seller in a way that can actually be collected.`],
            ['g', `Sign on the general assurance, with standard representations and no escrow.`, `The representations give a claim on paper. Without an escrow or a creditworthy seller behind them, the buyer is trusting the assurance and nothing more.`],
            ['p', `Sign an "as is" agreement to win the deal ahead of other bidders.`, `The board has agreed to pay full price for assets it has not seen and given up any remedy. No process supports that decision, so the business judgment rule will not protect it.`]
          ],
          rule: `What a buyer cannot verify, it must price, protect against, or decline. A board approving an acquisition should be able to say which of the three it did for each significant risk.`
        };
      }
    },
    {
      id: 'l11-substantially', title: 'Board approval is enough, surely',
      builds: ['Resolution'],
      make: function (g) {
        var spe = g.spe('Inc.'), a = g.person(), pct = g.pick([85, 90, 95]);
        return {
          scene: `${spe} owns one large property that accounts for ${pct}% of its assets and all of its income. Management has negotiated a sale. The company has eleven shareholders, two of whom oppose selling. ${a}, the president, says the board can approve the sale by itself. "We sell assets all the time."`,
          ask: `What approval does the sale need?`,
          options: [
            ['s', `Board approval and then a shareholder vote at the level the statute and articles require, with proper notice and disclosure, and any dissent rights explained.`, `Selling substantially all of a company's assets changes what the shareholders own. The law gives them the vote, and in many places gives those who oppose it a right to be bought out.`],
            ['g', `Close on board approval now and ask the shareholders to ratify at the annual meeting.`, `If the vote was required, the sale closed without it. The two opposing shareholders can challenge it, and the buyer's lawyers should not have accepted the board resolution alone.`],
            ['p', `Close on board approval. The opposing shareholders are a minority and would lose a vote anyway.`, `Whether they would lose is not the test. Skipping a required vote makes the transaction open to attack and takes away dissent rights those shareholders were entitled to use.`]
          ],
          rule: `Some decisions belong to the owners. Before a major transaction, check the statute and the governing documents for which approvals are needed, at what threshold, and with what rights for those who vote against.`,
          us: `Delaware requires approval by holders of a majority of the outstanding stock for a sale of all or substantially all the assets.`,
          ca: `Federal and Ontario statutes require a special resolution, two-thirds of the votes cast, for a sale outside the ordinary course of substantially all the property, and give dissenting shareholders a right to fair value.`
        };
      }
    },
    {
      id: 'l11-drag', title: 'Dragged to the majority\'s own buyer',
      builds: ['Good faith', 'Arm\'s length'],
      make: function (g) {
        var a = g.person(), b = g.person(), pct = g.pick([15, 20, 25]);
        return {
          scene: `${a} owns 70% of a development company, and ${b} owns ${pct}%. The shareholders' agreement lets the majority drag the minority into "a sale of all the shares to a third party on the same terms." ${a.first} now gives notice of a drag-along sale. The buyer is a company owned by ${a.first}'s family trust, and the price is well below last year's valuation.`,
          ask: `You advise the company's board. Is the drag-along valid?`,
          options: [
            ['s', `Not as it stands. A buyer controlled by the majority's family is not a third party in any real sense. Tell ${a.first} that a sale to an affiliate needs independent valuation and the minority's agreement, or a genuine outside buyer.`, `Drag-along rights exist to deliver a real market sale to a real buyer. Used to move the minority's shares to the majority's affiliate at a low price, the right is being used for a purpose it was never given for.`],
            ['g', `Let it proceed provided ${a.first} obtains a valuation from the company's own accountants.`, `Some price support is better than none. It still treats an affiliate as a third party, and the valuation comes from advisers who answer to ${a.first}.`],
            ['p', `Register the transfers. The agreement gives the majority the right and the board should not interfere.`, `The board would be helping a controlling shareholder squeeze out the minority at an undervalue. That is the conduct courts grant relief against.`]
          ],
          rule: `Contractual rights over other owners' interests are read for their purpose. A majority that uses them to deal with itself has to show independent pricing and fair treatment.`,
          us: `Controlling stockholders owe fiduciary duties to the minority when they stand on both sides of a transaction.`,
          ca: `The oppression remedy lets a court set aside or adjust conduct that unfairly disregards a minority shareholder's reasonable expectations.`
        };
      }
    }
  ]
});
