import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"

import { insertTopAuctions } from "./db.js"

/**
 * ################################################################
 */
export default async function scrap() {
  puppeteer.use(StealthPlugin())
  // const browser = await puppeteer.launch({ headless: "new" })
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await page.goto("https://fragment.com/?sort=ending", { waitUntil: "domcontentloaded", timeout: 50000 })

  try {
    await page.waitForSelector("input.form-control.tm-input.tm-search-input")

    let items = await page.$$eval(
      "html > body > div#aj_content > main > section.tm-section.clearfix.js-search-results > div.tm-table-wrap > table > tbody > tr.tm-row-selectable",
      (elements) => elements.map((e) => ({ 
        username_tg: e.querySelector("td > a.table-cell > div.table-cell-value-row > div.table-cell-value.tm-value").textContent.trim(),
        username_web: "t.me/" + e.querySelector("td > a.table-cell > div.table-cell-value-row > div.table-cell-value.tm-value").textContent.trim().replace("@", ""),
        username_ton: e.querySelector("td > a.table-cell > div.table-cell-desc > span.accent-color > span.tm-web3-address > span.subdomain").textContent.trim() + 
          e.querySelector("td > a.table-cell > div.table-cell-desc > span.accent-color > span.tm-web3-address > span.domain").textContent.trim(),
        min_bid_ton: e.querySelector("td.thin-last-col > a.table-cell > div.table-cell-value.tm-value.icon-before.icon-ton").textContent.trim(),
        min_bid_usd: e.querySelector("td.thin-last-col > a.table-cell > div.table-cell-desc.wide-only").textContent.trim()
      }))
    )

    await insertTopAuctions(items)
  } catch (error) {
    console.error("error: ", error)
  }

  await browser.close()
}
