/* The capstone: one continuous story, fixed order. The chair, the fund and the cast are generated once per sitting. */
(function () {
  function story(seedGen) {
    var g = seedGen;
    return {
      gp: g.spe('Inc.').replace(/ (Holdings|Developments|Lands|Residences) /, ' GP '),
      ceo: g.person(), officer: g.person(), dirA: g.person(), dirB: g.person(), cfo: g.person(), whistle: g.person(),
      fund: g.fund, pct: g.pick([14, 16, 18]), over: g.pick([15, 20, 25]), amt: g.m(0.4, 0.9, 0.1), city: g.city()
    };
  }
  function S(g) { return g.story; }

  MB.level({
    n: 13, title: 'The Chair', rank: 'Chair of the Board', pass: 0.8, fixed: true, draw: { authored: 8 }, story: story,
    topics: 'One board, one complaint, eight decisions that are yours to lead',
    blurb: 'You chair the board of a fund\'s general partner. A complaint arrives about an insider\'s contract. Nothing here is new. It is everything from the first twelve meetings at once, with you setting the agenda. The story runs in order, and each item follows from the last.',
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
        id: 'l13-1', title: 'The email arrives',
        builds: ['Litigation hold', 'Disclosure and recusal'],
        make: function (g) {
          var s = S(g);
          return {
            scene: `You chair the board of ${s.gp}, the general partner of a real estate fund sponsored by ${s.fund}. On a Friday evening an email reaches you from ${s.whistle}, a project accountant. It says that ${s.officer}, an officer of the general partner, owns the firm that manages the fund's properties in ${s.city}, that the firm has been paid for two years under a contract that was never approved, and that its fees are well above market. It adds that a director has a stake in the same firm and has never said so.\n\n${s.ceo}, the chief executive, is a long-time friend of ${s.officer.first}.`,
            ask: `What do you do first?`,
            options: [
              ['s', `Acknowledge the complaint and assure ${s.whistle.first} of protection. Bring it to the directors who have no connection to the firm, have independent counsel engaged, and have relevant records preserved before anyone named is told.`, `The complaint goes to people who can judge it without bias, the evidence is secured, and the person who raised it is protected. Everything later depends on these three steps.`],
              ['g', `Ask ${s.ceo.first} to look into it quietly and report back to you.`, `It gets someone moving, but that someone is a close friend of the person accused and a manager whose own oversight is in question. Whatever the result, it will not be believed.`],
              ['p', `Forward the email to ${s.officer.first} and ask for an explanation.`, `The accused now knows who complained and what to tidy up. You have exposed the whistleblower to retaliation and put the evidence at risk.`]
            ],
            rule: `A complaint about insiders is handled by people independent of them, with counsel who answer to those people, and with records preserved at once. Protecting the complainant is a duty as well as good practice.`,
            us: `Retaliation against whistleblowers is unlawful under several federal and state statutes, and regulators pay close attention to how complaints were handled.`,
            ca: `The Criminal Code prohibits retaliation against employees who report offences, and securities regulators run their own whistleblower programs.`
          };
        }
      },
      {
        id: 'l13-2', title: 'Calling the meeting',
        builds: ['Notice', 'Quorum'],
        make: function (g) {
          var s = S(g);
          return {
            scene: `Independent counsel's first look suggests the complaint has substance. The board has six directors: you, ${s.ceo}, ${s.dirA}, ${s.dirB}, and two outside directors. ${s.dirA} is believed to be the director with the undisclosed stake. The next scheduled meeting is in five weeks, and its agenda is already full.`,
            ask: `How does the board take this up?`,
            options: [
              ['s', `Call a special meeting on proper notice with this as the only item. Send counsel's summary in advance to the directors who are not implicated, and plan a session without management and without ${s.dirA.first}.`, `The board acts as a board: properly convened, properly informed, with the people under review out of the room. Decisions made that way will hold.`],
              ['g', `Add it under "other business" at the end of the regular meeting in five weeks, without written materials.`, `It reaches the board eventually. But five weeks is a long time for fees to keep flowing, and a serious matter raised without notice or papers at the end of a long meeting will not get a serious decision.`],
              ['p', `Phone each director separately over the weekend and settle on an approach that way.`, `A series of private calls is not a meeting. Nothing is decided validly, nothing is minuted, and the implicated directors learn of it in the worst possible manner.`]
            ],
            rule: `The chair's first tool is the agenda. Serious matters get their own properly called meeting, written materials, and a session where conflicted people are absent.`
          };
        }
      },
      {
        id: 'l13-3', title: 'The director who wants to stay',
        builds: ['Conflict of interest', 'Minutes'],
        make: function (g) {
          var s = S(g);
          return {
            scene: `At the special meeting ${s.dirA} confirms holding a ${s.pct}% interest in ${s.officer.first}'s firm, acquired three years ago and never disclosed. ${s.dirA.first} is apologetic but insists on staying for the discussion. "I know the facts better than anyone here, and I am still a director. I will simply not vote."`,
            ask: `What do you rule?`,
            options: [
              ['s', `${s.dirA.first} makes a full disclosure for the minutes, answers the board's questions, and then leaves before the discussion and the vote. The minutes record each step.`, `The board gets the facts from the person who has them and then deliberates freely. People do not speak candidly about a colleague who is watching.`],
              ['g', `${s.dirA.first} may stay for the whole discussion to answer questions as they come up, and will abstain from the vote.`, `Abstaining keeps one vote out. But the directors will soften what they say, ${s.dirA.first} hears the board's thinking, and the approval looks less independent than it should.`],
              ['p', `${s.dirA.first} stays and votes. A director cannot be excluded from a board meeting.`, `A director voting on a matter in which they have an undisclosed financial interest taints the resolution and compounds the original failure to disclose.`]
            ],
            rule: `A conflicted director discloses fully, answers questions, and leaves for the deliberation and the vote. The chair makes that happen courteously and without negotiation.`
          };
        }
      },
      {
        id: 'l13-4', title: 'Who investigates?',
        builds: ['Special committee'],
        make: function (g) {
          var s = S(g);
          return {
            scene: `The board agrees that the property management arrangement must be reviewed. ${s.ceo} proposes a committee of ${s.dirB}, who has served on the board with ${s.officer.first} for ten years and vacations with the family, together with ${s.cfo}, the chief financial officer, whose team paid the invoices. The company's regular law firm, which also acts for ${s.officer.first}'s firm, would advise.`,
            ask: `How is the committee set up?`,
            options: [
              ['s', `The two outside directors form the committee under a written mandate. They choose their own counsel and a forensic accountant, have access to all records and staff, and report to the board without management present.`, `Independence in fact, authority on paper, and advisers who owe nothing to the people under review. The committee's findings will carry weight because of how it was built.`],
              ['g', `One outside director and ${s.cfo.first}, advised by the regular law firm with an ethical wall in place.`, `There is one independent voice, which helps. But the finance chief is reviewing payments their own team made, and the lawyers act for the firm being examined. The findings will be questioned whatever they say.`],
              ['p', `Adopt ${s.ceo.first}'s proposal. The board should show confidence in its people.`, `A committee made up of the subject's friend and the person who paid the invoices, advised by the subject's lawyers, has its conclusion decided by its composition.`]
            ],
            rule: `An investigating committee is only as credible as its independence, its mandate and its advisers. The chair should settle all three before the work starts.`
          };
        }
      },
      {
        id: 'l13-5', title: 'The findings',
        builds: ['Related-party transaction', 'Arm\'s length'],
        make: function (g) {
          var s = S(g);
          return {
            scene: `The committee reports. The only paper behind the arrangement is a one-page engagement letter that expired after its first year. ${s.officer.first}'s firm has simply kept invoicing. Its fees ran about ${s.over}% above what three comparable managers would have charged, an excess of roughly ${MB.usd(s.amt)} over two years. The work itself was competent. No approval by the board or the investors' advisory committee was ever sought.\n\n${s.ceo} says: "The buildings are full and well run. Paper the contract and move on."`,
            ask: `What does the board resolve?`,
            options: [
              ['s', `Seek recovery of the excess fees. Either put the mandate out to tender or negotiate a written contract at market rates, approved by the independent directors and the investors' advisory committee. ${s.officer.first} has no part in either decision.`, `The fund is made whole, the contract is put on proper terms by the right people, and the firm may keep the work if it wins it on merit.`],
              ['g', `Sign a new contract with the firm at the existing rates, effective from two years ago, and close the matter.`, `The paperwork gap is closed, but the board has knowingly approved above-market fees to an insider's firm and waived the fund's claim to the excess. That is a fresh breach, this time with full knowledge.`],
              ['p', `Take no action. The work was done well and investors have not complained.`, `The board now knows of an unapproved related-party arrangement that cost the fund money. Doing nothing makes every director a party to it.`]
            ],
            rule: `Remediation has three parts: recover what was lost, put the arrangement on proper terms through independent approval, and remove the conflicted person from the decision. Competent work does not excuse the way it was obtained.`
          };
        }
      },
      {
        id: 'l13-6', title: 'Telling the investors',
        builds: ['Advisory committee', 'Good faith'],
        make: function (g) {
          var s = S(g);
          return {
            scene: `The partnership agreement requires the general partner to bring related-party transactions to the investors' advisory committee, and to report any material breach of the agreement to all limited partners promptly. The fund is also six weeks from closing a refinancing in which it will certify to the lender that it has no undisclosed affiliate contracts.\n\n${s.cfo} suggests waiting. "Tell the investors in the annual report. And the certificate will be true by then if we fix the contract first."`,
            ask: `What is disclosed, to whom, and when?`,
            options: [
              ['s', `Now: a factual report to the advisory committee and the limited partners of what was found and what is being done, and disclosure to the lender before it relies on any certificate. Counsel reviews each one.`, `The people entitled to know hear it from the general partner, promptly and with the remedy already under way. That is the version of this story investors and lenders can accept.`],
              ['g', `A short paragraph in the annual report five months from now, and nothing to the lender since the contract will be regularized before closing.`, `Each statement might be technically accurate when made. Together they are designed to keep people from learning something the agreement says they must be told promptly.`],
              ['p', `No disclosure. The matter was handled internally and raising it would only cause alarm.`, `That breaches the partnership agreement, risks a false certificate to a lender, and turns a problem the board handled well into a cover-up the board committed.`]
            ],
            rule: `Disclosure follows the agreements and the facts, on time, to everyone entitled. Deciding what people do not need to know is not the general partner's call when the contract already answers it.`
          };
        }
      },
      {
        id: 'l13-7', title: 'The ultimatum',
        builds: ['Duty of loyalty', 'Business judgment rule'],
        make: function (g) {
          var s = S(g);
          return {
            scene: `${s.ceo} asks to see you alone. "If the board goes after ${s.officer.first} for that money, I am done. I will resign the week before the refinancing, and you can explain that to the lender. Drop the recovery, keep the firm on, and we all get through this."\n\nThe refinancing matters. ${s.ceo.first} has the lender relationship, and there is no succession plan.`,
            ask: `What do you do?`,
            options: [
              ['s', `Tell ${s.ceo.first} the board's decision stands and that the conversation will be reported to the board. Convene the independent directors, prepare for either outcome with an interim leadership plan, and brief the lender candidly if it comes to that.`, `The board decides for the fund, not under threat from an executive. A chair who cannot be moved this way is the reason the board is worth having.`],
              ['g', `Offer a compromise: the firm keeps the contract at market rates and the recovery is quietly dropped, in return for ${s.ceo.first} staying through the refinancing.`, `It buys calm for six weeks. It also trades away the fund's money to settle a personal threat, in a private conversation, and teaches management that ultimatums work.`],
              ['p', `Agree, and ask the committee to wind up its work.`, `The chair has overridden an independent committee and abandoned a claim belonging to the fund in order to keep an executive. That is a breach of the chair's own duty.`]
            ],
            rule: `The board governs management, and the chair protects the board's independence when it is tested. A board that depends on one person has a succession problem to solve as well.`
          };
        }
      },
      {
        id: 'l13-8', title: 'Closing the loop',
        builds: ['Delegation of authority', 'Registers'],
        make: function (g) {
          var s = S(g);
          return {
            scene: `Three months on, the excess fees have been repaid, the property management mandate was tendered and awarded on written terms, ${s.dirA} has resigned from the board, and the refinancing closed with full disclosure. ${s.ceo} stayed. At the final meeting on the matter a director says: "It was an isolated incident. Let us not bury the company in policy."`,
            ask: `As chair, what do you propose?`,
            options: [
              ['s', `A short set of controls with owners: a related-party policy, annual written conflict declarations, a contract register checked against the payments ledger, a delegation of authority matrix, a whistleblower channel to an independent director, and a yearly review of how the board itself is working.`, `Each control answers a specific way this went wrong. Together they mean the next problem is found by the system in weeks, not by an accountant's conscience after two years.`],
              ['g', `A memo from the chair reminding everyone of their obligations to disclose conflicts.`, `A reminder is sincere and costs nothing. It also changes nothing: the people involved knew their obligations, and what was missing was any mechanism that would have caught the lapse.`],
              ['p', `Nothing further. The matter is resolved and the board should look forward.`, `A contract ran unapproved for two years and a director hid an interest for three. A board that learns nothing from that has decided to let it happen again.`]
            ],
            rule: `An incident is closed when the weakness that allowed it has been fixed and someone is responsible for keeping it fixed. The chair's last job on any failure is to make sure the board learns from it in writing.`
          };
        }
      }
    ]
  });
})();
