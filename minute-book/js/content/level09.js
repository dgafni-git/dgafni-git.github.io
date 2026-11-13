MB.level({
  n: 9, title: 'Loans, Defaults and Forbearance', rank: 'Head of Credit', pass: 0.7, draw: { authored: 5, numeric: 1 }, numerics: ['payoff', 'dscr'],
  topics: 'Covenants, notices, waivers and standing still on purpose',
  blurb: 'When a borrower stumbles, the lender\'s conduct in the following weeks decides what its documents are worth. Rights are kept by writing things down and lost by being casual.',
  concepts: [
    ['Covenant', 'A promise in the loan agreement to do or not do something: pay taxes, keep insurance, hold a coverage ratio, take on no other debt.'],
    ['Event of default', 'A breach that, after any notice and cure period the agreement gives, lets the lender use its remedies.'],
    ['Notice and cure', 'The agreed procedure before remedies: written notice to the right address and a set time to fix the breach.'],
    ['Reservation of rights', 'A letter saying that the lender\'s patience today is not a waiver of its rights tomorrow.'],
    ['Waiver', 'Giving up a right, deliberately or by conduct. A lender that repeatedly accepts late payment without comment may be found to have waived prompt payment.'],
    ['Forbearance agreement', 'A written deal in which the lender holds off enforcing for a set period in return for the borrower\'s acknowledgement of the default and the debt, milestones and usually a release.'],
    ['Guarantee', 'A separate promise by another person to pay the borrower\'s debt. Changing the loan without the guarantor\'s consent can release them.'],
    ['Intercreditor agreement', 'The contract between lenders at different levels of the capital stack that says who can act, when, and who is paid first.'],
    ['Lender liability', 'The claims a borrower can bring when a lender oversteps: breaking its own commitments, acting in bad faith, or taking control of the borrower\'s business.']
  ],
  scenarios: [
    {
      id: 'l9-late', title: 'Three late payments',
      make: function (g) {
        var a = g.person(), b = g.person(), days = g.pick([12, 15, 18]);
        return {
          scene: `A borrower of ${g.fund} has paid about ${days} days late in each of the last three months. Each time the payment was accepted without comment. This month it is late again, and ${a}, a credit officer, wants to call the loan today. "The note says time is of the essence."\n\n${b}, the borrower's principal, has told a colleague that "the lender has never minded."`,
          ask: `What should the lender do?`,
          options: [
            ['s', `Send written notice that late payments will no longer be accepted, that all rights are reserved, and that the loan terms will be strictly enforced from the next due date.`, `The lender's own conduct has created an argument that it waived prompt payment. Notice resets the position, and remedies exercised after it are much harder to attack.`],
            ['g', `Accept this payment too, and tell ${b.first} by phone that it cannot keep happening.`, `A phone call changes nothing on the record. The pattern of acceptance is now four months long, and the waiver argument is stronger.`],
            ['p', `Accelerate the loan today with no warning.`, `After three silent acceptances, calling the loan without notice invites a court to find waiver or bad faith. The lender could lose the enforcement action and face a damages claim.`]
          ],
          rule: `Rights that are not exercised should be expressly reserved. If a pattern of leniency has formed, give clear written notice before returning to strict enforcement.`,
          us: `Most loan documents include a clause that no delay is a waiver. Courts still look at conduct, and a reservation of rights letter is the standard precaution.`,
          ca: `Canadian courts require a lender to give reasonable notice before enforcing a demand, and the duty of honest contractual performance forbids misleading a borrower about the lender's intentions.`
        };
      }
    },
    {
      id: 'l9-forbear', title: 'Ninety days',
      builds: ['Ratification'],
      make: function (g) {
        var a = g.person(), amt = g.m(5, 14, 0.5);
        return {
          scene: `A ${MB.usd(amt)} loan from ${g.fund} matured last week unpaid. ${a}, the borrower's principal, has a buyer for the property and asks for ninety days to close the sale. The request is reasonable, and the credit committee is inclined to agree.`,
          ask: `How is the extra time given?`,
          options: [
            ['s', `In a signed forbearance agreement approved by the credit committee: the borrower and guarantors acknowledge the default and the amount owed, the sale milestones are dated, the lender's rights are preserved, and the borrower releases claims against the lender.`, `The lender gives time and gets certainty. If the sale fails, it enforces on day ninety-one without arguments about what was promised.`],
            ['g', `In an email from the relationship manager: "We will hold off for ninety days while you close your sale."`, `That is a written promise with none of the protections. It has no acknowledgement of the debt, no milestones, nothing from the guarantors and no release, and it may not have been approved by anyone with authority.`],
            ['p', `On a handshake. ${a.first} has always been straight with the fund.`, `In ninety days each side will remember a different deal. The borrower's version may include an open-ended extension and a promise not to charge default interest.`]
          ],
          rule: `Forbearance is a trade, and it is put in a contract. The lender gives time. The borrower gives acknowledgement, milestones, reaffirmed guarantees and a release.`
        };
      }
    },
    {
      id: 'l9-guarantor', title: 'The guarantor was not asked',
      make: function (g) {
        var a = g.person(), b = g.person();
        return {
          scene: `${g.fund} and a borrower agree to extend a loan by a year and raise the rate by two points. The loan is guaranteed personally by ${a}, a former partner of the borrower's principal, ${b}. The two no longer speak, and ${b.first} would rather not involve ${a.first}.\n\nThe guarantee contains a clause saying the guarantor consents in advance to amendments.`,
          ask: `Does the amendment close without the guarantor?`,
          options: [
            ['s', `No. Make the guarantor's signed consent and reaffirmation a condition of the amendment.`, `A guarantor who confirms the changed deal cannot later say they were released by it. If ${a.first} refuses, the lender learns something important before it extends.`],
            ['g', `Yes, relying on the advance consent clause after counsel has read it.`, `The clause may hold, and having counsel read it is sensible. But courts read guarantees narrowly, a rate increase is a material change, and the lender is choosing a legal argument over a signature.`],
            ['p', `Yes. The guarantee says what it says, and there is no need to stir things up.`, `Nobody has checked whether the clause covers this change. A material amendment made behind a guarantor's back is the standard ground for discharge.`]
          ],
          rule: `Any change to a guaranteed loan goes to the guarantor for signed consent and reaffirmation. It is the cheapest protection the lender has for the guarantee.`,
          us: `Guarantors are generally discharged by material modifications they did not consent to, unless the guarantee clearly waives that defence.`,
          ca: `The same rule applies. Alberta also requires individual guarantors to acknowledge the guarantee before a lawyer, or it cannot be enforced.`
        };
      }
    },
    {
      id: 'l9-control', title: 'Holding the cheque book',
      builds: ['Piercing the veil'],
      make: function (g) {
        var a = g.person(), spe = g.spe();
        return {
          scene: `${spe}, a borrower of ${g.fund}, is in default and negotiating a workout. ${a}, the fund's workout officer, no longer trusts the borrower's management and proposes that the fund approve every payment the borrower makes, choose which suppliers are paid, and replace the site contractor with one the fund prefers.`,
          ask: `How should the lender protect itself?`,
          options: [
            ['s', `Through its documents: tighter reporting, a budget the borrower must follow, cash controls the loan allows, and consent rights over major decisions. If control is truly needed, seek a receiver or require an independent restructuring officer.`, `The lender watches closely and can refuse, but the borrower still runs its own business. A court-appointed receiver takes control with the court's authority and without the lender's liability.`],
            ['g', `Join the borrower's weekly calls and "strongly recommend" which suppliers get paid.`, `A recommendation from the party that can foreclose is hard to tell from an instruction. Enough of them, and the unpaid suppliers will say the lender was running the company.`],
            ['p', `Take over payment approvals and replace the contractor.`, `A lender that runs its borrower's operations can be held liable to the borrower's other creditors, can see its own claim pushed behind theirs, and can take on the liabilities of an operator.`]
          ],
          rule: `A lender may monitor, consent and refuse. It should not manage. When management must change, the route is a receiver or an independent officer, so that control comes with legal authority.`,
          us: `Lenders that dominate a borrower risk equitable subordination of their claims in bankruptcy and claims from other creditors.`,
          ca: `Secured lenders usually act through a private or court-appointed receiver. Before enforcing against an insolvent business, a lender must give the statutory notice and wait ten days.`
        };
      }
    },
    {
      id: 'l9-talks', title: 'Talking about a deal',
      make: function (g) {
        var a = g.person(), b = g.person();
        return {
          scene: `A borrower in default wants to negotiate. ${a}, its principal, calls ${b}, the relationship manager at ${g.fund}, and they talk through a discounted payoff. ${b.first} says, "I think we could live with that." The next morning ${a.first} emails: "Thanks for agreeing to the discount. Please confirm."`,
          ask: `What should the lender have done before that call?`,
          options: [
            ['s', `Signed a pre-negotiation agreement with the borrower: discussions are confidential, nothing binds either side until a written agreement is signed by authorized people, and no rights are waived in the meantime.`, `Both sides can then talk freely. A hopeful remark on a call cannot become an alleged settlement.`],
            ['g', `Marked its emails "without prejudice" and kept negotiating.`, `The label helps keep settlement talks out of evidence. It does not stop the borrower from claiming that a binding deal was reached, which is the claim now on the table.`],
            ['p', `Nothing. A phone conversation cannot bind a lender.`, `Oral agreements and promises that someone relied on are litigated all the time. Even a claim that fails can stall enforcement for months.`]
          ],
          rule: `Before negotiating a workout, agree in writing that nothing is agreed until it is signed. Then only people with authority should say what the lender can live with.`
        };
      }
    },
    {
      id: 'l9-intercreditor', title: 'The mezzanine lender calls',
      builds: ['Senior and mezzanine debt'],
      make: function (g) {
        var a = g.person(), spe = g.spe('LLC');
        return {
          scene: `${g.fund} holds the senior mortgage on a project owned by ${spe}. A mezzanine lender holds a pledge of the ownership interests in ${spe}. The borrower has defaulted on both loans. ${a}, from the mezzanine lender, emails: they plan to foreclose on the pledge and take over the borrower, and they ask the fund to confirm it has no objection.`,
          ask: `How do you respond?`,
          options: [
            ['s', `Read the intercreditor agreement first. Respond in writing according to its terms: what notices are due, whether the mezzanine lender qualifies as a permitted transferee, and what it must cure on the senior loan.`, `The two lenders already agreed what each may do in this situation. Following that agreement protects the senior position and avoids a claim that the fund interfered.`],
            ['g', `Reply "no objection" to keep the relationship cooperative.`, `A casual consent may waive conditions the intercreditor agreement gave the senior lender, such as cure of the senior default or a replacement guarantor.`],
            ['p', `Ignore the email and start the senior foreclosure quickly, before they can act.`, `Intercreditor agreements usually give the mezzanine lender notice and time to cure. Racing past those rights is a breach and can expose the senior lender to damages.`]
          ],
          rule: `When more than one lender has a claim on a project, the intercreditor agreement governs how they deal with each other. Read it before answering anything.`
        };
      }
    }
  ]
});
