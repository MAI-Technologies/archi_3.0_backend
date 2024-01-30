const Conversation = require("./schema/Conversation");
const { Metrics } = require("./schema/Metrics");

async function fetchSession(sessionId) {
    try {
        const session = await Metrics.findOne({ sessionId: sessionId });

        return session;
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function fetchSessionWithDates(startDate, endDate) {
    try {
        const res = await Metrics.find({});
        const data = [];

        res.forEach(entry => {
            const entryDate = new Date(entry.creationDate).getTime();
            if (entryDate < startDate.getTime() || entryDate > endDate.getTime()) {
                return;
            }

            const messageHistory = [];

            entry.messageHistory.forEach(msg => {
                messageHistory.push({
                    user: msg.user,
                    bot: msg.bot,
                    timestamp: msg.timestamp
                });
            });

            data.push({
                id: entry._id,
                sessionId: entry.sessionId,
                totalMessageSent: entry.totalMessageSent,
                totalMessageReceived: entry.totalMessageReceived,
                allAIResponseTime: entry.allAiResponseTime,
                averageAIResponseTime: entry.averageAIResponseTime,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt,
                messageHistory,
                creationDate: entry.creationDate,
            });
        });

        return data;
    } catch (err) {
        throw err;
    }
}

async function fetchCurrentConversation(sessionId) {
    try {
        const conversation = await Conversation.findOne(sessionId);
        if (!conversation) return null;

        return conversation;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    fetchSession,
    fetchSessionWithDates,
    fetchCurrentConversation,
}