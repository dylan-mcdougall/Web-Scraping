Documentation

I had a lot of fun working on this project, while the tone of this file will be more casual than actual documentation, I'll still provide the structure of the project, as well as detail the primary functionality and thought process behind the key files!

## Usage Instructions

Install the node modules using `npm i`. 
I'm assuming there won't be any issues with your Playwright version but if there are, install/update your Playwright using `npm install playwright && npm install -D @playwright/test` then `npx playwright install`.

To run the script, use `node index.js`, the console will prompt you for your desired number of articles to scrape.

Once the script finishes, you should see the "HackerNews_Scraped_Data.csv" file in your root directory. I have included the page number in each data entry as well to allow for easier confirmation of a given value. If you want to run it multiple times, the script will overwrite the previous file. I wrote this with the intention of handling a large amount of data so feel free to go crazy with the input!

## Testing

I originally set out to create an entire View test suite that I would submit as well but that was turning out to be more ambitious than I originally intended. I still fully intend to play around with the actual testing functionalities of Playwright in the meantime while I wait to hear back about the next round. That being said, there is still a small amount of tests, feel free to run them with `npx playwright test`. They're definitely flawed but ideally by the time I possibly hear back about the results I'll have a better grasp of how to work with Playwright in that domain 🐺

## File Structure

```
├── DOCUMENTATION.md
├── README.md
├── index.js
├── js
│   ├── dataCleaning
│   │   ├── cleanComments.js
│   │   ├── cleanUrl.js
│   │   └── formatCsv.js
│   ├── dataScrapers
│   │   ├── getAge.js
│   │   ├── getAuthor.js
│   │   ├── getNumComments.js
│   │   ├── getRank.js
│   │   ├── getScore.js
│   │   └── getTitleAndUrl.js
│   └── primaryFunctionality
│       ├── fireBrowser.js
│       ├── handleHeavyRequest.js
│       ├── handleSimpleRequest.js
│       ├── inputNumArticles.js
│       ├── parseRequest.js
│       ├── saveHackerNewsArticles.js
│       └── sendToCsv.js
├── package-lock.json
├── package.json
├── playwright.config.js
├── tests
│   └── hnHeading.specs.js
└── why_qa_wolf.txt
```

## Control Flow

```
index.js
└── inputNumArticles.js
    └── parseRequest.js
        ├── handleHeavyRequest.js/handleSimpleRequest.js
        │           └── fireBrowser.js
        │               └── saveHackerNewsArticles.js
        │                   ├── getRank.js
        │                   ├── getAge.js
        │                   ├── getTitleAndUrl.js
        │                   ├── getScore.js
        │                   ├── getAuthor.js
        │                   ├── getNumComments.js
        │                   ├── cleanUrl.js
        │                   └── cleanComments.js
        └── formatCsv.js
            └── sendToCsv.js
```                 

# Key Functions

## parseRequest.js

*Description*
- Since this script was crafted with the intention of handling the max use case scenario, I wanted to pass the user input through a filter to ensure that each page had an appropriate chromium instance dedicated to it. Since Hacker News has a total of 30 articles per page, I created an array to house the unique url of each process, then sent the array for processing.

*Key Structure*
```
const pages = Math.ceil(input / 30);
const remainder = input % 30;

const baseUrl = "https://news.ycombinator.com/"
const pageList = []

// Modifying the base url to properly navigate each request
for (let i = 1; i <= pages; i++) {
    const value = `?p=${i}`
    pageList.push({ url: baseUrl + value, entries: 30 })
}

// Overwriting the final page with the remainder to maintain desired input amount
pageList[pageList.length - 1].entries = remainder > 0 ? remainder : 30;
```

## handleRequest.js

*Description*
- Since each of these actions are asynchronous in nature, I wanted to attempt to utilize Playwright's parallelism to operate on them simultaneously. There were two flaws with my original thoughts on this:
- First: I didn't consider the fact that Hacker News would have a rate limiter, it makes sense why they would, but it makes the idea of scraping the entire site immediately simultaneously a moot point.
- Second: After working with it and researching further, I became fairly certain that Playwright's testing functionalities are the only aspect capable of parallelism since Javascript is inherently single threaded. Since it seems to be handled strictly via the workers, I would likely have had to look into implementing Node's multi-threading to achieve the original desired outcome.
- In order to handle the rate limiter at high demand inputs, I imposed a setTimeout to pace how many simultaneous requests were being made, then awaited the return of the promises to send the data off to be formatted.
- One of the key areas for improvement in my script is that I'm still sending the page off to be processed if it lies far past the end of existing articles, I likely should have created a check for where the data stops in order to break out of the operation to optimize this process.

*Key Structure*
```
async function handleRequest(pageList) {
    const awaiting = pageList.map((page, i) => {
        const { url, entries } = page;
        // Setting a delay to avoid triggering the rate limiter
        return new Promise(resolve => {
            setTimeout(async () => {
                console.log(`Delaying page ${i + 1} request to avoid potential rate 
                limit abuse, please wait...`);
                const result = await fireBrowser(entries, url);
                resolve(result);
            }, i * 1000);
        })
    });
    return Promise.all(awaiting);
}
```

## saveHackerNewsArticles.js

*Description*
- Rather than just grab the required title and url, I wanted to get more experience with Playwright so I decided to pull all relevant data from each article.
- Some of the key challenges I had to problem solve my way through were the edge cases where some data wouldn't exist, the desired input exceeded the number of articles, and a case where some urls didn't have an entire path since they would navigate to a Hacker News address.
- To deal with this I decided to utilize the .isVisible() locator function, since some data would exist dependant on a specific span or cell being within the document, it made it straight forward to break out of my conditions if data wasn't there.

*Key Structure*
```
async function saveHackerNewsArticles(input, page) {
    const aggregateData = [];
    const pageNum = "Page " + page.url().split('=')[1];
    try {
        
        // Iterate through to grab the desired amount of data
        for (let i = 0; i < input; i++) {
            // Handle edge case for empty page and article cutoff
            const row = page.locator("tr.athing").nth(i);
            if (!(await row.isVisible())) {
                break
            }

            let rank = await getRank(page, i)
            let { title, url } = await getTitleAndUrl(page, i);
            let age = await getAge(page, i)
            
            // Acquiring page element here to avoid duplicate requests for remaining data
            subtext = page.locator("td.subtext").nth(i)
            subline = await subtext.locator("span.subline");
        
            let score = await getScore(subline);
            let author = await getAuthor(subline);
            let numComments = await getNumComments(subline);

            // Handling edge cases for url and numComments
            url = cleanUrl(url);
            numComments = cleanComments(numComments);

            const payload = {
                rank,
                title,
                url,
                score,
                author,
                age,
                numComments,
                pageNum,
            }

            aggregateData.push(payload);
        }

        return aggregateData;
    } catch (e) {
        console.error("There was a problem scraping Hacker News: ", e);
    }
}
```
