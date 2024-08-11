const express = require('express')
const app = express()
const port = 3000
const puppeteer = require("puppeteer");

app.get('/', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const newImgLinks = [];

    // Set screen size.
    await page.setViewport({ width: 1080, height: 1024 });

    // Navigate the page to a URL.
    await page.goto(`https://www.pinterest.com/search/pins/?q=${req.query.query}`);

    await page.waitForNetworkIdle(2000)


    // Type into search box.
    const imgSelector = await page.evaluate(() => Array.from(document.querySelectorAll("img"), e => e.src))

    for (let link of imgSelector) {
        var linkSplit = link.split('/')
        linkSplit[3] = "originals"
        newImgLinks.push(linkSplit.join('/'));
    }

    await browser.close();

    res.send(newImgLinks);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})