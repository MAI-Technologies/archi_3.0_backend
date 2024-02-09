const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
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

    signupType: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = {
    Teacher: mongoose.model("Teacher", TeacherSchema)
}