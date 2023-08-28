const express = require("express");
const userManagementRouter = require("./userManagementRouter");
const courseManagementRouter = require("./courseManagementRouter");


const notFoundHelper = require("../helpers/notFoundHelper");
const errorHelper = require("../helpers/errorHelper");

const router = express.Router();

// health check
router.get("/welcome", (req, res) => {
    // console.log("health check");
    res.status(200).json("Welcome Api L9_learning vulebaolong");
});

router.use("/UserManagement", userManagementRouter);
router.use("/CourseManagement", courseManagementRouter);


//xử lý các URL người dùng sử dụng không đúng
router.all("*", notFoundHelper);
router.use(errorHelper);

module.exports = router;
