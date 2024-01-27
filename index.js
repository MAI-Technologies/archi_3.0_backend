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
chatbot.use(cors({
  credentials: true,
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"]
}));
chatbot.use(routes);

// Default route
chatbot.get("/", (req, res) => res.json({ status: "OK" }));

chatbot.post("/openai", async (req, res) => {
  try {
    // Continually retrieve prompts from user and generate responses
    const prompt = req.body.prompt;
    const responseContent = await parseResponse(prompt);
    // convos(); // TODO: CHANGE!--THIS IS JUST A TEMPORARY ENDPOINT FOR ACCESSING CONVOS
    res.json({ response: responseContent }); // TODO: CONSIDER IF WE SHOULD OUTPUT USEFUL THINGS HERE
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    res.status(500).json({ error: "Failed to get a response from OpenAI" });
    return;
  }
});


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
