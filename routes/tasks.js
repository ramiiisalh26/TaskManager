const express = require("express");
const router = express.Router();

const {
    getAllTasks,
    createTask, 
    getTask, 
    updateStatus, 
    deleteTask,
    editTask,
    deleteAll
} = require("../controllers/tasks.js")

router.route("/").get(getAllTasks).post(createTask).delete(deleteAll);
router.route("/:id").get(getTask).put(updateStatus).delete(deleteTask).patch(editTask);

module.exports = router;