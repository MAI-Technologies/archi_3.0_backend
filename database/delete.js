const { Student } = require("./schema/Student");
const { Parent } = require("./schema/Parent");
const { Teacher } = require("./schema/Teacher");

async function deleteStudent(userId) {
    try {
        const result = await Student.deleteOne({ userId: userId });
        return result;
    } catch (err) {
        throw err;
    }
}

async function deleteParent(userId) {
    try {
        const result = await Parent.deleteOne({ userId: userId });
        return result;
    } catch (err) {
        throw err;
    }
}

async function deleteTeacher(userId) {
    try {
        const result = await Teacher.deleteOne({ userId: userId });
        return result;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    deleteStudent,
    deleteParent,
    deleteTeacher,
}