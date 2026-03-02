#!/usr/bin/env node
/**
 * Validate the site: check for console errors, broken links, layout issues, etc.
 *
 * Usage:
 *   node scripts/browser/validate.mjs
 */
import { setup } from "./helpers.mjs";

const { page, cleanup } = await setup();

const errors = [];
const warnings = [];

// Collect console errors
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`Console error: ${msg.text()}`);
  if (msg.type() === "warning") warnings.push(`Console warning: ${msg.text()}`);
});

page.on("pageerror", (err) => {
  errors.push(`Page error: ${err.message}`);
});

try {
  // Reload to capture console messages from scratch
  await page.reload({ waitUntil: "networkidle" });

  // Check page title exists
  const title = await page.title();
  if (!title) warnings.push("Page has no <title>");

  // Check no images are broken
  const brokenImages = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("img"))
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.src || img.outerHTML);
  });
  for (const img of brokenImages) {
    errors.push(`Broken image: ${img}`);
  }

  // Check all internal links have valid href
  const badLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("a"))
      .filter((a) => !a.href || a.href === "about:blank")
      .map((a) => a.outerHTML.slice(0, 120));
  });
  for (const link of badLinks) {
    errors.push(`Bad link: ${link}`);
  }

  // Check viewport widths for overflow
  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  if (hasHorizontalOverflow) {
    warnings.push("Page has horizontal overflow (content wider than viewport)");
  }

  // Report
  console.log("\n--- Validation Results ---\n");

  if (errors.length === 0 && warnings.length === 0) {
    console.log("All checks passed.");
  }

  if (warnings.length > 0) {
    console.log(`Warnings (${warnings.length}):`);
    for (const w of warnings) console.log(`  ⚠ ${w}`);
    console.log();
  }

  if (errors.length > 0) {
    console.log(`Errors (${errors.length}):`);
    for (const e of errors) console.log(`  ✗ ${e}`);
    console.log();
    process.exitCode = 1;
  }
} finally {
  await cleanup();
}
