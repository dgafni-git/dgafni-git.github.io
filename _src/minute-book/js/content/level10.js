MB.level({
  n: 10, title: 'Foreclosure and Owned Property', rank: 'Chief Restructuring Officer', pass: 0.7, draw: { authored: 4, numeric: 2, spot: 1 }, numerics: ['deficiency', 'reo'],
  topics: 'Remedies, taking title, and the entity that holds what you took',
  role: 'You run workouts at the lender, turning bad loans into something.',
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
  spots: [
    {
      id: 'l10-spot', title: 'Read the property file',
      make: function () {
        return {
          scene: `You have taken title to a four-storey building. The plan is to sell it as it stands. You read the file first.`,
          parts: [
            [`Zoned for six storeys. The approved site plan uses four.`, 'y', `Two storeys of unused density. It can be built, or sold to a buyer who will build it.`],
            [`Property taxes are paid up to date.`, 'n', `Good, and nothing more.`],
            [`A rooftop cell tower lease pays $1,800 a month and may be assigned.`, 'y', `An income stream that can be sold separately to specialist buyers, often for many years of rent up front.`],
            [`The parking lot is shared with the neighbour under a 1998 agreement.`, 'n', `Something to check, not something to sell.`],
            [`The environmental report is clean.`, 'n', `Comfort.`]
          ],
          rule: `A property is a bundle of rights. Some can be sold without selling the building.`,
          behind: `Buyers price what they see. Unused density and side income are in the file, not on the street, so sellers who do not read the file give them away.`
        };
      }
    }
  ],
  scenarios: [
    {
      id: 'l10-remedy', burn: 0, title: 'Same playbook, different place',
      make: function (g) {
        var a = g.person(), c1 = g.city('us'), c2 = g.city('ca');
        return {
          scene: `Two loans are in default, one in ${c1} and one in ${c2}. ${a} wants to send both borrowers the notice letters from the last enforcement file, today.`,
          behind: `${a.first} wants to save legal fees and move fast. Borrowers' lawyers look first for a defective notice, because one mistake can send the lender back to the start.`,
          deep: [
            [`Through the court`, `A lawsuit ending in a court-ordered sale. Slow, but hard to attack afterward.`],
            [`Without the court`, `A sale under a power in the mortgage. Faster, with strict notice periods.`],
            [`What varies by place`, `The length of notice, the borrower's right to buy the property back, and whether you can sue for a shortfall.`]
          ],
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
      id: 'l10-enviro', burn: 0, title: 'What is under the dry cleaner?',
      builds: ['Special purpose entity'],
      make: function (g) {
        var a = g.person();
        return {
          scene: `The lender is about to take title to a plaza that housed a dry cleaner for thirty years. No environmental report since the loan. "Put it in an entity," says ${a}. "Then it is the entity's problem."`,
          behind: `${a.first} wants the property taken quickly and assumes an entity makes any problem someone else's. The entity still belongs to the fund, and it would own a site nobody may want to buy.`,
          deep: [
            [`Why owners pay`, `Cleanup laws often make the current owner liable, whoever caused the pollution.`],
            [`What an assessment is`, `Phase one reviews records and history. Phase two tests soil and groundwater if phase one raises concerns.`],
            [`Ways to avoid owning it`, `Sell the loan, or have a receiver sell the property.`]
          ],
          options: [
            ['s', `Commission an environmental assessment first, and consider a receiver sale.`, `The lender learns what it would own while it can still choose not to own it.`],
            ['g', `Take title in a new entity without an assessment.`, `The entity limits the damage, but now owns possibly contaminated land blind.`],
            ['p', `Take title in the fund's own name.`, `Cleanup liability attaches to owners. The whole balance sheet now stands behind it.`]
          ],
          deal: {
            setup: `The assessment finds solvent in the soil. Cleanup is costly but known. You have not taken title, and you still hold the loan.`,
            asks: [
              ['m', `Sell the loan at a discount to a specialist buyer, with the report disclosed.`, `They price the risk better than you can, and you never own the site.`],
              ['r', `Offer the borrower more time in return for a funded cleanup escrow.`, `The owner pays for the cleanup. This borrower has little money left.`],
              ['x', `Sell the loan quickly without mentioning the report.`, `Concealing a known defect from a buyer is misrepresentation. They will find the report.`],
              ['o', `Sell the loan, keeping a share of the profit if the buyer resells within two years.`, `The buyer gives up nothing unless it does well, and then you share in it.`],
              ['n', `Hold the loan and wait.`, `Nothing lost today. The interest keeps going unpaid.`]
            ],
            rule: `Bad news about an asset can be sold, at a price, to someone told the truth.`
          },
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
          who: `${a.first}`,
          behind: `${a.first} wants out from under the personal guarantee and offers the property to get there. A fast deal suits ${a.first}, because the lender takes whatever else is registered against the title.`,
          deep: [
            [`How it differs from foreclosure`, `Foreclosure wipes out claims ranking behind the mortgage. A deed handed over does not.`],
            [`Keeping the mortgage alive`, `If the mortgage merges into ownership it disappears, and the claims behind it move up. The documents must say it does not merge.`],
            [`The guarantee`, `Releasing it is a separate price to negotiate.`]
          ],
          options: [
            ['s', `Search title, keep the mortgage alive, and get an appraisal before accepting.`, `A handed-over deed leaves junior liens in place. The mortgage is how you clear them.`],
            ['g', `Sign the borrower's form before ${a.first} changes course.`, `Fast, but the guarantor is released and the property comes with whatever is registered.`],
            ['p', `Accept the deed and discharge the mortgage.`, `Discharging gives away priority. Every junior claim moves up.`]
          ],
          sheet: {
            setup: `Title is clean and the appraisal is below the debt. ${a.first}, the borrower, wants the personal guarantee released and is walking away from the project. Write the terms.`,
            terms: [
              ['c', `Full cooperation: plans, permits, contracts and keys.`, `An afternoon for the borrower. Months saved for you.`, 0, 0.9],
              ['c', `A cash payment toward the shortfall.`, `The borrower has little cash. This is the hard one.`, 3, 1.4],
              ['o', `The borrower's claims against the contractor, assigned to you.`, `Worthless to someone leaving the project. Possibly worth a great deal to its new owner.`, 0, 1.5],
              ['o', `Supplier deposits and warranties, assigned to you.`, `They are abandoning these anyway. You can use them.`, 0, 0.8],
              ['c', `Six months of the borrower's time, unpaid, to finish the build.`, `A lot to ask of someone who has just lost the property.`, 2, 0.7],
              ['x', `Take the deed now and promise the release later, without meaning to give it.`, `A promise you do not intend to keep is fraud, and can unwind the transfer.`, 0, 2.4]
            ],
            rule: `Someone walking away holds things that are worthless to them and valuable to you. Ask for all of them.`
          },
          rule: `A voluntary transfer gives title as it is. Search first and keep the mortgage alive.`,
          us: `A transfer by an insolvent borrower for less than fair value can be challenged later. An appraisal is standard.`,
          ca: `The mortgage should be expressly kept from merging with title. The same challenge risk applies in bankruptcy.`
        };
      }
    },
    {
      id: 'l10-insider-sale', twist: true, title: 'A quick sale to a friend of the firm',
      builds: ['Conflict of interest', 'Arm\'s length'],
      make: function (g) {
        var a = g.person(), amt = g.m(3, 9, 0.5);
        if (g.twist) return {
          twist: `The property had been fully marketed and the connected bidder was highest. Rejecting it would have cost the borrower.`,
          scene: `The lender is selling under power of sale. The property was listed with a broker for ninety days and appraised twice. Three offers came in. The highest, at ${MB.usd(amt)}, is from ${a}, who co-invests with the partners. A colleague wants to take the second offer "for appearances."`,
          options: [
            ['s', `Accept the highest offer, with the connection disclosed and counsel's sign-off.`, `The market set the price. The borrower is owed the best one.`],
            ['g', `Take the second offer to avoid any appearance of favour.`, `A lower price makes the borrower's shortfall bigger, to spare the lender embarrassment.`],
            ['p', `Accept ${a.first}'s offer, with a discount for closing fast.`, `The process was clean until the price was cut for a connected buyer.`]
          ],
          rule: `A connected buyer who wins a real, open process is simply the best buyer.`
        };
        return {
          scene: `The lender is selling under power of sale. Before listing, ${a}, who co-invests with the partners, offers ${MB.usd(amt)}, matching the one appraisal, closing in ten days. The borrower will be sued for the shortfall.`,
          who: `${a.first}`,
          behind: `${a.first} wants the property without competing for it, and the partners may like a friendly, certain sale. The borrower, who will be sued for the shortfall, pays for any discount.`,
          deep: [
            [`The duty`, `A lender selling a borrower's property must take reasonable steps to get a proper price.`],
            [`Why it matters most here`, `The borrower will be sued for the gap between the sale price and the debt. A low price makes that claim bigger.`],
            [`The evidence`, `A listing, a marketing period, more than one appraisal, and the offers received.`]
          ],
          options: [
            ['s', `List it with a broker and get a second appraisal first.`, `A lender selling a borrower's property must take reasonable steps to get a proper price.`],
            ['g', `Accept. The price matches the appraisal.`, `An unmarketed sale to a connected buyer is how borrowers win improvident-sale claims.`],
            ['p', `Accept a little less for a faster close.`, `Selling below your own appraisal to a connected buyer can cost the shortfall claim.`]
          ],
          deal: {
            setup: `The property is listed. ${a.first}, the partners' co-investor, is still keen and asks if there is any way to get an edge.`,
            asks: [
              ['m', `Invite ${a.first} to bid through the broker like anyone else.`, `A motivated bidder in a fair process helps the price.`],
              ['r', `Ask ${a.first} for a firm opening bid that sets a floor, on counsel's advice.`, `A floor protects the price if it is disclosed and others can still outbid it.`],
              ['x', `Promise ${a.first} a last look at the best outside offer.`, `A secret last look for a connected buyer rigs the process against everyone else.`],
              ['n', `Tell ${a.first} to watch the listing.`, `Correct and cool. ${a.first} may not bother.`]
            ],
            rule: `A connected buyer may compete. A connected buyer may not be given the answer.`
          },
          rule: `A lender selling its borrower's property owes a duty about the price. Expose it to the market.`,
          us: `Auction sales are hard to attack on price alone, but self-dealing sales can be set aside.`,
          ca: `A lender under power of sale must take reasonable care to obtain true market value, and generally may not sell to itself.`
        };
      }
    },
    {
      id: 'l10-basis', burn: 2, title: 'The opening value',
      builds: ['Special purpose entity'],
      make: function (g) {
        var a = g.person(), bal = g.m(8, 16, 1), app = Math.round(bal * g.pick([0.7, 0.75, 0.8]) / 1e5) * 1e5;
        return {
          scene: `A foreclosed project moves into a new entity. The loan balance was ${MB.usd(bal)}. The independent appraisal says ${MB.usd(app)}. ${a}, who made the loan, wants the entity's debt to the fund set at the full balance instead. "Why book a loss?"`,
          who: `${a.first}`,
          behind: `${a.first} made the loan, and a recorded loss reflects on that decision and perhaps on pay. Setting the new debt at the old balance makes the loss vanish from this year's results.`,
          deep: [
            [`What foreclosure does to the books`, `A loan is replaced by a property. If the property is worth less than the loan, a loss has happened.`],
            [`The temptation`, `Record the property at the old loan amount and the loss does not appear this year.`],
            [`Who is misled`, `The fund's investors about performance, and anyone lending to or valuing the new entity.`]
          ],
          options: [
            ['s', `Set the note at the appraised value and record the loss.`, `The entity starts with a debt it can repay, and the fund's books tell the truth.`],
            ['g', `Use a higher internal valuation from the deal team.`, `A valuation by the team whose loan went bad is not independent.`],
            ['p', `Set it at the full balance. No loss recorded.`, `That hides a loss from investors and misstates every later report.`]
          ],
          deal: {
            none: true,
            setup: `The appraiser calls back. "If the number is a problem, there are assumptions I could revisit. My fee for a revised report would be higher."`,
            asks: [
              ['x', `Pay for the revised report.`, `Buying a number makes the appraisal worthless and both of you liable.`],
              ['t', `Send the appraiser your deal team's model and ask for another look.`, `Pressure dressed up as information. Appraisers talk to each other.`],
              ['n', `Decline, and use the report as written.`, `A value you can buy is not independent.`]
            ],
            rule: `The moment a valuation is for sale, it is worth nothing.`
          },
          rule: `The value at which foreclosed property moves to its entity must come from an independent source.`,
          us: `Accounting standards record foreclosed property at fair value less cost to sell.`,
          ca: `Where the fund and the entity are in different countries, the loan terms must also satisfy transfer pricing rules.`
        };
      }
    },
    {
      id: 'l10-stay', twist: true, title: 'The filing the night before',
      make: function (g) {
        var a = g.person();
        if (g.twist) return {
          twist: `The filing was by the guarantor, not the owner. The stay did not cover this property.`,
          scene: `A foreclosure sale is set for ten tomorrow. At six tonight the loan's personal guarantor files for court protection. The borrowing company, which owns the property, has filed nothing. ${a} wants to cancel the sale indefinitely.`,
          options: [
            ['s', `Have counsel confirm tonight that the stay does not reach the company's property, then proceed.`, `A stay protects the one who filed. Check, and then act.`],
            ['g', `Cancel the sale indefinitely.`, `Careful, and costly. Months are lost to a stay that may not apply.`],
            ['p', `Proceed without checking, and start collecting from the guarantor too.`, `The sale may be fine. Pursuing the guarantor after the filing is not.`]
          ],
          rule: `A stay protects whoever filed. Find out exactly who that is.`
        };
        return {
          scene: `A foreclosure sale is set for ten tomorrow. At six tonight the borrower files for court protection from creditors. ${a} says the sale "was already in motion."`,
          who: `${a.first}`,
          behind: `${a.first} has done months of work and sees a stalling tactic. It may be one. Courts still punish lenders who decide that for themselves.`,
          deep: [
            [`What a stay is`, `An automatic freeze on creditor action when a debtor files for court protection.`],
            [`Why acting anyway fails`, `Steps taken in breach can be undone, and courts can award damages against the lender.`],
            [`The lender's remedy`, `Ask the court to lift the stay, by showing the filing is abusive or the property is not needed for a restructuring.`]
          ],
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
    },
    {
      id: 'l10-receiver', title: 'Who runs it meanwhile?',
      make: function (g) {
        var a = g.person();
        return {
          scene: `A half-built site is deteriorating while the foreclosure runs. The borrower has stopped paying security and the roof is open. ${a}, your site manager, offers to send a crew to secure it and "run things until we own it."`,
          who: `${a.first}`,
          behind: `${a.first} wants to protect the collateral, which is right. A lender that takes charge of a site before it owns it takes on an occupier's duties, to workers, neighbours and trespassers, without an owner's rights.`,
          deep: [
            [`The trap`, `A lender in possession can be liable for accidents, for the state of the site, and to the borrower for how it manages.`],
            [`What a receiver is`, `An independent person appointed to take control, protect the property and often sell it.`],
            [`Who pays`, `The receiver's costs come out of the property ahead of the lender, which is usually cheaper than the liability.`]
          ],
          options: [
            ['s', `Apply to have a receiver appointed to secure and manage the site.`, `Control passes to someone with legal authority and insurance for the job.`],
            ['g', `Send your own crew to secure it and manage it informally.`, `The site is protected, and the lender is now answerable for it.`],
            ['p', `Leave it until the foreclosure completes.`, `The collateral loses value every week, and someone may be hurt on it.`]
          ],
          rule: `A lender protects a property it does not yet own through a receiver, not by moving in.`
        };
      }
    },
    {
      id: 'l10-rents', title: 'The rents are disappearing',
      make: function (g) {
        var a = g.person(), amt = g.pick([85000, 120000, 160000]);
        return {
          scene: `A borrower in default is collecting ${MB.usd(amt)} a month in rent and paying you nothing. Your security includes an assignment of the rents. ${a}, a colleague, suggests phoning the tenants and asking them to pay you directly.`,
          who: `${a.first}`,
          behind: `${a.first} wants the money stopped before more leaks out. Tenants who pay the wrong party can be made to pay twice. They need a formal notice they can rely on.`,
          deep: [
            [`What the assignment gives`, `The right to collect rents after default, once it is exercised in the way the law requires.`],
            [`The tenant's position`, `A proper written notice protects a tenant who then pays the lender.`],
            [`Using the money`, `Rent collected goes to the property's costs and the debt, and must be accounted for.`]
          ],
          options: [
            ['s', `Serve formal notices under the assignment, or have a receiver collect.`, `Tenants know who to pay and are protected for paying.`],
            ['g', `Phone the tenants and ask them to redirect rent.`, `Some will, some will not, and none are protected.`],
            ['p', `Change the locks on the borrower's management office.`, `That is taking possession without process.`]
          ],
          wider: [`Offer the borrower a choice: rents into a joint account while you talk, or a receiver tomorrow.`, `Most borrowers take the account. The money stops leaking without a court application.`],
          rule: `Security over rents is exercised by formal notice.`
        };
      }
    },
    {
      id: 'l10-anchor', title: 'The tenant you inherit',
      make: function (g) {
        var a = g.person();
        return {
          scene: `You now own a plaza. The anchor grocery pays below-market rent on a long lease. When the loan was made, the lender signed an agreement not to disturb that tenant after a foreclosure. ${a}, your leasing agent, wants it out. "The foreclosure wiped the leases."`,
          who: `${a.first}`,
          behind: `${a.first} is paid on new leases at higher rents. Foreclosure can end leases that rank behind the mortgage. The non-disturbance agreement is the lender's own promise that this one survives.`,
          deep: [
            [`What foreclosure does to leases`, `Leases made after the mortgage can usually be ended. Earlier ones cannot.`],
            [`The three-way agreement`, `The tenant accepts the mortgage ranks first. In return the lender promises to honour the lease if it takes over.`],
            [`Why lenders sign them`, `Anchor tenants will not sign a lease without one, and the anchor is what makes the plaza worth lending on.`]
          ],
          options: [
            ['s', `Honour the lease, as the lender promised.`, `It is your own agreement, and the anchor is why the plaza has value.`],
            ['g', `Hint at eviction to push the tenant into a higher rent.`, `Threatening what you have promised not to do is bad faith.`],
            ['p', `Serve notice to vacate.`, `A breach of your own agreement, with a tenant able to afford the lawsuit.`]
          ],
          rule: `A lender that takes over a property takes it with the promises it made to tenants.`,
          deal: {
            setup: `The grocer hears you are the new owner and asks for a meeting. It wants ten more years and a bigger store.`,
            asks: [
              ['m', `Offer the extension at market rent for the added years.`, `It keeps the anchor and lifts the income over time.`],
              ['r', `Ask for market rent from today in return for the expansion.`, `The grocer wants the space, but its current rent is protected.`],
              ['x', `Say the lease will not survive unless the rent goes up.`, `That is the threat you promised in writing not to make.`],
              ['o', `Ask for a share of the grocer's sales above a set level.`, `It costs the grocer nothing at today's sales. If the bigger store thrives, the rent rises with it.`],
              ['n', `Hear them out and commit to nothing.`, `Nothing lost. The opening may not come again.`]
            ],
            rule: `A protected tenant can still be a willing one. Offer something it wants.`
          }
        };
      }
    },
    {
      id: 'l10-redeem', burn: 2, title: 'They want it back',
      make: function (g) {
        var a = g.person(), amt = g.m(5, 12, 0.5);
        return {
          scene: `The law gives a borrower until Friday to pay everything owed and keep the property. On Thursday the borrower tenders the full ${MB.usd(amt)}. ${a}, a partner, has a buyer lined up at a much higher price. "Be hard to reach until Monday."`,
          who: `${a.first}`,
          behind: `${a.first} sees a profit above the debt and wants the lender to have it. A mortgage is security for a debt. A lender is entitled to be repaid, not to the property's upside.`,
          deep: [
            [`The right to redeem`, `Until it is properly cut off, a borrower can pay the debt and keep the property.`],
            [`Why courts guard it`, `Without it, every lender would have a reason to engineer defaults on valuable properties.`],
            [`If the lender dodges`, `Courts extend the deadline and award costs, and the buyer's deal collapses anyway.`]
          ],
          options: [
            ['s', `Accept the payment and release the mortgage.`, `The lender is paid in full, which is all it was ever owed.`],
            ['g', `Process it slowly and see whether the deadline passes.`, `Delay to defeat a payment made on time is bad faith.`],
            ['p', `Refuse the payment.`, `Refusing a valid payment does not end the right. It adds damages.`]
          ],
          wider: [`Accept the payment, and offer to introduce your buyer to the borrower for an agreed fee.`, `The debt is paid, the borrower may sell well, and you are paid for the introduction.`],
          rule: `A lender's interest in a property ends when the debt is paid.`
        };
      }
    },
    {
      id: 'l10-surplus', title: 'More than you are owed',
      make: function (g) {
        var a = g.person(), extra = g.m(0.4, 1.4, 0.1);
        return {
          scene: `A foreclosure sale brings in ${MB.usd(extra)} more than the debt and costs. ${a}, in accounting, proposes holding it against "final costs and contingencies," with no end date.`,
          who: `${a.first}`,
          behind: `${a.first} sees money in the account and no one yet asking for it. The surplus belongs to whoever ranks next: later lenders, then the borrower. The lender holds it for them.`,
          deep: [
            [`The order`, `Costs of sale, then the lender's debt, then creditors ranking behind it, then the borrower.`],
            [`The lender's role`, `It holds any surplus in trust for those next in line and must account for it.`],
            [`If nobody is sure who is entitled`, `The money can be paid into court for the claimants to sort out.`]
          ],
          options: [
            ['s', `Account for the sale and pay the surplus to those next in line.`, `The lender keeps what it is owed and nothing else.`],
            ['g', `Hold it for unspecified future costs.`, `An open-ended hold on other people's money is keeping it.`],
            ['p', `Book it as a recovery.`, `That is taking money that belongs to someone else.`]
          ],
          rule: `A lender keeps its debt and its costs. The rest belongs to others.`
        };
      }
    },
    {
      id: 'l10-lowbid', title: 'Bidding against nobody',
      make: function (g) {
        var a = g.person(), val = g.m(4, 9, 0.5);
        return {
          scene: `No one else comes to the foreclosure auction. The property is appraised at ${MB.usd(val)}. ${a}, a credit officer, wants to bid one dollar of the debt and sue the guarantor for nearly everything.`,
          who: `${a.first}`,
          behind: `The less the lender bids, the more debt is left to claim from the guarantor. A one-dollar bid would give the lender a multi-million-dollar property and almost the whole debt as well.`,
          deep: [
            [`How a credit bid works`, `The lender bids with the debt it is owed. Whatever it bids is treated as paid.`],
            [`The double recovery`, `Property worth millions for one dollar, plus a claim for the rest.`],
            [`How the law responds`, `Many places measure the shortfall against fair value, or refuse it after a grossly low bid.`]
          ],
          options: [
            ['s', `Bid an amount supported by the appraisal.`, `The shortfall claim that is left is one a court will enforce.`],
            ['g', `Bid half the appraised value.`, `Better than a dollar, and still set to inflate the claim.`],
            ['p', `Bid one dollar.`, `Courts see this for what it is, and can cancel the shortfall claim or the sale.`]
          ],
          rule: `A lender bidding with its own debt may not bid low to be paid twice.`,
          us: `Many states limit the shortfall to the gap between the debt and the property's fair value.`,
          ca: `A lender that takes title through foreclosure generally gives up its claim for any shortfall.`
        };
      }
    }
  ]
});
