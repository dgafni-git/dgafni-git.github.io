# Minute Book: design notes

A corporate equity and governance game set in real estate lending, development and private
equity. Static site, no dependencies. The published copy at `/minute-book/` is password-locked.

## The game

The player sits through thirteen board meetings and tries to finish with as much equity as
possible. Each meeting has five to eight decisions. Each decision is a two-sentence situation
and three short motions, and every motion shows what it pays today.

- **Sound**: what a careful board would do. It pays, and nothing follows. 2 points.
- **Grey**: common practice that leaves a gap. It pays, and leaves a loose end. 1 point.
- **Poor**: it pays the most on average, and leaves a liability. 0 points.

The player is not told which is which until they choose. Payouts overlap on purpose, so the
biggest number is not reliably the worst motion.

**The reckoning.** When a meeting adjourns, the player spins a wheel for each loose end and
each option. The coloured part of the wheel is the chance, and the pointer shows the result.
The outcome is drawn from the sitting's seed, so a reload cannot change it, and walking away
mid-reckoning records it anyway. The chance is built from the player's own record:

- A grey shortcut starts at 30%. A poor choice or an overreach starts at 60%.
- Plus 5% for each other loose end in the same meeting, up to 15%.
- Plus 8% for each thing that came due in the last two meetings on record, up to 16%.
- Minus 5% when standing is 85 or more.
- A free option pays off 25% of the time plus 3% per ten points of goodwill, up to 60%.

A grey loose end costs 2.5 times what was taken, a liability 4 times, an overreach 3 times.
Each card lists the factors behind its odds.

**Passing.** A meeting passes at 70% of its points (80% for the last). Fail and nothing is
banked. The first passed sitting is locked onto the record. After that the meeting can only be
sat for practice. A better score needs a new career. The best finished career is remembered.

**Standing.** The average quality of the sittings on record. It multiplies what sound work
pays, from 1.0 up to 1.25. Trust compounds.

**Goodwill.** What the people across the table think of dealing with you. It starts at 50. A
blunt sound choice costs a little, more when someone pushed hard. Passing a meeting earns some
back. A loose end that comes due costs a lot.

**The ask.** After a sound choice on some decisions, a second beat opens: what do you ask for?

- **Fair ask**: always agreed, pays a little, builds goodwill.
- **Strong ask**: pays well, can be refused. The odds rise with goodwill, from about 30% at 20
  to about 80% at 80. A refusal costs goodwill.
- **Overreach**: shows the biggest number, crosses a legal line, leaves a liability, and costs
  the item a governance point.
- **A gift**: costs money and buys goodwill.
- **Tone-deaf**: legal, refused, and remembered.
- **No ask**: always available. In beats marked `none`, every other ask is a mistake.

The number of legitimate asks varies, so the player cannot count their way to the answer. The
fixed rule for writers: price, time, security and upside can be traded. A notice, an approval
or a disclosure never can. Deal beats exist so far in Meetings IV, VI, VII, IX and X.

**Finding more in a deal.** Five mechanics teach that the deal space is wider than it looks
and that some gains cost nothing.

- **Free options** (`o` asks): no cash today, a value that may pay off at the reckoning,
  and no downside. An overreach can be dressed as one by adding `'later'` as a
  fourth element, for cases where the option is taken from people you owe a duty to.
- **Term sheets** (`sheet` in place of `deal`): the player ticks any number of terms. Each is
  `[kind, text, why, pain, value]`, with kind `c` (cash now), `o` (option) or `x` (overreach)
  and pain 0 to 3. Pain is hidden. Patience is 2 plus one for every 25 goodwill. Over the
  limit, the costliest terms are struck out. Every sheet needs at least one free term and
  one overreach.
- **Another way** (`wider: [text, why]` on a scenario): every decision has a button to look
  wider, at a fifth of the stake. Where a wider answer exists it appears as an extra motion
  paying 1.7 times the sound one. Where none exists the cost is wasted, so it takes judgment.
- **Spot it** (`spots` on a level, `spot: 1` in its draw): a document shown as tappable
  phrases, `[text, 'y' | 'n', why]`. Finding a `y` pays. Missing costs nothing but the chance.
- **Left on the table**: the adjournment screen lists what was available and not taken.

The rule that sits over these: taking a free option from a counterparty is good dealing, and
taking one for yourself from people whose money you manage needs their informed agreement.

