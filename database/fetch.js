const { Conversation } = require("./schema/Conversation");
const { Metrics } = require("./schema/Metrics");
const { Student } = require("./schema/Student");
const { Parent } = require("./schema/Parent");
const { Teacher } = require("./schema/Teacher");
const { WebsiteStats } = require("./schema/WebsiteStats");
const { createWebStatsTable } = require("./insert");

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

async function fetchStudent(userId) {
    try {
        const user = await Student.findOne({ userId: userId });
        return user;
    } catch (err) {
        throw err;
    }
}

async function fetchParent(userId) {
    try {
        const user = await Parent.findOne({ userId: userId });
        return user;
    } catch (err) {
        throw err;
    }
}

async function fetchTeacher(userId) {
    try {
        const user = await Teacher.findOne({ userId: userId });
        return user;
    } catch (err) {
        throw err;
    }
}

async function fetchCurrentConversation(sessionId) {
    try {
        const conversation = await Conversation.findOne({ sessionId: sessionId });
        if (!conversation) return null;

        return conversation;
    } catch (err) {
        throw err;
    }
}

async function fetchConvoHistory(userId) {
    try {
        const conversations = await Conversation.find({ userId: userId });
        if (!conversations) return null;

        return conversations;
    } catch (err) {
        throw err;
    }
}

async function fetchWebStats() {
    try {
        const stats = await WebsiteStats.find();

        if (stats.length == 0) {
            await createWebStatsTable();
            return await WebsiteStats.find()[0];
        }

        return stats[0];
    } catch (err) {
        throw err;
    }
}
module.exports = {
    fetchSession,
    fetchSessionWithDates,
    fetchCurrentConversation,
    fetchStudent,
    fetchParent,
    fetchTeacher,
    fetchConvoHistory,
    fetchWebStats,
}