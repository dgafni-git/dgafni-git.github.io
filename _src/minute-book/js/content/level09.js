MB.level({
  n: 9, title: 'Loans, Defaults and Forbearance', rank: 'Head of Credit', pass: 0.7, draw: { authored: 5, numeric: 1 }, numerics: ['payoff', 'dscr'],
  topics: 'Covenants, notices, waivers and standing still on purpose',
  role: 'You run credit at the lender.',
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
      id: 'l9-late', twist: true, title: 'Three late payments',
      make: function (g) {
        var a = g.person(), days = g.pick([12, 15, 18]);
        if (g.twist) return {
          burn: 0,
          twist: `Each late payment had been accepted in writing with rights reserved. No waiver had built up.`,
          scene: `A borrower has paid ${days} days late for three months. Each time the lender wrote: "Accepted with all rights reserved. Time remains of the essence." It is late again. ${a}, a credit officer, wants to act.`,
          options: [
            ['s', `Enforce as the documents allow, giving the default notice they require.`, `The reservations kept the lender's rights intact. It may now use them.`],
            ['g', `Accept this one too, without a letter this time.`, `The one silent acceptance starts the pattern the letters were preventing.`],
            ['p', `Accelerate without the notice the documents require.`, `Reserved rights still have to be exercised by the contract's own steps.`]
          ],
          rule: `Rights that were reserved each time can be enforced, by the steps the contract sets.`
        };
        return {
          scene: `A borrower has paid ${days} days late for three months, accepted each time without comment. It is late again. ${a}, a credit officer, wants to call the loan today.`,
          who: `${a.first}`,
          behind: `The borrower pays when its own tenants pay. ${a.first} wants to use the lateness for leverage. But three months of silence gave the borrower fair reason to think late was accepted.`,
          deep: [
            [`Waiver by conduct`, `Accept late payment repeatedly without objection and a court may find that you agreed to it.`],
            [`How to restore the terms`, `Written notice that, from a stated date, the loan will be enforced as written.`],
            [`Why it matters`, `Enforcement begun without that notice can be thrown out, and the borrower may claim damages.`]
          ],
          options: [
            ['s', `Send notice: rights reserved, strict terms from the next due date.`, `Silent acceptance built a waiver argument. Notice resets the position.`],
            ['g', `Accept it and warn the borrower by phone.`, `A call changes nothing on the record. The pattern is now four months.`],
            ['p', `Accelerate today, with no warning.`, `After three silent acceptances, a court may find waiver or bad faith.`]
          ],
          deal: {
            setup: `The borrower calls you, shaken by the notice. The late payments track when its own tenants pay rent, on the tenth.`,
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
          who: `${a.first}`,
          behind: `${a.first} wants time and would rather keep it informal, since paper means admitting the default and the amount. Those admissions are what the lender needs if the sale falls through.`,
          deep: [
            [`What the lender gives`, `Time.`],
            [`What it should get`, `A written admission of the default and the amount, guarantors signing again, deadlines, and a release of claims against the lender.`],
            [`Why the release matters`, `Borrowers in trouble often say the lender caused the trouble. A release closes that door while the borrower still wants something.`]
          ],
          options: [
            ['s', `Sign a forbearance agreement: debt acknowledged, milestones, guarantees reaffirmed, a release.`, `The lender gives time and gets certainty. On day ninety-one it can act.`],
            ['g', `Email: "We will hold off for ninety days."`, `A written promise with no acknowledgement, milestones, guarantors or release.`],
            ['p', `Shake on it. ${a.first} has always been straight.`, `In ninety days each side will remember a different deal.`]
          ],
          deal: {
            setup: `${a.first}, the borrower, needs the ninety days badly and says so. "Tell me what it costs."`,
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
          who: `The borrower`,
          behind: `The borrower wants to avoid a hostile former partner. But ${a.first} agreed to back the original loan, not a longer and costlier one. Change it without asking and the guarantee may fall away.`,
          deep: [
            [`What a guarantor promised`, `To back one specific deal. Change that deal materially and the law may free the guarantor.`],
            [`The clause`, `Guarantees often say the guarantor consents to changes in advance. Courts read those clauses narrowly.`],
            [`The cheap insurance`, `One signature. If the guarantor refuses, you find out before extending the loan, not when you sue.`]
          ],
          options: [
            ['s', `Make ${a.first}'s signed consent a condition of the amendment.`, `A guarantor who confirms the new deal cannot later claim to be released by it.`],
            ['g', `Close on the advance consent clause, after counsel reads it.`, `It may hold, but courts read guarantees narrowly and a rate increase is material.`],
            ['p', `Close. The guarantee says what it says.`, `Nobody checked. A material change behind a guarantor's back is the classic discharge.`]
          ],
          deal: {
            setup: `${a.first}, the guarantor, reads the amendment and is not eager to sign. "Why would I extend my exposure for a partner I no longer speak to?"`,
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
      id: 'l9-control', twist: true, title: 'Holding the cheque book',
      builds: ['Piercing the veil'],
      make: function (g) {
        var a = g.person();
        if (g.twist) return {
          twist: `The loan documents already gave the lender control of the cash. Not using it was the error.`,
          scene: `A borrower is in default. The loan documents provide that on default all rents flow to an account the lender controls, and are released against a budget the lender approves. ${a}, the workout officer, wants to go further and choose the borrower's contractor.`,
          options: [
            ['s', `Switch on the account and approve the budget by category.`, `These are rights the borrower agreed to. They control the cash without running the business.`],
            ['g', `Leave the account dormant to avoid looking heavy-handed.`, `An agreed protection goes unused while the cash leaks.`],
            ['p', `Switch it on, and choose the contractor as well.`, `Approving a budget is a lender's right. Picking suppliers is managing.`]
          ],
          rule: `Use every control the documents give you, and stop where they stop.`
        };
        return {
          scene: `A borrower is in default and in workout talks. ${a}, the workout officer, wants the lender to approve every payment the borrower makes and replace its contractor.`,
          who: `${a.first}`,
          behind: `${a.first} wants to stop money leaking. The more the lender decides for the borrower, the more it looks like the one running the business. The borrower's unpaid suppliers will say exactly that.`,
          deep: [
            [`The line`, `A lender may refuse, consent and monitor. Choosing which suppliers get paid is managing.`],
            [`The consequences`, `Unpaid creditors can argue that the lender ran the business, and should bear its debts or be paid after them.`],
            [`The tool built for this`, `A receiver, appointed under the security or by a court, who controls the business with legal authority.`]
          ],
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
      id: 'l9-talks', role: 'You manage this loan for the lender.', title: 'Talking about a deal',
      make: function (g) {
        var a = g.person(), b = g.person();
        return {
          scene: `Yesterday you talked through a discounted payoff with ${a}, a borrower in default, and said "I think we could live with that." This morning ${a.first} emails: "Thanks for agreeing to the discount." What should you have done before that call?`,
          who: `${a.first}`,
          behind: `${a.first} wants a discount and will treat any warm remark as a yes. Borrowers in default often claim a deal was struck, because the claim alone delays enforcement.`,
          deep: [
            [`The risk`, `Oral agreements can bind. A borrower only needs to persuade a court that terms were agreed.`],
            [`The standard protection`, `A short letter signed before talks begin: nothing binds until a written agreement is signed by named people.`],
            [`Who should talk`, `Only someone with authority to commit the lender should say what it can live with.`]
          ],
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
          who: `${a.first}`,
          behind: `${a.first}'s firm wants to take over the borrower and needs you not to object. A casual yes may give up conditions you were owed, such as having your own arrears paid first.`,
          deep: [
            [`Two lenders, one project`, `The senior lender is secured on the property. The mezzanine lender is secured on ownership of the company that owns it.`],
            [`What the agreement trades`, `The mezzanine lender may take over the borrower if it fixes the senior defaults and is a suitable owner. The senior lender gets notice and protection.`],
            [`Why not to improvise`, `A casual consent can give those conditions away.`]
          ],
          options: [
            ['s', `Read the intercreditor agreement and reply in writing on its terms.`, `The two lenders already agreed what each may do. Following it protects the senior position.`],
            ['g', `Reply "no objection" to stay cooperative.`, `A casual consent may waive conditions the agreement gave you, like cure of your default.`],
            ['p', `Ignore it and race to foreclose first.`, `The mezzanine lender usually has notice and cure rights. Racing past them is a breach.`]
          ],
          deal: {
            setup: `The agreement lets the mezzanine lender foreclose if it cures your arrears, and gives it an option to buy your loan at par. ${a.first}, at the mezzanine lender, is waiting for your reply.`,
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
    },
    {
      id: 'l9-cross', title: 'Pulling the other loan',
      make: function (g) {
        var a = g.person();
        return {
          scene: `A borrower has two loans with you. One is in default. The other is paid up, and its documents say nothing linking it to the first. ${a}, a credit officer, wants to call both. "It doubles our leverage."`,
          who: `${a.first}`,
          behind: `${a.first} wants the borrower desperate enough to settle the bad loan fast. Calling a loan that is not in default has no basis in its documents, and gives the borrower a claim worth more than the leverage.`,
          deep: [
            [`What cross-default is`, `A clause making default on one loan a default on another. It has to be written in.`],
            [`Why lenders want it`, `Leverage, and the ability to act before the second loan goes bad.`],
            [`Without it`, `Each loan stands alone. Calling a performing loan is the lender's own breach.`]
          ],
          options: [
            ['s', `Enforce the defaulted loan only.`, `Each loan's remedies come from its own documents. The second has no default.`],
            ['g', `Send a letter on the good loan "reserving rights" and hinting at default.`, `Implying a default that does not exist is a threat you cannot back up.`],
            ['p', `Call both loans.`, `Calling a performing loan with no right to is a breach, and the borrower's damages can be large.`]
          ],
          rule: `A default on one loan reaches another only if the documents say so.`
        };
      }
    },
    {
      id: 'l9-fire', title: 'After the fire',
      make: function (g) {
        var a = g.person(), amt = g.m(1, 4, 0.5);
        return {
          scene: `A fire damages part of a building. The insurer pays ${MB.usd(amt)} to you as lender. The loan documents say that, absent a default, the money is released to rebuild. ${a}, in credit, would rather apply it to the loan. "We wanted out of this one anyway."`,
          who: `${a.first}`,
          behind: `${a.first} sees a chance to shrink a loan the lender no longer likes. The borrower paid the premiums and needs the money to rebuild. Keeping it leaves a damaged building that cannot earn the rent to pay you.`,
          deep: [
            [`Why the lender gets the cheque`, `It is named on the policy so the money cannot disappear.`],
            [`What the documents decide`, `Whether insurance money rebuilds the property or repays the loan. Most let the borrower rebuild if it is not in default.`],
            [`The lender's real interest`, `A rebuilt, rent-paying building is better security than a damaged one with a smaller loan.`]
          ],
          options: [
            ['s', `Release it for rebuilding, in stages, as the documents provide.`, `The documents already decided this. There is no default.`],
            ['g', `Hold the money while the file is "under review."`, `An open-ended review is a refusal that has not been admitted.`],
            ['p', `Apply it to the loan balance.`, `That takes money the documents promised to the rebuild. It is a breach.`]
          ],
          rule: `Insurance money goes where the loan documents send it, even when the lender would prefer otherwise.`,
          deal: {
            setup: `The borrower is grateful and asks how the release will work. It needs the first payment within the month.`,
            asks: [
              ['m', `Release it in draws against inspections, with the administration fee the documents allow.`, `You control the money and are paid for the work, as agreed.`],
              ['r', `Ask for an updated appraisal and a deposit covering any rebuild shortfall.`, `Sensible protection the documents do not strictly require.`],
              ['x', `Release it only if the borrower accepts a higher interest rate.`, `Demanding a new term for something you already owe is bad faith.`],
              ['n', `Release it all at once.`, `Generous and quick. You lose oversight of the rebuild.`]
            ],
            rule: `Control how promised money is released. Do not charge for releasing it.`
          }
        };
      }
    },
    {
      id: 'l9-appraisal', burn: 2, title: 'The convenient appraisal',
      make: function (g) {
        var a = g.person();
        return {
          scene: `A loan requires the property to stay above a set value, tested by an appraisal you order. ${a}, a senior officer, wants the appraiser told to assume a forced sale within 30 days. "That gets us a default, and we get our money back."`,
          who: `${a.first}`,
          behind: `${a.first} wants out of the loan, and a default is the door. A forced-sale assumption produces a low number on purpose. The loan agreement sets the basis for the test, and it is not that one.`,
          deep: [
            [`How a value covenant works`, `If the loan exceeds a set share of the property's value, the borrower must pay it down or is in default.`],
            [`Why the basis matters`, `Market value assumes a normal selling period. A 30-day forced sale can come in 20% to 40% lower.`],
            [`The record`, `Instructions to appraisers are in writing, and they are the first thing a borrower's lawyer asks for.`]
          ],
          options: [
            ['s', `Order the appraisal on the basis the loan agreement specifies.`, `The test is whatever the agreement says it is. Nothing else counts.`],
            ['g', `Pick the most conservative appraiser on the panel and say nothing more.`, `No instruction was given, but the choice was made to get a result.`],
            ['p', `Instruct forced-sale assumptions.`, `Manufacturing a default is bad faith, and the instruction will be in the file.`]
          ],
          rule: `A lender may enforce a real default. It may not build one.`
        };
      }
    },
    {
      id: 'l9-payoff-delay', title: 'The slow payoff letter',
      make: function (g) {
        var a = g.person(), amt = g.pick([42000, 58000, 76000]);
        return {
          scene: `A borrower is refinancing elsewhere and asks for a payoff statement. Every extra month earns you ${MB.usd(amt)} in interest. ${a}, in servicing, suggests answering "in the normal course," meaning three weeks.`,
          who: `${a.first}`,
          behind: `${a.first} is adding income by being slow. The borrower's new lender has a closing date, and a late statement can cost the borrower its rate or the whole deal.`,
          deep: [
            [`The incentive`, `A lender earns interest every day a loan stays outstanding.`],
            [`The borrower's exposure`, `Its new lender's rate commitment expires. Lose it, and the refinancing may cost more or fail.`],
            [`The legal backdrop`, `Many places set a deadline for payoff statements and releases, with penalties for missing it.`]
          ],
          options: [
            ['s', `Send an accurate statement within the time the law and documents allow.`, `A borrower entitled to repay is entitled to be told how much.`],
            ['g', `Send it in three weeks.`, `Slow on purpose, to earn interest the borrower is trying to stop paying.`],
            ['p', `Delay, and add a fee the documents do not support.`, `An invented charge on a payoff is a breach, and regulators treat it severely.`]
          ],
          rule: `When a borrower is ready to repay, a lender's job is to let them.`,
          us: `Many states set deadlines for payoff statements and for releasing the mortgage afterward.`,
          ca: `Provincial laws require a lender to provide a discharge within a set time once it is paid.`
        };
      }
    },
    {
      id: 'l9-participation', title: 'The silent co-lender',
      make: function (g) {
        var a = g.person(), pct = g.pick([30, 40, 45]);
        return {
          scene: `You sold ${pct}% of a loan to another lender. That lender's consent is needed for any material change. The borrower asks for a lower rate and another year. ${a}, the relationship manager, says: "We run the loan. Tell them after."`,
          who: `${a.first}`,
          behind: `${a.first} wants to please the borrower quickly and thinks the co-lender will object. The co-lender owns part of the loan. Changing the rate changes its income without asking.`,
          deep: [
            [`What a participation is`, `The lead lender keeps the relationship and sells a share of the loan's income to another lender.`],
            [`What the participant keeps`, `A vote on changes to the rate, term, amount and security.`],
            [`Why the lead is tempted`, `It wants to keep the borrower happy, and often earns fees the participant does not share.`]
          ],
          options: [
            ['s', `Get the co-lender's consent before agreeing.`, `Part of the loan is theirs. The agreement gives them a say.`],
            ['g', `Agree with the borrower and inform the co-lender afterward.`, `They learn their income changed after it was too late to object.`],
            ['p', `Agree, and keep reporting the old terms.`, `Now it is a breach concealed with false reports.`]
          ],
          rule: `Running a loan for others gives you the work, not the right to change their deal.`
        };
      }
    },
    {
      id: 'l9-default-rate', title: 'Turning on default interest',
      make: function (g) {
        var a = g.person(), amt = g.pick([85000, 120000, 160000]);
        return {
          scene: `A borrower is late delivering financial statements but has never missed a payment. The documents allow a higher default rate after written notice and a 30-day chance to fix it. ${a}, in finance, wants ${MB.usd(amt)} of default interest booked from the due date, with no notice.`,
          who: `${a.first}`,
          behind: `${a.first} sees income in a technicality. Notice and time to fix it are what the documents require before the higher rate applies. Skipping them makes the charge uncollectable and sours a borrower who pays on time.`,
          deep: [
            [`Two kinds of default`, `Missing a payment, and breaking another promise such as delivering statements. The second usually comes with notice and time to fix it.`],
            [`Why sequence matters`, `The higher rate begins only once those steps are complete.`],
            [`The business sense`, `A borrower that pays on time is an asset. A surprise charge sends it to refinance elsewhere.`]
          ],
          options: [
            ['s', `Give the notice. Charge the rate only if the period passes unfixed.`, `The right to the higher rate starts when the documents say it does.`],
            ['g', `Accrue it quietly and raise it at payoff.`, `A surprise charge at payoff, with no notice, is a dispute waiting to happen.`],
            ['p', `Bill it now, backdated to the due date.`, `No notice and no cure period means no right to the charge.`]
          ],
          rule: `A penalty in a loan applies only after every step before it has been taken.`,
          ca: `Federal law also restricts charging a higher rate on arrears for mortgages on real property.`,
          deal: {
            setup: `The notice works. The statements arrive in a week, with an apology and a request to put this behind you both.`,
            asks: [
              ['m', `Waive the default rate for a small fee and firmer reporting dates.`, `The borrower pays for the lapse, and the covenant gets teeth.`],
              ['r', `Ask for rents to flow through an account you control.`, `Real protection. It is a big step for a borrower who has never missed a payment.`],
              ['x', `Demand a 2% penalty the documents do not provide for.`, `You cannot charge what the contract does not give you.`],
              ['n', `Accept the cure and close the file.`, `Fair and forgettable.`]
            ],
            rule: `A cured default is a chance to tighten terms, by agreement.`
          }
        };
      }
    }
  ]
});
