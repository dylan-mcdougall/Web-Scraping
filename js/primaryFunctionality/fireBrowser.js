const { chromium } = require("playwright");
const { saveHackerNewsArticles } = require("./saveHackerNewsArticles");

async function fireBrowser(input, url) {
    try {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url);

        const data = await saveHackerNewsArticles(input, page);

        await context.close();
        await browser.close();

        return data;
    } catch (e) {
        console.error("There was an issue launching chromium: ", e);
    }
}

module.exports = {
    fireBrowser
}
