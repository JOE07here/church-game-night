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
- Dark/light theme, sound toggle, keyboard shortcuts, ARIA labels, reduced-motion support

## Edit the questions

Open `index.html` and find the clearly marked `QUESTION_BANK` at the top of the
`<script>` section. Each box has `question`, `answer`, `acceptedAnswers`, `hint`,
`firstLetter`, and an optional `explanation` — replace them freely.
