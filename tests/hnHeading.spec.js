const { test, expect } = require("@playwright/test");

test('has title', async ({ page }) => {
    await page.goto("https://news.ycombinator.com/news");

    await expect(page).toHaveTitle(/Hacker News/);
});

test('has navigation', async ({ page }) => {
    await page.goto("https://news.ycombinator.com/news");

    const nav = page.locator("span.pagetop").first();
    await expect(nav).toBeVisible();

    await expect(nav.getByRole("link").getByText("new", { exact: true })).toBeVisible();
    await expect(nav.getByRole("link").getByText("past", { exact: true })).toBeVisible();
    await expect(nav.getByRole("link").getByText("comments", { exact: true })).toBeVisible();
    await expect(nav.getByRole("link").getByText("ask", { exact: true })).toBeVisible();
    await expect(nav.getByRole("link").getByText("show", { exact: true })).toBeVisible();
    await expect(nav.getByRole("link").getByText("jobs", { exact: true })).toBeVisible();
    await expect(nav.getByRole("link").getByText("show", { exact: true })).toBeVisible();

    await expect(nav.getByRole("link").getByText("new", { exact: true })).toHaveAttribute("href");
    await expect(nav.getByRole("link").getByText("past", { exact: true })).toHaveAttribute("href");
    await expect(nav.getByRole("link").getByText("comments", { exact: true })).toHaveAttribute("href");
    await expect(nav.getByRole("link").getByText("ask", { exact: true })).toHaveAttribute("href");
    await expect(nav.getByRole("link").getByText("show", { exact: true })).toHaveAttribute("href");
    await expect(nav.getByRole("link").getByText("jobs", { exact: true })).toHaveAttribute("href");
    await expect(nav.getByRole("link").getByText("show", { exact: true })).toHaveAttribute("href");
});

test('nav links properly navigate', async ({ page }) => {
    await page.goto("https://news.ycombinator.com/news");

    const nav = page.locator("span.pagetop").first();

    const newLink = [nav.getByRole("link").getByText("new", { exact: true }), "newest"];
    const pastLink = [nav.getByRole("link").getByText("past", { exact: true }), "front"];
    const commentsLink = [nav.getByRole("link").getByText("comments", { exact: true }), "newcomments"];
    const askLink = [nav.getByRole("link").getByText("ask", { exact: true }), "ask"];
    const showLink = [nav.getByRole("link").getByText("show", { exact: true }), "show"];
    const jobsLink = [nav.getByRole("link").getByText("jobs", { exact: true }), "jobs"];

    const navigation = [newLink, pastLink, commentsLink, askLink, showLink, jobsLink];

    // Setting a delay to bypass rate limiter
    navigation.forEach((test, i) => {
        const [locator, substring] = test;
        setTimeout(async () => {
            const pagePromise = page.waitForEvent("load");
            await locator.click();
            const newPage = await pagePromise;
            expect(page.url()).toContain(substring);
            await newPage.waitForLoadState("domcontentloaded");
            await page.goBack();
        }, i + 1 * 1000)
    });
});
