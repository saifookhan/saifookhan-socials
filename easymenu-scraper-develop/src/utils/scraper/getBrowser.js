import chromium from "@sparticuz/chromium-min";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";

const getBrowser = async () => {
  await chromium.font(
    "https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
  );

  const browser =
    process.env.NODE_ENV === "development"
      ? await puppeteer.launch({
          executablePath:
            process.platform == "darwin" // for macOS, else it will take the windows path ;)
              ? "/Applications/Chromium.app/Contents/MacOS/Chromium"
              : "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          headless: false,
        })
      : await puppeteerCore.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(
            `https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar`
          ),
          headless: chromium.headless,
          ignoreHTTPSErrors: true,
        });
  return browser;
};

export { getBrowser };
