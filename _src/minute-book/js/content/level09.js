MB.level({
  n: 9, title: 'Loans, Defaults and Forbearance', rank: 'Head of Credit', pass: 0.7, draw: { authored: 5, numeric: 1 }, numerics: ['payoff', 'dscr'],
  topics: 'Covenants, notices, waivers and standing still on purpose',
  blurb: 'When a borrower stumbles, the lender keeps its rights by writing things down and loses them by being casual.',
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
        var a = g.person(), days = g.pick([12, 15, 18]);
        return {
          scene: `A borrower has paid ${days} days late for three months, accepted each time without comment. It is late again. ${a}, a credit officer, wants to call the loan today.`,
          options: [
            ['s', `Send notice: rights reserved, strict terms from the next due date.`, `Silent acceptance built a waiver argument. Notice resets the position.`],
            ['g', `Accept it and warn the borrower by phone.`, `A call changes nothing on the record. The pattern is now four months.`],
            ['p', `Accelerate today, with no warning.`, `After three silent acceptances, a court may find waiver or bad faith.`]
          ],
          deal: {
            setup: `The borrower calls, shaken by the notice. The late payments track when its own tenants pay rent, on the tenth.`,
            asks: [
              ['m', `Offer to move the due date to the fifteenth for a small amendment fee.`, `It fixes the real problem, and the borrower pays you for it.`],
              ['r', `Ask for a three-month interest reserve, funded now.`, `Real protection. The borrower may not have the cash.`],
              ['x', `Bill default interest for the three months you already accepted.`, `You took those payments without objection. Charging for them now invites a bad-faith fight.`],
              ['n', `Leave the terms as they are.`, `The notice stands and nothing changes.`]
            ],
            rule: `Solve the borrower's problem and charge for it. Do not charge for the past you waived.`
          },
          rule: `Reserve rights you are not using. Give written notice before returning to strict terms.`,
          us: `No-waiver clauses help, but courts still look at conduct. A reservation of rights letter is the standard precaution.`,
          ca: `Lenders must give reasonable notice before enforcing, and may not mislead a borrower about their intentions.`
        };
      }
    },
    {
      id: 'l9-forbear', title: 'Ninety days',
      builds: ['Ratification'],
      make: function (g) {
        var a = g.person(), amt = g.m(5, 14, 0.5);
        return {
          scene: `A ${MB.usd(amt)} loan matured unpaid. ${a}, the borrower, has a buyer and asks for ninety days. The credit committee is inclined to agree.`,
          options: [
            ['s', `Sign a forbearance agreement: debt acknowledged, milestones, guarantees reaffirmed, a release.`, `The lender gives time and gets certainty. On day ninety-one it can act.`],
            ['g', `Email: "We will hold off for ninety days."`, `A written promise with no acknowledgement, milestones, guarantors or release.`],
            ['p', `Shake on it. ${a.first} has always been straight.`, `In ninety days each side will remember a different deal.`]
          ],
          deal: {
            setup: `${a.first} needs the ninety days badly and says so. "Tell me what it costs."`,
            asks: [
              ['m', `A 1% forbearance fee, with interest kept current.`, `Market terms. The borrower pays for time and keeps its dignity.`],
              ['r', `A fee, a charge on ${a.first}'s other property, and a share of sale proceeds above the debt.`, `More security and some upside, all documented. Counsel checks the total cost against rate limits.`],
              ['x', `All of that, plus a signed deed held in escrow, to record if a date is missed.`, `A pre-signed deed skips foreclosure. Courts often refuse it as a clog on the right to redeem.`],
              ['n', `Just the standard forbearance terms.`, `Time given, rights preserved, nothing extra.`]
            ],
            rule: `Price the time and take more security. Never take the borrower's right to redeem.`
          },
          rule: `Forbearance is a trade, and it goes in a contract.`
        };
      }
    },
    {
      id: 'l9-guarantor', title: 'The guarantor was not asked',
      make: function (g) {
        var a = g.person();
        return {
          scene: `The lender and borrower agree to extend the loan a year and raise the rate. The guarantor, ${a}, has fallen out with the borrower. The guarantee says the guarantor consents in advance to amendments.`,
          options: [
            ['s', `Make ${a.first}'s signed consent a condition of the amendment.`, `A guarantor who confirms the new deal cannot later claim to be released by it.`],
            ['g', `Close on the advance consent clause, after counsel reads it.`, `It may hold, but courts read guarantees narrowly and a rate increase is material.`],
            ['p', `Close. The guarantee says what it says.`, `Nobody checked. A material change behind a guarantor's back is the classic discharge.`]
          ],
          deal: {
            setup: `${a.first} reads the amendment and is not eager to sign. "Why would I extend my exposure for a partner I no longer speak to?"`,
            asks: [
              ['m', `Offer to cap the guarantee at today's balance in return for the signature.`, `A fair trade. You give up growth in the guarantee and keep the guarantee.`],
              ['r', `Ask for the signature plus a pledge of ${a.first}'s interest in another property.`, `More security than you had. ${a.first} has no reason to give it cheaply.`],
              ['x', `Say the loan will be called tomorrow unless ${a.first} signs tonight.`, `The loan is not in default. A threat you have no right to carry out is duress.`],
              ['n', `Simply ask ${a.first} to sign.`, `No sweetener. It may take a while.`]
            ],
            rule: `Give a guarantor a reason to sign. Do not invent a threat.`
          },
          rule: `Any change to a guaranteed loan goes to the guarantor for signed consent.`,
          us: `Guarantors are generally discharged by material changes they did not consent to, unless the guarantee clearly waives that.`,
          ca: `The same rule applies. Alberta also requires individual guarantors to acknowledge the guarantee before a lawyer.`
        };
      }
    },
    {
      id: 'l9-control', title: 'Holding the cheque book',
      builds: ['Piercing the veil'],
      make: function (g) {
        var a = g.person();
        return {
          scene: `A borrower is in default and in workout talks. ${a}, the workout officer, wants the lender to approve every payment the borrower makes and replace its contractor.`,
          options: [
            ['s', `Tighten reporting and consent rights. If control is needed, seek a receiver.`, `The lender can watch and refuse. A receiver takes control with legal authority.`],
            ['g', `Join weekly calls and "strongly recommend" who gets paid.`, `A recommendation from the party that can foreclose reads as an instruction.`],
            ['p', `Take over payments and replace the contractor.`, `A lender that runs its borrower can be liable to the borrower's other creditors.`]
          ],
          rule: `A lender may monitor, consent and refuse. It should not manage.`,
          us: `Lenders that dominate a borrower risk having their claims pushed behind other creditors in bankruptcy.`,
          ca: `Lenders usually act through a receiver, and must give statutory notice and wait ten days before enforcing against an insolvent business.`
        };
      }
    },
    {
      id: 'l9-talks', title: 'Talking about a deal',
      make: function (g) {
        var a = g.person(), b = g.person();
        return {
          scene: `On a call about a discounted payoff, ${b}, the lender's manager, said "I think we could live with that." Next morning ${a}, the borrower, emails: "Thanks for agreeing." What should have come first?`,
          options: [
            ['s', `A signed pre-negotiation agreement: nothing binds until authorized people sign.`, `Both sides can talk freely, and a hopeful remark cannot become a settlement.`],
            ['g', `Marking the emails "without prejudice."`, `The label keeps talks out of evidence. It does not stop a claim that a deal was reached.`],
            ['p', `Nothing. A phone call cannot bind a lender.`, `Oral agreements are litigated all the time, and even a weak claim stalls enforcement.`]
          ],
          rule: `Before negotiating a workout, agree in writing that nothing is agreed until signed.`
        };
      }
    },
    {
      id: 'l9-intercreditor', title: 'The mezzanine lender calls',
      builds: ['Senior and mezzanine debt'],
      make: function (g) {
        var a = g.person();
        return {
          scene: `You hold the senior mortgage. ${a}, from the mezzanine lender, emails that they will foreclose on the ownership pledge and asks you to confirm no objection.`,
          options: [
            ['s', `Read the intercreditor agreement and reply in writing on its terms.`, `The two lenders already agreed what each may do. Following it protects the senior position.`],
            ['g', `Reply "no objection" to stay cooperative.`, `A casual consent may waive conditions the agreement gave you, like cure of your default.`],
            ['p', `Ignore it and race to foreclose first.`, `The mezzanine lender usually has notice and cure rights. Racing past them is a breach.`]
          ],
          deal: {
            setup: `The agreement lets the mezzanine lender foreclose if it cures your arrears, and gives it an option to buy your loan at par. ${a.first} is waiting.`,
            asks: [
              ['m', `Confirm consent once the senior arrears are cured, and waive nothing else.`, `Exactly what the agreement provides. You get paid current.`],
              ['r', `Invite them to use the option and buy your loan at par plus costs.`, `A clean exit at full value. They may not have the money.`],
              ['x', `Ask for a consent fee the agreement does not provide for.`, `Charging for a consent you are bound to give is a breach, and they will have it in writing.`],
              ['n', `Reply that you reserve all rights.`, `Safe, and it moves nothing forward.`]
            ],
            rule: `Take everything the intercreditor agreement gives you, and nothing it does not.`
          },
          rule: `When several lenders have claims, the intercreditor agreement governs. Read it first.`
        };
      }
    }
  ]
});
