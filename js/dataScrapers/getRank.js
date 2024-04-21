async function getRank(page, i) {
    const rankSpan = page.locator('span.rank')
        .nth(i);
    const rank = await rankSpan.innerText();
  
    return rank
  }

module.exports = {
    getRank
}
