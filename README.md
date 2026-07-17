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
- One lifeline per team for the whole game: Hint or First 2 Letters
- Three secret special boxes hide +100, +200 and −50 points (scores never drop below zero)
- Score animations, confetti finale, and a host-configurable tie-breaker
- Undo, manual score adjust, and two-tap confirmations for destructive actions
- Auto-save to localStorage — refreshing mid-game offers Continue / New Game
- On-screen custom question editor with quick-paste plus JSON import/export
- Dark/light theme, sound toggle, keyboard shortcuts, ARIA labels, reduced-motion support

## Practice Mode

Tap **🎭 Try mock game** on the setup screen to rehearse before the real quiz.
Practice mode uses six easy non-biblical demo questions (100/200/300 points,
three per team), short timers (10/15/20 seconds), sample teams *Demo Team A*
and *Demo Team B*, and its own demo tie-breaker. A striped **PRACTICE MODE**
banner stays visible the whole time, with an **Exit practice** button that
returns to the setup screen. Every host control works exactly like the real
game — lifelines, undo, score adjust, tie-breaker — but nothing
is saved: your real saved game, custom questions, and settings are untouched.

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
mobile layout, reload recovery after an answer has been judged, and the full
practice-mode flow (demo questions, isolation from real saves, and exit).
