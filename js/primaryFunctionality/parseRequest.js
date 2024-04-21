const { handleHeavyRequest } = require("./handleHeavyRequest");
const { handleSimpleRequest } = require("./handleSimpleRequest");
const { formatCsv } = require("../dataCleaning/formatCsv");
const { sendToCsv } = require("./sendToCsv");

async function parseRequest(input) {
    // Specifying total pages to process and determine the remainder
    const pages = Math.ceil(input / 30);
    const remainder = input % 30;

    const baseUrl = "https://news.ycombinator.com/"
    const pageList = []

    // Modifying the base url to properly navigate each request
    for (let i = 1; i <= pages; i++) {
        const value = `?p=${i}`
        pageList.push({ url: baseUrl + value, entries: 30 })
    }

    // Overwriting the final page with the remainder to maintain desired input amount
    pageList[pageList.length - 1].entries = remainder > 0 ? remainder : 30;

    // Calling the appropriate amount of operations then sending data to be processed
    if (pageList.length < 5) {
        handleSimpleRequest(pageList)
            .then(async results => {
                sendToCsv(formatCsv(results))
            })
            .catch(e => {
                console.error("There was an error fulfilling request: ", e);
            });
    } else {
        handleHeavyRequest(pageList)
            .then(async results => {
                sendToCsv(formatCsv(results))
            })
            .catch(e => {
                console.error("There was an error fulfilling request: ", e);
            });
    }
}

module.exports = {
    parseRequest
}
