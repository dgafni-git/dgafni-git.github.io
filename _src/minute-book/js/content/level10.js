MB.level({
  n: 10, title: 'Foreclosure and Owned Property', rank: 'Chief Restructuring Officer', pass: 0.7, draw: { authored: 4, numeric: 2 }, numerics: ['deficiency', 'reo'],
  topics: 'Remedies, taking title, and the entity that holds what you took',
  blurb: 'Enforcing a mortgage turns a lender into an owner. Process, price and structure decide what happens next.',
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
          scene: `Two loans are in default, one in ${c1} and one in ${c2}. ${a} wants to send both borrowers the notice letters from the last enforcement file, today.`,
          options: [
            ['s', `Ask local counsel in each place what notices and remedies apply.`, `Enforcement law is local. An error at the start can void everything after it.`],
            ['g', `Send the template now and have counsel review afterward.`, `If it does not fit, the notice is defective and the clock never started.`],
            ['p', `Change the locks on both properties.`, `Taking possession without process is unlawful in most places.`]
          ],
          rule: `Enforcement follows the law of the place where the property is, step by step.`,
          us: `About half the states mainly use court foreclosure. The rest allow a trustee's sale. Notice and deficiency rules vary widely.`,
          ca: `Ontario, New Brunswick, Prince Edward Island and Newfoundland and Labrador mostly use power of sale. British Columbia, Alberta and Nova Scotia use court-supervised processes.`
        };
      }
    },
    {
      id: 'l10-enviro', title: 'What is under the dry cleaner?',
      builds: ['Special purpose entity'],
      make: function (g) {
        var a = g.person();
        return {
          scene: `The lender is about to take title to a plaza that housed a dry cleaner for thirty years. No environmental report since the loan. "Put it in an entity," says ${a}. "Then it is the entity's problem."`,
          options: [
            ['s', `Commission an environmental assessment first, and consider a receiver sale.`, `The lender learns what it would own while it can still choose not to own it.`],
            ['g', `Take title in a new entity without an assessment.`, `The entity limits the damage, but now owns possibly contaminated land blind.`],
            ['p', `Take title in the fund's own name.`, `Cleanup liability attaches to owners. The whole balance sheet now stands behind it.`]
          ],
          rule: `Investigate before you own. A lender has choices an owner does not.`,
          us: `Federal law protects a lender holding title mainly to protect its security, if it does not manage the site and sells promptly.`,
          ca: `Provincial laws can reach anyone with ownership or control of a contaminated site. Lender protections are narrow.`
        };
      }
    },
    {
      id: 'l10-deed', title: 'The borrower offers the keys',
      make: function (g) {
        var a = g.person(), amt = g.m(4, 11, 0.5);
        return {
          scene: `${a} owes ${MB.usd(amt)} and offers to sign the property over in exchange for release of the guarantee. Title has not been searched in three years. A one-page form is ready to sign.`,
          options: [
            ['s', `Search title, keep the mortgage alive, and get an appraisal before accepting.`, `A handed-over deed leaves junior liens in place. The mortgage is how you clear them.`],
            ['g', `Sign the borrower's form before ${a.first} changes course.`, `Fast, but the guarantor is released and the property comes with whatever is registered.`],
            ['p', `Accept the deed and discharge the mortgage.`, `Discharging gives away priority. Every junior claim moves up.`]
          ],
          rule: `A voluntary transfer gives title as it is. Search first and keep the mortgage alive.`,
          us: `A transfer by an insolvent borrower for less than fair value can be challenged later. An appraisal is standard.`,
          ca: `The mortgage should be expressly kept from merging with title. The same challenge risk applies in bankruptcy.`
        };
      }
    },
    {
      id: 'l10-insider-sale', title: 'A quick sale to a friend of the firm',
      builds: ['Conflict of interest', 'Arm\'s length'],
      make: function (g) {
        var a = g.person(), amt = g.m(3, 9, 0.5);
        return {
          scene: `The lender is selling under power of sale. Before listing, ${a}, who co-invests with the partners, offers ${MB.usd(amt)}, matching the one appraisal, closing in ten days. The borrower will be sued for the shortfall.`,
          options: [
            ['s', `List it with a broker and get a second appraisal first.`, `A lender selling a borrower's property must take reasonable steps to get a proper price.`],
            ['g', `Accept. The price matches the appraisal.`, `An unmarketed sale to a connected buyer is how borrowers win improvident-sale claims.`],
            ['p', `Accept a little less for a faster close.`, `Selling below your own appraisal to a connected buyer can cost the shortfall claim.`]
          ],
          rule: `A lender selling its borrower's property owes a duty about the price. Expose it to the market.`,
          us: `Auction sales are hard to attack on price alone, but self-dealing sales can be set aside.`,
          ca: `A lender under power of sale must take reasonable care to obtain true market value, and generally may not sell to itself.`
        };
      }
    },
    {
      id: 'l10-basis', title: 'The opening value',
      builds: ['Special purpose entity'],
      make: function (g) {
        var a = g.person(), bal = g.m(8, 16, 1), app = Math.round(bal * g.pick([0.7, 0.75, 0.8]) / 1e5) * 1e5;
        return {
          scene: `A foreclosed project moves into a new entity. The loan balance was ${MB.usd(bal)}. The independent appraisal says ${MB.usd(app)}. ${a}, who made the loan, wants the entity's note set at the full balance. "Why book a loss?"`,
          options: [
            ['s', `Set the note at the appraised value and record the loss.`, `The entity starts with a debt it can repay, and the fund's books tell the truth.`],
            ['g', `Use a higher internal valuation from the deal team.`, `A valuation by the team whose loan went bad is not independent.`],
            ['p', `Set it at the full balance. No loss recorded.`, `That hides a loss from investors and misstates every later report.`]
          ],
          rule: `The value at which foreclosed property moves to its entity must come from an independent source.`,
          us: `Accounting standards record foreclosed property at fair value less cost to sell.`,
          ca: `Where the fund and the entity are in different countries, the loan terms must also satisfy transfer pricing rules.`
        };
      }
    },
    {
      id: 'l10-stay', title: 'The filing the night before',
      make: function (g) {
        var a = g.person();
        return {
          scene: `A foreclosure sale is set for ten tomorrow. At six tonight the borrower files for court protection from creditors. ${a} says the sale "was already in motion."`,
          options: [
            ['s', `Stop until counsel confirms whether a stay applies.`, `A stay halts enforcement at once. The lender's rights now run through the court.`],
            ['g', `Finish the scheduled steps and start nothing new.`, `A stay does not care which steps were already scheduled.`],
            ['p', `Proceed. The filing is a delay tactic.`, `A sale in breach of a stay is void or voidable, and can be sanctioned.`]
          ],
          rule: `When a borrower files for protection, stop and take advice before the next step.`,
          us: `A bankruptcy filing triggers an automatic stay. Lenders move for relief from it.`,
          ca: `Proposals and restructurings stay secured creditors. A straight bankruptcy generally does not.`
        };
      }
    }
  ]
});
