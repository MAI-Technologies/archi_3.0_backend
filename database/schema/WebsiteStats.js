const mongoose = require("mongoose");

const WebsiteStatsSchema = new mongoose.Schema({
    totalNumberOfVisitors: {
        type: Number,
    },

    totalNumberOfVisitorsWhoClickedOnGetStarted: {
        type: Number,
    },

    totalNumberOfVisitorsWhoMadeAnAccount: {
        type: Number,
    },

    totalCalculatorClicks: {
        type: Number,
    },

    chatbotResponseTimes: {
        type: [Number],
    },

    totalChatbotResponseTimes: {
        type: Number,
    },

    userReturnToChatbotAfterFirstInteraction: {
        type: Number,
    }



}, { timestamps: true });

module.exports = {
    WebsiteStats: mongoose.model("WebsiteStats", WebsiteStatsSchema)
}