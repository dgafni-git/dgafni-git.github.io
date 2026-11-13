# Minute Book: design notes

A corporate governance game for real estate lending, development and private equity.
Static site, no build step, no dependencies. Served at `/minute-book/`.

## The idea

The player sits through thirteen board meetings. Each meeting is a level with an agenda of
five to eight items. Every item is a decision with three motions:

- **Sound**: what a careful board and its counsel would do. 2 points.
- **Grey**: common practice that leaves a gap. 1 point.
- **Poor**: 0 points.

After choosing, the player sees why each motion is graded as it is, the principle behind the
item, and notes on where the United States and Canada differ. Some items ask for a figure
instead (a waterfall, a coverage ratio, a vote count) and show the working.

A meeting passes at 70% of its points (80% for the last). Passing opens the next meeting,
enters that meeting's terms in the Registers (the glossary), and promotes the player:
Analyst, Associate, and so on up to Chair of the Board.

Two career meters run across the whole game. **Standing** is trust earned. **Exposure** is
legal risk left lying around.

## The curriculum

Each meeting assumes the ones before it. Later items carry a "Draws on" line naming the
earlier terms they depend on.

| No. | Meeting | What it establishes |
| --- | --- | --- |
| I | The Entity | Separate legal persons, limited liability, authority to sign, veil piercing |
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

## How scenarios are generated

Nothing is stored as fixed text. Each sitting gets a random seed, and from it the engine:

1. draws a subset of the meeting's scenario pool (the capstone is fixed and in order);
2. fills each scenario with generated names, entities, cities, property types and amounts;
3. shuffles the order of the motions;
4. builds the figure questions from fresh numbers and computes the answer and the working.

The seed is saved, so a reload resumes the same sitting. Sitting a meeting again gives a new one.

## Files

- `index.html`: the shell.
- `css/book.css`: all styling. Design tokens are in the `:root` block.
- `js/engine.js`: state, seeded generation, scoring, rendering, routing.
- `js/numerics.js`: the generated figure questions.
- `js/content/levelNN.js`: one file per meeting.

Progress is kept in the browser's local storage under `minute-book-v1`.

## Adding a scenario

Add an object to a level's `scenarios` array:

```js
{
  id: 'l4-example',            // unique
  title: 'Shown as the item heading',
  builds: ['Duty of loyalty'], // optional: earlier terms this depends on
  make: function (g) {         // g is the seeded generator
    var a = g.person(), amt = g.m(1, 5, 0.5);
    return {
      scene: `Text with ${a} and ${MB.usd(amt)}.`,
      ask: `The question.`,
      options: [
        ['s', `The sound motion.`, `Why it is sound.`],
        ['g', `The grey motion.`, `Why it is grey.`],
        ['p', `The poor motion.`, `Why it is poor.`]
      ],
      rule: `The principle.`,
      us: `Optional United States note.`,
      ca: `Optional Canada note.`
    };
  }
}
```

Generator helpers: `g.person()`, `g.city('us' | 'ca')`, `g.spe('LP' | 'LLC' | 'Inc.')`,
`g.asset()`, `g.fund`, `g.m(lo, hi, step)` for dollars in $ millions, `g.pick([...])`, `g.int(lo, hi)`.

Each scenario needs exactly one motion of each grade.

## Content standard

- Every scenario is invented. No real firm, person or transaction.
- The sound motion is the general best practice, not a ruling on any one jurisdiction.
- Country notes point to common differences and are not complete.
- The game is a teaching tool and says so on every page. It is not legal advice.

## Ideas not yet built

- Branching consequences that carry between meetings, so an unreleased fee in Meeting VII
  returns as a claim in Meeting XII.
- A jurisdiction switch that swaps the sound motion where the two countries truly diverge.
- Role tracks: lender, sponsor, limited partner, independent director.
- More topics: tax structuring, anti-money-laundering checks, fund formation, joint venture
  deadlock and buy-sell clauses, construction bonding, environmental and social reporting.
- A printable certificate and a shareable result.
- A review mode that re-asks only the items the player got wrong.
