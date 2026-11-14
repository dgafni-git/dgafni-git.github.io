/* The capstone: one continuous story in a fixed order. The cast is generated once per sitting. */
(function () {
  function story(g) {
    return {
      ceo: g.person(), officer: g.person(), dirA: g.person(), dirB: g.person(), cfo: g.person(), whistle: g.person(),
      fund: g.fund, pct: g.pick([14, 16, 18]), over: g.pick([15, 20, 25]), amt: g.m(0.4, 0.9, 0.1)
    };
  }

  MB.level({
    n: 13, title: 'The Chair', rank: 'Chair of the Board', pass: 0.8, fixed: true, draw: { authored: 8 }, story: story,
    topics: 'One board, one complaint, eight decisions that are yours to lead',
    role: 'You chair the board of the fund\'s general partner.',
    blurb: 'You chair the board. A complaint arrives about an insider\'s contract. Eight decisions, in order, each following from the last.',
    concepts: [
      ['The chair\'s role', 'The chair runs the board, not the company: sets the agenda, makes sure directors get proper information, manages conflicts in the room, and makes sure decisions are actually taken and recorded.'],
      ['Independence', 'A director is independent on a question when they have no interest in it and no relationship that would reasonably be seen to affect their judgment.'],
      ['Whistleblower handling', 'A complaint goes to people independent of its subject, the complainant is protected from retaliation, and records are preserved from the first hour.'],
      ['Executive session', 'A part of a board meeting held without management, or without conflicted directors, so that the others can speak freely.'],
      ['Mandate', 'The written terms that give a committee its task, its powers, its budget for advisers and its reporting line.'],
      ['Remediation', 'Fixing what an investigation finds: recovering money, correcting contracts, disclosing to those entitled to know, and changing the controls that failed.'],
      ['Tone at the top', 'What the board and senior people actually do when a rule is inconvenient. It teaches the organization more than any written policy.']
    ],
    scenarios: [
      {
        id: 'l13-1', burn: 0, title: 'The email arrives',
        builds: ['Litigation hold', 'Disclosure and recusal'],
        make: function (g) {
          var s = g.story;
          if (s.alt) return {
            twist: `The complaint touched you this time. Even a small mention means someone else leads.`,
            scene: `${s.whistle}, a project accountant, emails you. ${s.officer}, an officer of the general partner, owns the firm managing the fund's properties, on a contract nobody approved. A director has a hidden stake. The email adds that you signed one of the firm's invoices last year.`,
            options: [
              ['s', `Hand the lead to an independent director, protect ${s.whistle.first}, and preserve records.`, `You are named, however slightly. Someone untouched should run the first look.`],
              ['g', `Lead it yourself, and mention the invoice when you brief the board.`, `Open about it, and still directing an inquiry that touches you.`],
              ['p', `Brief the board and leave out the invoice.`, `Hiding your own part in a complaint about hidden interests ends your authority as chair.`]
            ],
            rule: `Anyone named in a complaint, however lightly, steps back from running it.`
          };
          return {
            scene: `${s.whistle}, a project accountant, emails you. ${s.officer}, an officer of the general partner, owns the firm managing the fund's properties, on an unapproved contract at inflated fees. A director has a hidden stake. ${s.ceo}, the chief executive, is ${s.officer.first}'s old friend.`,
            behind: `${s.whistle.first} is taking a risk by reporting. ${s.officer.first} profits from the fees. ${s.ceo.first} has a friendship to protect. Who hears the complaint first decides whether it is examined or managed.`,
            deep: [
              [`The first hour`, `Protect the person, preserve the records, and choose who investigates.`],
              [`Why independence comes first`, `Whoever controls the first look controls what gets found.`],
              [`Retaliation`, `It is unlawful in many settings, and it guarantees there will be no second report.`]
            ],
            options: [
              ['s', `Protect ${s.whistle.first}, brief the unconflicted directors, hire independent counsel, and preserve records.`, `People without bias judge it, the evidence is secured, and the complainant is safe.`],
              ['g', `Ask ${s.ceo.first} to look into it quietly.`, `The investigator is the accused's close friend. Whatever the result, it will not be believed.`],
              ['p', `Forward the email to ${s.officer.first} for an explanation.`, `The accused now knows who complained and what to tidy up.`]
            ],
            rule: `A complaint about insiders goes to people independent of them, with records preserved at once.`,
            us: `Retaliation against whistleblowers is unlawful under several federal and state statutes.`,
            ca: `The Criminal Code prohibits retaliation against employees who report offences.`
          };
        }
      },
      {
        id: 'l13-2', burn: 0, title: 'Calling the meeting',
        builds: ['Notice', 'Quorum'],
        make: function (g) {
          var s = g.story;
          if (s.alt) return {
            twist: `A proper meeting was already two days away. A special one would only have been slower.`,
            scene: `An independent director's first look clears your one invoice as routine, and says the rest has substance. ${s.dirA} is believed to be the director with the stake. The regular board meeting is in two days, with a full agenda.`,
            options: [
              ['s', `Put it first on that agenda, with a written summary and a session without ${s.dirA.first} or management.`, `A proper meeting is two days away. Use it, and give this the first hour.`],
              ['g', `Call a separate special meeting for next week.`, `Proper, and a week slower than it needs to be while fees keep flowing.`],
              ['p', `Phone each director beforehand to settle the outcome.`, `A meeting whose result was fixed by private calls is not a board deciding.`]
            ],
            rule: `Use the fastest proper forum, and give a serious matter real time in it.`
          };
          return {
            scene: `Counsel's first look says the complaint has substance. ${s.dirA} is believed to be the director with the stake. The next scheduled board meeting is five weeks away with a full agenda.`,
            behind: `Delay suits anyone who benefits from the contract, because the fees keep flowing. A weekend of private calls would let the chief executive shape each director's view one at a time.`,
            deep: [
              [`The chair's real power`, `The agenda. What gets a meeting gets a decision.`],
              [`Why not a round of calls`, `A board acts together. One-to-one calls produce no resolution and no minutes.`],
              [`A session without management`, `It lets the independent directors speak freely.`]
            ],
            options: [
              ['s', `Call a special meeting on this alone, with a session without ${s.dirA.first} or management.`, `The board acts properly convened and informed, with those under review out of the room.`],
              ['g', `Add it under "other business" in five weeks.`, `Five weeks of fees keep flowing, and a serious matter gets a tired board.`],
              ['p', `Phone each director separately this weekend.`, `A series of calls is not a meeting. Nothing is validly decided or minuted.`]
            ],
            rule: `The chair's first tool is the agenda. Serious matters get their own properly called meeting.`
          };
        }
      },
      {
        id: 'l13-3', title: 'The director who wants to stay',
        builds: ['Conflict of interest', 'Minutes'],
        make: function (g) {
          var s = g.story;
          if (s.alt) return {
            twist: `The director resigned on the spot. That ended the seat, not the inquiry.`,
            scene: `${s.dirA} admits a ${s.pct}% interest in ${s.officer.first}'s firm, never disclosed, and offers to resign on the spot. "Accept it, and we can all skip the discussion."`,
            options: [
              ['s', `Accept it, and still record the disclosure and continue the review.`, `A resignation ends the seat. It does not end the questions, or the fund's claims.`],
              ['g', `Accept it and close the item.`, `The board never learns what the interest was or what it cost.`],
              ['p', `Refuse the resignation, to keep ${s.dirA.first} under the board's authority.`, `A board cannot refuse a resignation. The attempt achieves nothing.`]
            ],
            rule: `Resignation is not disclosure. Get the facts on the record first.`
          };
          return {
            scene: `${s.dirA} admits a ${s.pct}% interest in ${s.officer.first}'s firm, never disclosed, and insists on staying. "I know the facts best. I will simply not vote."`,
            who: `${s.dirA.first}`,
            behind: `${s.dirA.first} wants to hear what the board thinks, and to influence it by being present. People do not say what they believe about a colleague sitting across the table.`,
            deep: [
              [`The rule in practice`, `Disclose, answer questions, leave.`],
              [`Why leaving matters`, `Even a silent presence changes what people are willing to say.`],
              [`The minutes`, `Record the disclosure, the departure and the return.`]
            ],
            options: [
              ['s', `${s.dirA.first} discloses for the minutes, answers questions, then leaves the room.`, `The board gets the facts, then talks freely. Nobody speaks candidly about a colleague who is watching.`],
              ['g', `${s.dirA.first} stays throughout and abstains.`, `One vote is kept out, but the others soften what they say.`],
              ['p', `${s.dirA.first} stays and votes.`, `A vote by a director with a hidden interest taints the resolution.`]
            ],
            rule: `A conflicted director discloses, answers questions, and leaves for the discussion and vote.`
          };
        }
      },
      {
        id: 'l13-4', burn: 2, title: 'Who investigates?',
        builds: ['Special committee'],
        make: function (g) {
          var s = g.story;
          if (s.alt) return {
            twist: `Only one director was truly independent. The committee needed help from outside the board.`,
            scene: `${s.ceo} proposes a review committee of the two outside directors. You learn that one of them, ${s.dirB}, has a consulting contract with ${s.officer.first}'s firm.`,
            options: [
              ['s', `The one independent director, joined by an outside lawyer or retired judge, under a written mandate.`, `Independence can be borrowed from outside the board when there is too little inside it.`],
              ['g', `Both outside directors, with ${s.dirB.first}'s contract disclosed.`, `Disclosed, and half the committee is still paid by the firm under review.`],
              ['p', `Accept the proposal and say nothing about the contract.`, `The committee's findings would be worthless the day the contract surfaced.`]
            ],
            rule: `If the board has too few independent members, bring in independent outsiders.`
          };
          return {
            scene: `${s.ceo} proposes a review committee: ${s.dirB}, who vacations with ${s.officer.first}'s family, and ${s.cfo}, whose team paid the invoices. The firm's own lawyers would advise.`,
            who: `${s.ceo.first}`,
            behind: `${s.ceo.first} wants the inquiry in friendly hands. A committee can be designed to find nothing, and its membership usually tells you which kind it is.`,
            deep: [
              [`Three tests of a committee`, `Members with no ties, a written mandate with real powers, and advisers who answer only to it.`],
              [`The lawyers`, `A firm that also acts for the person under review cannot advise the people reviewing them.`],
              [`The payoff`, `Findings that investors, lenders and regulators will accept.`]
            ],
            options: [
              ['s', `The two outside directors, a written mandate, and advisers they choose.`, `Independent in fact, with authority on paper. Its findings will carry weight.`],
              ['g', `One outside director and ${s.cfo.first}, with the usual lawyers behind a wall.`, `One independent voice, but finance is reviewing its own payments.`],
              ['p', `Adopt ${s.ceo.first}'s proposal.`, `A committee of the subject's friends has its conclusion decided in advance.`]
            ],
            rule: `A committee is only as credible as its independence, its mandate and its advisers.`
          };
        }
      },
      {
        id: 'l13-5', title: 'The findings',
        builds: ['Related-party transaction', 'Arm\'s length'],
        make: function (g) {
          var s = g.story;
          if (s.alt) return {
            twist: `The fees turned out to be at market. The failure was process, so the remedy was process.`,
            scene: `The committee reports: an expired one-page engagement letter, no approval by anyone, and fees in line with three comparable managers. The work is good. ${s.ceo} says: "No harm done. Leave it."`,
            options: [
              ['s', `Put a written contract through independent approval and the advisory committee. No money is owed back.`, `Nothing was overpaid, so nothing is recovered. The missing approval is still fixed properly.`],
              ['g', `Demand a partial refund anyway, to make a point.`, `There was no loss. Taking money to make a point is its own unfairness.`],
              ['p', `Leave it, as ${s.ceo.first} says.`, `An unapproved insider contract stays unapproved.`]
            ],
            rule: `Match the remedy to the harm. Fix the approval even when the price was fair.`
          };
          return {
            scene: `The committee reports: an expired one-page engagement letter, fees ${s.over}% above market, about ${MB.usd(s.amt)} too much over two years, and competent work. ${s.ceo} says: "Paper the contract and move on."`,
            who: `${s.ceo.first}`,
            behind: `${s.ceo.first} wants it over without embarrassing a friend. Papering the contract at the old rates would turn two years of overcharging into something the board approved.`,
            deep: [
              [`Three steps`, `Recover the overpayment, reset the contract through independent approval, and keep the insider out of both.`],
              [`Why not paper it retroactively`, `That approves the overcharge with full knowledge of it.`],
              [`The arithmetic`, `Twenty percent over market on $1.5 million a year, for two years, is $600,000 of the fund's money.`]
            ],
            options: [
              ['s', `Recover the excess and tender the mandate, with ${s.officer.first} out of both decisions.`, `The fund is made whole, and the firm can keep the work if it wins on merit.`],
              ['g', `Sign a backdated contract at the existing rates.`, `The board has now knowingly approved above-market fees to an insider.`],
              ['p', `Take no action. The buildings are full.`, `Doing nothing makes every director a party to it.`]
            ],
            rule: `Recover the loss, fix the terms through independent approval, and keep the insider out.`
          };
        }
      },
      {
        id: 'l13-6', title: 'Telling the investors',
        builds: ['Advisory committee', 'Good faith'],
        make: function (g) {
          var s = g.story;
          if (s.alt) return {
            twist: `No money was lost, and the duty to tell the investors was exactly the same.`,
            scene: `The agreement requires related-party dealings to be reported to the investors' advisory committee. No money was lost. ${s.cfo} says: "Nothing to report, then. Why worry them over paperwork?"`,
            options: [
              ['s', `Report it to the advisory committee now, with the findings.`, `The duty is to report the dealing, whether or not it cost anything.`],
              ['g', `Mention it briefly in the annual report.`, `Late, and framed so that nobody notices.`],
              ['p', `Report nothing, since there was no loss.`, `The duty has no exception for dealings that turned out fine.`]
            ],
            rule: `A duty to disclose a conflict does not depend on the conflict having cost anything.`
          };
          return {
            scene: `The agreement requires prompt reports of related-party dealings and material breaches. A refinancing closes in six weeks with a no-affiliate-contracts certificate. ${s.cfo} says: "Tell them in the annual report."`,
            who: `${s.cfo.first}`,
            behind: `${s.cfo.first} wants to avoid alarming investors and endangering the refinancing. Waiting means the lender relies on a certificate the general partner knows is untrue.`,
            deep: [
              [`Who is entitled to know`, `The advisory committee, the investors, and any lender relying on a certificate.`],
              [`Timing`, `Agreements usually say promptly. An annual report months later is not prompt.`],
              [`The certificate`, `Signing a statement known to be untrue is a personal risk for whoever signs.`]
            ],
            options: [
              ['s', `Report now to the investors, and to the lender before it relies on the certificate.`, `They hear it from the general partner, promptly, with the fix under way.`],
              ['g', `A paragraph in the annual report, and nothing to the lender.`, `Each statement might be accurate. Together they are built to keep people from knowing.`],
              ['p', `No disclosure. It was handled internally.`, `That turns a problem the board handled well into a cover-up.`]
            ],
            rule: `Disclosure follows the agreements, on time, to everyone entitled.`
          };
        }
      },
      {
        id: 'l13-7', burn: 2, title: 'The ultimatum',
        builds: ['Duty of loyalty', 'Business judgment rule'],
        make: function (g) {
          var s = g.story;
          if (s.alt) return {
            twist: `The pressure this time was to stay silent about a harmless breach. The answer did not change.`,
            scene: `${s.ceo} sees you alone. "Nothing was lost. Report this to the investors and you humiliate ${s.officer.first} for nothing, and I resign before the refinancing. Keep it inside the board."`,
            options: [
              ['s', `Hold the decision to report, tell the board about this conversation, and prepare interim leadership.`, `What the investors are owed is not the chief executive's to trade.`],
              ['g', `Agree to delay the report until after the refinancing.`, `It swaps a duty to investors for six quiet weeks.`],
              ['p', `Agree to keep it inside the board.`, `The chair has joined in withholding what the agreement says must be told.`]
            ],
            rule: `What investors are entitled to hear is not the chief executive's to bargain with.`
          };
          return {
            scene: `${s.ceo} sees you alone. "Go after ${s.officer.first} for that money and I resign the week before the refinancing. Drop it and we all get through this." There is no succession plan.`,
            who: `${s.ceo.first}`,
            behind: `${s.ceo.first} is using the refinancing as leverage to protect ${s.officer.first}. The threat works only if the board believes it cannot manage without one person.`,
            deep: [
              [`What the threat tests`, `Whether the board governs, or is governed.`],
              [`Succession`, `A board with a plan for replacing its chief executive cannot be held hostage by one.`],
              [`The record`, `Report the conversation to the board. Private bargains between a chair and a chief executive are how boards lose their independence.`]
            ],
            options: [
              ['s', `Hold the board's decision, report the conversation, and prepare interim leadership.`, `The board decides for the fund, not under threat from an executive.`],
              ['g', `Quietly drop the recovery if ${s.ceo.first} stays through the refinancing.`, `It trades the fund's money to settle a personal threat, and teaches that ultimatums work.`],
              ['p', `Agree and wind up the committee.`, `The chair has overridden an independent committee to keep an executive.`]
            ],
            rule: `The board governs management. The chair protects that when it is tested.`
          };
        }
      },
      {
        id: 'l13-8', burn: 0, title: 'Closing the loop',
        builds: ['Delegation of authority', 'Registers'],
        make: function (g) {
          var s = g.story;
          if (s.alt) return {
            twist: `No loss this time. The controls that failed were the same ones.`,
            scene: `The contract is approved, the investors were told, ${s.dirA} has left the board, and the refinancing closed. A director says: "Nothing was even lost. We do not need new controls for a paperwork slip."`,
            options: [
              ['s', `Adopt a few owned controls: conflict declarations, a contract register, an authority matrix.`, `The slip ran for two years unnoticed. Next time the price may not be fair.`],
              ['g', `Send a memo reminding everyone of their obligations.`, `They knew their obligations. Nothing existed to catch a lapse.`],
              ['p', `Nothing further.`, `A board that learns nothing from a near miss is waiting for a real one.`]
            ],
            rule: `A near miss is the cheapest lesson a board gets. Use it.`
          };
          return {
            scene: `The fees are repaid, the mandate was tendered, ${s.dirA} has resigned, and the refinancing closed. A director says: "An isolated incident. Let us not bury the company in policy."`,
            behind: `The director wants to move on, which is human. The gaps that let this run for two years are still open.`,
            deep: [
              [`From incident to control`, `Each failure maps to a fix: conflict declarations, a contract register, an approvals list, a channel for reports.`],
              [`Ownership`, `Each control needs a named person and a review date.`],
              [`The board's own review`, `Ask every year whether the board would catch this sooner now.`]
            ],
            options: [
              ['s', `Adopt a few owned controls: conflict declarations, a contract register, an authority matrix.`, `Each control answers a way this went wrong. Next time the system finds it in weeks.`],
              ['g', `Send a memo reminding everyone of their obligations.`, `They knew their obligations. What was missing was anything that would catch a lapse.`],
              ['p', `Nothing further. Look forward.`, `A board that learns nothing has decided to let it happen again.`]
            ],
            rule: `An incident is closed when the weakness behind it is fixed and someone owns the fix.`
          };
        }
      }
    ]
  });
})();
