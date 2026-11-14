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
          behind: `Nobody wanted anything improper. One manager retired, another carried on, and paying the invoices was easier than raising it. The gap matters only when something goes wrong, which is when it matters most.`,
          deep: [
            [`What an assignment does`, `It moves a contract's rights to someone new. The obligations move only if the new party takes them on, and the old party is released only if you agree.`],
            [`What is at risk without it`, `Insurance requirements, indemnities, service standards and the notice clause all sit in a contract the new firm never signed.`],
            [`The cheap fix`, `A one-page assignment and assumption, signed by both firms and approved by the partnership.`]
          ],
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
      id: 'l7-release', twist: true, burn: 0, title: 'The fee that was never released',
      make: function (g) {
        var a = g.person(), fee = g.m(0.25, 0.9, 0.05);
        if (g.twist) return {
          twist: `A release had been signed at the exit. Nothing was owed.`,
          scene: `The entity ended ${a}'s management contract early, which would trigger a ${MB.usd(fee)} termination fee. The exit agreement both sides signed includes a full mutual release. Accounts are being prepared for a lender. A colleague suggests paying ${a.first} something anyway, "to be safe."`,
          options: [
            ['s', `Rely on the release, and put it in the lender's file.`, `The claim was given up in writing. The paper answers the lender's question.`],
            ['g', `Pay ${a.first} something anyway.`, `Giving away the entity's money for a claim that no longer exists needs the owners' agreement.`],
            ['p', `Leave the exit agreement out of the lender's file to avoid questions.`, `Withholding the document that answers the question creates the doubt.`]
          ],
          rule: `A signed release ends the matter. Keep it where it can be found.`
        };
        return {
          scene: `The entity ended ${a}'s management contract early, which triggers a ${MB.usd(fee)} termination fee. ${a.first} left on good terms, never asked for it, and nothing was signed. Accounts are now being prepared for a lender, who will ask what the entity owes.`,
          behind: `${a.first} may simply have forgotten. The exposure is with the lender. It will lend against accounts that say nothing is owed, while a signed contract says a fee is.`,
          deep: [
            [`Silence does not end a claim`, `A contractual right lasts until it is paid, waived in writing, or the limitation period runs out, which usually takes years.`],
            [`Why the lender cares`, `It lends against what the entity owns less what it owes. A fee that surfaces later changes the numbers it relied on.`],
            [`Who signs`, `Officers usually certify the accounts to the lender. A known liability left out makes that certificate untrue.`]
          ],
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
          behind: `${a.first} wants the contract and may deserve it. The problem is standing on both sides: helping decide who is hired while owning the firm that gets paid.`,
          deep: [
            [`Two hats`, `As an officer, the person owes the partnership the best deal. As the vendor's owner, the person wants the highest fee. Nobody can negotiate against themselves.`],
            [`What fixes it`, `Written disclosure, stepping out of the decision, competing quotes, and approval by people with no stake.`],
            [`Why bother if the firm is good`, `Because then the partnership can prove it. Without the process, a fair fee and an inflated one look identical.`]
          ],
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
      id: 'l7-anti-assign', twist: true, role: 'You advise the company buying the site.', title: 'Assigning the purchase agreement',
      make: function (g) {
        var a = g.person(), amt = g.m(5, 16, 1);
        if (g.twist) return {
          burn: 0,
          twist: `The contract allowed a transfer to a controlled affiliate. No consent was needed.`,
          scene: `A company has a contract to buy a ${MB.usd(amt)} site and wants a new joint venture, which it controls with 80%, to take title. The contract allows assignment to an affiliate the buyer controls, on written notice to the seller.`,
          options: [
            ['s', `Assign it to the joint venture and give the seller written notice.`, `The contract permits it. The notice is the only condition.`],
            ['g', `Ask the seller's consent anyway.`, `Polite, and it invites the seller to ask a price for something you already have.`],
            ['p', `Assign it and skip the notice.`, `The right came with one condition, and it was left undone.`]
          ],
          rule: `Read what the contract already allows before asking permission for it.`
        };
        return {
          scene: `A company has a contract to buy a ${MB.usd(amt)} site and wants a new joint venture to take title. The contract bars assignment without consent. ${a} suggests selling the company's shares instead.`,
          who: `${a.first}`,
          behind: `${a.first} wants to avoid asking the seller, who might want something in return. Selling the company instead keeps the same buyer on paper while changing who really owns it.`,
          deep: [
            [`Why sellers restrict assignment`, `They chose a buyer they believed could close. A different buyer is a different risk.`],
            [`The share-sale workaround`, `The party to the contract stays the same while its owner changes. Many contracts treat that as an assignment for exactly this reason.`],
            [`The hidden cost`, `Buying a company means taking on its debts and its history, not only its contract.`]
          ],
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
          behind: `${b.first} is paid as a consultant and shares the profit as a secret owner. While it is hidden, the people approving ${b.first}'s fees do not know they are paying one of the partners.`,
          deep: [
            [`What a nominee is`, `One person holds an interest in their own name for someone else. It is lawful when disclosed.`],
            [`Why it matters here`, `The consultant's fees are approved by people who think they are dealing with an outsider. In truth one of the owners is setting their own pay.`],
            [`Who else asks`, `Lenders, tax authorities and regulators increasingly require the real owners to be named. A false answer is a problem of its own.`]
          ],
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
          behind: `${a.first} wants to use the building season, and the firm wants the job without competition. A survey written by the bidder answers the price question in the bidder's favour.`,
          deep: [
            [`What one point is worth`, `On $30 million of hard costs, the gap between a 4% fee and a 5% fee is $300,000.`],
            [`Why the bidder's survey fails`, `It chooses its own comparisons. Pick large, complex projects and any fee looks low.`],
            [`What a week buys`, `Two outside quotes turn a belief that the fee was fair into evidence, which is what protects the directors who vote.`]
          ],
          options: [
            ['s', `Get two independent proposals this week, then decide without that director.`, `A week buys price evidence from someone with no interest in the answer.`],
            ['g', `Approve today on the firm's survey, with the director abstaining.`, `The only price evidence came from the party being paid.`],
            ['p', `Approve today with all directors voting.`, `A conflicted director voted and nothing was checked.`]
          ],
          rule: `Arm's-length terms are proven with outside evidence, never the related party's assurance.`
        };
      }
    },
    {
      id: 'l7-renewal', title: 'The renewal date',
      make: function (g) {
        var a = g.person(), days = g.pick([8, 10, 12]);
        return {
          scene: `A maintenance contract renews for three more years unless written notice goes to the vendor's head office 90 days before expiry. That deadline is in ${days} days. The vendor has been poor. Its rep, ${a}, says: "No need for letters. Just tell me."`,
          who: `${a.first}`,
          behind: `${a.first} would like the deadline to pass. If notice is not given the way the contract says, the contract renews, and three more years of fees are locked in whatever was said on the phone.`,
          deep: [
            [`Why vendors like auto-renewal`, `Customers forget dates. A missed deadline locks in years of revenue with no sales effort.`],
            [`Why form matters`, `Courts generally enforce notice clauses as written. A phone call, or an email to the wrong person, may not count.`],
            [`The habit that prevents it`, `A contract register listing every renewal and notice date, checked monthly.`]
          ],
          options: [
            ['s', `Send written notice to the head office address now.`, `Notice counts only if it is given the way the contract requires.`],
            ['g', `Email ${a.first} that you plan to rebid.`, `An email to the rep is not notice to the head office. The contract may still renew.`],
            ['p', `Let it renew and end it "for cause" later.`, `Proving cause is slow and uncertain. You gave up the one free exit.`]
          ],
          rule: `A notice clause is a recipe. Follow it exactly: form, address and date.`,
          deal: {
            setup: `The notice lands. The vendor's regional manager calls the same day, anxious to keep the account.`,
            asks: [
              ['m', `Offer a one-year renewal with written performance standards.`, `They keep the work, and you get a way to measure it.`],
              ['r', `Ask for 15% off and the right to end it on 30 days' notice.`, `A lot to give up. They may prefer to lose the account.`],
              ['x', `Say you will tell their other clients about the poor work unless they cut the price.`, `Threatening someone's reputation to get money can amount to extortion.`],
              ['n', `Let it expire and rebid.`, `A clean break. Rebidding takes time.`]
            ],
            rule: `Leverage from a real right is fair. Leverage from a threat is not.`
          }
        };
      }
    },
    {
      id: 'l7-indemnity', title: 'Sign here, it is standard',
      make: function (g) {
        var a = g.person();
        return {
          scene: `An engineering consultant's contract makes the partnership cover any claim against the consultant, including claims caused by the consultant's own mistakes, and caps the consultant's liability at its fee. ${a}, the project lead, needs it signed today.`,
          who: `${a.first}`,
          behind: `The consultant wants to be paid for advice without standing behind it. ${a.first} wants the work to start. If the design is wrong, these clauses mean the partnership pays for the consultant's error.`,
          deep: [
            [`What an indemnity does`, `It decides who pays when something goes wrong, whatever the fee was.`],
            [`Why this one is lopsided`, `You would cover the consultant even for its own mistakes, while its exposure stops at its fee. That could be a $60,000 fee against a $2 million design error.`],
            [`The usual position`, `Each side answers for its own negligence, and the cap is tied to the insurance the consultant carries.`]
          ],
          options: [
            ['s', `Negotiate: each side covers its own negligence, with liability tied to insurance.`, `Risk should sit with whoever can prevent it and insure it.`],
            ['g', `Sign. Nobody ever gets sued on these.`, `True until the one time it matters, when the clause decides who pays.`],
            ['p', `Sign, and waive the insurance certificate too.`, `Now nobody stands behind the advice, including an insurer.`]
          ],
          rule: `The indemnity and liability clauses are the contract. The rest is description.`
        };
      }
    },
    {
      id: 'l7-nda', title: 'What you saw last year',
      make: function (g) {
        var a = g.person();
        return {
          scene: `Last year you reviewed a rival's finances under a confidentiality agreement, for a deal that never happened. Now you are bidding against that rival for a site. ${a}, a colleague, says: "We know their costs. Use them."`,
          who: `${a.first}`,
          behind: `Knowing a rival's costs tells you how high they can bid. The agreement let you see those numbers for one purpose only. Using them to beat the rival is the misuse it was written to stop.`,
          deep: [
            [`Two promises in one`, `Not to disclose the information, and not to use it for any other purpose. The second is the one people forget.`],
            [`Why it can be proved`, `A bid that sits just above a rival's known break-even is strong evidence, and emails get read in litigation.`],
            [`What firms do`, `Keep the people who saw the information away from the new bid, and record that they did.`]
          ],
          options: [
            ['s', `Do not use it. Keep anyone who saw the file out of the bid.`, `The agreement limits use, not only disclosure.`],
            ['g', `Use only your "general impressions" of their position.`, `An impression formed from their confidential numbers is still their information.`],
            ['p', `Use the numbers. They cannot prove it.`, `Bids that track a rival's private costs are the proof.`]
          ],
          rule: `A confidentiality agreement binds what you do with information, not just who you tell.`
        };
      }
    },
    {
      id: 'l7-loan-to-boss', burn: 2, title: 'A loan to the boss',
      make: function (g) {
        var a = g.person(), amt = g.m(0.4, 1.2, 0.1);
        return {
          scene: `${a}, the managing principal, asks the project company to lend ${a.first} ${MB.usd(amt)} for six months at a low rate. "The cash is sitting idle anyway, and you know I am good for it."`,
          who: `${a.first}`,
          behind: `${a.first} wants cheap money without going to a bank. The company's cash belongs to all its owners and stands behind its lender. A loan to the person in charge is approved by people who report to the borrower.`,
          deep: [
            [`Whose money it is`, `The company's cash belongs to all its owners and stands behind its lender. It is the cushion, not spare change.`],
            [`Why approval is hollow`, `The people who would approve the loan report to the borrower. Saying no is a career risk.`],
            [`What proper looks like`, `The other owners approve, the rate matches a bank's, there is security, and the lender consents if the loan agreement requires it.`]
          ],
          options: [
            ['s', `Treat it as a related-party deal: owners' approval, market rate, security. Or decline.`, `It can be done properly. It cannot be done on a nod.`],
            ['g', `Approve it at the bank deposit rate as cash management.`, `A below-market loan to an insider is a gift from the other owners.`],
            ['p', `Wire it. ${a.first} is good for it.`, `Company money left on the boss's word, likely in breach of the loan agreement.`]
          ],
          rule: `Lending company money to an insider needs the approval of everyone but the insider.`,
          us: `Public companies are barred from making personal loans to their executives.`,
          ca: `Corporate statutes no longer ban these loans outright, but directors owe duties in approving them, and related-party loans are disclosed in the financial statements.`
        };
      }
    },
    {
      id: 'l7-estoppel', title: 'Certify this, please',
      make: function (g) {
        var a = g.person();
        return {
          scene: `A bank lending to your tenant asks you to certify that the lease has no defaults and no side agreements. In fact you let the tenant defer three months of rent on a handshake. ${a}, the tenant's owner, says: "Just sign. It is a form."`,
          who: `${a.first}`,
          behind: `${a.first} needs the bank to see a clean lease. The bank will lend on your word. If you certify there is no side deal, you may later be unable to collect the deferred rent at all.`,
          deep: [
            [`What the certificate is`, `A statement a third party relies on. Having made it, you cannot later say otherwise. That is the meaning of estoppel.`],
            [`The trap in signing`, `Certify that there are no side agreements and you may be unable to enforce the deferral, or to collect that rent ahead of the bank.`],
            [`The easy fix`, `Describe the deferral in the certificate. Banks see this constantly and price it in.`]
          ],
          options: [
            ['s', `Correct the certificate to show the deferral, then sign.`, `You are bound by what you certify. The bank lends on it.`],
            ['g', `Sign, adding "to our knowledge," and leave the deferral out.`, `You do know about it. The qualifier does not cover what you chose to omit.`],
            ['p', `Sign it as it stands.`, `A false certificate that a bank relies on is a misrepresentation with your name on it.`]
          ],
          rule: `A certificate others rely on is a promise that its contents are true.`,
          deal: {
            setup: `${a.first} accepts that the deferral must be disclosed, and wants the certificate today so the loan can close.`,
            asks: [
              ['m', `Ask ${a.first} to sign a short written deferral agreement first.`, `The handshake becomes paper, and the certificate can describe it.`],
              ['r', `Ask for the deferred rent to be repaid from the loan proceeds.`, `You have what ${a.first} needs. It is still a hard ask.`],
              ['x', `Refuse to sign unless ${a.first} pays you a fee.`, `The lease obliges you to give the certificate. Charging for it is a breach.`],
              ['n', `Sign the corrected certificate.`, `Honest and prompt.`]
            ],
            rule: `You may tidy up your own position before certifying. You may not sell the certificate.`
          }
        };
      }
    },
    {
      id: 'l7-referral', title: 'The referral program',
      make: function (g) {
        var a = g.person(), fee = g.pick([1500, 2500, 4000]);
        return {
          scene: `${a}, an insurance broker, offers the general partner's affiliate a ${MB.usd(fee)} "marketing fee" for every policy the partnership buys through the brokerage. The partnership pays the premiums.`,
          who: `${a.first}`,
          behind: `${a.first} wants the partnership's business and is paying the people who choose the broker. The partnership pays full premium, and part of it comes back to the general partner's side, not to the investors.`,
          deep: [
            [`Follow the money`, `The partnership pays the premium. Part of it comes back to the general partner's affiliate. Investors are funding a payment to their own manager.`],
            [`How it distorts the choice`, `The broker paying the fee may not be the cheapest or the best. The fee gives the affiliate a reason to choose it anyway.`],
            [`The clean version`, `Any rebate goes to the partnership as a lower premium.`]
          ],
          options: [
            ['s', `Credit the fee to the partnership, or get the investors' approval to keep it.`, `Money earned from spending the partnership's money belongs to the partnership.`],
            ['g', `Keep it in the affiliate and disclose it in the annual report.`, `Telling investors afterward is not asking them.`],
            ['p', `Keep it quietly.`, `A secret payment for steering a client's business is a kickback.`]
          ],
          rule: `A benefit you receive for directing someone else's spending belongs to them.`,
          us: `Kickbacks for referring settlement business on home loans are illegal under federal law.`,
          ca: `The Criminal Code makes secret commissions to an agent an offence.`,
          deal: {
            setup: `${a.first} still wants the account. "If the fee is a problem, tell me what works."`,
            asks: [
              ['m', `Ask for lower premiums for the partnership instead of any fee.`, `The saving goes to the people paying the bill.`],
              ['r', `Ask for a volume rebate paid to the partnership across all its policies.`, `A bigger saving. The broker's margin may not stretch.`],
              ['x', `Ask for the fee to be paid to you personally.`, `That is the kickback, with fewer steps.`],
              ['n', `Decline and choose the broker on price and service.`, `Nothing gained beyond a clean file.`]
            ],
            rule: `Turn an offered kickback into a discount for the client.`
          }
        };
      }
    }
  ]
});
