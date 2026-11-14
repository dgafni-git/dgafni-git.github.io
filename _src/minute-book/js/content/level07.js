MB.level({
  n: 7, title: 'Contracts and Related Parties', rank: 'Managing Director', pass: 0.7, draw: { authored: 5 },
  topics: 'Assignments, releases, insiders as vendors and deals with yourself',
  role: 'You are a managing director at the general partner, signing off on its contracts.',
  blurb: 'Insiders end up on both sides of a deal. That is fine when it is written down and approved by someone else.',
  concepts: [
    ['Assignment', 'The transfer of a party\'s rights under a contract to someone else. Many contracts forbid it without the other side\'s consent, and it does not by itself release the original party.'],
    ['Novation', 'A three-way agreement that replaces one party to a contract with another and releases the one leaving. It needs everyone\'s signature.'],
    ['Release', 'A written statement that a party gives up specified claims. Without one, an unpaid entitlement stays alive when a relationship ends.'],
    ['Termination fee', 'A payment a contract promises one side if the other ends it early. It remains a liability until it is paid, waived or released in writing.'],
    ['Related-party transaction', 'Any dealing between the entity and an insider, an insider\'s family, or a company an insider owns. It needs disclosure, independent pricing and disinterested approval.'],
    ['Arm\'s length', 'The terms unrelated parties would agree to, each looking after its own interest. The benchmark for any related-party deal.'],
    ['Beneficial ownership', 'The real economic ownership of an interest, whoever\'s name is on the register. Arrangements where one person holds for another must be disclosed where the agreement or the law requires.'],
    ['Change of control', 'A clause triggered when ownership of a contracting party changes hands, often treated the same as an assignment.']
  ],
  scenarios: [
    {
      id: 'l7-successor', title: 'The contract that moved by itself',
      builds: ['Authority to bind'],
      make: function (g) {
        var a = g.person(), b = g.person(), fee = g.pick([18000, 24000, 32000]);
        return {
          scene: `${a}'s firm managed the properties until ${a.first} retired. ${b}'s company took over, and its ${MB.usd(fee)} monthly invoices are being paid. No assignment was signed, and the contract forbids one without consent.`,
          who: `${b.first}`,
          options: [
            ['s', `Sign an assignment or a new contract, approved by whoever has authority.`, `Until then the partnership is paying a stranger and may be unable to enforce anything.`],
            ['g', `Email ${b.first} to confirm "same terms as before."`, `It shows an understanding. It does not show consent or that anyone took on the obligations.`],
            ['p', `Leave it. The work is being done.`, `Fine until there is a claim. Then nobody can say who is party to what.`]
          ],
          deal: {
            setup: `${b.first}, the new manager, is relieved to get a real contract and asks what terms you want. The work has been good.`,
            asks: [
              ['m', `Ask for a 30-day termination right and proof of insurance.`, `Standard protections ${b.first} will happily give.`],
              ['r', `Ask for a 10% lower fee in return for a three-year term.`, `A fair trade of price for certainty. ${b.first} may not need the certainty.`],
              ['x', `Demand a refund of six months of fees, since no contract covered them.`, `The work was done and accepted. Using your own paperwork gap as a weapon is bad faith.`],
              ['n', `Paper the existing terms as they are.`, `Clean, and nothing more.`]
            ],
            rule: `A gap in the paper is a chance to improve terms going forward, not to claw back the past.`
          },
          rule: `A contract does not follow the work. Assign it, get consent, and have the new party sign.`
        };
      }
    },
    {
      id: 'l7-release', burn: 0, title: 'The fee that was never released',
      make: function (g) {
        var a = g.person(), fee = g.m(0.25, 0.9, 0.05);
        return {
          scene: `The entity ended ${a}'s management contract early, which triggers a ${MB.usd(fee)} termination fee. ${a.first} left on good terms, never asked for it, and nothing was signed. Accounts are now being prepared for a lender, who will ask what the entity owes.`,
          options: [
            ['s', `Get a signed release or agree payment, and disclose it until then.`, `An unreleased right stays alive. The lender is entitled to know.`],
            ['g', `Assume the friendly exit settled it, and note the file.`, `Probably the understanding. An assumption in a file binds nobody.`],
            ['p', `Leave it out. No claim in this long means no claim.`, `Limitation periods run for years, and omitting a known liability misleads the lender.`]
          ],
          deal: {
            setup: `You call ${a.first}, the former manager, who had forgotten the fee. "Honestly? I would rather settle it than argue. What did you have in mind?"`,
            asks: [
              ['m', `Offer 80% now for a full release.`, `A quick, fair discount for certainty on both sides.`],
              ['r', `Offer half, pointing to the friendly early exit.`, `Aggressive but honest. ${a.first} knows what the contract says.`],
              ['x', `Say the fee lapsed when ${a.first} left without claiming it.`, `Asserting a waiver you know is not there is a misrepresentation.`],
              ['n', `Pay it in full against a release.`, `The contract honoured to the dollar. ${a.first} tells people.`]
            ],
            rule: `Settle a real debt for less by offering speed and certainty, never by misstating the contract.`
          },
          rule: `When a relationship ends, close it in writing: what was paid, what was waived, a release.`
        };
      }
    },
    {
      id: 'l7-officer-vendor', title: 'Officer on Monday, vendor on Tuesday',
      builds: ['Conflict of interest', 'Disclosure and recusal'],
      make: function (g) {
        var a = g.person(), amt = g.m(0.6, 2.2, 0.1);
        return {
          scene: `${a} is an officer of the general partner and owns a construction management firm. The firm is the obvious choice for a ${MB.usd(amt)} contract on the next phase.`,
          who: `${a.first}`,
          options: [
            ['s', `${a.first} discloses and steps out. Others compare independent quotes and approve.`, `The best firm can still win, on tested terms, approved by people who do not profit.`],
            ['g', `${a.first} negotiates the terms, then abstains from the vote.`, `The terms were set by the person who benefits. The vote only blessed them.`],
            ['p', `Award it. Everyone knows ${a.first} owns the firm.`, `General awareness is not disclosure, and nobody tested the price.`]
          ],
          deal: {
            setup: `The independent quotes are in. ${a.first}'s firm is the best qualified and not the cheapest. The disinterested directors ask how to handle it.`,
            asks: [
              ['m', `Have them ask the firm to match the lowest quote.`, `The quotes did their job. The price is now a market price.`],
              ['r', `Have them ask for 10% below the lowest quote, with part of the fee tied to schedule.`, `Hard bargaining with an insider, done by the right people. The firm may walk.`],
              ['x', `Show the firm its rivals' bids so it can undercut them.`, `Leaking sealed bids to a favoured bidder corrupts the tender you just ran.`],
              ['n', `Award it at the firm's quoted price.`, `Defensible if the directors record why quality justified the premium.`]
            ],
            rule: `Use the market to price an insider. Do not hand the insider the market's secrets.`
          },
          rule: `An insider can be a vendor, with disclosure, no role in the decision, and market-tested terms.`
        };
      }
    },
    {
      id: 'l7-anti-assign', role: 'You advise the company buying the site.', title: 'Assigning the purchase agreement',
      make: function (g) {
        var a = g.person(), amt = g.m(5, 16, 1);
        return {
          scene: `A company has a contract to buy a ${MB.usd(amt)} site and wants a new joint venture to take title. The contract bars assignment without consent. ${a} suggests selling the company's shares instead.`,
          who: `${a.first}`,
          options: [
            ['s', `Ask the seller for written consent well before closing.`, `It is what the contract calls for, and sellers usually agree when asked early.`],
            ['g', `Sell the shares without checking the change-of-control clause.`, `It can work, but many contracts treat a change of control as an assignment.`],
            ['p', `Assign at closing and hope the seller takes the money.`, `A breach the seller can use to refuse or renegotiate at the worst moment.`]
          ],
          rule: `Read the assignment and change-of-control clauses before changing who holds a contract.`
        };
      }
    },
    {
      id: 'l7-nominee', title: 'Holding it for someone else',
      builds: ['Registers'],
      make: function (g) {
        var a = g.person(), b = g.person();
        return {
          scene: `${a} mentions that half of their partnership interest is really held for ${b}, a consultant the partnership pays. Nothing is written. The agreement requires consent to transfers of any beneficial interest.`,
          who: `${a.first}`,
          options: [
            ['s', `Insist it is disclosed, documented and put through consent.`, `The partnership is paying someone who secretly shares its profits.`],
            ['g', `Note it privately and suggest they keep it to themselves.`, `You now know of a hidden related-party interest, and your note proves it.`],
            ['p', `Forget it. Partners' interests are their own business.`, `Not under this agreement, and not when the hidden owner is a paid vendor.`]
          ],
          deal: {
            none: true,
            setup: `Before the disclosure goes in, ${b.first}, the consultant with the hidden stake, takes you aside. "It is a good interest. I could let you in on a piece. No need to make this formal."`,
            asks: [
              ['x', `Accept a piece and let the disclosure drop.`, `That is taking a benefit to conceal a related-party interest.`],
              ['t', `Decline, but ask for first refusal if ${b.first} ever sells.`, `You are an officer bargaining for yourself in the middle of a disclosure.`],
              ['n', `Decline and proceed with the disclosure.`, `There was never a deal here, only an offer to share the problem.`]
            ],
            rule: `An offer made to keep you quiet is not an opening. It is the next thing to report.`
          },
          rule: `Hidden ownership by someone the entity pays is a related-party problem from the day it exists.`,
          us: `Federal ownership reporting has been narrowed, but lenders, title insurers and banks still ask at closing.`,
          ca: `Federal and most provincial corporations must keep a register of individuals with significant control.`
        };
      }
    },
    {
      id: 'l7-benchmark', role: 'You are a director with no connection to the firm being hired.', title: 'A market survey from the bidder',
      make: function (g) {
        var a = g.person(), pct = g.pick(['4.5%', '5%', '5.5%']);
        return {
          scene: `A firm tied to one director proposes a development fee of ${pct} of hard costs, with its own survey calling that "below market." ${a}, the chair, wants to approve it today.`,
          who: `${a.first}`,
          options: [
            ['s', `Get two independent proposals this week, then decide without that director.`, `A week buys price evidence from someone with no interest in the answer.`],
            ['g', `Approve today on the firm's survey, with the director abstaining.`, `The only price evidence came from the party being paid.`],
            ['p', `Approve today with all directors voting.`, `A conflicted director voted and nothing was checked.`]
          ],
          rule: `Arm's-length terms are proven with outside evidence, never the related party's assurance.`
        };
      }
    }
  ]
});