**Terms.** Words the Registers or `EXTRA_DEFS` define are tappable wherever they appear in a
situation, an insight or an explanation. Options and asks cannot hold a button, so a "Terms"
row lists what they use. Add a new term by adding its definition and an `ALIAS` pattern.

**Stakes.** About $20,000 a decision in Meeting I, growing 40% a meeting. Starting equity is
$100,000.

**Reading load.** Targets, checked by the test script: situation under 46 words, motion under
17, explanation under 22, principle under 24. After a choice every motion shows its grade, what
it paid or would have paid, what it risked, and one line on why. One principle follows. The
United States and Canada notes sit behind a disclosure.

## The curriculum

| No. | Meeting | What it establishes |
| --- | --- | --- |
| I | The Entity | Separate legal persons, limited liability, authority to sign |
| II | Duties | Care, loyalty, business judgment, conflicts, corporate opportunity |
| III | Meetings and the Paper Trail | Notice, quorum, resolutions, minutes, ratification, registers |
| IV | The Capital Stack | Debt and equity layers, capital calls, dilution, raising from friends |
| V | Waterfalls and Prefs | Return of capital, preferred return, promote, catch-up, clawback |
| VI | Partnerships | General and limited partners, control rule, advisory committee, key person |
| VII | Contracts and Related Parties | Assignment, novation, releases, insiders as vendors |
| VIII | Development Oversight | Draws, change orders, contingency, holdback, insurance |
| IX | Loans, Defaults and Forbearance | Covenants, waiver, forbearance, guarantees, lender liability |
| X | Foreclosure and Owned Property | Remedies, deed in lieu, credit bids, environmental risk, the holding entity |
| XI | Deals | Letters of intent, diligence, owner approvals, insider buyouts, drag-along |
| XII | Distress | Insolvency, preferences, trust funds, director liability, litigation holds |
| XIII | The Chair | A capstone: one related-party investigation, eight linked decisions |

Later items carry a "Draws on" list of the earlier terms they depend on.

**The insight.** After an answer, a short "What was going on" note says what each party was
after and how they stood to gain. Every scenario has one, in its `behind` field. A "Go deeper"
button expands it into three or four short points from the `deep` field: how the money moves,
who pays, and what a careful operator does, with a worked figure where one helps.

**Repetition.** The game remembers which situations a player has met in each meeting and deals
the unmet ones first. Meetings I to XII have twelve situations each.

**Twists.** Two situations in each of those meetings have a twist: the same setup with one
fact changed, so that the right answer changes with it. A scenario marks itself `twist: true`
and its `make` returns the twisted version when `g.twist` is set. A situation whose plain
version has been met usually returns as its twist. A new one arrives twisted about a quarter
of the time, so the title is never a safe guide. After the answer, a "The twist" line names
the fact that changed. A twist borrows `behind` and `deep` from the plain version unless it
restates them, and has no deal beat.

**The final story.** Meeting XIII is one story in a fixed order. It has a twist version of
all eight beats, chosen for the whole sitting through `g.story.alt`, so the through line
holds. The first sitting is always the plain story.

## How scenarios are generated

Each sitting gets a random seed. From it the engine draws a subset of the meeting's pool, fills
in names, entities, places and amounts, shuffles the motions, sets each motion's payout, builds
the figure questions from fresh numbers, and later rolls the reckoning. The seed is saved, so a
reload resumes the same sitting.

## Files

Sources live in `_src/minute-book/`. GitHub Pages does not publish folders that start with an
underscore, so this folder is not on the website. That depends on the site using the default
Pages build. Do not add a `.nojekyll` file while the lock matters.

- `dev.html`: an unlocked copy for working on the game. Open it from a local web server.
- `shell.html`: the published page. It holds only the lock.
- `css/book.css`, `js/engine.js`, `js/numerics.js`, `js/content/levelNN.js`
- `build.js`: joins and encrypts the scripts into `/minute-book/`.

## The lock

```
MB_PASSWORD='the password' node _src/minute-book/build.js
```

This writes `/minute-book/index.html`, `book.css` and `book.lock.js`. The scripts are encrypted
with AES-256-GCM under a key derived from the password (PBKDF2-SHA256, 250,000 rounds). The
password is not stored anywhere in the repository. Run the build again after any change to the
sources, and commit the output.

What the lock does and does not do:

- A visitor to the website cannot play or read the game without the password.
- A device that ticked "keep it open" stays open until the password or salt changes.
  `--new-salt` closes every device.
