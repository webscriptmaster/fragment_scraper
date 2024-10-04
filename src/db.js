import sqlite3 from "sqlite3"
import { open } from "sqlite"
import fs from "fs"
import path from "path"

const fileName = process.env.SQLITE3_DB ?? "fragment.db"

/**
 * ################################################################
 */
export default async function initializeDB() {
  if (fs.existsSync(path.join(process.cwd(), fileName))) {
    fs.unlinkSync(path.join(process.cwd(), fileName))
  }

  const db = await open({ filename: fileName, driver: sqlite3.Database })

  await db.exec(
    `CREATE TABLE top_auctions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username_tg TEXT,
      username_web TEXT,
      username_ton TEXT,
      min_bid_ton INTEGER,
      min_bid_usd INTEGER
    )`
  )

  await db.close()
}

/**
 * ################################################################
 */
export async function insertTopAuctions(items) {
  if (!items || items.length <= 0) return

  const db = await open({ filename: fileName, driver: sqlite3.Database, mode: sqlite3.OPEN_READWRITE })

  const ids = []
  for (let i = 0; i < items.length; i++) {
    const one = items[i]

    const result = await db.run("INSERT INTO top_auctions (username_tg, username_web, username_ton, min_bid_ton, min_bid_usd) VALUES (:username_tg, :username_web, :username_ton, :min_bid_ton, :min_bid_usd)", {
      ":username_tg": one.username_tg,
      ":username_web": one.username_web,
      ":username_ton": one.username_ton,
      ":min_bid_ton": one.min_bid_ton,
      ":min_bid_usd": one.min_bid_usd
    })

    ids.push(result.lastID)
  }

  await db.close()

  return ids
}