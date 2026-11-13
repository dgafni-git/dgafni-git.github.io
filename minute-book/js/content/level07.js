MB.level({
  n: 7, title: 'Contracts and Related Parties', rank: 'Managing Director', pass: 0.7, draw: { authored: 5 },
  topics: 'Assignments, releases, insiders as vendors and deals with yourself',
  blurb: 'Contracts change hands, people change roles, and insiders end up on both sides of a deal. None of that is improper if it is written down and approved by someone with nothing to gain. Most of it becomes improper when it is not.',
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
        var lp = g.spe('LP'), a = g.person(), b = g.person(), fee = g.pick([18000, 24000, 32000]);
        return {
          scene: `${lp} has a leasing and property management contract with a firm owned by ${a}. Six months ago ${a.first} retired and ${b}'s company took over the work. Invoices of ${MB.usd(fee)} a month now arrive on ${b.first}'s letterhead and are being paid. No assignment was signed, and the contract says it may not be assigned without the partnership's written consent.`,
          ask: `You have just noticed. What do you do?`,
          options: [
            ['s', `Paper it: an assignment and assumption or a new contract, approved for the partnership by whoever has authority, confirming the terms and what happens to the old manager's obligations.`, `Until that exists, the partnership is paying a stranger to the contract and cannot be sure it can enforce the insurance, indemnity or performance terms against anyone.`],
            ['g', `Email ${b.first} to confirm "same terms as before" and file the reply.`, `An email shows a shared understanding, which is better than nothing. It does not show the partnership consented through the right people, or that ${b.first}'s company took on the old contract's obligations.`],
            ['p', `Leave it. The work is being done and the price has not changed.`, `Things are fine until there is a claim, a fee dispute or a termination. Then nobody can say what the contract is or who is party to it.`]
          ],
          rule: `A contract does not follow the work to a new provider. Someone must assign it, the other side must consent if the contract requires it, and the new party must agree to be bound. All three belong in writing.`
        };
      }
    },
    {
      id: 'l7-release', title: 'The fee that was never released',
      make: function (g) {
        var spe = g.spe('LLC'), a = g.person(), fee = g.m(0.25, 0.9, 0.05);
        return {
          scene: `${spe} ended its asset management agreement with ${a}'s firm two years early. The agreement promised a termination fee of ${MB.usd(fee)} in that case. ${a.first} left on good terms after selling a small ownership stake to one of the members, and no one mentioned the fee. Nothing was signed about it.\n\nThe entity is now preparing its accounts for a refinancing.`,
          ask: `How should the fee be treated?`,
          options: [
            ['s', `Raise it with ${a.first} now and document the outcome: a signed release if it was waived as part of the exit, or payment terms if it was not. Until then, disclose it as a possible liability.`, `An unreleased contractual right stays alive. The lender, the auditors and the other members are entitled to know whether the entity owes this money.`],
            ['g', `Assume the private sale of the stake settled everything, and put a note in the file saying so.`, `It may well have been the understanding. But the sale was between ${a.first} and one member, the fee is owed by the entity, and an assumption in a file binds nobody.`],
            ['p', `Leave it out of the accounts. If ${a.first} has not asked in this long, the claim is dead.`, `Limitation periods run for years. Certifying accounts to a lender while knowingly omitting a possible liability is a misrepresentation.`]
          ],
          rule: `When a relationship ends, close it in writing: what was paid, what was waived, and a release of the rest. Friendly exits are when this is easiest to get and most often skipped.`
        };
      }
    },
    {
      id: 'l7-officer-vendor', title: 'Officer on Monday, vendor on Tuesday',
      builds: ['Conflict of interest', 'Disclosure and recusal'],
      make: function (g) {
        var lp = g.spe('LP'), a = g.person(), amt = g.m(0.6, 2.2, 0.1);
        return {
          scene: `${a} is an officer of the general partner of ${lp}. ${a.first} also owns a construction management firm, which is the obvious candidate for a ${MB.usd(amt)} contract to oversee the project's next phase. The firm is capable and already knows the site.`,
          ask: `How can the partnership hire the firm properly?`,
          options: [
            ['s', `${a.first} discloses the interest in writing and stays out of the decision. People with no stake compare the proposal with independent quotes, negotiate a written contract, and get any approval the partnership agreement requires for affiliate deals.`, `The partnership can still hire the best firm. It does so on terms tested against the market, approved by people who do not profit, with a record to prove it.`],
            ['g', `${a.first} abstains from the formal vote but negotiates the fee and scope with the project team beforehand.`, `The abstention is real but late. The terms were set by the person who benefits from them, and the vote merely blessed the result.`],
            ['p', `Award it without ceremony. Everyone already knows ${a.first} owns the firm.`, `General awareness is not disclosure, and nobody tested the price. If investors later challenge the fees, the general partner must prove fairness with no evidence.`]
          ],
          rule: `An insider can be a vendor. The conditions are full disclosure, no part in the decision, market-tested terms, a written contract and approval by people with nothing to gain.`
        };
      }
    },
    {
      id: 'l7-anti-assign', title: 'Assigning the purchase agreement',
      make: function (g) {
        var a = g.person(), amt = g.m(5, 16, 1), c = g.city();
        return {
          scene: `A development company has a contract to buy a site in ${c} for ${MB.usd(amt)}. It now wants a new joint venture entity to take title at closing. The contract says the buyer may not assign it without the seller's written consent.\n\n${a}, the deal lawyer's client contact, suggests selling the shares of the development company to the joint venture instead. "Then nothing is assigned."`,
          ask: `What is the right way to get the site into the joint venture?`,
          options: [
            ['s', `Ask the seller for written consent to the assignment, well before closing.`, `It is what the contract calls for. Sellers usually agree when asked early and given a reason, and the consent removes any doubt about title.`],
            ['g', `Sell the shares of the buyer to the joint venture without checking whether the contract treats a change of control as an assignment.`, `It can work, and sometimes it is the right structure. But many contracts restrict changes of control for this very reason, and the joint venture would also inherit everything else the company owes.`],
            ['p', `Assign it at closing and assume the seller will not object once the money arrives.`, `That is a breach the seller can use to refuse to close or to renegotiate, at the moment the buyer has the least leverage.`]
          ],
          rule: `Read the assignment and change-of-control clauses before restructuring who holds a contract. If consent is needed, ask for it early and get it in writing.`
        };
      }
    },
    {
      id: 'l7-nominee', title: 'Holding it for someone else',
      builds: ['Registers'],
      make: function (g) {
        var lp = g.spe('LP'), a = g.person(), b = g.person();
        return {
          scene: `${a} is registered as holding a 6% interest in ${lp}. Over coffee, ${a.first} tells you that half of it is really held for ${b}, a consultant the partnership pays, under a private understanding that was never written down. The partnership agreement requires consent to any transfer of an interest "or of any beneficial interest in it."`,
          ask: `You are an officer of the general partner. What do you do with what you heard?`,
          options: [
            ['s', `Tell ${a.first} it must be disclosed to the general partner, documented, and put through the agreement's consent process. Treat ${b.first} as a related party in the meantime.`, `The partnership is paying a consultant who secretly shares in its profits. The agreement requires consent, and the people approving ${b.first}'s fees need to know.`],
            ['g', `Make a private note of it and suggest the two of them keep it between themselves.`, `You now know of an undisclosed related-party interest and have chosen not to act. If it surfaces, you knew, and your note proves it.`],
            ['p', `Forget it. What partners do with their own interests is their business.`, `Not under this agreement, and not when the hidden owner is someone the partnership pays. Turning away from it is a failure of your own duty.`]
          ],
          rule: `Who really owns an interest matters to conflicts, to consent rights and increasingly to the law. Hidden ownership by someone the entity does business with is a related-party problem the moment it exists.`,
          us: `The federal beneficial ownership reporting regime has been narrowed mainly to foreign companies, but lenders, title insurers and banks still ask for the same information at closing.`,
          ca: `Federal and most provincial corporations must keep a register of individuals with significant control, and several provinces have land ownership transparency rules.`
        };
      }
    },
    {
      id: 'l7-benchmark', title: 'A market survey from the bidder',
      make: function (g) {
        var a = g.person(), pct = g.pick(['4.5%', '5%', '5.5%']), spe = g.spe();
        return {
          scene: `${spe} needs a development manager for its next phase. A firm affiliated with one of its directors proposes a fee of ${pct} of hard costs and attaches its own survey showing that this is "at or below market." ${a}, the chair, wants to approve it at today's meeting because the season is short.`,
          ask: `What should the board do?`,
          options: [
            ['s', `Get two independent proposals or a cost consultant's opinion within the week, then decide without the affiliated director, and minute the comparison.`, `A week buys evidence of market terms from someone with no interest in the answer. That evidence is what protects the directors who vote.`],
            ['g', `Approve today on the strength of the firm's survey, with the affiliated director abstaining.`, `The abstention helps. But the only price evidence came from the party being paid, so the directors cannot show they tested it.`],
            ['p', `Approve today with all directors voting, since the fee is plainly reasonable.`, `A conflicted director voted and nothing was independently checked. If the fee is challenged, the board must prove fairness after the fact.`]
          ],
          rule: `Arm's-length terms are proven with evidence from outside the relationship: competing bids, an independent consultant, published benchmarks. The related party's own assurance is not evidence.`
        };
      }
    }
  ]
});
