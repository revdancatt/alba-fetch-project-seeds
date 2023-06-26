// Please excuse the mess, this is so I can 'require' in a module
import { createRequire } from 'module'
import * as url from 'url'
import fetch from 'node-fetch'
// Also a messy way to get the __dirname
const require = createRequire(import.meta.url)
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

// We want the user to pass in the project name on the command line as the first argument
// If it doesn't exist then we need to let the user know and exit the program.
// Check the length of the arguments array
if (process.argv.length < 3) {
  console.log('Please pass in a project name')
  process.exit(1)
}
// Get the project name from the arguments array
const projectName = process.argv[2]
console.log(projectName)

// Make sure the data directory exists
const fs = require('fs')
const path = require('path')
const dataDir = path.join(__dirname, 'data')
// If it doesn't exist create it
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)

// Create a seeds array to hold the seeds
const seeds = []

// Now we are going to make a function that fetches the data from the URL
const fetchPage = async (page = 0) => {
  console.log(`Fetching page ${page}`)
  // Build the URL
  const url = `https://prod-alba-56s2.encr.app/collections/${projectName}/chain/1/page/${page}/`
  // Now we want to fetch the data from the URL, with an await
  // Wrap it in a try/catch block, so we can report an error if needed
  let data = null
  try {
    const response = await fetch(url)
    data = await response.json()
  } catch (er) {
    console.log('Error when fetching data from url: ', url)
    console.log('Code may need to be updated for new prod server or chain')
    process.exit()
  }

  const newSeeds = data.Metadata.map(item => item.seed)

  // If the length of the newSeeds array is 0 then we have reached the end of the data
  if (newSeeds.length === 0) {
    console.log('Reached the end of the data')
    console.log(`Total seeds: ${seeds.length}`)
    // Write out the seeds to a file
    const seedsFile = path.join(dataDir, `${projectName}-seeds.json`)
    fs.writeFileSync(seedsFile, JSON.stringify(seeds), 'utf8')
  } else {
    // If we have not reached the end of the data then we need to add the new seeds to the seeds array
    seeds.push(...newSeeds)
    // And then call the fetchPage function again, with the next page number
    await fetchPage(page + 1)
  }
}

// A function to kick it all off
const init = async () => {
  await fetchPage()
}

// Now we need to call the fetchPage function
init()
