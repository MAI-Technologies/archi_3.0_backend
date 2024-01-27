const { Metrics } = require("./schema/Metrics");

async function insertNewSession(sessionId) {
    try {
        const dateObj = new Date();
        const currentDate = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;
        await Metrics.create({
            sessionId: sessionId,
            totalMessageSent: 0,
            totalMessageReceived: 0,
            messageHistory: [],
            allAIResponseTimes: [],
            averageAIResponseTime: 0,
            creationDate: new Date(currentDate),
        });

    } catch (err) {
        throw err;
    }
}

module.exports = {
    insertNewSession,
}