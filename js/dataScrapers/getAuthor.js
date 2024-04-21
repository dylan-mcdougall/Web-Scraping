async function getAuthor(subline) {
    let author = "N/A";
    if (await subline.isVisible()) {
        author = await subline.locator("a.hnuser").innerText();
    }

    return author;
}

module.exports = {
    getAuthor
}
