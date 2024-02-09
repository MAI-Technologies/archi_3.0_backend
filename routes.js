const express = require('express');
const router = express.Router();
const { openAIController } = require("./controllers/openAIController")
const { getMetricsWithDatesController, getMetricsWithSessionDataController } = require("./controllers/metricsController");
const { addStudentController, findStudentController } = require("./controllers/userController")

router.get("/", (req, res) => res.json({ status: "OK" }));
router.post("/openai", openAIController);

router.post("/metrics/sessionId", getMetricsWithSessionDataController);
router.post("/metrics/dates", getMetricsWithDatesController);

router.get("/user/find-user", findStudentController);
router.post("/user/add-user", addStudentController);
// add-parent
// find-parent
// add-teacher
// find-teacher

module.exports = router;