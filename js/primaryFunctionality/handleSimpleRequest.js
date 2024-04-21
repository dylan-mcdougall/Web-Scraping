const { fireBrowser } = require("./fireBrowser");

// Launching independant browsers for each page
async function handleSimpleRequest(pageList) {
    const result = pageList.map(async page => {
        const { url, entries } = page;
        return await fireBrowser(entries, url)
    });
    return Promise.all(result);
}

module.exports = {
    handleSimpleRequest
}
