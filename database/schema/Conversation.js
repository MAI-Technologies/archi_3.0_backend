const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },

    userId: {
        type: String,
        required: true,
        unique: true
    },

    summary: {
        type: String,
    },

    conversations: {
        type: [{
            role: String,
            content: String,
        }]
    },

    tutorName: {
        type: String,
        required: true,
    }

}, { timestamps: true });

module.exports = {
    Conversation: mongoose.model("Conversation", ConversationSchema)
}