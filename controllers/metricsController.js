const { fetchSessionWithDates, fetchWebStats, fetchAllUsers, fetchAllConversations } = require("../database/fetch");
const { increaseTotalVisitors, increaseTotalVisitorsThatSignIn, increaseTotalVisitorsThatMadeAnAccount, increaseTotalCalculatorClicks } = require("../database/insert");

async function getMetricsWithSessionDataController(req, res) {
    return res.status(501).send();
}

async function verifyPasswordController(req, res) {
    const password = req.body.password;

    if (!password) return res.status(401).send();

    if (password === "@rchIm3d*s") {
        return res.send();
    }

    return res.status(401).send();
}

async function getMetricsWithDatesController(req, res) {
    const rawStartDate = req.body.startDate;
    const rawEndDate = req.body.endDate;


    if (!rawStartDate) return res.status(400).json({ status: "Invalid start date" });
    if (!rawEndDate) return res.status(400).json({ status: "Invalid end date" });

    const startDate = new Date(rawStartDate);
    const endDate = new Date(rawEndDate);

    if (startDate.toString() === "Invalid Date") {
        return res.status(400).json({ status: "Invalid start date" });
    }

    if (endDate.toString() === "Invalid Date") {
        return res.status(400).json({ status: "Invalid end date" });
    }

    try {
        const data = await fetchSessionWithDates(startDate, endDate);

        const users = await fetchAllUsers();
        const totalNumOfStudents = users.length || 0;

        let activeAgainAfterOneWeek = 0;

        users.forEach(user => {
            const isDateWithinOneWeek = (date) => {
                const currentDate = new Date();

                const diffInMilliseconds = currentDate - date;
                const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

                return diffInDays < 7;
            }

            console.log(user);
            if (isDateWithinOneWeek(user.lastActiveDate)) {
                activeAgainAfterOneWeek++;
            };
        })

        // get web stats
        const webStats = await fetchWebStats();
        const conversations = await fetchAllConversations();

        let outputs = 0;
        let inputs = 0;

        conversations.forEach(convo => {
            const rawConversations = convo.conversations;

            rawConversations.forEach(dialog => {
                if (dialog.role === "user") inputs++;
                else if (dialog.role === "assistant") outputs++;
            })
        });

        return res.json(
            {
                data,
                webStats,
                totalNumOfStudents,
                totalOutputs: outputs,
                totalInputs: inputs,
                activeAgainAfterOneWeek,
            }
        );
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "Internal Server Error" });
    }

}

async function updateVisitorCountController(_, res) {
    // update the visitor count in the db
    try {
        await increaseTotalVisitors();
        return res.send();
    } catch (err) {
        return res.status(500).json({ status: "Error while fetching stats" });
    }
}

async function updateVisitorCountForSignInController(_, res) {
    // update the visitor count in the db
    try {
        await increaseTotalVisitorsThatSignIn();
        return res.send();
    } catch (err) {
        return res.status(500).json({ status: "Error while fetching stats" });
    }
}

async function updateVisitorCountForMakingAnAccountController(_, res) {
    try {
        await increaseTotalVisitorsThatMadeAnAccount();
        return res.send();
    } catch (err) {
        return res.status(500).json({ status: "Error while fetching stats" });
    }
}

async function updateTotalCalculatorClicksController(_, res) {
    try {
        await increaseTotalCalculatorClicks();
        return res.send();
    } catch (err) {
        return res.status(500).json({ status: "Error while fetching stats" });
    }
}

module.exports = {
    getMetricsWithSessionDataController,
    getMetricsWithDatesController,
    updateVisitorCountController,
    updateVisitorCountForSignInController,
    updateVisitorCountForMakingAnAccountController,
    updateTotalCalculatorClicksController,
    verifyPasswordController,
}