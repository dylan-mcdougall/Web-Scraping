async function getNumComments(subline) {
    let numComments = null;
    if (await subline.isVisible()) {
        numComments = await subline.getByRole("link").last().innerText();
    }
    return numComments;
}

module.exports = {
    getNumComments
}
