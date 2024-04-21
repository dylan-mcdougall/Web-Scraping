const { cleanUrl } = require("../dataCleaning/cleanUrl");
const { cleanComments } = require("../dataCleaning/cleanComments");
const { getRank } = require("../dataScrapers/getRank");
const { getTitleAndUrl } = require("../dataScrapers/getTitleAndUrl");
const { getAge } = require("../dataScrapers/getAge");
const { getScore } = require("../dataScrapers/getScore");
const { getAuthor } = require("../dataScrapers/getAuthor");
const { getNumComments } = require("../dataScrapers/getNumComments");

async function saveHackerNewsArticles(input, page) {
    const aggregateData = [];
    const pageNum = "Page " + page.url().split('=')[1];
    try {
        
        // Iterate through to grab the desired amount of data
        for (let i = 0; i < input; i++) {
            // Handle edge case for empty page and article cutoff
            const row = page.locator("tr.athing").nth(i);
            if (!(await row.isVisible())) {
                break
            }

            let rank = await getRank(page, i)
            let { title, url } = await getTitleAndUrl(page, i);
            let age = await getAge(page, i)
            
            // Acquiring page element here to avoid duplicate requests for remaining data
            subtext = page.locator("td.subtext").nth(i)
            subline = await subtext.locator("span.subline");
        
            let score = await getScore(subline);
            let author = await getAuthor(subline);
            let numComments = await getNumComments(subline);

            // Handling edge cases for url and numComments
            url = cleanUrl(url);
            numComments = cleanComments(numComments);

            const payload = {
                rank,
                title,
                url,
                score,
                author,
                age,
                numComments,
                pageNum,
            }

            aggregateData.push(payload);
        }

        return aggregateData;
    } catch (e) {
        console.error("There was a problem scraping Hacker News: ", e);
    }
}

module.exports = {
    saveHackerNewsArticles
}
