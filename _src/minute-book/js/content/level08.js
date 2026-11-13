MB.level({
  n: 8, title: 'Development Oversight', rank: 'Head of Development', pass: 0.7, draw: { authored: 5 },
  topics: 'Budgets, draws, change orders, liens and insurance',
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
      id: 'l8-contingency', title: 'Raiding the contingency',
      builds: ['Related-party transaction'],
      make: function (g) {
        var a = g.person(), amt = g.pick([150000, 220000, 300000]);
        return {
          scene: `The development manager is a firm owned by ${a}, who sits on the board. It asks to move ${MB.usd(amt)} from contingency to its fee. A third of the work is still ahead.`,
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
      id: 'l8-balance', title: 'Out of balance',
      builds: ['Duty of care'],
      make: function (g) {
        var a = g.person(), gap = g.m(0.6, 2, 0.1);
        return {
          scene: `Your cost to complete is ${MB.usd(gap)} more than the remaining loan and equity. The loan requires monthly reporting. ${a}, the developer, wants the old estimate shown. "We will find savings."`,
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
      id: 'l8-insurance', title: 'The policy that ran out',
      make: function (g) {
        var a = g.person(), days = g.pick([19, 26, 33]);
        return {
          scene: `The project is four months late. The builder's risk policy expires in ${days} days, before the new completion date. ${a}, for the contractor, says their certificate "covers everything."`,
          options: [
            ['s', `Extend the policy now and confirm who is insured.`, `Extensions are routine before expiry and sometimes impossible after.`],
            ['g', `Rely on the contractor's certificate.`, `A certificate summarizes someone else's policy. It rarely covers the owner.`],
            ['p', `Let it lapse a few weeks to save premium.`, `Fire and theft are likeliest on a quiet site. The loss falls on the entity.`]
          ],
          rule: `Insurance has dates. Someone must check them against the real schedule.`
        };
      }
    }
  ]
});
