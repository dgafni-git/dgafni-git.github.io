MB.level({
  n: 3, title: 'Meetings and the Paper Trail', rank: 'Corporate Secretary', pass: 0.7, draw: { authored: 5, numeric: 1 }, numerics: ['vote'],
  topics: 'Notice, quorum, resolutions, minutes and registers',
  blurb: 'An entity can only act through decisions properly made and recorded. When something is challenged years later, the paper is all that is left to say what happened and who approved it.',
  concepts: [
    ['Notice', 'The advance warning of a meeting that the governing documents require. A meeting held without proper notice can be challenged unless everyone entitled to it waives the defect.'],
    ['Quorum', 'The minimum number of decision-makers who must be present for a meeting to act. Without it, nothing the meeting does is valid.'],
    ['Resolution', 'A formal decision of the board, the shareholders or the partners. It is the entity speaking.'],
    ['Written resolution', 'A decision made on paper without a meeting. For directors it almost always needs every director\'s signature, not a majority.'],
    ['Minutes', 'The official record of a meeting: who attended, what was before them, conflicts declared, what was decided. Not a transcript.'],
    ['Ratification', 'A later, properly made decision that adopts something done without authority. It is honest about the date and fixes the gap going forward.'],
    ['Delegation of authority', 'The board\'s written statement of who may approve and sign what, usually by dollar limit. Often set out as a matrix.'],
    ['Registers', 'The entity\'s official lists of its directors, officers and owners. The securities register, not anyone\'s memory, says who owns what.']
  ],
  scenarios: [
    {
      id: 'l3-quorum', title: 'Two directors and a deadline',
      builds: ['Authority to bind'],
      make: function (g) {
        var spe = g.spe('Inc.'), a = g.person();
        return {
          scene: `${spe} has five directors, and quorum is three. A loan commitment needs board approval by tomorrow. Only two directors come to today's meeting. ${a}, the chief financial officer, suggests approving it now and listing all five as present. "They would all vote yes."`,
          ask: `How do you get a valid approval?`,
          options: [
            ['s', `Adjourn. Either circulate a written resolution for all five directors to sign, or reconvene by video tonight with waivers of notice from anyone who did not get it.`, `Both routes produce a real decision of the board by tomorrow. The loan is then approved in a way the lender's counsel can rely on.`],
            ['g', `Have the two directors approve it today and ask the full board to ratify at the next meeting.`, `Ratification can repair it later, but until then the officer signing the commitment has no authority, and the certificate the lender asks for would be untrue.`],
            ['p', `Record all five as present and approve it.`, `That is a false corporate record. It does not create a quorum, and whoever signs those minutes or certifies them to a lender has misrepresented the facts.`]
          ],
          rule: `No quorum means no meeting. The fix is always to get a real decision by another proper route, and written resolutions and waivers of notice exist for exactly this.`,
          us: `Delaware directors can act without a meeting only by unanimous written or electronic consent.`,
          ca: `A directors' resolution in writing must be signed by every director entitled to vote on it.`
        };
      }
    },
    {
      id: 'l3-backdate', title: 'The resolution that was never passed',
      make: function (g) {
        var spe = g.spe(), a = g.person(), amt = g.m(2, 9, 0.5);
        return {
          scene: `${spe} signed a ${MB.usd(amt)} construction contract five weeks ago. A lender's counsel now asks for the board resolution approving it. There is none. ${a}, a paralegal, offers to prepare one "dated the day before the contract, so the file looks right."`,
          ask: `What goes in the file?`,
          options: [
            ['s', `A resolution dated today that states the contract was signed on its actual date, and ratifies and confirms it.`, `It tells the truth and still gives the lender what it needs: the board stands behind the contract.`],
            ['g', `A resolution headed "as of" the earlier date, signed now, with no mention of when it was actually signed.`, `"As of" dating is acceptable when the document makes clear it was signed later. Without that, a reader is misled about when the board acted, which is what backdating means.`],
            ['p', `A resolution dated five weeks ago.`, `That fabricates a record. If it is given to a lender or produced in litigation, the people who signed it have a far worse problem than a missing approval.`]
          ],
          rule: `A missed approval is repaired by ratification, dated honestly. Never repair the past by rewriting when things happened.`
        };
      }
    },
    {
      id: 'l3-minutes', title: 'What the minutes should say',
      builds: ['Disclosure and recusal'],
      make: function (g) {
        var spe = g.spe('Inc.'), a = g.person(), b = g.person();
        return {
          scene: `You are taking minutes at a tense board meeting of ${spe}. ${a}, a director, disclosed that their company would supply materials under the contract being approved, then left for that item. The remaining directors argued for forty minutes and approved it four to one.\n\nAfterward ${b}, the chair, says: "Keep it clean. Just say the contract was approved."`,
          ask: `What do you write?`,
          options: [
            ['s', `Who attended, what materials the board had, that ${a.first} disclosed the interest and left, the main points considered, and the result of the vote with the dissent noted.`, `Minutes like these prove the decision was informed and untainted. They are the directors' best evidence if the contract is ever attacked.`],
            ['g', `"After discussion, the contract was approved." Nothing more.`, `It is accurate and nearly useless. It shows neither that the conflict was handled nor that the board considered anything.`],
            ['p', `The approval only, leaving out the conflict so that no one reading later gets the wrong idea.`, `Leaving out the disclosure erases the one fact that protects ${a.first} and the board. It also makes a compliant process look like concealment.`]
          ],
          rule: `Good minutes record attendance, materials, conflicts, the substance of what was weighed, and the decision. They are not a transcript, and they are never edited to look tidier than the meeting was.`
        };
      }
    },
    {
      id: 'l3-email', title: 'Approval by reply-all',
      make: function (g) {
        var spe = g.spe('Inc.'), a = g.person(), b = g.person();
        return {
          scene: `${spe} needs a board decision to extend a purchase option that expires Friday. You circulate a written resolution by email on Tuesday. By Thursday three of the four directors have replied "approved." The fourth, ${a}, is hiking somewhere without signal.\n\n${b}, the president, says three out of four is a majority and wants to sign the extension.`,
          ask: `Is the resolution passed?`,
          options: [
            ['s', `No. Call a meeting on short notice for Friday morning, where the three directors form a quorum and can pass it by majority.`, `A written resolution needs every director. A meeting needs only a quorum and a majority, so a quick meeting gets a valid decision that the written route cannot.`],
            ['g', `Treat it as passed, let ${b.first} sign, and get ${a.first}'s signature after the hike.`, `It will probably be completed, but on Friday the extension is signed without authority. If ${a.first} objects or the other side later wants out, the gap is real.`],
            ['p', `Add ${a.first}'s name to the resolution "per" the president, since ${a.first} would have agreed.`, `Nobody can sign a director's vote for them. That is a forged consent.`]
          ],
          rule: `Meetings decide by majority once quorum is met. Written resolutions of directors decide only by unanimity. Know which one you are using, because the arithmetic is different.`,
          us: `Stockholders of a Delaware corporation can usually act by written consent of a majority, unless the charter says otherwise. Directors cannot.`,
          ca: `Shareholder resolutions in writing must also be signed by all shareholders entitled to vote, which makes them practical only for closely held companies.`
        };
      }
    },
    {
      id: 'l3-register', title: 'The register says otherwise',
      make: function (g) {
        var lp = g.spe('LP'), a = g.person(), amt = g.m(0.2, 0.9, 0.05);
        return {
          scene: `${lp} is about to pay a distribution. ${a}, one of the limited partners, emails: "I moved my units into my holding company last year. Send my ${MB.usd(amt)} there." The partnership's register still shows ${a.first} personally, and the partnership agreement requires the general partner's written consent to any transfer.`,
          ask: `Where does the money go?`,
          options: [
            ['s', `Hold that payment briefly. Get the transfer documents, have the general partner consider consent, update the register, then pay whoever the register shows.`, `The register is the partnership's record of who its partners are. Paying on it protects the partnership, and fixing it first protects ${a.first}.`],
            ['g', `Pay the holding company as asked and tidy up the register afterward.`, `If the transfer was never valid, the partnership has paid a stranger and still owes ${a.first}. If the units were pledged or disputed, it is worse.`],
            ['p', `Pay whichever account each partner asks for. It is their money.`, `Payment instructions by email, unconnected to the register, are also how payment fraud works. The partnership would bear the loss.`]
          ],
          rule: `Ownership is what the register says after the agreement's transfer rules have been followed. Pay, notify and count votes by the register, and keep it current.`
        };
      }
    },
    {
      id: 'l3-limit', title: 'Three purchase orders',
      make: function (g) {
        var spe = g.spe(), a = g.person(), lim = g.pick([100000, 150000, 250000]), amt = lim * 3 - 20000;
        return {
          scene: `The delegation of authority for ${spe} lets the project manager, ${a}, approve contracts up to ${MB.usd(lim)}. Anything larger goes to the board. A drainage contract comes in at ${MB.usd(amt)}, and the crew can start Monday if it is signed today. The board next meets in three weeks.\n\n${a.first} suggests issuing it as three purchase orders.`,
          ask: `What do you do?`,
          options: [
            ['s', `Send the contract to the board today for approval by written resolution, with a one-page summary.`, `The limit exists so that commitments of this size get the board's eyes. A written resolution can do that in a day or two.`],
            ['g', `Have ${a.first} sign the full contract now given the urgency, and put it to the board for ratification in three weeks.`, `It is open about what happened, which matters. It is still a commitment made without authority, and the board is left to approve something it can no longer refuse.`],
            ['p', `Split it into three purchase orders, each under the limit.`, `Splitting a contract to avoid an approval limit is deliberate evasion of a control. In most organizations that is a firing matter, whatever the merits of the contract.`]
          ],
          rule: `A delegation of authority works only if the limits apply to the real size of the commitment. When the limit is in the way, the answer is a faster approval, never a smaller-looking contract.`
        };
      }
    }
  ]
});
