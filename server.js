const http = require("http");
const hubspot = require("@hubspot/api-client");
const hubspotClient = new hubspot.Client({
  apiKey: "{your-hubspot-api}"
});

const tableIdOrName = "5342466";
const archived = undefined;
const includeForeignIds = undefined;

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    const dynamicMetaTags = {};

    const HubDbTableV3Request = {
      name: "test",
      label: "test",
      useForPages: false,
      allowPublicApiAccess: false,
      allowChildTables: false,
      enableChildTablePages: false,
      columns: [
        { id: 2, name: "text_column", label: "text_column", type: "TEXT" },
        {
          id: 3,
          name: "number_column",
          label: "Number Column",
          archived: false,
          type: "NUMBER",
        },
        {
          id: 4,
          name: "select_column",
          label: "select_column",
          archived: false,
          type: "multiselect",
          options: [
            {
              name: "Option 1",
              type: "option",
            },
          ],
        },
        {
          id: 5,
          name: "multiselect",
          label: "Multi Select Column",
          archived: false,
          type: "multiselect",
          options: [
            {
              name: "Option 1",
              type: "option",
            },
            {
              name: "Option 2",
              type: "option",
            },
          ],
        },
      ],
      dynamicMetaTags,
    };

    async function updateDraftTable() {
      try {
        const apiResponse =
          await hubspotClient.cms.hubdb.tablesApi.updateDraftTable(
            tableIdOrName,
            HubDbTableV3Request,
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
    updateDraftTable();

  
    res.end("Hello!\n");
  })
  .listen(1337, "127.0.0.1");

console.log("Server running at http://127.0.0.1:1337/");