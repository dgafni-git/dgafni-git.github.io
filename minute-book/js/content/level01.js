MB.level({
  n: 1, title: 'The Entity', rank: 'Associate', pass: 0.7, draw: { authored: 5 },
  topics: 'Separate legal persons, limited liability, who can sign',
  blurb: 'Every foreclosed property, fund and project sits inside a legal entity. Before you can govern one, you need to know what it is, what it shields, and who can speak for it.',
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
        var spe = g.spe(), a = g.person(), c = g.city();
        return {
          scene: `${g.fund} has foreclosed on ${g.asset()} in ${c}. Title now sits in a new entity, ${spe}. A site security contractor sends its agreement, and the owner line reads "${g.fund}".\n\n${a}, the asset manager, shrugs. "Everyone knows it is us. Just sign it."`,
          ask: `How should the contract be signed?`,
          options: [
            ['s', `Have it reissued in the name of ${spe} and signed by an authorized signatory "for and on behalf of" the entity, with their title.`, `The entity that owns the property takes on the obligation, and the signature block shows the signer acts for it and not personally.`],
            ['g', `Sign in the fund's name today so security starts tonight, and assign the contract to ${spe} later.`, `Security starts on time, but the parent is now directly liable on a property contract, and the later assignment may need the contractor's consent. It undoes the reason for having the entity.`],
            ['p', `Sign it yourself to keep things moving. The paperwork can catch up.`, `A person who signs without naming the entity and their capacity can be personally liable, and the entity may not be bound at all.`]
          ],
          rule: `Contracts go in the name of the entity that owns the asset, signed by someone with authority, in a stated capacity. That one habit does most of the work of keeping liability where it belongs.`
        };
      }
    },
    {
      id: 'l1-account', title: 'One bank account is easier',
      make: function (g) {
        var spe = g.spe(), a = g.person();
        return {
          scene: `${spe} holds a foreclosed project for ${g.fund}. Its bank account is not open yet, and invoices are arriving. ${a}, the controller, proposes paying the entity's bills from the fund's operating account and "netting it all out at year end."`,
          ask: `What do you recommend?`,
          options: [
            ['s', `Open the entity's own account now. Until then, fund each payment as a recorded advance under a written intercompany loan.`, `The entity pays its own bills with money it has borrowed on documented terms. Its books stand on their own.`],
            ['g', `Pay from the fund's account for now, and have accounting book an intercompany receivable for each payment.`, `The bookkeeping helps, but the parent is still paying the entity's creditors directly with no loan agreement. Repeated often enough, it looks like one business.`],
            ['p', `Pay from the fund's account and reconcile at year end, as proposed.`, `This is commingling. If the project goes wrong, a creditor will point to it as proof the entity was never separate, and ask a court to reach the parent.`]
          ],
          rule: `Separateness is something an entity does, not something it has. Its own account, its own books and documented dealings with its parent are what a court looks for when someone tries to pierce the veil.`,
          us: `Lenders to single-asset entities often require "separateness covenants" that list these habits, and breaching them can trigger recourse to a guarantor.`,
          ca: `Canadian courts lift the corporate veil rarely, mostly where the entity is a sham or is used for an improper purpose. Commingling is still the evidence plaintiffs reach for first.`
        };
      }
    },
    {
      id: 'l1-signer', title: 'Who can sign today?',
      make: function (g) {
        var spe = g.spe('LLC'), a = g.person(), b = g.person();
        return {
          scene: `A broker needs the listing agreement for ${spe}'s property signed by five o'clock. Under the operating agreement only the manager, ${a}, can sign contracts over $25,000, and ${a.first} is on a flight.\n\n${b}, the broker, says: "You have run this file for months. Your email says Authorized Representative. Sign it."`,
          ask: `What do you do?`,
          options: [
            ['s', `Check the operating agreement, then reach ${a.first} for an electronic signature or a written delegation that the agreement allows.`, `Authority comes from the governing documents. A short delay costs less than a contract the entity can later disown, or one you are personally answerable for.`],
            ['g', `Sign it and add "subject to ratification by the manager" under your name.`, `The note is honest, but the broker may still rely on your signature, and the entity is left arguing about whether it is bound. It invites a dispute to save an afternoon.`],
            ['p', `Sign. You know the file better than anyone.`, `Knowing the file is not authority. You may have bound no one but yourself, and you have shown the broker that the entity's signing rules are optional.`]
          ],
          rule: `Before anyone signs, ask where their authority comes from: a clause in the governing documents or a resolution. If the answer is "everyone knows," there is no authority yet.`,
          us: `A counterparty can sometimes hold the entity to a deal signed by someone with apparent authority. That protects them. It does not protect the person who signed without real authority.`,
          ca: `The indoor management rule lets outsiders assume a company's internal steps were followed. It is no defence for an insider who knew they were not.`
        };
      }
    },
    {
      id: 'l1-type', title: 'Which kind of entity?',
      make: function (g) {
        var n = g.int(6, 14), c = g.city();
        return {
          scene: `${g.fund} is taking over ${g.asset()} in ${c}. ${n} outside investors will put money in. They want a share of the profit, no role in running the project, and no risk beyond their cheque. The deal team wants to close in two weeks.`,
          ask: `What structure do you propose?`,
          options: [
            ['s', `A limited partnership with the investors as limited partners and a corporation as general partner, under a written partnership agreement, after tax advice.`, `Passive investors get limited liability, the general partner runs the project, and the corporate general partner contains the unlimited liability that role carries. An LLC can do the same job in many US deals.`],
            ['g', `Put every investor on title as a co-owner, with a short co-ownership letter.`, `It is lawful and quick, but each owner's creditors, death or divorce now touches the land, every owner must sign to sell or borrow, and nobody has agreed how decisions get made.`],
            ['p', `Shake hands and split the profit. A partnership needs no paperwork.`, `That is true, and it is the problem. A partnership formed by conduct is a general partnership, where every partner is liable without limit for the debts of the business.`]
          ],
          rule: `Choose the entity by asking who needs limited liability, who will manage, and how profit and tax should flow. Then write it down. The default the law supplies when nothing is written is usually the worst available.`,
          us: `Delaware limited partnerships and LLCs are the usual choices for real estate ventures, and both let the parties shape their own governance by agreement.`,
          ca: `Limited partnerships are formed under provincial law and must file a declaration or certificate. Until they do, the investors may not have limited liability.`
        };
      }
    },
    {
      id: 'l1-standing', title: 'The filing nobody made',
      make: function (g) {
        var spe = g.spe(), a = g.person();
        return {
          scene: `While preparing for a sale that closes next month, you notice that ${spe} has not filed its annual return for two years. Its registered agent resigned for non-payment. ${a}, a colleague, says the entity "is just a shell holding one property" and the buyer's lawyer will flag anything that matters.`,
          ask: `What do you do?`,
          options: [
            ['s', `File the overdue returns and appoint a new agent now, order a certificate of good standing, and put every entity's filing dates on a compliance calendar.`, `An entity out of good standing may be unable to convey title, sue, or even exist. Fixing it takes days or weeks, so it has to start before the closing depends on it.`],
            ['g', `Leave it until the buyer's lawyer raises it, then fix it as a closing item.`, `It will probably get fixed, but on the buyer's timetable, with penalties, and with the seller looking careless. If the entity has already been struck off, reinstatement can outlast the closing date.`],
            ['p', `Do nothing. A shell does not need maintenance.`, `A dissolved entity cannot hold or sell property in the ordinary way, and people who keep acting for it can become personally liable for what they sign.`]
          ],
          rule: `An entity exists because a public registry says so. Annual filings, a registered office or agent and paid fees are the price of that existence, and somebody must own the calendar.`
        };
      }
    },
    {
      id: 'l1-guarantee', title: 'A formality on the credit application',
      make: function (g) {
        var spe = g.spe('Inc.'), a = g.person();
        return {
          scene: `A lumber supplier will open an account for ${spe} once its credit application is signed. The last paragraph says the person signing "personally and unconditionally guarantees" the account. ${a}, the supplier's rep, says it is a formality that every customer signs.`,
          ask: `How do you handle the form?`,
          options: [
            ['s', `Strike the guarantee paragraph, initial the change, and sign as "${spe}, per" your name and title. If the supplier insists on a guarantee, take that request to the board.`, `Only the entity is bound. A guarantee is a separate decision with its own risk, and a person should give one deliberately or not at all.`],
            ['g', `Sign as it stands, but write your title after your name so it is clear you sign for the company.`, `A title does not cancel express guarantee wording. Courts regularly enforce these clauses against the individual who signed.`],
            ['p', `Sign it. It is a formality.`, `The supplier's lawyers wrote that paragraph for the day the entity cannot pay. On that day it will not be a formality.`]
          ],
          rule: `Limited liability can be signed away one form at a time. Read what you sign for the entity, sign in a stated capacity, and treat any personal guarantee as a decision that needs its own approval.`
        };
      }
    }
  ]
});
