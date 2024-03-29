/**
RSS Feed Parser and HubDB table creator
This script uses the RSS-parser module to parse an RSS feed and create a new HubDB table with the parsed data. It also creates new rows in the table with the parsed data.
@since 1.0.0
@access private
@class
@alias rssFeedParser
@param {string} tableIdOrName The name of the table to be created.
@param {string} rssFeedUrl The url of the RSS feed to be parsed.
@param {Object} hubspotClient The instance of the hubspot client used to create the table and rows.
@fires tableCreated
@fires rowCreated
@see Parser, hubspot.Client
@return {void}
*/

const tableIdOrName = "rss_test";
const Parser = require('rss-parser');
const cron = require("node-cron");
const hubspot = require("@hubspot/api-client");
const hubspotClient = new hubspot.Client({
  "accessToken": process.env.ACCESS_TOKEN
});

const table = {
    name: tableIdOrName,
    label: tableIdOrName,
    columns: [{
            name: "title",
            label: "Title",
            type: "TEXT"
        },
        {
            name: "description",
            label: "Description",
            type: "TEXT"
        },
        {
            name: "enclosure",
            label: "Enclosure",
            type: "TEXT"
        },
        {
            name: "hot",
            label: "Hot",
            type: "TEXT"
        },
        {
            name: "zwoelfuhr",
            label: "ZwoelfUhr",
            type: "TEXT"
        },
        {
            name: "pubdate",
            label: "PubDate",
            type: "TEXT"
        }
    ]
};

// create a new parser instance with custom fields for 'zwoelfUhr' and 'hot'
const parser = new Parser({
    customFields: {
        item: ['zwoelfUhr', 'hot'],
        zwoelfUhr: function(item) {
            // code to parse the zwoelfUhr tag
            return item.zwoelfUhr && item.zwoelfUhr.url ? item.zwoelfUhr.url : 'none';
        },
        hot: function(item) {
            // code to parse the hot tag
            return item.hot && item.hot.url ? item.hot.url : 'none';
        }
    }
});


/**
 * This function creates rows and batches them to the HubDB table.  
 * @param {string} tableIdOrName - The ID or name of the table
 */
function createDraftTableRows(tableIdOrName) {
  // parse the RSS feed
  parser.parseURL('https://www.fundresearch.de/rss/rss-feed-test.xml')
      .then(feed => {
          // create an array to store the rows to be created
          let rows = [];
          // loop through each item in the feed
          feed.items.forEach(item => {
              // set urls for enclosure, zwoelfUhr and hot if they exists, otherwise set them to empty string
              const enclosure = item.enclosure ? item.enclosure.url : '';
              let hot = item.hot ? "https://www.fundresearch.de/fundresearch-wGlobal/wGlobal/layout/newsletter/meist-gelesen.png" : '';
              let zwoelfUhr = item.zwoelfUhr ? "https://www.fundresearch.de/fundresearch-wGlobal/wGlobal/layout/newsletter/12h-black.png" : '';
              // create object for the new row
              let row = {
                values: {
                  "title": item.title,
                  "description": item.content,
                  "enclosure": enclosure,
                  "hot": hot,
                  "zwoelfuhr": zwoelfUhr,
                  "pubdate": item.pubDate
                }
              };

              // push the row object to the rows array
              rows.push(row);
          });

        // create multiple rows in the table using the hubspot batch API
        // use the Batch API to insert the array of objects into the table
        const BatchInputHubDbTableRowV3Request = { inputs: rows };
        hubspotClient.cms.hubdb.rowsBatchApi.batchCreateDraftTableRows(tableIdOrName, BatchInputHubDbTableRowV3Request)
        .then((apiResponse) => {
          console.log(JSON.stringify(apiResponse, null, 2));
        })
        .catch((e) => {
          e.message === 'HTTP request failed'
          ? console.error(JSON.stringify(e.response, null, 2))
          : console.error(e)
        });
      })
      .catch(err => console.error(err));
}

// function to create a HubDB table
function createTable(tableIdOrName) {
    //Create the table
    hubspotClient.cms.hubdb.tablesApi.createTable(table)
        .then(() => {
            //create rows in the new HubDB table
            createDraftTableRows(tableIdOrName)
           // publish the new HubDB table
            publishTable(tableIdOrName)

        })
        .catch(err => console.error(err));
}

// function to create a HubDB table
function publishTable(tableIdOrName) {
  //Create the table
  hubspotClient.cms.hubdb.tablesApi.publishDraftTable(tableIdOrName)
      .then(() => {
        // Table  has been created
        console.log(`Table ${tableIdOrName} created`);        
      })
      .catch(err => console.error(err));
}

// function to delete the existing HubDB table and create new one
function replaceTable(tableIdOrName) {
     hubspotClient.cms.hubdb.tablesApi.getAllDraftTables()
    .then(response => { 
      const tables = response.results;
      // find the target table with the name tableIdOrName
      const targetTable = tables.find(table => table.name === tableIdOrName);
      if (targetTable) {
        // Table exists, delete the table
        console.log(`Table ${tableIdOrName} exists`);
        hubspotClient.cms.hubdb.tablesApi.archiveTable(targetTable.id)
        .then(() => {
          //create new HubDB table with the same name
          createTable(tableIdOrName)
        })
        .catch(err => console.error(err));
      } else {
        // Table does not exist, create it
        if (error.statusCode === 404) {
          createTable(tableIdOrName);
        } else {
          console.error(error);
        }
      }
    })
    .catch(e => {
      e.message === 'HTTP request failed'
        ? console.error(JSON.stringify(e.response, null, 2))
        : console.error(e)
    });
}

//This will schedule the function to run at 12:00 PM and 6:00 PM every day.
cron.schedule("0 0 12,18 * * *", () => {
  // delete the existing HubDB table and create new one
  replaceTable(tableIdOrName);
});