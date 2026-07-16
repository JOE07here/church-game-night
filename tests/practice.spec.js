// Playwright tests for Practice Mode and real-game regression.
// Run with: npm test  (serves index.html via tests/server.mjs, see playwright.config.js)
import { expect, test } from '@playwright/test';

const SAVE_KEY = 'twoTeamBoxQuiz_v2';
const BANK_KEY = 'twoTeamBoxQuiz_bank_v1';

// Load the page with clean storage so no continue-saved-game modal appears.
async function freshPage(page) {
  await page.goto('/index.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator('#scr-setup')).toBeVisible();
}

test.describe('Practice mode', () => {
  test('mock game button appears on the setup screen', async ({ page }) => {
    await freshPage(page);
    await expect(page.locator('#btn-demo')).toBeVisible();
    await expect(page.locator('#btn-demo')).toContainText('Try mock game');
  });

  test('starting practice shows the banner, six demo boxes, and demo team names', async ({ page }) => {
    await freshPage(page);
    await page.click('#btn-demo');
    await expect(page.locator('#practice-banner')).toBeVisible();
    await expect(page.locator('#practice-banner')).toContainText('PRACTICE MODE');
    await expect(page.locator('#board-grid .tile')).toHaveCount(6);
    await expect(page.locator('#tc-0 .tname')).toHaveText('Demo Team A');
    await expect(page.locator('#tc-1 .tname')).toHaveText('Demo Team B');
  });

  test('demo questions and short practice timers are used', async ({ page }) => {
    await freshPage(page);
    await page.click('#btn-demo');
    await page.click('#board-grid .tile:first-child'); // 100 A in display order
    await expect(page.locator('#q-text')).toContainText('blue and yellow');
    await expect(page.locator('#q-text')).not.toContainText('ark');
    const t = (await page.locator('#q-time').textContent()).trim();
    expect(['0:10', '0:09', '0:08']).toContain(t); // 10s demo timer, allow ticks
  });

  test('typed-answer matching, scoring, and turn change work in practice', async ({ page }) => {
    await freshPage(page);
    await page.click('#btn-demo');
    await page.click('#board-grid .tile:first-child');
    await page.fill('#q-answer-in', 'green');
    await page.click('#btn-submit');
    await expect(page.locator('#q-submitted')).toContainText('matches');
    await page.click('#btn-correct');
    await page.click('#btn-continue');
    await expect(page.locator('#tc-0 .tscore')).toHaveText('100');
    await expect(page.locator('#turn-banner')).toContainText('Demo Team B');
  });

  test('lifelines, skip & return, and undo work in practice', async ({ page }) => {
    await freshPage(page);
    await page.click('#btn-demo');
    // Demo Team A: hint lifeline on 100A
    await page.click('#board-grid .tile:first-child');
    await page.click('#ll-hint');
    await expect(page.locator('#q-hint')).toContainText('grass');
    await page.click('#btn-correct');
    await page.click('#btn-continue');
    // Demo Team B: skip & return, then the pending box is theirs to reopen
    await page.locator('#board-grid .tile:not([disabled])').first().click();
    await page.click('#ll-skip');
    await expect(page.locator('#board-grid .tile.pending')).toHaveCount(1);
    await expect(page.locator('#tc-1 .tmeta')).toContainText('Skip used');
    // Undo reverses the last opened question (back to Team B's skip snapshot)
    await page.click('#btn-undo');
    await expect(page.locator('#board-grid .tile.pending')).toHaveCount(0);
  });

  test('exit practice returns safely to the setup screen', async ({ page }) => {
    await freshPage(page);
    await page.click('#btn-demo');
    await page.click('#btn-exit-practice');
    await expect(page.locator('#scr-setup')).toBeVisible();
    await expect(page.locator('#practice-banner')).toBeHidden();
  });

  test('practice never overwrites the real save or custom questions', async ({ page }) => {
    await freshPage(page);
    const sentinelSave = '{"sentinel":"real-save"}';
    const sentinelBank = '{"sentinel":"custom-bank"}';
    await page.evaluate(
      ([k1, v1, k2, v2]) => { localStorage.setItem(k1, v1); localStorage.setItem(k2, v2); },
      [SAVE_KEY, sentinelSave, BANK_KEY, sentinelBank]
    );
    await page.click('#btn-demo');
    await page.click('#board-grid .tile:first-child');
    await page.click('#btn-correct');
    await page.click('#btn-continue');
    await page.click('#btn-exit-practice');
    const after = await page.evaluate(
      ([k1, k2]) => [localStorage.getItem(k1), localStorage.getItem(k2)],
      [SAVE_KEY, BANK_KEY]
    );
    expect(after[0]).toBe(sentinelSave);
    expect(after[1]).toBe(sentinelBank);
  });
});

test.describe('Real game regression', () => {
  test('20-box game starts with real questions and real timers', async ({ page }) => {
    await freshPage(page);
    await page.click('#btn-start');
    await expect(page.locator('#board-grid .tile')).toHaveCount(20);
    await expect(page.locator('#practice-banner')).toBeHidden();
    await page.click('#board-grid .tile:first-child');
    await expect(page.locator('#q-text')).toContainText('ark'); // real 100A question
    const t = (await page.locator('#q-time').textContent()).trim();
    expect(['0:30', '0:29', '0:28']).toContain(t); // real 100-point timer
  });

  test('10-box game starts, scores, and switches turns', async ({ page }) => {
    await freshPage(page);
    await page.check('input[name="boardsize"][value="10"]');
    await page.click('#btn-start');
    await expect(page.locator('#board-grid .tile')).toHaveCount(10);
    await page.click('#board-grid .tile:first-child');
    await page.click('#btn-correct');
    await page.click('#btn-continue');
    await expect(page.locator('#tc-0 .tscore')).toHaveText('100');
    await expect(page.locator('#turn-banner')).toContainText('pick a box');
  });
});
