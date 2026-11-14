MB.level({
  n: 8, title: 'Development Oversight', rank: 'Head of Development', pass: 0.7, draw: { authored: 5 },
  topics: 'Budgets, draws, change orders, liens and insurance',
  role: 'You oversee a construction project for its owner.',
  blurb: 'A project spends other people\'s money every week on the say-so of the people being paid.',
  concepts: [
    ['Project budget', 'The approved plan for every dollar, by line. It is the baseline for the lender, the investors and the board, and changes to it need approval.'],
    ['Contingency', 'A budget line held back for the unknown. It belongs to the project, not to whoever asks first.'],
    ['Draw request', 'A periodic claim for payment for work done, supported by invoices, an inspection and lien documents.'],
    ['Change order', 'A written amendment to the construction contract that changes scope, price or time. Work done without one has no agreed price.'],
    ['Lien and holdback', 'Unpaid trades can register a claim against the property. Owners protect themselves by holding back part of each payment or collecting lien waivers.'],
    ['In balance', 'A construction loan is in balance when the undrawn loan plus committed equity covers the cost to finish. Lenders stop funding when it is not.'],
    ['Cost to complete', 'The current estimate of what it will take to finish. It should be updated honestly every month.'],
    ['Builder\'s risk insurance', 'Coverage for a project under construction. It ends on a date, and delayed projects outlast it.']
  ],
  scenarios: [
    {
      id: 'l8-draw', title: 'Paying for next week\'s work',
      make: function (g) {
        var a = g.person(), draw = g.m(0.6, 1.8, 0.1), short = g.pick([120000, 180000, 240000]);
        return {
          scene: `The contractor's draw is ${MB.usd(draw)}. The inspector certifies all of it except ${MB.usd(short)} of framing not yet installed. ${a}, the construction manager, wants it funded in full. "The crew starts Monday."`,
          who: `${a.first}`,
          behind: `${a.first} wants the contractor paid so the crew stays. Paying ahead of the work makes the owner a lender to the contractor, with nothing to show if the contractor stops.`,
          deep: [
            [`The risk in plain terms`, `Money paid for work not yet done is an unsecured loan to the contractor.`],
            [`What the inspection does`, `It ties each payment to something physically on the site, and the site is the lender's security.`],
            [`If the contractor fails`, `A replacement charges a premium to finish someone else's job. Having prepaid, the owner pays for the same framing twice.`]
          ],
          options: [
            ['s', `Fund the certified amount, less holdback, against lien waivers.`, `If the contractor fails tomorrow, everything paid for is standing on the site.`],
            ['g', `Fund it all on ${a.first}'s written promise.`, `If the contractor stalls, the project paid for work it does not have.`],
            ['p', `Fund it all and skip next month's inspection.`, `The inspection is the only independent check between a request and the bank account.`]
          ],
          rule: `Money follows work in place, verified independently, with lien protection at every draw.`,
          us: `Owners typically collect conditional lien waivers with each payment and unconditional ones for the last.`,
          ca: `Provincial statutes require a holdback from each payment, commonly 10%.`
        };
      }
    },
    {
      id: 'l8-change', title: 'Approved on the tailgate',
      builds: ['Delegation of authority'],
      make: function (g) {
        var a = g.person(), amt = g.pick([85000, 140000, 210000]);
        return {
          scene: `The crew hits bad soil. The site superintendent tells the contractor to replace it, at about ${MB.usd(amt)}. Nothing is written. ${a} plans to "paper the changes at month end."`,
          who: `${a.first}`,
          behind: `The superintendent wants the dig to continue, and the contractor is glad to start before a price is fixed. Once the work is done, the owner has no leverage left on the price.`,
          deep: [
            [`Before and after`, `Before the work, the owner can compare prices or redesign. Afterward it can only argue about the bill.`],
            [`How budgets die`, `Rarely by one big decision. Usually by forty small verbal ones, each reasonable on the day.`],
            [`The emergency route`, `A written direction to proceed, with the price to be agreed within days. Speed and paper are both possible.`]
          ],
          options: [
            ['s', `Issue a written, priced change order now, approved at the right level.`, `The price and approval exist before the cost is sunk.`],
            ['g', `Let the work go on and paper it at month end.`, `By then the owner is negotiating price for finished work, with no leverage.`],
            ['p', `Leave it verbal. They work well together.`, `Verbal changes are how budgets fail without anyone deciding they should.`]
          ],
          rule: `Every change is written, priced and approved before it is built.`
        };
      }
    },
    {
      id: 'l8-contingency', burn: 2, title: 'Raiding the contingency',
      builds: ['Related-party transaction'],
      make: function (g) {
        var a = g.person(), amt = g.pick([150000, 220000, 300000]);
        return {
          scene: `The development manager is a firm owned by ${a}, who sits on the board. It asks to move ${MB.usd(amt)} from contingency to its fee. A third of the work is still ahead.`,
          who: `${a.first}`,
          behind: `${a.first}'s firm wants more fee. Taking it from contingency means no new money needs approving. It also spends the project's safety margin on someone who sits on its board.`,
          deep: [
            [`What contingency is`, `Usually 5% to 10% of cost, held for the unknown. With a third of the work still ahead, it is not yet surplus.`],
            [`Two decisions posing as one`, `Whether the manager deserves more fee, and where the money comes from. Bundling them avoids a vote on the first.`],
            [`The lender's view`, `Loan agreements usually require consent to move contingency, because it protects completion.`]
          ],
          options: [
            ['s', `Treat the fee increase as a contract amendment for disinterested directors, then seek lender consent.`, `Contingency is not the manager's to draw, and the fee is a related-party deal.`],
            ['g', `Approve it as budget flexibility, since total cost is unchanged.`, `Money moved from protecting the project to paying an insider, with no lender consent.`],
            ['p', `Approve it with ${a.first} voting.`, `A director voted to raise their own firm's fee out of the safety margin.`]
          ],
          rule: `Contingency is for the project's unknowns. Moving it to an insider needs every approval.`
        };
      }
    },
    {
      id: 'l8-holdback', title: 'Release it early, just this once',
      make: function (g) {
        var a = g.person(), amt = g.pick([90000, 130000, 175000]);
        return {
          scene: `A subcontractor short of cash asks for its ${MB.usd(amt)} holdback weeks before the lien period ends. Its owner, ${a}, offers a waiver of the firm's own lien rights.`,
          who: `${a.first}`,
          behind: `${a.first} needs cash to survive. But the holdback is not ${a.first}'s yet. It is held in case ${a.first}'s own suppliers go unpaid and claim against the property.`,
          deep: [
            [`Who it protects`, `The owner, against claims by people the subcontractor did not pay. They can claim against the property even though the owner paid in full.`],
            [`Why the sub's waiver is not enough`, `The subcontractor can give up its own rights. It cannot give up its suppliers'.`],
            [`Paying twice`, `Release $130,000 early, a supplier claims $80,000, and the owner may have to pay that $80,000 again.`]
          ],
          options: [
            ['s', `Wait for the lien period to end with clear title.`, `The holdback protects against the sub's unpaid suppliers. Their rights are not ${a.first}'s to waive.`],
            ['g', `Release it against ${a.first}'s waiver.`, `If the sub's suppliers lien the job, the owner may pay that money twice.`],
            ['p', `Release it, and other trades' on request.`, `That dismantles lien protection across the whole project.`]
          ],
          rule: `Holdback is released when the conditions are met, never out of sympathy.`,
          us: `Retainage is mostly contractual. Unconditional waivers from lower tiers are the usual protection.`,
          ca: `Holdback is statutory. An owner who releases it early stays liable up to the amount that should have been kept.`
        };
      }
    },
    {
      id: 'l8-balance', burn: 2, title: 'Out of balance',
      builds: ['Duty of care'],
      make: function (g) {
        var a = g.person(), gap = g.m(0.6, 2, 0.1);
        return {
          scene: `Your cost to complete is ${MB.usd(gap)} more than the remaining loan and equity. The loan requires monthly reporting. ${a}, the developer, wants the old estimate shown. "We will find savings."`,
          who: `${a.first}`,
          behind: `${a.first} fears a reported shortfall will stop the lender funding and force in new equity. Hiding it keeps money flowing for another month and makes the eventual gap bigger.`,
          deep: [
            [`What in balance means`, `The money left to spend must cover the cost left to build. Lenders stop funding when it does not.`],
            [`Why hiding tempts`, `Reporting the gap brings an immediate demand for new equity.`],
            [`Why it fails`, `Costs do not shrink by going unreported. A false report made to obtain a draw can turn a business problem into personal liability.`]
          ],
          options: [
            ['s', `Report the current estimate, with a plan to close the gap.`, `A shortfall reported early can be solved. Reported late, it is a default.`],
            ['g', `Show the old estimate, trimming contingency to absorb some.`, `It spends the safety margin on paper. If savings do not appear, the report misled.`],
            ['p', `Show the old estimate and hold invoices to next month.`, `A false report to a lender to obtain funding. That can be fraud.`]
          ],
          rule: `Report the cost to complete as it is. Shortfalls can be fixed. False reports cannot.`
        };
      }
    },
    {
      id: 'l8-insurance', burn: 0, title: 'The policy that ran out',
      make: function (g) {
        var a = g.person(), days = g.pick([19, 26, 33]);
        return {
          scene: `The project is four months late. The builder's risk policy expires in ${days} days, before the new completion date. ${a}, for the contractor, says their certificate "covers everything."`,
          behind: `${a.first} wants no extra cost or paperwork on the contractor's side. The contractor's policy protects the contractor. The building belongs to the owner.`,
          deep: [
            [`Who is covered by what`, `A contractor's liability policy covers harm the contractor causes. Builder's risk covers the building itself, for the owner and the lender.`],
            [`Why delay matters`, `Policies are written for the planned construction period. A late project outlives its cover unless someone extends it.`],
            [`The lender's interest`, `Loan agreements require the cover. A lapse is a default even if nothing burns.`]
          ],
          options: [
            ['s', `Extend the policy now and confirm who is insured.`, `Extensions are routine before expiry and sometimes impossible after.`],
            ['g', `Rely on the contractor's certificate.`, `A certificate summarizes someone else's policy. It rarely covers the owner.`],
            ['p', `Let it lapse a few weeks to save premium.`, `Fire and theft are likeliest on a quiet site. The loss falls on the entity.`]
          ],
          rule: `Insurance has dates. Someone must check them against the real schedule.`
        };
      }
    },
    {
      id: 'l8-lowbid', title: 'The bid that is too good',
      make: function (g) {
        var a = g.person(), pct = g.pick([19, 22, 26]);
        return {
          scene: `The lowest bid for the concrete work is ${pct}% under the next one, from a small firm with thin finances. ${a}, the cost manager, wants to accept it at once. "That saving pays for the lobby."`,
          who: `${a.first}`,
          behind: `${a.first} is measured on the budget, and a low bid looks like a win today. A bidder that priced it wrong either walks off mid-job or asks for more money later, when replacing it costs far more than the saving.`,
          deep: [
            [`The winner's curse`, `The lowest bidder is often the one that made the biggest mistake in its estimate.`],
            [`What failure costs`, `Delay, a replacement at premium prices, and a dispute over half-finished work. Commonly far more than the saving.`],
            [`What a bond does`, `A surety promises to finish the work or pay if the contractor defaults. A firm that cannot get one is telling you something.`]
          ],
          options: [
            ['s', `Check the scope, references and finances, and require a bond, before deciding.`, `A low bid is fine if the bidder can finish. Find out before you rely on it.`],
            ['g', `Accept it and hold a bigger contingency.`, `A reserve helps with overruns. It does not finish the job if the contractor fails.`],
            ['p', `Accept it and write a tough contract.`, `A harsh contract against a firm with no money is worth nothing.`]
          ],
          rule: `Price is one term. A contractor who cannot finish is the most expensive bid there is.`
        };
      }
    },
    {
      id: 'l8-substitution', title: 'Equal or better',
      make: function (g) {
        var a = g.person(), amt = g.pick([60000, 95000, 140000]);
        return {
          scene: `The contractor wants to install cheaper windows it calls "equivalent," saving ${MB.usd(amt)}. The contract requires the architect to approve substitutions. ${a}, the contractor's manager, says there is no time for that.`,
          who: `${a.first}`,
          behind: `The contract price is fixed, so every dollar ${a.first}'s firm saves on materials is a dollar it keeps. "No time" keeps the architect from comparing the two products, and keeps the owner from asking for the saving.`,
          deep: [
            [`A fixed price cuts both ways`, `The contractor bears overruns and keeps savings on what was specified. It does not get to change what was specified.`],
            [`Why the architect`, `Two windows can look alike and differ in air leakage, warranty and lifespan.`],
            [`The fair split`, `The owner receives the saving as a credit. Some contracts share part of it with the contractor to encourage good ideas, by agreement.`]
          ],
          options: [
            ['s', `Require a formal request, reviewed by the architect, with the saving credited.`, `The owner paid for the specified window. A change needs approval and a price.`],
            ['g', `Approve it on the contractor's data sheet.`, `The party that profits from the swap supplied the only evidence.`],
            ['p', `Let it go. Windows are windows.`, `The owner gets a cheaper building at the original price, and maybe a warranty problem.`]
          ],
          rule: `A substitution is a change. It needs the designer's approval and a credit to the owner.`,
          deal: {
            setup: `The architect confirms the cheaper window is acceptable. The contractor still wants the swap, and now it is your decision.`,
            asks: [
              ['m', `Accept it with the full saving credited and a longer warranty.`, `The owner gets the money and extra protection for agreeing.`],
              ['r', `Ask for the full saving, and the two weeks of schedule the swap frees up.`, `The contractor wanted to keep some of both.`],
              ['x', `Have the contractor pay half the saving to your own firm.`, `Money for approving a change, paid to the person who approves, is a kickback.`],
              ['n', `Keep the specified windows.`, `No risk, no saving.`]
            ],
            rule: `A saving on the owner's building belongs to the owner.`
          }
        };
      }
    },
    {
      id: 'l8-safety', title: 'Keep it off the log',
      make: function (g) {
        var a = g.person();
        return {
          scene: `A safety inspector finds no fall protection on the fourth floor. ${a}, the superintendent, says: "We will fix it tonight. Do not log it and do not stop the crew. A recorded stop costs us a week."`,
          who: `${a.first}`,
          behind: `${a.first} is judged on schedule, and a recorded stop looks bad on the next bid. An unrecorded hazard looks worse after a fall, when the missing entry shows the firm knew and carried on.`,
          deep: [
            [`Why records exist`, `To show that a hazard was found and corrected. That is the evidence of care.`],
            [`How an unrecorded fix looks later`, `After an injury, investigators find a known hazard and no entry. It reads as concealment.`],
            [`Who is exposed`, `Supervisors and company officers can be charged personally under workplace safety laws.`]
          ],
          options: [
            ['s', `Stop that work, fix it, record it, and report it as the rules require.`, `The record shows the hazard was found and dealt with. That protects everyone.`],
            ['g', `Fix it tonight, but leave it out of the log.`, `The hazard is gone and so is the evidence that you acted properly.`],
            ['p', `Keep working and fix it when there is a gap.`, `Knowingly leaving workers exposed can make owners and managers personally liable.`]
          ],
          rule: `A safety record is your proof of care. Keeping things out of it removes the proof, not the risk.`,
          us: `Federal workplace safety rules require employers to keep injury and hazard records.`,
          ca: `Provincial statutes put safety duties on owners, constructors and supervisors, with personal fines for breaches.`
        };
      }
    },
    {
      id: 'l8-presale', burn: 2, title: 'Changing what they bought',
      make: function (g) {
        var a = g.person(), n = g.int(60, 140);
        return {
          scene: `${n} buyers have signed for condo units. Costs are up. ${a}, the developer, wants smaller balconies and cheaper finishes. The contracts allow "minor" changes without notice. Bigger ones must be disclosed and can let buyers cancel.`,
          who: `${a.first}`,
          behind: `${a.first} wants to recover margin without reopening ${n} sales. Calling the changes minor avoids a notice that would let buyers walk away, in a market where some of them would like to.`,
          deep: [
            [`The buyer's bargain`, `They agreed a price for a described unit, often years before it exists.`],
            [`Why the label matters`, `A material change usually requires formal notice and gives buyers a short window to cancel and recover their deposits.`],
            [`The market angle`, `If prices have fallen, some buyers want out. A developer that mislabels a change hands them the exit and a claim.`]
          ],
          options: [
            ['s', `Have counsel assess the changes, and disclose them if they are material.`, `Whether a change is minor is a legal question with a consequence, not a label.`],
            ['g', `Make the changes and mention them in a newsletter.`, `A newsletter is not the notice the law requires, and it proves you knew.`],
            ['p', `Make the changes. Buyers will not notice until closing.`, `Buyers who find out at closing can refuse to close and claim their deposits.`]
          ],
          rule: `Buyers bought what the disclosure described. Changing it means telling them and honouring their rights.`,
          us: `State condominium laws and federal land sales rules require updated disclosure for material changes.`,
          ca: `Provincial laws require an amended disclosure for a material change, and often give buyers a short period to cancel.`
        };
      }
    },
    {
      id: 'l8-neighbour', title: 'The crane over the fence',
      make: function (g) {
        var a = g.person();
        return {
          scene: `The tower crane must swing over the neighbour's yard, and the shoring needs anchors under it. ${a}, the neighbour, has not agreed to anything. The site team wants to start Monday and "sort it out if anyone complains."`,
          who: `The site team`,
          behind: `The site team wants the schedule. ${a.first} holds something the project needs and knows it. Starting without agreement turns a negotiation into a trespass, and hands ${a.first} a court order to stop the job.`,
          deep: [
            [`What you need`, `Permission for the crane to pass overhead and for anchors under the soil. Ownership of land extends above and below it.`],
            [`The neighbour's leverage`, `A court will usually stop a trespass on request, and a stopped crane costs thousands a day.`],
            [`What agreements cover`, `A fee, insurance naming the neighbour, a survey of their building before and after, and what happens to the anchors.`]
          ],
          options: [
            ['s', `Sign an access agreement with ${a.first} before the crane goes up.`, `The space over and under a property belongs to its owner.`],
            ['g', `Swing at night and apologize if it comes up.`, `It is still trespass, and now it looks deliberate.`],
            ['p', `Proceed. Air is not really property.`, `Courts grant injunctions against cranes and order anchors removed.`]
          ],
          rule: `If the project needs a neighbour's land, air or soil, it needs the neighbour's signature first.`,
          deal: {
            setup: `${a.first} is not hostile, just wary. "What is in it for me?"`,
            asks: [
              ['m', `Offer a monthly fee, insurance cover, and repair of any damage.`, `A fair price for a real intrusion. Neighbours sign this.`],
              ['v', `Offer to repave ${a.first}'s driveway as well.`, `It costs you, and it buys patience you will need for a year of construction.`],
              ['r', `Ask for the access free, in return for first right to buy the lot.`, `${a.first} may not want to sell, ever.`],
              ['x', `Mention that the city might take an interest in ${a.first}'s unpermitted deck.`, `Threatening to report someone unless they sign is coercion.`],
              ['n', `Redesign the crane position and avoid the yard.`, `Costly, and you owe ${a.first} nothing.`]
            ],
            rule: `Pay for what you need from a neighbour. Never threaten for it.`
          }
        };
      }
    },
    {
      id: 'l8-certifier', title: 'Certifying your own work',
      make: function (g) {
        var a = g.person();
        return {
          scene: `The construction lender releases each draw on a certificate from the payment certifier. That certifier turns out to be a company owned by the construction manager. ${a}, the developer, wants to keep it. "They know the job, and it saves a fee."`,
          who: `${a.first}`,
          behind: `${a.first} likes a certifier who never slows a draw. The lender believes an independent eye is checking the work. A certifier owned by the firm being paid will always be tempted to say yes.`,
          deep: [
            [`What a certifier does`, `Confirms the value of work done, so that payment matches progress.`],
            [`Why independence is the point`, `The lender cannot inspect every week. It pays for an independent eye, or believes it does.`],
            [`If it comes out later`, `Every draw is questioned, and the lender may say it was misled into advancing the money.`]
          ],
          options: [
            ['s', `Tell the lender, and appoint an independent certifier or get its consent.`, `The lender is relying on independence. It should know when there is none.`],
            ['g', `Keep the affiliate and have a second person initial each certificate.`, `A second signature from the same side is not independence.`],
            ['p', `Keep it and do not raise it.`, `Draws obtained on a certificate the lender wrongly thinks is independent look like misrepresentation.`]
          ],
          rule: `Whoever checks the work should not be owned by whoever is paid for it.`
        };
      }
    }
  ]
});
