import { chromium } from "playwright";
import { spawn } from "child_process";

/**
 * Start the Vite dev server and wait for it to be ready.
 * Returns { url, kill }.
 */
export function startDevServer({ port = 5173 } = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn("npx", ["vite", "--port", String(port)], {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
    });

    let output = "";

    const timeout = setTimeout(() => {
      proc.kill();
      reject(
        new Error(
          `Dev server failed to start within 15s. Output:\n${output}`
        )
      );
    }, 15_000);

    function checkOutput(chunk) {
      const text = chunk.toString();
      output += text;
      // Match the local URL from Vite output (strips ANSI codes)
      const match = text
        .replace(/\x1b\[[0-9;]*m/g, "")
        .match(/Local:\s+(http:\/\/localhost:\d+)/);
      if (match) {
        clearTimeout(timeout);
        resolve({ url: match[1], kill: () => proc.kill() });
      }
    }

    proc.stdout.on("data", checkOutput);
    proc.stderr.on("data", checkOutput);

    proc.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

/**
 * Launch a Chromium browser and open a page at the given URL.
 */
export async function launchBrowser({ headless = true, url } = {}) {
  const browser = await chromium.launch({ headless });
  const page = await browser.newPage();
  if (url) await page.goto(url, { waitUntil: "networkidle" });
  return { browser, page };
}

/**
 * Full setup: start dev server + launch browser.
 * Returns { browser, page, url, cleanup }.
 */
export async function setup({ headless = true, port = 5173 } = {}) {
  const server = await startDevServer({ port });
  const { browser, page } = await launchBrowser({
    headless,
    url: server.url,
  });

  const cleanup = async () => {
    await browser.close();
    server.kill();
  };

  return { browser, page, url: server.url, cleanup };
}