- If this repository is public, the sources in `_src/` can still be read on GitHub. The lock
  protects the website, not the repository.

To remove the lock later, publish `dev.html` and the `css` and `js` folders as `/minute-book/`.

## Adding a scenario

```js
{
  id: 'l4-example',            // unique
  title: 'Shown as the item heading',
  builds: ['Duty of loyalty'], // optional
  make: function (g) {         // g is the seeded generator
    var a = g.person(), amt = g.m(1, 5, 0.5);
    return {
      scene: `Two sentences with ${a} and ${MB.usd(amt)}.`,
      options: [
        ['s', `The sound motion.`, `One sentence on why.`],
        ['g', `The grey motion.`, `One sentence on why.`],
        ['p', `The poor motion.`, `One sentence on why.`]
      ],
      deal: {                   // optional second beat, shown after a sound choice
        none: false,            // true when there is no deal to be had
        setup: `One or two sentences on the opening.`,
        asks: [                 // m fair, r strong, x overreach, v gift, t tone-deaf, n none
          ['m', `The ask.`, `One line on why.`],
          ['x', `The ask.`, `One line on why.`],
          ['n', `Ask for nothing.`, `One line on why.`]
        ],
        rule: `One sentence on where the line is.`
      },
      who: `${a.first}`,        // who is pushing, named when goodwill moves
      behind: `What each party wanted and how they stood to gain.`,
      deep: [                   // the "Go deeper" points: a lead-in and one or two sentences
        [`The mechanics`, `How the money moves.`],
        [`Who pays`, `Where the cost lands.`],
        [`What to do`, `What a careful operator does.`]
      ],
      rule: `One sentence.`,
      us: `Optional United States note.`,
      ca: `Optional Canada note.`
    };
  }
}
```

Add `burn: 0` to a scenario where the sound choice upsets nobody, or `burn: 2` where it
upsets someone powerful. The default is 1.

Helpers: `g.person()`, `g.city('us' | 'ca')`, `g.spe('LP' | 'LLC' | 'Inc.')`, `g.asset()`,
`g.fund`, `g.m(lo, hi, step)` for dollars in $ millions, `g.pick([...])`, `g.int(lo, hi)`.

## Content standard

- Every scenario is invented. No real firm, person or transaction.
- The sound motion is general best practice, not a ruling on any one jurisdiction.
- The game is a teaching tool and says so. It is not legal advice.

## Look

One visual world: a cloth-bound ledger on pale green paper. Each meeting has its own colour and
line icon, set in `TONE` and `MARK` in the engine, in the manner of the colour groups on a set
of property cards. The colour appears on the meeting's card in the contents, on its token on
the cover shelf, along the top of the sheet while the meeting is in session, and on its seal.

## A board game, later

Notes from the conversation, for after the online game is settled.

- A card game in the family of Monopoly Deal, for ages eight and up, with terms boiled down
  to basics.
- Turn based. On your turn you are the fund manager running a deal. When it is not your
  turn you play another role in that deal, such as builder, lender, investor or landlord,
  so everyone is involved on every turn and the same deal looks different from each seat.
- A "fine print" card lets a player tweak a deal in their favour. Another player may
  challenge, and the dice decide whether it sticks or backfires.
- Any player can buy into another player's deal as a passive investor.
- Dice replace the wheel. Tokens held, such as loose ends and goodwill, change the roll.
- Players can bend the rules and make better deals with each other. The game needs a simple
  way to mark where bending ends and breaking begins.
- Earnings must be countable at a glance: coins on cards, no arithmetic beyond adding.
- Possibly something to sell from buckshot.sbs one day.

## Ideas not yet built

- Deal beats for the meetings that have none, and more twists.
- A planning and debrief layer between meetings, built on the term sheet.
- Options that carry forward and can be exercised in a later meeting.
- Deal flow that depends on goodwill, and a deal table for investing equity between meetings.
- Per-motion payouts written to fit each scenario, in place of generated ones.
- Loose ends that stay buried and resurface in later meetings.
- Consequences that carry forward, so an unreleased fee in Meeting VII returns in Meeting XII.
- A cap table for the player: buying into deals, carried interest, dilution of your own stake.
- Role tracks: lender, sponsor, limited partner, independent director.
- More topics: tax structuring, fund formation, joint venture deadlock, bonding, reporting.
- A shareable career result.
