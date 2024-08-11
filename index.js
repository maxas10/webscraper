const express = require('express')
const app = express()
const port = 3000
const puppeteer = require("puppeteer");

require("dotenv").config()

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 2560, height: 1440 });
    await page.setCookie({
        name: "_pinterest_sess",
        url: "https://www.pinterest.com/",
        value: process.env["_pinterest_sess"]
    })

    app.get('/', async (req, res) => {
        await page.goto(`https://www.pinterest.com/search/pins/?q=${req.query.query}`);

        await page.waitForFunction(() => {
            return document.querySelectorAll('img.hCL.kVc.L4E.MIw[src*="236x"]:not([role="presentation"])').length >= 30;
        });
        
        // Query for images that contain "236x" in the `src` attribute
        const imgSelector = await page.evaluate(() => 
            Array.from(document.querySelectorAll('img.hCL.kVc.L4E.MIw[src*="236x"]:not([role="presentation"])'), e => e.src)
        );
        
        // Replace "236x" with "originals" in the URLs
        const newImgLinks = imgSelector.map(link => link.replace('/236x/', '/originals/'));

        res.send(newImgLinks);
    })
}

run();

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})