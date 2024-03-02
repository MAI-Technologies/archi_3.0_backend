const express = require('express');
const router = express.Router();
const { openAIController } = require("./controllers/openAIController");
const { getMetricsWithDatesController, getMetricsWithSessionDataController } = require("./controllers/metricsController");
const { addStudentController, findStudentController, findParentController, addParentController, 
    findTeacherController, addTeacherController, deleteStudentController, deleteParentController, 
    deleteTeacherController, deleteConversationController, getConvoHistoryController, getCurrentConvoController, addConversationController } = require("./controllers/userController");

router.get("/", (req, res) => res.json({ status: "OK" }));
router.post("/openai", openAIController);

router.post("/metrics/sessionId", getMetricsWithSessionDataController);
router.post("/metrics/dates", getMetricsWithDatesController);

router.get("/user/find-user", findStudentController);
router.post("/user/add-user", addStudentController);
router.get("/user/find-parent", findParentController);
router.post("/user/add-parent", addParentController);
router.get("/user/find-teacher", findTeacherController);
router.post("/user/add-teacher", addTeacherController);
router.delete("/user/delete-user", deleteStudentController);
router.delete("/user/delete-parent", deleteParentController);
router.delete("/user/delete-teacher", deleteTeacherController);
router.delete("/user/deleter-convo", deleteConversationController); 
router.get("/user/get-history", getConvoHistoryController);
router.get("/user/get-convo", getCurrentConvoController);
router.post("/user/add-convo", addConversationController);

module.exports = router;