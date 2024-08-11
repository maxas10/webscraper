const express = require('express')
const app = express()
const port = 3000
const puppeteer = require("puppeteer");

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1024 });

    app.get('/', async (req, res) => {
        const newImgLinks = [];
        await page.goto(`https://www.pinterest.com/search/pins/?q=${req.query.query}`);

        await page.waitForFunction(() => {
            return document.querySelectorAll('img').length >= 15;
        });

        // Type into search box.
        const imgSelector = await page.evaluate(() => Array.from(document.querySelectorAll("img"), e => e.src))

        for (let link of imgSelector) {
            var linkSplit = link.split('/')
            linkSplit[3] = "originals"
            newImgLinks.push(linkSplit.join('/'));
        }

        res.send(newImgLinks);
    })
}

run();

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})