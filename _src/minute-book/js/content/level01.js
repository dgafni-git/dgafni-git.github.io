MB.level({
  n: 1, title: 'The Entity', rank: 'Associate', pass: 0.7, draw: { authored: 5 },
  topics: 'Separate legal persons, limited liability, who can sign',
  role: 'You are a new associate at a lender that ends up owning what it forecloses on.',
  blurb: 'Every property and project sits inside a legal entity. Know what it shields and who can speak for it.',
  concepts: [
    ['Separate legal personality', 'A corporation, LLC or limited partnership is its own legal person. It owns the property, signs the contracts and owes the debts. Its owners and its parent do not, unless they agree to.'],
    ['Limited liability', 'Owners risk what they invested and not their other assets. The protection depends on treating the entity as genuinely separate.'],
    ['Special purpose entity', 'An entity formed to hold one asset or project, so that its risks stay with it and do not spread to the parent or to other projects.'],
    ['Governing documents', 'The documents that create and run the entity: articles or a certificate of formation, plus by-laws, an operating agreement or a limited partnership agreement. They say who decides what.'],
    ['Authority to bind', 'Only people authorized by the governing documents or by a resolution can commit the entity. A job title or an email signature is not authority.'],
    ['Piercing the veil', 'A court can look past the entity and reach its owners when it was used as a sham or run as an extension of the owner. Mixed money and skipped formalities are the usual evidence.'],
    ['Good standing', 'An entity must keep its registrations, annual filings and registered office or agent current. One that lapses can lose the right to do business or be dissolved.']
  ],
  scenarios: [
    {
      id: 'l1-name', title: 'Whose name is on the contract?',
      make: function (g) {
        var spe = g.spe(), a = g.person();
        return {
          scene: `${g.fund} foreclosed on ${g.asset()}. Title sits in ${spe}, but the security contract names the fund as owner. "Everyone knows it is us," says ${a}. "Just sign."`,
          who: `${a.first}`,
          behind: `${a.first} wants speed. The fund's name is on everything else, so it feels natural. The hidden cost is that the fund becomes directly liable for a property it created an entity to hold at a distance.`,
          deep: [
            [`Why each property gets its own company`, `So that a disaster at one cannot reach the lender's other assets.`],
            [`What the wrong name does`, `A contract in the fund's name makes the fund the party. If a guard is hurt or a bill is disputed, the claim is against the fund itself.`],
            [`The signature block`, `The entity's name, then the signer's name and title, signing on its behalf. That line is what tells a court who is bound.`]
          ],
          options: [
            ['s', `Reissue it in ${spe}'s name, signed by an authorized signatory with their title.`, `The entity that owns the property takes the obligation, and nobody signs personally.`],
            ['g', `Sign in the fund's name tonight and assign it later.`, `The parent is now liable on a property contract, which defeats the point of the entity.`],
            ['p', `Sign it yourself and let the paperwork catch up.`, `Sign without naming the entity and your capacity, and you may be bound personally.`]
          ],
          rule: `Contracts go in the name of the entity that owns the asset, signed by someone with authority, in a stated capacity.`
        };
      }
    },
    {
      id: 'l1-account', title: 'One bank account is easier',
      make: function (g) {
        var spe = g.spe(), a = g.person();
        return {
          scene: `${spe} has no bank account yet and invoices are arriving. ${a}, the controller, wants to pay them from the fund's account and "net it out at year end."`,
          who: `${a.first}`,
          behind: `${a.first} wants less bookkeeping. One account means fewer transfers. The price is that the entity stops looking like a separate business, which is the only thing protecting the fund from its debts.`,
          deep: [
            [`What a court looks for`, `Whether the entity behaved like a real, separate business: its own account, its own records, its own decisions.`],
            [`Why mixed money is the favourite exhibit`, `It is easy to prove from bank statements, and it suggests the owner treated the entity's money as its own.`],
            [`The proper way to fund it`, `A written loan from the parent, with each advance recorded. The entity then pays its own bills with money it has borrowed.`]
          ],
          options: [
            ['s', `Open the entity's account now. Fund payments as advances under a written intercompany loan.`, `The entity pays its own bills with documented borrowed money. Its books stand alone.`],
            ['g', `Pay from the fund's account and book a receivable each time.`, `Better than nothing, but the parent is still paying the entity's creditors with no loan agreement.`],
            ['p', `Pay from the fund and reconcile at year end.`, `That is commingling, the first evidence a creditor uses to reach the parent.`]
          ],
          rule: `Separateness is a habit: own account, own books, documented dealings with the parent.`,
          us: `Lenders to single-asset entities often require separateness covenants, and breaching them can trigger a guarantor's liability.`,
          ca: `Canadian courts lift the corporate veil rarely, mostly for shams. Commingling is still the evidence plaintiffs reach for first.`
        };
      }
    },
    {
      id: 'l1-signer', title: 'Who can sign today?',
      make: function (g) {
        var spe = g.spe('LLC'), a = g.person();
        return {
          scene: `A listing agreement for ${spe} must be signed by five. Only the manager, ${a}, may sign contracts over $25,000, and ${a.first} is on a flight. The broker points out that your email says "Authorized Representative."`,
          who: `The broker`,
          behind: `The broker is paid only once the listing is signed, so any signature today will do. Your email title gives the broker a story to tell if the signature is challenged later.`,
          deep: [
            [`Two kinds of authority`, `Actual authority comes from the documents. Apparent authority is what an outsider could reasonably assume from how the company presents you.`],
            [`Who is at risk`, `The entity may be held to a deal it never approved. You may be liable for claiming an authority you did not have.`],
            [`The practical answer`, `Electronic signatures and short written delegations exist for exactly this afternoon.`]
          ],
          options: [
            ['s', `Reach ${a.first} for an e-signature or a written delegation.`, `Authority comes from the governing documents. A short delay beats a contract the entity can disown.`],
            ['g', `Sign "subject to ratification by the manager."`, `Honest, but the broker may rely on it, and the entity is left arguing about whether it is bound.`],
            ['p', `Sign. You know the file better than anyone.`, `Knowing the file is not authority. You may have bound only yourself.`]
          ],
          rule: `Before anyone signs, ask where their authority comes from: a clause or a resolution.`,
          us: `Apparent authority can protect the counterparty. It does not protect the person who signed without real authority.`,
          ca: `The indoor management rule protects outsiders who assume internal steps were followed. It is no defence for an insider who knew they were not.`
        };
      }
    },
    {
      id: 'l1-type', role: 'You are structuring a new investment for the lender.', burn: 0, title: 'Which kind of entity?',
      make: function (g) {
        var n = g.int(6, 14);
        return {
          scene: `${n} outside investors will fund ${g.asset()}. They want a share of profit, no role in management, and no risk beyond their cheque. Closing is in two weeks.`,
          behind: `The deal team wants to close fast. Investors want profit without liability. Only a structure that gives limited liability on paper delivers that. Speed without paper delivers the opposite.`,
          deep: [
            [`General partnership`, `The default when people go into business together with nothing written. Every partner is liable for everything.`],
            [`Limited partnership`, `Passive investors risk only what they put in. One general partner carries the rest, and it is usually a company formed for the job.`],
            [`Why the paper matters`, `Limited liability for investors generally begins only once the partnership is registered.`]
          ],
          options: [
            ['s', `A limited partnership with a corporate general partner and a written agreement.`, `Passive investors get limited liability, and the corporate general partner contains the rest.`],
            ['g', `Put every investor on title as co-owners, with a short letter.`, `Lawful and quick, but every owner's creditors, death or divorce now touches the land.`],
            ['p', `Shake hands and split the profit.`, `A partnership by handshake is a general partnership. Every partner is liable without limit.`]
          ],
          rule: `Choose the entity by who needs limited liability and who manages. Then write it down.`,
          us: `Delaware limited partnerships and LLCs are the usual choices, and both let the parties shape governance by agreement.`,
          ca: `Limited partnerships must file a declaration or certificate under provincial law. Until they do, investors may not have limited liability.`
        };
      }
    },
    {
      id: 'l1-standing', burn: 0, title: 'The filing nobody made',
      make: function (g) {
        var spe = g.spe(), a = g.person();
        return {
          scene: `A sale closes next month. You notice ${spe} has filed no annual return for two years and its registered agent has resigned. "It is just a shell," says ${a}.`,
          behind: `${a.first} sees a shell with no staff and assumes it needs no upkeep. Registries do not care what an entity owns. They dissolve the ones that stop filing.`,
          deep: [
            [`What lapses`, `Annual filings, fees, and a registered office or agent to receive legal papers.`],
            [`What follows`, `Loss of good standing, then dissolution. A dissolved entity may be unable to transfer title, sue or defend itself.`],
            [`The hidden danger`, `With no registered agent, a lawsuit can be served and won by default without anyone at the company knowing.`]
          ],
          options: [
            ['s', `File the returns, appoint an agent, and order a good standing certificate now.`, `An entity out of good standing may be unable to convey title, and fixing it takes weeks.`],
            ['g', `Fix it when the buyer's lawyer raises it.`, `It gets fixed on the buyer's timetable, with penalties, possibly after the closing date.`],
            ['p', `Do nothing. A shell needs no maintenance.`, `A dissolved entity cannot sell property, and people acting for it can be personally liable.`]
          ],
          rule: `An entity exists because a registry says so. Somebody must own the filing calendar.`
        };
      }
    },
    {
      id: 'l1-guarantee', role: 'You are opening a supplier account for the project company.', title: 'A formality on the credit application',
      make: function (g) {
        var spe = g.spe('Inc.');
        return {
          scene: `A supplier's credit application for ${spe} ends with a clause: the signer "personally guarantees" the account. The rep calls it a formality.`,
          who: `The supplier's rep`,
          behind: `The supplier knows a single-project company may have nothing left if things go wrong. The clause quietly makes you its backstop. Calling it a formality is how it gets signed.`,
          deep: [
            [`What a guarantee is`, `A separate promise to pay someone else's debt out of your own assets.`],
            [`Why suppliers ask`, `A project company may own nothing once the project ends or fails.`],
            [`How it gets signed`, `Buried in a form and described as standard. Courts hold people to what they sign, read or not.`]
          ],
          options: [
            ['s', `Strike the guarantee, initial it, and sign for the company with your title.`, `Only the entity is bound. A personal guarantee is a separate decision.`],
            ['g', `Sign as is, adding your title after your name.`, `A title does not cancel express guarantee wording. Courts enforce these.`],
            ['p', `Sign it. It is a formality.`, `It was drafted for the day the entity cannot pay. On that day it is no formality.`]
          ],
          rule: `Limited liability can be signed away one form at a time. Read what you sign.`
        };
      }
    }
  ]
});
