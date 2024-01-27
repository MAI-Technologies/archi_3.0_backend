const { fetchSessionWithDates } = require("../database/fetch");

async function getMetricsWithSessionDataController(req, res) {
    return res.status(501).send();
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

module.exports = {
    getMetricsWithSessionDataController,
    getMetricsWithDatesController
}