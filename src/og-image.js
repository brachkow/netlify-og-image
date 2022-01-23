const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const { builder } = require("@netlify/functions");
const fs = require("fs").promises;

exports.handler = builder(async function (event, context) {
  const { template, ...params } = Object.fromEntries(
    event.path
      .split("/")
      .filter((p) => p.includes("="))
      .map(decodeURIComponent)
      .map((s) => s.split("=", 2))
  );

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { height: 630, width: 1200 },
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  let htmlPage = (
    await fs.readFile(require.resolve(`./templates/${template}.html`))
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
      "Content-Type": "image/png",
    },
    body: buffer.toString("base64"),
    isBase64Encoded: true,
  };
});
