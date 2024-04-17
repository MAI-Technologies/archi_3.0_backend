// Initialize express
const express = require("express");
// Handle user messages and post chatbot response
const { initDatabase } = require("./database/index.js");
const initCurriculum = require("./database/initCurriculum.js");
// Require dotenv
require('dotenv').config();
// AWS Lambda
const serverless = require("serverless-http")

const routes = require("./routes.js");

// Set up port to listen
const PORT = process.env.PORT || 3001;

// Initialize chatbot app
const chatbot = express();

chatbot.use(express.json({ type: ["application/json", "text/event-stream"] }));

chatbot.use(routes);

// Start server
initDatabase().then(async () => {
  await initCurriculum();
}).catch(err => {
  console.log(`Error connecting to database`);
  console.error(err);
});

if (process.env.NODE_ENVIRONMENT === 'dev') {
  chatbot.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
    console.log(`Server Up`);
    // console.log("Greeting: ", greet()) // Greet user BEFORE user makes requests
  });
}

module.exports.handler = serverless(chatbot);