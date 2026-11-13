MB.level({
  n: 10, title: 'Foreclosure and Owned Property', rank: 'Chief Restructuring Officer', pass: 0.7, draw: { authored: 4, numeric: 2 }, numerics: ['deficiency', 'reo'],
  topics: 'Remedies, taking title, and the entity that holds what you took',
  blurb: 'Enforcing a mortgage turns a lender into an owner. The choices made on the way in, about process, price and structure, decide whether the property can be worked out or becomes a second problem.',
  concepts: [
    ['Judicial foreclosure', 'Enforcement through a court action that ends in a court-ordered sale or a transfer of title to the lender.'],
    ['Power of sale', 'A right in the mortgage, backed by statute, to sell the property after default without a court action. It comes with strict notice periods and a duty to seek a proper price.'],
    ['Deed in lieu', 'The borrower hands over title voluntarily to avoid foreclosure. It is faster, but junior claims on the property are not wiped out.'],
    ['Credit bid', 'A lender bidding at its own foreclosure sale using the debt it is owed instead of cash.'],
    ['Deficiency', 'What the borrower and guarantors still owe after the property is sold or taken. Many jurisdictions limit or bar it.'],
    ['Receiver', 'An independent person appointed by the lender or a court to take control of the property, protect it and sell it.'],
    ['Environmental due diligence', 'Investigation of contamination before taking title. Owners can be liable for cleanup regardless of who caused it.'],
    ['Owned-property entity', 'A special purpose entity that takes title to foreclosed property, funded by a documented loan from the lender at an independently appraised value.']
  ],
  scenarios: [
    {
      id: 'l10-remedy', title: 'Same playbook, different place',
      make: function (g) {
        var a = g.person(), c1 = g.city('us'), c2 = g.city('ca');
        return {
          scene: `${g.fund} has two defaulted loans to enforce at once, one on a property in ${c1} and one in ${c2}. ${a}, a junior workout officer, has the notice letters from the fund's last enforcement file and proposes sending the same ones to both borrowers today to save legal fees.`,
          ask: `How do you start?`,
          options: [
            ['s', `With local counsel in each place: which remedies are available, what notices are required, how long each takes, and what happens to the claim for any shortfall. Then send notices that fit each jurisdiction.`, `Enforcement law is local. The notice periods, the available remedies and the effect on the deficiency all differ, and an error at the start can void everything after it.`],
            ['g', `Send the old template to both borrowers now and have counsel review the files afterward.`, `If the template happens to fit, a few days are saved. If it does not, the notice is defective, the clock has not started, and the borrower has learned that the lender is careless.`],
            ['p', `Change the locks on both properties. The loans are in default and the mortgages say the lender may take possession.`, `Self-help possession without the required process is unlawful in most places. It exposes the lender to damages and, as a party in possession, to the liabilities of an occupier.`]
          ],
          rule: `Enforcement follows the law of the place where the property is, step by step. A lender that operates in several jurisdictions needs a checklist for each, not one template.`,
          us: `About half the states mainly use court foreclosure, and the rest allow sale by a trustee under a deed of trust. Notice periods, redemption rights and deficiency rules vary widely.`,
          ca: `Ontario, New Brunswick, Prince Edward Island and Newfoundland and Labrador mostly use power of sale. British Columbia, Alberta and Nova Scotia use court-supervised foreclosure and sale. Each has its own notices and waiting periods.`
        };
      }
    },
    {
      id: 'l10-enviro', title: 'What is under the dry cleaner?',
      builds: ['Special purpose entity'],
      make: function (g) {
        var c = g.city(), a = g.person(), amt = g.m(2, 6, 0.5);
        return {
          scene: `${g.fund} is about to take title to a defaulted ${MB.usd(amt)} loan's collateral in ${c}: a small retail plaza that housed a dry cleaner for thirty years. No environmental report has been done since the loan was made. ${a}, a colleague, says the fund will put the property in a special purpose entity, "so any contamination is the entity's problem."`,
          ask: `What do you do before taking title?`,
          options: [
            ['s', `Commission a Phase I environmental assessment, and a Phase II if it flags anything. Depending on the result, consider a receiver sale or selling the loan instead of becoming the owner.`, `The lender finds out what it would be buying while it can still choose not to own it. A receiver can often sell contaminated property without the lender ever going on title.`],
            ['g', `Take title in a new special purpose entity without an assessment.`, `The entity limits the damage if separateness holds. But the entity is now an owner of possibly contaminated land with no information, no plan, and no defence that it made proper inquiries.`],
            ['p', `Take title directly in the fund's name. It is the simplest route.`, `The fund itself becomes the owner of the site. Cleanup liability attaches to owners, and the fund's whole balance sheet now stands behind it.`]
          ],
          rule: `Investigate before you own. A lender has choices that an owner does not, and environmental liability is the most important reason to look first.`,
          us: `Federal law protects a lender that holds title mainly to protect its security and does not participate in management, provided it tries to sell the property at the earliest practicable, commercially reasonable time.`,
          ca: `Provincial environmental laws can reach anyone with ownership, charge or control of a contaminated site. Protections for lenders and receivers exist but are narrow.`
        };
      }
    },
    {
      id: 'l10-deed', title: 'The borrower offers the keys',
      make: function (g) {
        var a = g.person(), amt = g.m(4, 11, 0.5);
        return {
          scene: `${a}, a borrower who owes ${g.fund} ${MB.usd(amt)}, offers to sign the property over rather than go through foreclosure, in exchange for a release of the personal guarantee. The fund has not searched title since the loan closed three years ago. ${a.first}'s lawyer sends a one-page transfer and release, ready to sign.`,
          ask: `How do you respond?`,
          options: [
            ['s', `Update the title search first. If the title is acceptable, document the transfer through the fund's counsel: the mortgage is kept alive and does not merge with the title, the property goes to a special purpose entity, value is supported by an appraisal, and the release is given on the lender's terms.`, `A deed in lieu leaves junior liens in place. Keeping the mortgage alive preserves the ability to foreclose them out, and the appraisal answers any later claim that the property was worth more than the debt.`],
            ['g', `Sign the borrower's form to capture the deal before ${a.first} changes course.`, `Speed has value, but the lender has released the guarantor and taken the property as it stands, including any second mortgage, tax arrears or liens registered in the last three years.`],
            ['p', `Accept the deed and discharge the mortgage, since the fund now owns the property.`, `Discharging the mortgage gives away the lender's priority. Every junior claim moves up, and the lender owns the property subject to all of them with no way to clear them.`]
          ],
          rule: `A voluntary transfer gives the lender title as it is, with everything registered against it. Search first, keep the mortgage alive, and price the release of the guarantee as a separate decision.`,
          us: `A transfer by a borrower who is insolvent, for less than fair value, can be challenged later as a fraudulent transfer or a preference. An appraisal and an estoppel certificate are standard.`,
          ca: `The mortgage should be expressly kept from merging with the title. The same risk of a later challenge applies if the borrower becomes bankrupt.`
        };
      }
    },
    {
      id: 'l10-insider-sale', title: 'A quick sale to a friend of the firm',
      builds: ['Conflict of interest', 'Arm\'s length'],
      make: function (g) {
        var a = g.person(), amt = g.m(3, 9, 0.5), c = g.city('ca');
        return {
          scene: `${g.fund} is selling a property in ${c} under power of sale. Before it is listed, ${a}, who invests alongside the fund's partners in other deals, offers ${MB.usd(amt)}, which equals the single appraisal on file. The offer is unconditional and can close in ten days. The borrower still owes more than that and will be pursued for the shortfall.`,
          ask: `Does the fund accept?`,
          options: [
            ['s', `Not yet. List the property with an independent broker for a proper marketing period, get a second appraisal, and keep a record. If ${a.first} is still the best offer, accept it on the advice of counsel with the connection disclosed.`, `A lender selling under power of sale must take reasonable steps to get a proper price. Market exposure is the evidence, and it matters most when the buyer is connected and the borrower will be asked to pay the difference.`],
            ['g', `Accept it. The price matches the appraisal and the certainty is valuable.`, `The price may be fair. But an unmarketed sale at one appraisal to a person connected to the lender is the fact pattern borrowers win improvident-sale claims on, and it puts the shortfall claim at risk.`],
            ['p', `Accept a slightly lower price in return for an even faster close.`, `A lender knowingly selling below its own appraisal to a connected buyer, while planning to sue the borrower for the gap, has breached its duty and may lose the shortfall and owe damages.`]
          ],
          rule: `A lender that sells its borrower's property owes a duty about the price. Expose the property to the market, document the process, and treat any connected buyer as a conflict to be managed.`,
          us: `Foreclosure sales by public auction are harder to attack on price alone, but a sale that shocks the conscience or involves self-dealing can be set aside, and many states measure deficiencies against fair value.`,
          ca: `A lender exercising power of sale must take reasonable care to obtain the true market value, and generally may not sell to itself or its nominee.`
        };
      }
    },
    {
      id: 'l10-basis', title: 'The opening value',
      builds: ['Special purpose entity'],
      make: function (g) {
        var a = g.person(), bal = g.m(8, 16, 1), app = Math.round(bal * g.pick([0.7, 0.75, 0.8]) / 1e5) * 1e5, spe = g.spe('LLC');
        return {
          scene: `${g.fund} has foreclosed on a project and placed it in ${spe}. The loan balance was ${MB.usd(bal)}. An independent appraisal at the date of transfer says ${MB.usd(app)}. Fund policy is that the entity gives the fund a note for the appraised value and the fund books the difference as a loss.\n\n${a}, the partner who originated the loan, proposes setting the note at the full loan balance. "The value will come back once we finish the project. Why book a loss we will reverse?"`,
          ask: `What is the opening value of the note?`,
          options: [
            ['s', `The independent appraised value, in a written note with a stated rate, term and security. The fund records the loss, and the investors' reports show both.`, `The entity starts with a debt it has a real chance of repaying, the fund's books show what happened to the loan, and the project's later result means something.`],
            ['g', `A higher figure from an internal valuation prepared by the deal team, on the basis that the appraiser was too conservative.`, `Appraisals can be wrong, and a second independent opinion would be a fair response. A valuation by the team whose loan went bad is not independent, and it happens to shrink their loss.`],
            ['p', `The full loan balance, so that no loss is recorded.`, `That hides a loss from the fund's investors and loads the entity with debt above the property's value on day one. Every later report from either entity is misstated.`]
          ],
          rule: `The value at which a foreclosed property moves from the lender to its holding entity must come from an independent source, be written into a real loan document, and flow through to honest reporting on both sides.`,
          us: `Accounting standards require foreclosed property to be recorded at fair value less cost to sell when the lender takes it.`,
          ca: `Where the fund and the entity are in different countries, the terms of the loan between them must also satisfy transfer pricing rules, and interest may attract withholding tax.`
        };
      }
    },
    {
      id: 'l10-stay', title: 'The filing the night before',
      make: function (g) {
        var a = g.person(), c = g.city();
        return {
          scene: `The sale of a foreclosed property in ${c} is set for ten o'clock tomorrow. At six this evening the borrower's lawyer emails a notice that the borrower has filed for court protection from its creditors. ${a}, the fund's workout officer, says the sale steps "were already in motion" and wants to let tomorrow proceed.`,
          ask: `What happens at ten o'clock?`,
          options: [
            ['s', `Nothing, until counsel has confirmed whether a stay applies. If it does, postpone the sale and apply to the court for leave to continue.`, `A stay of proceedings stops enforcement the moment it takes effect. The lender's rights are not lost, but they now run through the court.`],
            ['g', `Complete the steps that were already scheduled and hold off on anything new.`, `A stay does not distinguish between steps already scheduled and new ones. If it applies, tomorrow's sale is a violation however long ago it was planned.`],
            ['p', `Proceed with the sale. The filing is obviously a delay tactic.`, `It may well be a tactic. A sale held in breach of a stay is void or voidable, and the lender can be sanctioned and ordered to pay damages.`]
          ],
          rule: `When a borrower files for insolvency protection, stop and take advice before the next step. A lender that believes the filing is abusive asks the court for relief. It does not decide the question for itself.`,
          us: `A bankruptcy filing triggers an automatic stay of nearly all enforcement. Lenders move for relief from the stay, with special rules for single-asset real estate cases.`,
          ca: `Proposals and restructuring filings stay secured creditors. A straight bankruptcy generally does not stop a secured creditor realizing on its security, so the type of filing matters.`
        };
      }
    }
  ]
});
