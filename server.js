var http = require("http");

const hubspot = require('@hubspot/api-client');

const hubspotClient = new hubspot.Client({"apiKey":"9b77916b-1d35-4ad3-a309-c781c20615c0"});

const tableId = "5342266";
const portalId = "9177354";
var options = [];


const tableIdOrName = "5342133";
const archived = undefined;
const includeForeignIds = undefined;

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });

    // function to create a Table
    // const dynamicMetaTags = {};
    // const HubDbTableV3Request = {
    //   name: "test_table_3",
    //   label: "Test Table_3",
    //   useForPages: true,
    //   allowPublicApiAccess: false,
    //   allowChildTables: true,
    //   enableChildTablePages: false,
    //   columns: [
    //     { name: "text_column", label: "Text Column", id: "1", type: "TEXT" },
    //   ],
    //   dynamicMetaTags,
    // };
    // async function createTable() {
    //   try {
    //     const apiResponse = await hubspotClient.cms.hubdb.tablesApi.createTable(
    //       HubDbTableV3Request
    //     );
    //     console.log(JSON.stringify(apiResponse.body, null, 2));
    //   } catch (e) {
    //     e.message === "HTTP request failed"
    //       ? console.error(JSON.stringify(e.response, null, 2))
    //       : console.error(e);
    //   }
    // }

    // createTable();






    /* Get details for a published table
     * Returns the details for the published version of the specified table. This will include the definitions for the columns in the table and the number of rows in the table.
     * Note: This endpoint can be accessed without any authentication if the table is set to be allowed for public access.
     */



    // async function getTableDetails() {

    //   try {
    //     const apiResponse =
    //       await hubspotClient.cms.hubdb.tablesApi.getTableDetails(
    //         tableIdOrName,
    //         archived,
    //         includeForeignIds
    //       );
    //     console.log(JSON.stringify(apiResponse.body, null, 2));
    //   } catch (e) {
    //     e.message === "HTTP request failed"
    //       ? console.error(JSON.stringify(e.response, null, 2))
    //       : console.error(e);
    //   }
    // }

    // getTableDetails();





    /* 
     * Get details for a draft table
     * Get the details for the draft version of a specific HubDB table. This will include the definitions for the columns in the table and the number of rows in the table.
     */

    async function getDraftTableDetailsById() {
      try {
        const apiResponse =
          await hubspotClient.cms.hubdb.draft.tablesApi.getDraftTableDetailsById(
            tableIdOrName,
            archived,
            includeForeignIds
          );
        console.log(JSON.stringify(apiResponse.body, null, 2));
      } catch (e) {
        e.message === "HTTP request failed"
          ? console.error(JSON.stringify(e.response, null, 2))
          : console.error(e);
      }
    }

    console.log(getDraftTableDetailsById());



    

    res.end("Hello World\n");
  })
  .listen(1337, "127.0.0.1");

console.log("Server running at http://127.0.0.1:1337/");
