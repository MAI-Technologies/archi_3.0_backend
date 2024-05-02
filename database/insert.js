const { Conversation } = require("./schema/Conversation");
const { Metrics } = require("./schema/Metrics");
const { Student } = require("./schema/Student");
const { Parent } = require("./schema/Parent");
const { Teacher } = require("./schema/Teacher");
const { WebsiteStats } = require("./schema/WebsiteStats");
const { fetchWebStats } = require("./fetch");

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
            lastActiveDate: new Date(),
            usedChatbotBefore: false,
            userCameBack: false,
        });
    } catch (err) {
        throw err;
    }
}

async function insertParent(userId, firstName, lastName, email, signupType) {
    try {
        // create a new Parent
        await Parent.create({
            userId,
            firstName,
            lastName,
            email,
            signupType,
        });
    } catch (err) {
        throw err;
    }
}

async function insertTeacher(userId, firstName, lastName, email, signupType) {
    try {
        // create a new Parent
        await Teacher.create({
            userId,
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

async function createWebStatsTable() {
    try {
        await WebsiteStats.create({
            totalNumberOfVisitors: 0,
            totalNumberOfVisitorsWhoClickedOnGetStarted: 0,
            totalNumberOfVisitorsWhoMadeAnAccount: 0,
            totalCalculatorClicks: 0,
            chatbotResponseTimes: [],
            totalChatbotResponseTimes: 0,
            userWhoReturnToChatbotAfter24InitialConversation: 0,
        });
    } catch (err) {
        throw err;
    }
}

async function increaseTotalVisitors() {
    try {
        const stats = await WebsiteStats.find();

        if (stats.length == 0) throw new Error("Couldn't find stats");

        stats[0].totalNumberOfVisitors += 1;
        await stats[0].save();

    } catch (err) {
        throw err;
    }
}

async function increaseTotalVisitorsThatSignIn() {
    try {
        const stats = await WebsiteStats.find();

        if (stats.length == 0) throw new Error("Couldn't find stats");

        stats[0].totalNumberOfVisitorsWhoClickedOnGetStarted += 1;
        await stats[0].save();

    } catch (err) {
        throw err;
    }
}

async function increaseTotalVisitorsThatMadeAnAccount() {
    try {
        const stats = await WebsiteStats.find();

        if (stats.length == 0) throw new Error("Couldn't find stats");

        stats[0].totalNumberOfVisitorsWhoMadeAnAccount += 1;
        await stats[0].save();

    } catch (err) {
        throw err;
    }
}

async function increaseTotalCalculatorClicks() {
    try {
        const stats = await WebsiteStats.find();
        if (stats.length == 0) throw new Error("Couldn't find stats");

        stats[0].totalCalculatorClicks += 1;
        await stats[0].save();
    } catch (err) {
        throw err;
    }
}

async function updateUserLastActiveDate(userId) {
    try {
        const user = await Student.findOne({ userId: userId });

        if (!user) throw new Error("Couldn't find user");

        user.lastActiveDate = new Date();

        if (!user.firstChatbotInteractionDate) user.firstChatbotInteractionDate = new Date();
        else {
            const currentDate = new Date();

            const diffInMilliseconds = currentDate - user.firstChatbotInteractionDate;

            const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

            if (diffInHours > 24) {
                const stats = await WebsiteStats.find();

                if (stats.length != 0 && !user.userCameBack) {
                    stats[0].userWhoReturnToChatbotAfter24InitialConversation += 1;
                    user.userCameBack = true;
                    await stats[0].save();
                }
            }
        }

        await user.save();

    } catch (err) {
        throw err;
    }
}

module.exports = {
    insertNewSession,
    insertNewConversation,
    appendConversation,
    insertStudent,
    insertParent,
    insertTeacher,
    createWebStatsTable,
    increaseTotalVisitors,
    increaseTotalVisitorsThatSignIn,
    increaseTotalVisitorsThatMadeAnAccount,
    increaseTotalCalculatorClicks,
    updateUserLastActiveDate,
}