// server/services/openaiService.js

// Initialize OpenAI instance with API key
const { OpenAI } = require('openai');
require('dotenv').config();
const { greeting, system_message } = require("./config.json");

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

// Store chat sessions and generated responses
let conversations = [
    { role: "system", content: system_message },
    { role: "assistant", content: greeting }
];
let questionCounter = {};
let previousPrompt = null;

// Chat monologues for chatbot to facilitate thinking
const monologues = {
    answers: "In a positive, yet firm nonjudgemental way remind student you are there to help tutor them, not provide answers. Ask them if they have any ideas about solving the problem.",
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

// Return greeting once user connects to server
function greet() {
    return greeting;
}

// Return converations
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


// Generate responses from OpenAI chatbot based on user input
function parseResponse(prompt) {
    // Insert contextually relevant monologue into prompt input
    const monologue = insertMonologue(prompt);
    const combinedInput = `${prompt} <MONOLOGUE>${monologue}</MONOLOGUE>`;

    // Append user message to conversation history
    conversations.push({ "role": "user", "content": prompt });

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
        console.log("It seems you've asked about this topic multiple times. Please try a different question or rephrase.");
        return (conversations, "It seems you've asked about this topic multiple times. Please try a different question or rephrase.");
    }

    return (conversations, combinedInput);

    // TODO: REMOVE SYSTEM_MESSAGE_CONTENT FROM THIS PART/SEE IF IT'S WORTH KEEPING HERE

    // const response = await openai.chat.completions.create({
    //     model: 'gpt-4-1106-preview',
    //     messages: [...conversations, { "role": "user", "content": combinedInput }],
    //     stream: true,
    // });

    // for await (const chunk of response) {
    //     console.log(chunk.choices[0]?.delta?.content || "");
    // }

    // conversations.push(response.choices[0].message);
    // console.log("Chatbot Response:  ", response.choices[0].message)
    // return response.choices[0].message;
    return "hi"
}

// Export functions to other files
module.exports = {
    greet, parseResponse, convos,
};
