function cleanComments(numComments) {
    if (numComments && numComments === "discuss") {
        numComments = "0 comments";
    } else if (!numComments) {
        numComments = "N/A"
    }
    return numComments;
}

module.exports = {
    cleanComments
}
