const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },

    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    dob: {
        type: String,
        required: true,
    },

    signupType: {
        type: String,
        required: true,
    },

    lastActiveDate: {
        type: Date,
    },

    firstChatbotInteractionDate: {
        type: Date
    },

    userCameBack: {
        type: Boolean,
    }

}, { timestamps: true });

module.exports = {
    Student: mongoose.model("Student", StudentSchema)
}