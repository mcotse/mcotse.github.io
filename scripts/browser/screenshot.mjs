#!/usr/bin/env node
/**
 * Take a full-page screenshot of the site.
 *
 * Usage:
 *   node scripts/browser/screenshot.mjs                  # saves to screenshots/full.png
 *   node scripts/browser/screenshot.mjs my-shot.png      # saves to screenshots/my-shot.png
 */
import { setup } from "./helpers.mjs";
import { mkdirSync } from "fs";
import { resolve } from "path";

const outDir = resolve(process.cwd(), "screenshots");
mkdirSync(outDir, { recursive: true });

const filename = process.argv[2] || "full.png";
const outPath = resolve(outDir, filename);

const { page, cleanup } = await setup();

try {
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(`Screenshot saved to ${outPath}`);
} finally {
  await cleanup();
}
