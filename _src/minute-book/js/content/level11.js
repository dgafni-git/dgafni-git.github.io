MB.level({
  n: 11, title: 'Deals', rank: 'Partner', pass: 0.7, draw: { authored: 5, numeric: 1, spot: 1 }, numerics: ['basket'],
  topics: 'Letters of intent, diligence, approvals and selling to insiders',
  role: 'You are a partner advising the board on a transaction.',
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
  spots: [
    {
      id: 'l11-spot', title: 'Read the purchase agreement', role: 'You are buying the company.',
      make: function () {
        return {
          scene: `You are buying a small property manager. The seller's lawyer sends a draft. Your team is arguing about price.`,
          parts: [
            [`The price is payable in cash at closing.`, 'n', `The term everyone is looking at.`],
            [`The seller will stay for six months, unpaid, to help with the handover.`, 'y', `Free expertise during the riskiest months. Make sure it is specific and enforceable.`],
            [`The seller's promises about the business last for 12 months.`, 'n', `Protection, and fairly standard.`],
            [`The buyer may assign this agreement to an affiliate.`, 'y', `Freedom to bring in a partner or change the buying entity later, without asking again.`],
            [`Each party pays its own costs.`, 'n', `Routine.`]
          ],
          rule: `Read a draft for what it gives you as well as for what it costs you.`,
          behind: `Sellers offer transition help and flexibility to make a deal feel easy. Buyers focused on price skim past them, then pay consultants for the same help.`
        };
      }
    }
  ],
  scenarios: [
    {
      id: 'l11-loi', burn: 0, title: 'A letter of intent, or a deal?',
      builds: ['Authority to bind'],
      make: function (g) {
        var a = g.person(), amt = g.m(12, 40, 2);
        return {
          scene: `A buyer offers ${MB.usd(amt)} for a loan portfolio in a two-page letter with 60 days of exclusivity. It does not say what is binding. ${a} replies to the broker: "We have a deal."`,
          behind: `${a.first} wants the buyer locked in. The buyer's broker wants the seller locked in. A vague letter with a price and exclusivity can bind the seller more than the buyer.`,
          deep: [
            [`What usually binds`, `Confidentiality and exclusivity. Price and terms do not bind until a full agreement is signed.`],
            [`The risk of saying nothing`, `A court may find a binding deal where the letter has the key terms and no clear statement otherwise.`],
            [`Exclusivity`, `It stops you talking to other buyers. Sixty days is a real cost if this buyer then lowers its price.`]
          ],
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
      id: 'l11-rofr', twist: true, role: 'You are closing the sale for the selling partner.', title: 'The right of first refusal',
      make: function (g) {
        var a = g.person(), b = g.person(), amt = g.m(3, 9, 0.5);
        if (g.twist) return {
          twist: `Transfers to the seller's own holding company were exempt. No matching right applied.`,
          scene: `${a} is moving a partnership interest worth ${MB.usd(amt)} into ${a.first}'s wholly owned holding company. The agreement exempts such transfers from the other partners' right to match, on written notice. ${b}, another partner, insists on a 30-day offer process.`,
          options: [
            ['s', `Give the written notice the exemption requires and complete the transfer.`, `The agreement carved this out. The notice is the condition.`],
            ['g', `Run the 30-day process anyway to keep ${b.first} happy.`, `Harmless, slow, and it suggests a right exists where it does not.`],
            ['p', `Use the exemption, then sell the holding company to an outsider next week.`, `That uses the exemption to disguise the sale it was never meant to cover.`]
          ],
          rule: `An exemption applies to what it describes, and not to what it can be bent to cover.`
        };
        return {
          scene: `${a} is selling a partnership interest for ${MB.usd(amt)}. The other partners have 30 days to match after written notice. The buyer wants ten days. "${b.first} told me at dinner they are not interested."`,
          who: `The buyer`,
          behind: `${a.first} wants a fast sale and the buyer wants no rival. A formal notice gives the other partners thirty days to take the deal for themselves, which is why it is tempting to skip.`,
          deep: [
            [`What the right is`, `The other partners may buy on the same terms an outsider has offered.`],
            [`Why buyers dislike it`, `They do the work of pricing the deal and may lose it. So they push to close before the right is used.`],
            [`The clean routes`, `Wait out the period, or collect signed waivers.`]
          ],
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
      id: 'l11-buyout', burn: 2, title: 'The chief executive wants to buy',
      builds: ['Duty of loyalty', 'Disclosure and recusal'],
      make: function (g) {
        var a = g.person(), amt = g.m(30, 90, 5);
        return {
          scene: `${a}, the chief executive, leads a group offering ${MB.usd(amt)} for the company, and offers to "run the process" using the company's usual lawyers.`,
          who: `${a.first}`,
          behind: `${a.first} knows the company better than the board does and wants to buy it. Running the sale would let the buyer control the timing, the information and the competition.`,
          deep: [
            [`The information gap`, `Management knows more about the company's value than the board does.`],
            [`The fix`, `Independent directors with their own advisers, the authority to say no, and the freedom to seek other buyers.`],
            [`Often added`, `Approval by the owners who are not part of the buying group.`]
          ],
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
          who: `${a.first}`,
          behind: `${a.first} may be protecting client confidentiality, or hiding weak contracts. The board cannot tell which. That uncertainty is what the protections in a purchase agreement are for.`,
          deep: [
            [`Three responses to a risk you cannot check`, `Verify it, get protection against it, or walk away.`],
            [`What protection means`, `Specific promises about those contracts, part of the price held back, and a right to cancel.`],
            [`The board's record`, `Minutes showing the risk was seen and how it was dealt with.`]
          ],
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
      id: 'l11-substantially', twist: true, role: 'You advise the company\'s board.', title: 'Board approval is enough, surely',
      builds: ['Resolution'],
      make: function (g) {
        var a = g.person(), pct = g.pick([85, 90, 95]);
        if (g.twist) return {
          twist: `This property was a third of the assets. The board could decide alone.`,
          scene: `The company owns several properties and a lending business. Management has a buyer for one property, about 30% of its assets. Two of eleven shareholders object. ${a}, the president, says the board can approve it. A director wants a shareholder vote anyway.`,
          options: [
            ['s', `Approve it at the board, properly, and report it to shareholders.`, `Selling one asset among many is ordinary business, which is the board's job.`],
            ['g', `Call a shareholder vote anyway.`, `Not required, and the delay may cost the sale.`],
            ['p', `Close without a board resolution, since management has authority.`, `A sale this size still needs the board.`]
          ],
          rule: `Owners vote on selling the business. The board decides on selling part of it.`
        };
        return {
          scene: `The company's one property is ${pct}% of its assets. Management has a buyer. Two of eleven shareholders object. ${a}, the president, says the board can approve the sale alone.`,
          who: `${a.first}`,
          behind: `${a.first} wants to avoid a fight with two unhappy shareholders. A vote would let them object formally and, in many places, demand to be bought out at fair value.`,
          deep: [
            [`Why owners vote`, `Selling nearly everything turns their investment into something else. The law reserves that decision to them.`],
            [`The right to be bought out`, `In many places, shareholders who vote no can require the company to buy their shares at fair value.`],
            [`If the vote is skipped`, `The sale can be challenged, and the directors are exposed.`]
          ],
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
      id: 'l11-drag', role: 'You advise the company\'s board.', title: 'Dragged to the majority\'s own buyer',
      builds: ['Good faith', 'Arm\'s length'],
      make: function (g) {
        var a = g.person(), b = g.person(), pct = g.pick([15, 20, 25]);
        return {
          scene: `${a} owns 70% and may drag ${b}'s ${pct}% into "a sale to a third party on the same terms." The buyer is ${a.first}'s family trust, at a price well below last year's valuation.`,
          who: `${a.first}`,
          behind: `${a.first} wants all of the company cheaply. The drag-along was written to deliver a sale to an outsider. Used on a family trust, it buys ${b.first} out at a price ${a.first} chose.`,
          deep: [
            [`What a drag-along is for`, `Letting a majority deliver the whole company to a real buyer, so a minority cannot block a good sale.`],
            [`The built-in protection`, `The same price and terms for everyone, from an unrelated buyer.`],
            [`The abuse`, `Using it to buy out the minority yourself, at a price you set.`]
          ],
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
    },
    {
      id: 'l11-clean-team', title: 'Showing a rival your prices',
      make: function (g) {
        var a = g.person();
        return {
          scene: `A competitor wants to buy your company. Its deal team asks for your customer list with prices, "to finish our model." ${a}, your sales head, says: "If the deal dies, they have our whole pricing book."`,
          who: `The buyer`,
          behind: `The buyer wants certainty about what it is paying for. If the deal fails, a rival knows exactly how to undercut you. Competitors exchanging live prices can also break competition law.`,
          deep: [
            [`The commercial risk`, `Most deals between competitors that start do not finish. The information stays with the other side.`],
            [`The legal risk`, `Until closing, the two are still competitors. Sharing current prices can be unlawful coordination.`],
            [`The usual answer`, `A small group of outside advisers sees the detail and reports totals and ranges only.`]
          ],
          options: [
            ['s', `Share it only with outside advisers, who report in summary.`, `The buyer gets what it needs to price the deal and nothing it could use against you.`],
            ['g', `Share it with the buyer's deal team under a confidentiality agreement.`, `A promise not to misuse it does not make them forget it.`],
            ['p', `Send the full list.`, `A gift to a competitor, and possibly an offence.`]
          ],
          rule: `Until a deal closes, a competitor who wants to buy you is still a competitor.`
        };
      }
    },
    {
      id: 'l11-mac', title: 'One bad quarter',
      make: function (g) {
        var a = g.person(), amt = g.m(20, 60, 5);
        return {
          scene: `You signed to buy a company for ${MB.usd(amt)}. Before closing, it reports one weak quarter. The contract lets you walk away for a "material adverse change." ${a}, your chief executive, wants to invoke it to force a lower price.`,
          who: `${a.first}`,
          behind: `${a.first} has buyer's remorse and sees leverage. Courts set that bar very high: a lasting blow to the business, not a bad quarter. Claiming it weakly can make you the party in breach.`,
          deep: [
            [`What the clause covers`, `A serious, lasting decline in the business as a whole.`],
            [`How courts treat it`, `Buyers almost never win. Short-term dips and industry-wide problems do not count.`],
            [`The risk of bluffing`, `A buyer that refuses to close without good grounds can be ordered to close, or to pay damages.`]
          ],
          options: [
            ['s', `Assess it honestly with counsel, then close or open a candid price talk.`, `You keep your options without making a claim you cannot support.`],
            ['g', `Threaten the clause, knowing it is weak, to open a renegotiation.`, `It may work. It may also be the bad faith the seller's lawyers needed.`],
            ['p', `Refuse to close.`, `On one weak quarter, you are probably the party in breach.`]
          ],
          wider: [`Close, and ask for part of the price to be held back against next quarter's results.`, `It answers your worry directly, and a seller confident in the business can accept it.`],
          rule: `A right to walk away is used when its conditions are met, not when the price looks high.`
        };
      }
    },
    {
      id: 'l11-earnout', title: 'Running it to miss the target',
      make: function (g) {
        var a = g.person(), amt = g.m(2, 6, 0.5);
        return {
          scene: `You bought a business and owe the seller another ${MB.usd(amt)} if first-year revenue reaches a target. It is on track. ${a}, your finance chief, suggests signing this year's renewals through a sister company.`,
          who: `${a.first}`,
          behind: `${a.first} wants to save the payment by keeping revenue out of the measured business. The seller accepted a lower price up front on your promise to run it fairly.`,
          deep: [
            [`What an earn-out is`, `Part of the price, paid later if the business performs. It bridges a gap over what the business is worth.`],
            [`The buyer's control`, `After closing, the buyer runs the business and so controls whether the target is hit.`],
            [`The limit`, `Contracts and good faith stop a buyer from running the business for the purpose of defeating the payment.`]
          ],
          options: [
            ['s', `Run the business as you would anyway, and pay if the target is met.`, `That is the bargain. The seller took a lower price for it.`],
            ['g', `Hold back signing renewals until the year is over.`, `No diversion on paper, and the same intent.`],
            ['p', `Book the renewals in the sister company.`, `Moving revenue to defeat the payment is a breach, and easy to trace.`]
          ],
          wider: [`Offer the seller a smaller fixed payment now to end the earn-out.`, `The seller takes certainty. You are free to run the business as you like.`],
          rule: `If you control whether a payment falls due, you may not arrange for it not to.`
        };
      }
    },
    {
      id: 'l11-knowledge', role: 'You are an officer of the company being sold.', title: 'What the seller knew',
      make: function (g) {
        var a = g.person();
        return {
          scene: `You are selling a company. You know of an environmental notice it received last month. The contract says there are none "to the seller's knowledge," defined as what the chief executive actually knows. ${a}, the deal lead, says: "So do not tell the chief executive."`,
          who: `${a.first}`,
          behind: `${a.first} wants a clean contract and a full price. Keeping the one named person uninformed, so that a statement stays technically true, is building a false statement on purpose.`,
          deep: [
            [`What a knowledge qualifier is for`, `Protecting a seller from what it truly did not know.`],
            [`What it does not cover`, `Facts deliberately kept from the named person. Courts treat that as knowing.`],
            [`The honest route`, `List the notice as an exception. The price may move. The fraud claim disappears.`]
          ],
          options: [
            ['s', `Disclose the notice in the contract's schedule of exceptions.`, `The buyer prices it, and the seller sleeps.`],
            ['g', `Sign as drafted, relying on the definition.`, `The words may hold. A court will ask who decided the chief executive should not know.`],
            ['p', `Keep the chief executive in the dark and sign.`, `That is arranging ignorance to make a false statement.`]
          ],
          rule: `A statement limited to what you know cannot be kept true by arranging not to know.`
        };
      }
    },
    {
      id: 'l11-fairness', title: 'The adviser paid to say yes',
      make: function (g) {
        var a = g.person(), fee = g.m(1, 3, 0.5);
        return {
          scene: `The board is selling the company and has an opinion from its financial adviser that the price is fair. The adviser's ${MB.usd(fee)} fee is paid almost entirely if the sale closes. ${a}, the chair, would rather not mention the fee to shareholders.`,
          who: `${a.first}`,
          behind: `${a.first} wants the opinion to carry weight. An adviser paid only if the deal closes has every reason to find the price fair. Shareholders deciding how to vote are entitled to know that.`,
          deep: [
            [`What the opinion is for`, `Evidence that the board had expert support for the price.`],
            [`Why the fee matters`, `A success fee is a conflict. It can be managed by disclosing it, or by a second opinion for a fixed fee.`],
            [`What courts have done`, `Delayed or criticised deals where an adviser's conflicts were hidden from shareholders.`]
          ],
          options: [
            ['s', `Disclose the fee structure, and consider a second opinion for a fixed fee.`, `Shareholders can weigh the opinion knowing how it was paid for.`],
            ['g', `Rely on the opinion and leave the fee to the fine print.`, `Technically disclosed, practically hidden.`],
            ['p', `Leave the fee out of what shareholders are sent.`, `Hiding the adviser's stake in the outcome from the people voting on it.`]
          ],
          rule: `An opinion is worth what its author's independence is worth. Say how they were paid.`
        };
      }
    },
    {
      id: 'l11-lockup', title: 'Locked in',
      make: function (g) {
        var a = g.person(), amt = g.m(40, 90, 10);
        return {
          scene: `A buyer offers ${MB.usd(amt)} for the company, on two conditions: an 8% fee if the company accepts any other offer, and no right for the board to consider a better one. ${a}, the chief executive, says: "Sign before they change their mind."`,
          who: `${a.first}`,
          behind: `The buyer wants certainty and ${a.first} wants the deal. Terms this tight mean a higher bidder would have to pay the price plus the fee, so none will come. The board would be giving up its ability to get more for the owners.`,
          deep: [
            [`What these terms do`, `They make a rival bid expensive or impossible.`],
            [`What is normal`, `A fee of roughly 2% to 4%, and a right for the board to accept a clearly better offer.`],
            [`The board's duty in a sale`, `To get the best value reasonably available for the owners.`]
          ],
          options: [
            ['s', `Negotiate the fee down and keep the board's right to accept a better offer.`, `The buyer gets reasonable protection, and the owners keep a chance at more.`],
            ['g', `Accept the terms to secure the price.`, `A good price today, and no way to know whether it was the best one.`],
            ['p', `Accept, and give the buyer an option over the main property as well.`, `That makes any rival bid pointless, which is the intent.`]
          ],
          wider: [`Offer a normal fee, plus a right for the buyer to match any higher bid.`, `The buyer is protected against losing the deal, and the owners can still get a better price.`],
          rule: `A board selling a company may protect the deal, but not so tightly that no better one can appear.`,
          us: `Delaware courts strike down deal protections that prevent a board from accepting a better offer.`
        };
      }
    }
  ]
});
