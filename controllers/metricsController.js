const { fetchSessionWithDates } = require("../database/fetch");
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
        console.log(data);
        return res.json({ data });
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