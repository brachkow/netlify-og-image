const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const { builder } = require("@netlify/functions");
const fs = require("fs").promises;

exports.handler = builder(async function (event, context) {
  const generateHtml = (event) => {
    const { template, ...params } = Object.fromEntries(
      event.path
        .split("/")
        .filter((p) => p.includes("="))
        .map(decodeURIComponent)
        .map((s) => s.split("=", 2))
    );

    let htmlPage = (
      await fs.readFile(require.resolve(`./${template}.html`))
    ).toString();

    for (const k in params) {
      htmlPage = htmlPage.replace(`{${k}}`, params[k]);
    }

    return htmlPage;
  };

  const makeScreenshot = async (htmlPage) => {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { height: 630, width: 1200 },
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

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
  };

  return await makeScreenshot(generateHtml(event));
});
