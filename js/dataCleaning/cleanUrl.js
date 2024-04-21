function cleanUrl(url) {
    if (url && url.startsWith("item?id=")) {
        url = `https://news.ycombinator.com/${url}`
      } else if (!url) {
        url = null;
        console.error("Error locating url.");
      }
    return url
}

module.exports = {
    cleanUrl
}
