import { connect } from "puppeteer-real-browser";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getRealBrowserDeliveroo(url) {
  const { browser, page } = await connect({
    headless: false,
    args: [],
    customConfig: {},
    turnstile: true,
    connectOption: {},
    disableXvfb: false,
    ignoreAllFlags: false,
    // proxy:{
    //     host:'<proxy-host>',
    //     port:'<proxy-port>',
    //     username:'<proxy-username>',
    //     password:'<proxy-password>'
    // }
  });
  console.log("URL", url);
  await page.goto(url);

  await sleep(10000);

  const result = await page.evaluate(() => {
    return window.__NEXT_DATA__;
  });

  await browser.close();

  return result;
}
export { getRealBrowserDeliveroo };
