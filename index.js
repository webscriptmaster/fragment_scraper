import "dotenv/config"

import scrap from "./src/scrap.js"
import initialize from "./src/initialize.js"
import { markEnd, markStart } from "./src/util.js"

markStart("Initializing Started")
await initialize();
markEnd("Initializing Ended")

markStart("Scrapping Started")
await scrap()
markEnd("Scrapping Ended")