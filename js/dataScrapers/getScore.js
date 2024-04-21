async function getScore(subline) {
    let score = "N/A";
    if (await subline.isVisible()) {
        score = await subline.locator("span.score").innerText();
    }

    return score;
}

module.exports = {
    getScore
}
