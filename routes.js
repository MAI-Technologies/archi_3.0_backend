const express = require('express');
const router = express.Router();
const { openAIController } = require("./controllers/openAIController")
const { getMetricsWithDatesController, getMetricsWithSessionDataController } = require("./controllers/metricsController");

router.get("/", (req, res) => res.json({ status: "OK" }));
router.post("/openai", openAIController);

router.post("/metrics/sessionId", getMetricsWithSessionDataController);
router.post("/metrics/dates", getMetricsWithDatesController);

module.exports = router;