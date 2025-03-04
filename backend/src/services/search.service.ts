import puppeteer from "puppeteer";

export const search = async (query: string, userId: string): Promise<string> => {
    return (async () => {
      const browser = await puppeteer.launch();
      puppeteer.connect({
        
      })
      const page = await browser.newPage();
      await page.goto('https://google.com?q=' + query);
      const imgData = await page.screenshot({
        encoding: 'base64',
        type: 'png',
        fullPage: true,
      });
      await browser.close();
      return imgData;
    })();
}