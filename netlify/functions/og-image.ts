import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import { readFile } from 'fs';
import { existsSync } from 'fs';

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  const { template, ...params } = Object.fromEntries(
    event.path
      .split('/')
      .filter((p) => p.includes('='))
      .map(decodeURIComponent)
      .map((s) => s.split('=', 2)),
  );
  let localChrome =
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  let executable = existsSync(localChrome)
    ? localChrome
    : chromium.executablePath;

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { height: 630, width: 1200 },
    executablePath: await executable,
    headless: chromium.headless,
  });

  let htmlPage = (
    await readFile(require.resolve(`./${template}.html`))
  ).toString();

  for (const k in params) {
    htmlPage = htmlPage.replace(`{${k}}`, params[k]);
  }

  const page = await browser.newPage();
  await page.setContent(htmlPage);
  await page.waitForTimeout(1000);
  const buffer = await page.screenshot();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/png',
    },
    body: buffer.toString('base64'),
    isBase64Encoded: true,
  };
};

export { handler };
