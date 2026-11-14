MB.level({
  n: 3, title: 'Meetings and the Paper Trail', rank: 'Corporate Secretary', pass: 0.7, draw: { authored: 5, numeric: 1 }, numerics: ['vote'],
  topics: 'Notice, quorum, resolutions, minutes and registers',
  role: 'You are the corporate secretary. The paperwork is yours.',
  blurb: 'An entity acts only through decisions properly made and recorded. Later, the paper is all that is left.',
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
          scene: `${spe} has five directors and a quorum of three. A loan needs board approval by tomorrow, and only two directors show up. ${a} suggests listing all five as present. "They would all vote yes."`,
          who: `${a.first}`,
          behind: `${a.first} needs the loan approved by tomorrow and is sure of the outcome. The shortcut swaps a real approval for a false record that the lender will be asked to rely on.`,
          deep: [
            [`Quorum`, `The minimum number who must be present for a meeting to act at all. Here it is three of five.`],
            [`Two valid routes`, `A meeting with a quorum decides by majority. A written resolution needs every director's signature.`],
            [`Why the lender cares`, `Its lawyers will ask an officer to certify that the resolution was properly passed. A false certificate is a personal problem for whoever signs it.`]
          ],
          options: [
            ['s', `Adjourn. Circulate a written resolution for all five to sign.`, `That produces a real board decision by tomorrow that the lender can rely on.`],
            ['g', `Approve it with two and ratify at the next meeting.`, `Ratification can repair it later, but tomorrow's signature has no authority behind it.`],
            ['p', `Record all five as present.`, `That is a false corporate record, and it still creates no quorum.`]
          ],
          rule: `No quorum, no meeting. Get a real decision by another proper route.`,
          us: `Delaware directors can act without a meeting only by unanimous written consent.`,
          ca: `A directors' resolution in writing must be signed by every director entitled to vote.`
        };
      }
    },
    {
      id: 'l3-backdate', burn: 0, title: 'The resolution that was never passed',
      make: function (g) {
        var spe = g.spe(), amt = g.m(2, 9, 0.5);
        return {
          scene: `${spe} signed a ${MB.usd(amt)} contract five weeks ago. A lender now wants the board resolution approving it. There is none. A paralegal offers to prepare one "dated the day before."`,
          behind: `The paralegal wants a tidy file, and the lender wants proof the contract was authorized. A backdated page gives both, until someone compares the dates.`,
          deep: [
            [`Ratification`, `A later decision that adopts an earlier unauthorized act. It is honest about the dates and fully effective.`],
            [`Dating a document as of an earlier day`, `Acceptable where the document shows when it was really signed. Deceptive where it hides that.`],
            [`Why backdating is serious`, `A document that lies about its date can be forgery or fraud once anyone relies on it.`]
          ],
          options: [
            ['s', `Pass a resolution dated today that ratifies the contract.`, `It tells the truth and still gives the lender what it needs.`],
            ['g', `Sign one "as of" the earlier date, without saying when it was signed.`, `"As of" is fine only when the document shows it was signed later. Otherwise it misleads.`],
            ['p', `Date it five weeks ago.`, `That fabricates a record. It is far worse than a missing approval.`]
          ],
          rule: `Repair a missed approval by ratifying it, dated honestly. Never rewrite when things happened.`
        };
      }
    },
    {
      id: 'l3-minutes', title: 'What the minutes should say',
      builds: ['Disclosure and recusal'],
      make: function (g) {
        var a = g.person(), b = g.person();
        return {
          scene: `${a} disclosed an interest in a contract and left the room. The board argued for forty minutes and approved it four to one. The chair, ${b}, says: "Keep the minutes clean. Just say it was approved."`,
          who: `${b.first}`,
          behind: `${b.first} worries that mentioning a conflict makes the board look bad. It is the reverse. The recorded recusal is the board's proof that it handled the conflict properly.`,
          deep: [
            [`What minutes are for`, `Proving later that the board was properly assembled, informed and free of conflict when it decided.`],
            [`What goes in`, `Who attended, what papers they had, conflicts declared and who stepped out, the main factors weighed, and the vote.`],
            [`What stays out`, `Word-for-word argument and personal remarks. Minutes record decisions. They are not a transcript.`]
          ],
          options: [
            ['s', `Record attendance, the disclosure and recusal, the main points, and the vote.`, `Those minutes prove the decision was informed and untainted.`],
            ['g', `Write "After discussion, the contract was approved."`, `Accurate and nearly useless. It shows neither the recusal nor any deliberation.`],
            ['p', `Leave out the conflict so nobody gets the wrong idea.`, `That erases the one fact that protects the board, and looks like concealment.`]
          ],
          rule: `Minutes record attendance, conflicts, what was weighed, and the decision. They are never tidied.`
        };
      }
    },
    {
      id: 'l3-email', title: 'Approval by reply-all',
      make: function (g) {
        var a = g.person();
        return {
          scene: `An option expires Friday. Three of four directors have emailed "approved" on a written resolution. The fourth, ${a}, is hiking without signal. The president says three out of four is a majority.`,
          who: `The president`,
          behind: `The president wants the option extended before Friday and reads three approvals as enough. At a meeting it would be. On paper, the missing signature is the whole point.`,
          deep: [
            [`Why a written resolution needs everyone`, `There is no discussion and no chance to persuade. Unanimity stands in for the meeting.`],
            [`Why a meeting needs fewer`, `The absent director had notice and the chance to attend.`],
            [`Short notice`, `Directors can waive notice. Three of them on a call, with waivers, is a valid meeting.`]
          ],
          options: [
            ['s', `Call a short-notice meeting. Three directors are a quorum and can pass it.`, `A written resolution needs every director. A meeting needs only a quorum and a majority.`],
            ['g', `Treat it as passed and get ${a.first}'s signature later.`, `On Friday the extension is signed without authority, and the gap is real if anyone objects.`],
            ['p', `Add ${a.first}'s name "per" the president.`, `Nobody can sign a director's vote for them. That is a forged consent.`]
          ],
          rule: `Meetings decide by majority. Written resolutions of directors need everyone.`,
          us: `Stockholders can usually act by written consent of a majority. Directors cannot.`,
          ca: `Shareholder resolutions in writing must also be signed by all shareholders entitled to vote.`
        };
      }
    },
    {
      id: 'l3-register', role: 'You administer the partnership\'s records and payments.', title: 'The register says otherwise',
      make: function (g) {
        var a = g.person(), amt = g.m(0.2, 0.9, 0.05);
        return {
          scene: `A distribution is due. ${a} emails: "I moved my units to my holding company. Send my ${MB.usd(amt)} there." The register still shows ${a.first}, and transfers need the general partner's consent.`,
          who: `${a.first}`,
          behind: `${a.first} wants the money in a holding company, probably for tax reasons. The partnership's risk is paying someone who is not its partner while still owing the one who is.`,
          deep: [
            [`What the register is`, `The partnership's official list of who owns what. Distributions, notices and votes all follow it.`],
            [`Why transfers need consent`, `The partnership must know who its partners are, for tax, for capital calls and for eligibility.`],
            [`The fraud angle`, `Changing payment details by email is the commonest form of payment fraud. Checking against the register is the control.`]
          ],
          options: [
            ['s', `Hold that payment. Get the transfer papers and consent, update the register, then pay.`, `The register says who the partners are. Paying on it protects the partnership.`],
            ['g', `Pay the holding company and fix the register afterward.`, `If the transfer was never valid, the partnership paid a stranger and still owes ${a.first}.`],
            ['p', `Pay whatever account each partner asks for.`, `Emailed payment instructions with no check are also how payment fraud works.`]
          ],
          rule: `Ownership is what the register says after the transfer rules are followed. Pay by the register.`
        };
      }
    },
    {
      id: 'l3-limit', role: 'You check that the project\'s approvals follow the rules.', title: 'Three purchase orders',
      make: function (g) {
        var a = g.person(), lim = g.pick([100000, 150000, 250000]), amt = lim * 3 - 20000;
        return {
          scene: `${a} may approve contracts up to ${MB.usd(lim)}. A drainage contract comes in at ${MB.usd(amt)}, the crew can start Monday, and the board meets in three weeks. ${a.first} suggests three purchase orders.`,
          who: `${a.first}`,
          behind: `${a.first} wants the crew working Monday and sees the board as a three-week delay. Splitting the contract keeps each piece under the limit, and keeps the board from seeing the commitment.`,
          deep: [
            [`What a delegation of authority is`, `The board's written list of who may approve what, usually by dollar amount.`],
            [`Why splitting is worse than overspending`, `An honest overrun is a mistake. A split contract is a deliberate act to avoid oversight.`],
            [`What auditors look for`, `Several orders to one vendor in the same week, each just under the limit.`]
          ],
          options: [
            ['s', `Send it to the board today for a written resolution.`, `The limit exists so the board sees commitments this size. That can take a day.`],
            ['g', `Sign the full contract now and ask the board to ratify.`, `Open about what happened, but the board is asked to approve what it can no longer refuse.`],
            ['p', `Split it into three orders under the limit.`, `Splitting a contract to dodge a limit is deliberate evasion of a control.`]
          ],
          rule: `When a limit is in the way, get a faster approval. Never a smaller-looking contract.`
        };
      }
    }
  ]
});
