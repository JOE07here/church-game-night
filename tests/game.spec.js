import { expect, test } from "@playwright/test";

async function openFresh(page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

test("starts a 10-box game with custom team names", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });

  await openFresh(page);
  await expect(page.getByRole("heading", { name: "📦 Two-Team Box Quiz" })).toBeVisible();
  await page.getByLabel("Team 1 name").fill("Grace");
  await page.getByLabel("Team 2 name").fill("Hope");
  await page.getByRole("button", { name: "▶ Start game" }).click();

  await expect(page.getByRole("gridcell")).toHaveCount(10);
  await expect(page.locator("#turn-banner")).toContainText("Grace — pick a box");
  await expect(page.locator("#tc-0 .tname")).toHaveText("Grace");
  await expect(page.locator("#tc-1 .tname")).toHaveText("Hope");
  expect(errors).toEqual([]);
});

test("quick-pastes, saves, and plays manual questions", async ({ page }) => {
  await openFresh(page);
  await page.getByRole("button", { name: "✏️ Add or edit questions" }).click();
  await page.locator("#bulk-question-entry summary").click();
  await page.getByLabel("Questions to quick-paste").fill([
    "What is the first Greek letter? | Alpha | A | It comes before beta. | Greek alphabet",
    "What is two plus two? | Four | 4; four | Count two pairs. | Basic arithmetic"
  ].join("\n"));
  await page.getByRole("button", { name: "Fill selected board" }).click();

  await expect(page.locator('[data-i="0"][data-f="question"]')).toHaveValue("What is the first Greek letter?");
  await expect(page.locator('[data-i="4"][data-f="question"]')).toHaveValue("What is two plus two?");
  await expect(page.locator("#editor-status")).toContainText("Filled 2 boxes");
  await page.getByRole("button", { name: "💾 Save questions" }).click();

  await page.reload();
  await page.getByRole("button", { name: "▶ Start game" }).click();
  await page.getByRole("gridcell", { name: "Open box 100 A" }).click();
  await expect(page.getByRole("dialog")).toContainText("What is the first Greek letter?");
  await page.getByRole("textbox", { name: "Team's spoken answer" }).fill("A");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByText("✔ matches a stored answer", { exact: false })).toBeVisible();
});

test("recovers after reload between judging and continuing", async ({ page }) => {
  await openFresh(page);
  await page.getByRole("button", { name: "▶ Start game" }).click();
  // neutralize the random special boxes so the score assertion is deterministic
  await page.evaluate(() => { state.specialBoxes = {}; save(); });
  await page.getByRole("gridcell", { name: "Open box 100 A" }).click();
  await page.getByRole("button", { name: "✔ Correct" }).click();
  await expect(page.locator("#q-result")).toContainText("Team Alpha wins 100 points");

  await page.reload();
  await page.getByRole("button", { name: "▶ Continue" }).click();
  await expect(page.locator("#q-result")).toContainText("Team Alpha wins 100 points");
  await page.getByRole("button", { name: "Continue ▶" }).click();

  await expect(page.locator("#tc-0 .tscore")).toHaveText("100");
  await expect(page.locator("#turn-banner")).toContainText("Team Omega — pick a box");
  await expect(page.getByRole("gridcell", { name: "100 A — answered" })).toBeDisabled();
});

test("keeps the board within a narrow mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await openFresh(page);
  await page.getByRole("button", { name: "▶ Start game" }).click();

  const layout = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    columns: getComputedStyle(document.querySelector("#board-grid")).gridTemplateColumns.split(" ").length
  }));
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
  expect(layout.columns).toBe(2);
});
