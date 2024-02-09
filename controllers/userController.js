const { fetchStudent } = require("../database/fetch");
const { insertStudent } = require("../database/insert");

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


module.exports = {
    findStudentController,
    addStudentController,
}