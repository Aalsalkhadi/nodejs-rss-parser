## Node.js Server to run Api requests for the HubSpot API at https://developers.hubspot.com/docs/overview.

How to run this simple Node.js server:

- You need Node.js to be installed on your system. You can download Node.js and follow the instructions on how to do that on [nodejs.org](http://nodejs.org/);
- Clone or download this repository;
- Change the "apiKey" to the ApiKey you find on your hubspot portal;
- Change the "tableId" and the "portalId" to yours;
- Open your terminal;
- , so your server start running;
- Go to the browser and access http://127.0.0.1:1337/.




#Hubspot RSS Feed Parser
This is a script that parses an RSS feed and creates a HubDB table in Hubspot with the parsed data. It also creates rows in the table with data from the RSS feed using the Hubspot API.

##Installation

Clone the repository
`
git clone https://github.com/userName/hubspot-rss-feed-parser
`


Install the required packages by running
`
npm install
`

Replace the access token in index.js with your own token
Replace the RSS feed URL in index.js with the desired RSS feed
Run the script with
`
node index.js
`

or Type 
`
npm start
`


##Usage
The script will run once and create the table and rows in Hubspot. To run the script on a schedule, set up a cron job to run the script at desired intervals.


##Customization
You can customize the script by:

Changing the table name and columns in the table object in index.js
Changing the parser options in the parser object in index.js


##Dependencies
This script requires the following packages:
'@hubspot/api-client'
'node-cron'
'rss-parser'
'http'

##Support
Please open an issue if you have any questions or problems.
