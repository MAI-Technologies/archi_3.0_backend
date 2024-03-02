require("dotenv").config();
const { fetchMetricsFromDatabase, updateMetricsFromDatabase } = require("../services/metricsService.js");
const { OpenAI } = require('openai');
const { archi_greeting, archi_system_message,
    hypatia_greeting, hypatia_system_message,
    mary_j_greeting, mary_j_system_message
} = require("./config.json");
const { fetchCurrentConversation } = require("../database/fetch.js");
const { insertNewConversation, appendConversation } = require("../database/insert.js");

const openAI = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

// Store chat sessions and generated responses
const conversations = {};

let questionCounter = {};
let previousPrompt = null;

const monologues = {
    answers: "In a positive, yet firm nonjudgmental way remind student you are there to help tutor them, not provide answers. Ask them if they have any ideas about solving the problem.",
    // no_idea: "If student says they have no idea, gently guide them towards getting a paper and pencil and trying to work problem out. If they save they've done this already or have been reminded before, then slowly reveal process to them.",
    // problem_summary: "Summarize the problem in your words, concisely. [Encourage brief responses.]",
    // independent_attempt: "Try solving it first, then share your method. [Be brief in guidance.]",
    // positive_reinforcement: "Nice attempt! Let's quickly review it. [Stay concise and positive.]",
    // open_ended_question: "Explain your steps so far, in a nutshell. [Prompt for succinct explanations.]",
    // growth_mindset: "Each challenge helps you grow. Keep at it! [Encourage briefly.]",
    // "customized_learning": "Let's find the best approach for you. What clicks with you? [Adapt while being brief.]"
};

// Regex patterns for student inputs
const patterns = {
    answers: /\b(answer|tell me)\b/i,
    // noIdea: /\b(confused|phone|noise|can't concentrate)\b/i,
    // summarizeProblem: /\b(what does this mean|confused|don't understand|factor|find)\b/i,
    // directAnswer: /\b(answer|solve this|what is)\b/i,
    // frustration: /\b(difficult|hard|impossible|stuck)\b/i,
    // shortAnswer: /\b(yes|no|maybe|idk)\b/i,
    // lackOfConfidence: /\b(can't do this|not good at math|give up)\b/i,
    // learningPreference: /\b(don't get it|doesn't make sense|another way)\b/i
};

// Return conversations
function convos() {
    console.log("Convos: ", conversations);
    return conversations;
}

// Select an appropriate monologue
function insertMonologue(userMessage) {
    console.log("INSERTED MONOLOGUE!")
    for (const [key, pattern] of Object.entries(patterns)) {
        if (pattern.test(userMessage)) {
            return monologues[key];
        }
    }
    return (
        "Work out your own process before answering students' questions. Ensure that you have an understanding of each step of the process, but do not show this process to students. Respond succinctly and consistently ask students questions that require active engagement and thinking on their part. MAKE SURE RESPONSES ARE BRIEF."
    );
}

async function openAIController(req, res) {
    try {
        // Continually retrieve prompts from user and generate responses
        const prompt = req.body.prompt;
        const userId = req.body.userId || null;
        const sessionId = req.body.sessionId;
        const tutor = req.body.tutor || "archi";

        // const sessionId = generateSessionId();
        const session = await fetchMetricsFromDatabase(sessionId);

        const start = new Date().getTime();

        const monologue = insertMonologue(prompt);
        const combinedInput = `${prompt} <MONOLOGUE>${monologue}</MONOLOGUE>`;

        // Move question counter based on if question is repeated or not
        if (prompt === previousPrompt) {
            questionCounter[prompt] = (questionCounter[prompt] || 0) + 1;
        } else {
            questionCounter[prompt] = 1;
            previousPrompt = prompt;
        }
        // Refuse to flat out answer question if user has asked same question multiple times
        // TODO: Check if this actually needs to be outputted/ how
        if (questionCounter[prompt] >= 5) {
            res.write("It seems you've asked about this topic multiple times. Please try a different question or rephrase.");
            return res.end();
        }

        // the request is from a registered account
        if (userId) {
            // search for the sessionId in db
            console.log(sessionId);
            const currentConversation = await fetchCurrentConversation(sessionId);

            // append conversation if it exists
            if (currentConversation) {

            }

            // create a new db entry if does not exist
            else {
                let greeting = "";
                let system_message = "";

                switch (tutor.toLowerCase()) {
                    case "hypatia":
                        greeting = hypatia_greeting;
                        system_message = hypatia_system_message;
                        break;

                    case "mary j.":
                        greeting = mary_j_greeting;
                        system_message = mary_j_system_message;
                        break;

                    default:
                        greeting = archi_greeting;
                        system_message = archi_system_message;
                        break;
                }

                const newConversation = [{ role: "system", content: system_message }, { role: "assistant", content: greeting }];
                conversations[sessionId] = newConversation;

                await insertNewConversation(sessionId, userId, prompt, tutor, newConversation);
            }

        }

        // !!! use map/loop to retrieve all data for conversations[sessionId] - this is to account for when a new convo is created from frontend and backend doesn't have record of previous convo
        const messageToGPT = [...conversations[sessionId], { "role": "user", "content": combinedInput }];

        const response = await openAI.chat.completions.create({
            model: 'gpt-4-1106-preview',
            messages: messageToGPT,
            stream: true,
        });

        let responseContent = "";

        for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content || "";
            responseContent += text;
            res.write(text);
        }

        // update the conversation
        conversations[sessionId] = [...messageToGPT, { "role": "assistant", "content": responseContent }];
        await appendConversation(sessionId, userId, prompt, responseContent);

        const end = new Date().getTime();

        const elapsedTime = end - start;
        await updateMetricsFromDatabase(sessionId, session.totalMessageSent + 1, session.totalMessageReceived + 1, prompt, responseContent, elapsedTime);

        res.end();

    } catch (error) {
        console.error("Error calling OpenAI:", error);
        res.status(500).json({ error: "Failed to get a response from OpenAI" });
        return;
    }
}

module.exports = {
    openAIController,
}