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
      id: 'l3-email', twist: true, title: 'Approval by reply-all',
      make: function (g) {
        var a = g.person();
        if (g.twist) return {
          burn: 0,
          twist: `This entity's own agreement allowed a majority to act in writing.`,
          scene: `An option expires Friday. The owner is an LLC whose operating agreement lets a majority of its four managers act by written consent. Three have emailed "approved." The fourth, ${a}, is hiking without signal.`,
          options: [
            ['s', `Record the consent of the three, sign the extension, and notify ${a.first}.`, `The agreement sets the rule, and a majority in writing is enough here.`],
            ['g', `Insist on a meeting, and risk missing Friday.`, `More process than the agreement asks for, at the cost of the option.`],
            ['p', `Add ${a.first}'s name to make it unanimous.`, `Unnecessary, and a forgery.`]
          ],
          rule: `How an entity decides is set by its own documents. Read them before assuming.`
        };
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
      id: 'l3-limit', twist: true, role: 'You check that the project\'s approvals follow the rules.', title: 'Three purchase orders',
      make: function (g) {
        var a = g.person(), lim = g.pick([100000, 150000, 250000]), amt = lim * 3 - 20000;
        if (g.twist) return {
          burn: 0,
          twist: `An emergency clause covered this. Waiting for the board would have flooded the site.`,
          scene: `${a} may approve contracts up to ${MB.usd(lim)}. A storm has overwhelmed the excavation, and emergency drainage will cost ${MB.usd(amt)}. The authority policy lets the project manager exceed the limit to prevent imminent damage, with notice to the chair within a day.`,
          options: [
            ['s', `Have ${a.first} sign under the emergency clause and notify the chair today.`, `The policy foresaw this. Use the clause and meet its condition.`],
            ['g', `Send it to the board for a written resolution first.`, `Correct on an ordinary day. Today the excavation floods while signatures are collected.`],
            ['p', `Split it into three orders under the limit.`, `There was an honest route. This is still evasion.`]
          ],
          rule: `A good authority policy has an emergency route. Know it before the emergency.`
        };
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
    },
    {
      id: 'l3-short-notice', title: 'The meeting nobody was told about',
      make: function (g) {
        var a = g.person(), b = g.person();
        return {
          scene: `The by-laws require five days' notice of board meetings. Yesterday's was called with one. Four of five directors came and approved a sale. The fifth, ${b}, was travelling and now objects. ${a}, the president, says a quorum was there.`,
          who: `${a.first}`,
          behind: `${a.first} wanted the sale approved fast, and perhaps without ${b.first}'s questions. Notice exists so that every director can attend and argue. A quorum does not cure leaving one out.`,
          deep: [
            [`Notice and quorum are different`, `Quorum is how many must attend. Notice is whether everyone had the chance.`],
            [`The cure`, `A written waiver from the director who missed it, or a properly called meeting that confirms the decision.`],
            [`Why it matters to a buyer`, `Its lawyers will ask for proof the sale was validly approved.`]
          ],
          options: [
            ['s', `Get ${b.first}'s waiver, or hold a properly called meeting to confirm it.`, `Either one gives the sale an approval nobody can attack.`],
            ['g', `Rely on the quorum and move on.`, `The approval can be challenged by the one director with a reason to.`],
            ['p', `Change the date on the notice.`, `That is falsifying a record to hide a defect that could have been cured.`]
          ],
          rule: `Every director is entitled to notice. A quorum of the others does not replace it.`
        };
      }
    },
    {
      id: 'l3-proxy', title: 'Voting by proxy',
      make: function (g) {
        var a = g.person(), b = g.person();
        return {
          scene: `${a}, a director, cannot attend tomorrow's board meeting and sends an assistant, ${b}, with a signed note: "${b.first} votes for me on all items."`,
          who: `${a.first}`,
          behind: `${a.first} wants to be counted without attending. Shareholders can send someone to vote for them. Directors are chosen for their own judgment and cannot hand it to anyone.`,
          deep: [
            [`Shareholders versus directors`, `A shareholder votes their own property and may appoint a proxy. A director exercises a duty and may not.`],
            [`What attendance can be`, `By phone or video, in almost every set of by-laws.`],
            [`If the vote is counted`, `Any resolution that needed it can be challenged.`]
          ],
          options: [
            ['s', `Tell ${a.first} to join by phone, or be recorded as absent.`, `A director's vote has to be the director's own.`],
            ['g', `Count the vote "as instructed" and note the proxy.`, `It is recorded honestly, and it is still not a valid vote.`],
            ['p', `Let ${b.first} sign the resolutions for ${a.first}.`, `Nobody can sign a director's decision for them.`]
          ],
          rule: `Shareholders may vote by proxy. Directors may not.`
        };
      }
    },
    {
      id: 'l3-signature', title: 'Signed by the assistant',
      make: function (g) {
        var a = g.person(), amt = g.m(2, 8, 0.5);
        return {
          scene: `A ${MB.usd(amt)} guarantee must be signed today. ${a}, the only authorized officer, is abroad and tells an assistant by phone: "Use my signature stamp. I approve."`,
          who: `${a.first}`,
          behind: `${a.first} wants it done without finding a printer in another time zone. A guarantee is the document most likely to be tested in court, where the first question is who actually signed.`,
          deep: [
            [`Why it matters more for a guarantee`, `Guarantees are read strictly, and a guarantor's best defence is that it never properly signed.`],
            [`What works`, `The officer signing electronically from a phone. It takes minutes and leaves a trail.`],
            [`What a stamp leaves behind`, `A dispute about whether the officer saw the final text.`]
          ],
          options: [
            ['s', `Have ${a.first} sign electronically from the phone.`, `The officer signs the actual document, with a record of when and where.`],
            ['g', `Apply the stamp and note the phone approval in the file.`, `Honest, but it invites the argument that the officer never saw what was signed.`],
            ['p', `Have the assistant imitate the signature in ink.`, `That is forging a signature, whatever was said on the phone.`]
          ],
          rule: `The person with authority signs. Technology makes that easy from anywhere.`
        };
      }
    },
    {
      id: 'l3-rewrite', title: 'Improving last month\'s minutes',
      make: function (g) {
        var a = g.person();
        return {
          scene: `Minutes approved last month record a decision that has since gone badly. ${a}, a director, wants them amended to add a warning ${a.first} "meant to give" at the time.`,
          who: `${a.first}`,
          behind: `${a.first} wants to be on record as having seen it coming. Minutes are trusted because they are fixed once approved. Change them after the event and nothing in the book can be relied on.`,
          deep: [
            [`What minutes are`, `Evidence of what happened, written near the time and approved by those present.`],
            [`Correcting a real error`, `A dated correction at a later meeting, saying what is corrected and why.`],
            [`What it does to the rest`, `One altered entry casts doubt on every other entry.`]
          ],
          options: [
            ['s', `Leave the minutes. ${a.first} can state the view at the next meeting, dated now.`, `The record stays true, and the view is still recorded.`],
            ['g', `Add the warning to the old minutes, with everyone's agreement.`, `Agreement does not make it true that the warning was given then.`],
            ['p', `Rewrite the minutes and reprint the page.`, `That is falsifying a corporate record.`]
          ],
          rule: `Minutes record what happened. Later thoughts get a later date.`
        };
      }
    },
    {
      id: 'l3-inspection', title: 'The investor asks for the books',
      make: function (g) {
        var a = g.person(), b = g.person();
        return {
          scene: `${b}, a minority shareholder, asks in writing to inspect the minutes and the financial statements, saying it is to value the shares. ${a}, the president, says: "Send a summary. The rest is none of ${b.first}'s business."`,
          who: `${a.first}`,
          behind: `${a.first} would rather not be examined. Owners with no seat on the board have few ways to check on those who run the company. The right to look at its records is the main one.`,
          deep: [
            [`The right`, `Shareholders may generally inspect core records for a proper purpose, such as valuing their shares.`],
            [`The limits`, `Trade secrets and unrelated material can be withheld or protected.`],
            [`Refusing`, `Courts order inspection and often make the company pay the costs.`]
          ],
          options: [
            ['s', `Provide the records the law entitles ${b.first} to, on time.`, `It is their right, and refusing only suggests there is something to find.`],
            ['g', `Send summaries prepared by management.`, `A summary written by the people being checked is not inspection.`],
            ['p', `Refuse.`, `A court will order it, at the company's expense.`]
          ],
          rule: `Owners are entitled to see how their company is run.`
        };
      }
    },
    {
      id: 'l3-incumbency', title: 'Certify the president',
      make: function (g) {
        var a = g.person();
        return {
          scene: `A lender wants a certificate from you that ${a} is "the duly appointed President." ${a.first} has acted as president for two years. The records show no resolution ever appointing ${a.first}.`,
          who: `${a.first}`,
          behind: `Everyone treated ${a.first} as president, so nobody papered it. The lender will rely on your certificate. If it is wrong, the loan documents ${a.first} signs are open to question, and so are you.`,
          deep: [
            [`What the certificate does`, `It tells an outsider who may sign for the company.`],
            [`The gap`, `Acting as an officer is not the same as being appointed one.`],
            [`The fix`, `One resolution appointing the president and confirming past acts. Then the certificate is true.`]
          ],
          options: [
            ['s', `Have the board appoint ${a.first} and confirm past acts, then certify.`, `An hour of paperwork makes the certificate true.`],
            ['g', `Certify it. ${a.first} has plainly been acting as president.`, `You would be certifying an appointment that never happened.`],
            ['p', `Certify it, and add a backdated resolution to the file.`, `A false certificate supported by a false record.`]
          ],
          rule: `Certify only what the records show. If they are missing, fix the records first.`
        };
      }
    }
  ]
});
