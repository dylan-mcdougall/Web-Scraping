async function getAge(page, i) {
    const ageElement = page.locator("span.age").nth(i)
    const age = await ageElement.innerText();

    return age;
}

module.exports = {
    getAge
}
