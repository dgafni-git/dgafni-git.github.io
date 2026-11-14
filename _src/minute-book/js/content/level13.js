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
          return {
            scene: `${s.whistle}, a project accountant, emails you. ${s.officer}, an officer of the general partner, owns the firm managing the fund's properties, on an unapproved contract at inflated fees. A director has a hidden stake. ${s.ceo}, the chief executive, is ${s.officer.first}'s old friend.`,
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
          return {
            scene: `Counsel's first look says the complaint has substance. ${s.dirA} is believed to be the director with the stake. The next scheduled board meeting is five weeks away with a full agenda.`,
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
          return {
            scene: `${s.dirA} admits a ${s.pct}% interest in ${s.officer.first}'s firm, never disclosed, and insists on staying. "I know the facts best. I will simply not vote."`,
            who: `${s.dirA.first}`,
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
          return {
            scene: `${s.ceo} proposes a review committee: ${s.dirB}, who vacations with ${s.officer.first}'s family, and ${s.cfo}, whose team paid the invoices. The firm's own lawyers would advise.`,
            who: `${s.ceo.first}`,
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
          return {
            scene: `The committee reports: an expired one-page engagement letter, fees ${s.over}% above market, about ${MB.usd(s.amt)} too much over two years, and competent work. ${s.ceo} says: "Paper the contract and move on."`,
            who: `${s.ceo.first}`,
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
          return {
            scene: `The agreement requires prompt reports of related-party dealings and material breaches. A refinancing closes in six weeks with a no-affiliate-contracts certificate. ${s.cfo} says: "Tell them in the annual report."`,
            who: `${s.cfo.first}`,
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
          return {
            scene: `${s.ceo} sees you alone. "Go after ${s.officer.first} for that money and I resign the week before the refinancing. Drop it and we all get through this." There is no succession plan.`,
            who: `${s.ceo.first}`,
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
          return {
            scene: `The fees are repaid, the mandate was tendered, ${s.dirA} has resigned, and the refinancing closed. A director says: "An isolated incident. Let us not bury the company in policy."`,
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
