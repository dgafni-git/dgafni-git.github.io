MB.level({
  n: 8, title: 'Development Oversight', rank: 'Head of Development', pass: 0.7, draw: { authored: 5 },
  topics: 'Budgets, draws, change orders, liens and insurance',
  blurb: 'A construction project spends other people\'s money every week on the say-so of the people being paid. The controls around that spending are governance in its most practical form.',
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
          scene: `The contractor's monthly draw request is ${MB.usd(draw)}. The independent inspector certifies everything except ${MB.usd(short)} of framing that has not been installed. ${a}, the construction manager, asks you to fund the full amount. "The lumber is on site and the crew starts Monday. Holding it back slows the job."`,
          ask: `What do you fund?`,
          options: [
            ['s', `The certified amount, less the holdback, against lien waivers or the statutory declaration. The framing goes in next month's draw once it is in place.`, `Paying only for inspected work in place means that if the contractor fails tomorrow, the money already spent is standing on the site.`],
            ['g', `The full amount, on ${a.first}'s written promise that the framing will be finished within the week.`, `If the promise is kept, nothing is lost. If the contractor stalls or fails, the project has paid for work it does not have, and the lender and investors were told funds follow inspection.`],
            ['p', `The full amount, and skip the inspection next month to save time.`, `The inspection is the only independent check between a draw request and the bank account. Removing it leaves spending controlled by the people being paid.`]
          ],
          rule: `Money follows work in place, verified by someone independent, with lien protection collected at every draw. Advance payments turn the owner into the contractor's unsecured lender.`,
          us: `Owners and lenders typically collect conditional lien waivers with each payment and unconditional waivers for the prior one.`,
          ca: `Provincial statutes require owners to hold back a percentage of each payment, commonly 10%, and many require a statutory declaration that trades have been paid.`
        };
      }
    },
    {
      id: 'l8-change', title: 'Approved on the tailgate',
      builds: ['Delegation of authority'],
      make: function (g) {
        var a = g.person(), amt = g.pick([85000, 140000, 210000]);
        return {
          scene: `During excavation the crew hits unsuitable soil. The site superintendent tells the contractor to dig it out and bring in engineered fill, and the contractor says that will cost about ${MB.usd(amt)}. Nothing is written. ${a}, the project manager, plans to "paper all the changes together at month end."`,
          ask: `How should the change be handled?`,
          options: [
            ['s', `Issue a written change order now with scope, price and schedule impact, approved by someone whose authority covers the amount. If work truly cannot wait, give a written direction today and price it within days.`, `The price and the approval exist before the cost is sunk. Construction contracts provide for urgent directions so that speed and paper are both possible.`],
            ['g', `Let the work proceed and settle the paperwork at month end with the other changes.`, `The work gets done, but by month end the owner is negotiating price for work already finished, with no leverage, and nobody with authority has approved the spend.`],
            ['p', `Leave it as a verbal understanding. The superintendent and the contractor work well together.`, `Verbal changes approved by site staff are how budgets fail without anyone deciding they should. The contractor will bill what it believes was agreed.`]
          ],
          rule: `Every change to scope or price is written, priced and approved at the right level before it is built, or as soon after as an emergency allows. The change order log is one of the first things a lender or buyer will ask to see.`
        };
      }
    },
    {
      id: 'l8-contingency', title: 'Raiding the contingency',
      builds: ['Related-party transaction'],
      make: function (g) {
        var a = g.person(), amt = g.pick([150000, 220000, 300000]), spe = g.spe();
        return {
          scene: `${spe}'s project has ${MB.usd(amt * 3)} left in contingency with a third of the work still ahead. The development manager, a firm owned by ${a}, who also sits on the entity's board, asks to move ${MB.usd(amt)} of it to the development fee line. "The job has taken more of our time than anyone planned."`,
          ask: `How is the request handled?`,
          options: [
            ['s', `As two separate decisions. A fee increase is a contract amendment for the disinterested directors to consider on its merits. Any budget reallocation then needs whatever consent the loan agreement requires.`, `The contingency is not the manager's to draw on, and a fee increase to a director's firm is a related-party transaction whatever budget line pays for it.`],
            ['g', `Approve the reallocation as ordinary budget flexibility, without checking the loan agreement, since total cost is unchanged.`, `The total is unchanged, but money has moved from protecting the project to paying an insider, and most construction loans require lender consent to move contingency. Both points were skipped.`],
            ['p', `Approve it at the board with ${a.first} voting. The manager has earned it.`, `A director voted to raise their own firm's fee out of the project's safety margin. That breaches loyalty, and probably the loan agreement too.`]
          ],
          rule: `Contingency exists for the unknown costs of the project. Moving it, especially to pay an insider, needs the approvals the budget, the loan and the conflict rules each require.`
        };
      }
    },
    {
      id: 'l8-holdback', title: 'Release it early, just this once',
      make: function (g) {
        var a = g.person(), amt = g.pick([90000, 130000, 175000]), c = g.city();
        return {
          scene: `The mechanical subcontractor on a project in ${c} has finished its work and is short of cash. ${a}, its owner, asks for the ${MB.usd(amt)} held back from its payments to be released now, weeks before the lien period ends, and offers a signed waiver of the firm's own lien rights.`,
          ask: `Do you release it?`,
          options: [
            ['s', `Not until the lien period has expired with a clear title search, or the statute's conditions for early release are met. Offer to speed up anything else that is properly due.`, `The holdback protects the owner against claims from the subcontractor's own suppliers and workers. Their rights are not ${a.first}'s to waive.`],
            ['g', `Release it against ${a.first}'s waiver.`, `The waiver covers ${a.first}'s firm. If its suppliers are unpaid and file liens, the owner may have to pay that money again, having given up the fund meant to cover it.`],
            ['p', `Release it, and other trades' holdbacks on request. Goodwill keeps a site moving.`, `That dismantles the owner's lien protection across the whole project, and where holdback is statutory it breaches the statute.`]
          ],
          rule: `Holdback and retainage are released when the conditions are met and not before. Sympathy for a trade's cash position is a reason to pay promptly what is due, never to pay early what is held for others.`,
          us: `Retainage is mostly a matter of contract, with state statutes capping it on some projects. Unconditional waivers from the lower tiers are the usual protection.`,
          ca: `Holdback is statutory. An owner who releases it early remains liable to lien claimants up to the amount that should have been retained.`
        };
      }
    },
    {
      id: 'l8-balance', title: 'Out of balance',
      builds: ['Duty of care'],
      make: function (g) {
        var a = g.person(), gap = g.m(0.6, 2, 0.1), spe = g.spe();
        return {
          scene: `Your updated cost to complete for ${spe}'s project is ${MB.usd(gap)} more than the undrawn loan and remaining equity. The loan agreement requires the borrower to report the project's status monthly and to deposit any shortfall before the lender funds another draw.\n\n${a}, the developer's principal, wants this month's report to show the old estimate. "We will find savings. Do not start a fire."`,
          ask: `What goes in the report?`,
          options: [
            ['s', `The current estimate, with a plan: where savings may come from, what equity is needed, and when. The board and investors get the same numbers.`, `A shortfall reported early can be solved with equity, value engineering or a loan modification. Reported late, it is a default and a breach of trust at once.`],
            ['g', `The old estimate, with contingency trimmed to absorb part of the overrun, while the team hunts for savings.`, `It defers the conversation by using up the project's safety margin on paper. If the savings do not appear, the gap is bigger and the report was misleading.`],
            ['p', `The old estimate, with some invoices held over to next month so the costs to date agree with it.`, `That is a false report to a lender made to obtain funding. It is an event of default, can trigger personal recourse, and may be fraud.`]
          ],
          rule: `The cost to complete is reported as it is, on time, to everyone entitled to it. Shortfalls can usually be fixed. A misstated report cannot be taken back.`
        };
      }
    },
    {
      id: 'l8-insurance', title: 'The policy that ran out',
      make: function (g) {
        var a = g.person(), spe = g.spe(), days = g.pick([19, 26, 33]);
        return {
          scene: `${spe}'s project is four months behind schedule. Checking the file, you see that the builder's risk policy expires in ${days} days, well before the new completion date. ${a}, the contractor's project manager, says the contractor's own insurance certificate "covers everything."`,
          ask: `What do you do?`,
          options: [
            ['s', `Arrange the extension with the broker now, confirm in writing who is insured and that the lender is loss payee, and diarize every policy date against the current schedule.`, `Extensions are routine if requested before expiry. After a lapse or a loss they can be impossible to get.`],
            ['g', `Rely on the contractor's certificate and revisit it at renewal.`, `A certificate is a summary of someone else's policy. It rarely covers the owner's interest in the structure, and it gives the owner no rights against the insurer.`],
            ['p', `Let it lapse for a few weeks to save the premium while the site is quiet.`, `Fire, theft and water damage are most likely on a quiet site. An uninsured loss falls on the entity, breaches the loan agreement, and the directors chose it to save a premium.`]
          ],
          rule: `Insurance is a governance item with dates. Someone owns the schedule of policies, checks it against the real construction timeline, and confirms the right parties are named.`
        };
      }
    }
  ]
});
