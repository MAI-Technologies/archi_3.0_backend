const { fetchStudent, fetchParent, fetchTeacher, fetchConvoHistory } = require("../database/fetch");
const { insertStudent, insertParent, insertTeacher } = require("../database/insert");
const { deleteStudent, deleteParent, deleteTeacher } = require("../database/delete");

async function findStudentController(req, res) {
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ message: "UserId is not provided" });

    try {
        // fetch the user
        const user = await fetchStudent(userId);
        if (!user) return res.status(404).json({ message: "No such user" });

        return res.json({
            data: {
                userId: userId,
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching user information" });
    }

}

async function addStudentController(req, res) {
    const userId = req.body.userId || null;
    const dob = req.body.dob || null;
    const firstName = req.body.firstName || null;
    const lastName = req.body.lastName || null;
    const email = req.body.email || null;
    const signupType = req.body.signupType || null;

    if (!userId) return res.status(400).json({ message: "UserId not specified" });
    if (!dob) return res.status(400).json({ message: "Date of birth not specified" });
    if (!firstName) return res.status(400).json({ message: "First name not specified" });
    if (!lastName) return res.status(400).json({ message: "Last name not specified" });
    if (!email) return res.status(400).json({ message: "Email not specified" });
    if (!signupType) return res.status(400).json({ message: "Signup not specified" });

    try {
        await insertStudent(userId, dob, firstName, lastName, email, signupType);
        return res.json();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "An error occurred when adding user to database" });
    }

}

async function deleteStudentController(req, res) {
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ message: "UserId is not provided" });

    try {
        // delete the user
        const result = await deleteStudent(userId);
        if (result.deletedCount == 0) return res.status(404).json({ message: "No such user" });

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching user information" });
    }

}

async function findParentController(req, res) {
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ message: "UserId is not provided" });

    try {
        // fetch the user
        const user = await fetchParent(userId);
        if (!user) return res.status(404).json({ message: "No such user" });

        return res.json({
            data: {
                userId: userId,
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching user information" });
    }

}

async function addParentController(req, res) {
    const userId = req.body.userId || null;
    const firstName = req.body.firstName || null;
    const lastName = req.body.lastName || null;
    const email = req.body.email || null;
    const signupType = req.body.signupType || null;

    if (!userId) return res.status(400).json({ message: "UserId not specified" });
    if (!firstName) return res.status(400).json({ message: "First name not specified" });
    if (!lastName) return res.status(400).json({ message: "Last name not specified" });
    if (!email) return res.status(400).json({ message: "Email not specified" });
    if (!signupType) return res.status(400).json({ message: "Signup not specified" });

    try {
        await insertParent(userId, firstName, lastName, email, signupType);
        return res.json();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "An error occurred when adding user to database" });
    }

}

async function deleteParentController(req, res) {
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ message: "UserId is not provided" });

    try {
        // delete the parent
        const result = await deleteParent(userId);
        if (result.deletedCount == 0) return res.status(404).json({ message: "No such user" });

        return res.status(200).json({ message: "Parent deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching user information" });
    }

}

async function findTeacherController(req, res) {
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ message: "UserId is not provided" });

    try {
        // fetch the user
        const user = await fetchTeacher(userId);
        if (!user) return res.status(404).json({ message: "No such user" });

        return res.json({
            data: {
                userId: userId,
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching user information" });
    }

}

async function addTeacherController(req, res) {
    const userId = req.body.userId || null;
    const firstName = req.body.firstName || null;
    const lastName = req.body.lastName || null;
    const email = req.body.email || null;
    const signupType = req.body.signupType || null;

    if (!userId) return res.status(400).json({ message: "UserId not specified" });
    if (!firstName) return res.status(400).json({ message: "First name not specified" });
    if (!lastName) return res.status(400).json({ message: "Last name not specified" });
    if (!email) return res.status(400).json({ message: "Email not specified" });
    if (!signupType) return res.status(400).json({ message: "Signup not specified" });

    try {
        await insertTeacher(userId, firstName, lastName, email, signupType);
        return res.json();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "An error occurred when adding user to database" });
    }

}

async function deleteTeacherController(req, res) {
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ message: "UserId is not provided" });

    try {
        // delete the teacher
        const result = await deleteTeacher(userId);
        if (result.deletedCount == 0) return res.status(404).json({ message: "No such user" });

        return res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching user information" });
    }

}

async function getConvoHistoryController(req, res) {
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ message: "UserId is not provided" });

    try {
        // fetch the history based on userId
        const convos = await fetchConvoHistory(userId);

        return res.json({
            convos: convos
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching user information" });
    }
}

module.exports = {
    findStudentController,
    addStudentController,
    findParentController,
    addParentController,
    findTeacherController,
    addTeacherController,
    deleteStudentController,
    deleteParentController,
    deleteTeacherController,
    getConvoHistoryController,
}