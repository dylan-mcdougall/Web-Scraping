const { fireBrowser } = require("./fireBrowser");

// Launching independant browsers for each page
async function handleHeavyRequest(pageList) {
    const awaiting = pageList.map((page, i) => {
        const { url, entries } = page;
        // Setting a delay to avoid triggering the rate limiter
        return new Promise(resolve => {
            setTimeout(async () => {
                console.log(`Delaying page ${i + 1} request to avoid potential rate limit abuse, please wait...`);
                const result = await fireBrowser(entries, url);
                resolve(result);
            }, i * 1000);
        })
    });
    return Promise.all(awaiting);
}

module.exports = {
    handleHeavyRequest
}
