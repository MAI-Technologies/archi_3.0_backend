const db = require("../database");

async function fetchMetricsFromDatabase(sessionId) {

    // find if the session id exist in db
    let session = await db.fetchSession(sessionId);

    // create a new session
    if (!session) {
        await db.insertNewSession(sessionId);
    }

    session = await db.fetchSession(sessionId);
    return session;
}

async function updateMetricsFromDatabase(sessionId, totalMessageSent, totalMessageReceived, userPrompt, botResponse, responseTime) {

    const session = await db.fetchSession(sessionId);
    if (!session) return null;

    session.totalMessageSent = totalMessageSent;
    session.totalMessageReceived = totalMessageReceived;
    session.messageHistory.push({ user: userPrompt, bot: botResponse, timestamp: new Date().getTime() });
    session.allAIResponseTimes = [...session.allAIResponseTimes, responseTime];
    session.averageAIResponseTime = (session.allAIResponseTimes.reduce((a, b) => a + b, 0)) / session.allAIResponseTimes.length || 0;

    await session.save();

    const websiteStat = await db.fetchWebStats();
    websiteStat.chatbotResponseTimes.push(responseTime);
    console.log(responseTime);
    console.log(websiteStat.totalChatbotResponseTimes);
    websiteStat.totalChatbotResponseTimes += responseTime;

    await websiteStat.save();

    console.log(session);
}

module.exports = {
    fetchMetricsFromDatabase,
    updateMetricsFromDatabase
}