# Two-Team Box Quiz 📦

A game-show style quiz for church game nights — two teams, ten question boxes
(100–500 points), open-ended answers, lifelines, and a host-driven flow.

**Play it live:** https://joe07here.github.io/church-game-night/

## How to run

Open `index.html` in any browser (works fully offline), or use the live link
above and project it on a big screen.

1. Enter both team names.
2. Toss a real coin and tap which team starts (or open the built-in virtual toss).
3. Teams alternate picking boxes — each team answers exactly 5 open-ended questions.
4. The host reads the question, judges the spoken answer with **Correct / Wrong**,
   and can reveal the answer + explanation at any time.

## Features

- Value-based countdown timers (30–75s) with pause, ±10s, and a final-10-seconds warning
- One lifeline per team: Extra Time, Hint, First Letter, or Skip & Return
- Optional Mystery Rewards (small perks, max one per team)
- Score animations, confetti finale, and a host-configurable tie-breaker
- Undo, manual score adjust, and two-tap confirmations for destructive actions
- Auto-save to localStorage — refreshing mid-game offers Continue / New Game
- On-screen custom question editor with quick-paste plus JSON import/export
- Dark/light theme, sound toggle, keyboard shortcuts, ARIA labels, reduced-motion support

## Edit the questions

From the setup screen, choose **Add or edit questions**. You can edit any box
directly or quick-paste one question per line in this format:

```text
Question | Answer | accepted answer 1; accepted answer 2 | Hint | Explanation
```

Choose **Save questions** when finished. Custom questions are stored in that
browser. Use **Export question set** to create a JSON backup or move the set to
another device, then use **Import question set** there.

Developers can also edit the clearly marked `DEFAULT_QUESTION_BANK` near the top
of the `<script>` section in `index.html`.

## Tests

```bash
npm install
npm run test:install-browser
npm test
```

The Playwright suite covers setup, custom questions, scoring, turn changes,
mobile layout, and reload recovery after an answer has been judged.
