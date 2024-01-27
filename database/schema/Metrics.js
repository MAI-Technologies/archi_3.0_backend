const mongoose = require("mongoose");

const MetricsSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
    },

    totalMessageSent: {
        type: Number,
    },

    totalMessageReceived: {
        type: Number,
    },

    messageHistory: {
        type: [{
            user: String,
            bot: String,
            timestamp: Number,
        }],
    },

    allAIResponseTimes: {
        type: [Number],
    },

    creationDate: {
        type: Date,
        required: true,
    },

    averageAIResponseTime: {
        type: Number,
    },

}, { timestamps: true });

module.exports = {
    Metrics: mongoose.model("Metrics", MetricsSchema)
}