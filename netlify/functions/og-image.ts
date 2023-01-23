import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import { readFileSync, existsSync } from 'fs';

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  let localChrome =
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  let executable = existsSync(localChrome)
    ? localChrome
    : chromium.executablePath;

  const params = {};

  event.rawQuery.split('&').forEach((queryParamString) => {
    const [key, value] = queryParamString.split('=');
    params[key] = value;
  });

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { height: 630, width: 1200 },
    executablePath: await executable,
    headless: chromium.headless,
  });

  let content = readFileSync(__dirname + `/${params.template}.html`).toString();

  for (const param in params) {
    content = content.replace(`{${param}}`, params[param]);
  }

  const page = await browser.newPage();
  await page.setContent(content, { waitUntil: 'networkidle0' });
  const screenshot = await page.screenshot();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/png',
    },
    body: screenshot.toString('base64'),
    isBase64Encoded: true,
  };
};

export { handler };
