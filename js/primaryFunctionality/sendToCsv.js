const fs = require("fs");
const { Buffer } = require("node:buffer");

function sendToCsv(string) {
    try {
        // Formatting string into acceptable csv format
        const blob = new Buffer.from(string);
        fs.writeFile("HackerNews_Scraped_Data.csv", blob, err => {
            if (err) {
                console.error("There was an issue writing to the file: ", err)
            } else {
                console.log("Success! Your file is located in the root directory 🐺")
            }
        });
    } catch (e) {
        console.error("There was an issue writing the csv file: ", e);
    }
}

module.exports = {
    sendToCsv
}
