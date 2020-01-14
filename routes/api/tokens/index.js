const express = require("express");
const router = express.Router();

//MIDDLEWARES
const checkRefresh = require("../../../middleware/checkRefresh");

router.get("/refreshToken", checkRefresh, require("./refreshtoken"));

router.get("/publicToken", require("./publictoken"));

module.exports = router;
