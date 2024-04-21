async function getTitleAndUrl(page, i) {
    const titleElement = page.locator("span.titleline")
        .getByRole("link")
        .filter({ hasNot: page.getByRole("link"), hasNot: page.locator("span.sitestr") })
        .nth(i);
    const title = await titleElement.innerText();
    const url = await titleElement.getAttribute("href");

    return { title, url };
}

module.exports = {
    getTitleAndUrl
}
