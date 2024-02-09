// Initialize express
const express = require("express");
const cors = require("cors");
// Handle user messages and post chatbot response
const { initDatabase } = require("./database");
const initCurriculum = require("./database/initCurriculum.js");
// Require dotenv
require('dotenv').config();

const routes = require("./routes");

// Set up port to listen
const PORT = process.env.PORT || 3001;

// Initialize chatbot app
const chatbot = express();

// Make it able to handle JSON requests
chatbot.use(cors({
  credentials: true,
  origin: process.env.NODE_ENVIRONMENT === "prod" ? process.env.FRONTEND_HOST : "*"
}));

chatbot.use(express.json({ type: ["application/json", "text/event-stream"] }));

chatbot.use(routes);

// Start server
initDatabase().then(async () => {
  await initCurriculum();

  chatbot.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
    console.log(`Server Up`);
    // console.log("Greeting: ", greet()) // Greet user BEFORE user makes requests
  });
}).catch(err => {
  console.log(`Error connecting to database`);
  console.error(err);
});
