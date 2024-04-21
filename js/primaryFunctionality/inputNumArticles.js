const readline = require("readline");

async function inputNumArticles() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Prompt user for desired amount of articles
    const res = await new Promise(resolve => {
        rl.question(`*NOTE: Values exceeding available data will not be included.*\nHow many articles would you like to scrape? ` , answer => {
            resolve(answer);
        })
    });

    // Ensure response falls within constraints
    const response = parseInt(res);
    if (!isNaN(response)) {
        if (response < 1 || response > 1000) {
            console.log("Please ensure the amount is between 1 and 1000." 
            );
            rl.close();
            return inputNumArticles();
        } else {
            rl.close();
            return response
        }
    }

    // Handle edge cases
    console.log("Please enter a valid number between 1 and 1000.");
    rl.close();
    return inputNumArticles();
}

module.exports = {
    inputNumArticles
}
