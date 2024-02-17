const { Conversation } = require("./schema/Conversation");
const { Metrics } = require("./schema/Metrics");
const { Student } = require("./schema/Student");

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

async function insertStudent(userId, dob, firstName, lastName, email, signupType) {
    try {
        // create a new Student
        await Student.create({
            userId,
            dob,
            firstName,
            lastName,
            email,
            signupType,
        });
    } catch (err) {
        throw err;
    }
}

async function insertNewConversation(sessionId, userId, firstUserMessage, tutorName, conversations) {
    try {
        await Conversation.create({
            sessionId: sessionId,
            userId: userId,
            summary: firstUserMessage,
            conversations: conversations,
            tutorName: tutorName,
        });
    } catch (err) {
        throw err;
    }
}

async function appendConversation(sessionId, userId, userContent, botContent) {
    try {
        const conversation = await Conversation.findOne({ sessionId: sessionId });
        if (!conversation) throw new Error("Couldn't find conversation");

        conversation.conversations.push({ role: "user", content: userContent });
        conversation.conversations.push({ role: "assistant", content: botContent });

        await conversation.save();

        return conversation;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    insertNewSession,
    insertNewConversation,
    appendConversation,
    insertStudent,
}