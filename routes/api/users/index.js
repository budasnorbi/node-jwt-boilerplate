const router = require("express").Router();

// Input Validations
const registerValidator = require("../../../validation/register");
const loginValidator = require("../../../validation/login");
const changePasswordOutsideValidator = require("../../../validation/password-change-outside");
const changePasswordInsideValidator = require("../../../validation/password-change-inside");
const forgetPasswordValidator = require("../../../validation/password-email-name");

// Error handling
const { handleError } = require("../../../utils/errorHandler");
// Middlewares
const checkAuth = require("../../../middleware/checkAuth");
const checkBody = require("../../../middleware/checkBody");
// const checkRole = require("../../../middleware/checkRole");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", checkBody(registerValidator), require("./register"));

// @route POST api/users/login
// @desc Login User
// @access Public
router.post("/login", checkBody(loginValidator), require("./login"));

// @route GET api/users/logout
// @desc Logout the user
// @access Protected
router.get("/logout", checkAuth, require("./logout"));

// @route GET api/users/verify-email
// @desc Verify user email
// @access Public
router.get("/verify-email/:token", require("./verify-email"));

// @route GET api/users/password-recover
// @desc Recover password
// @access Public
router.post(
  "/forget-password",
  checkBody(forgetPasswordValidator),
  require("./forget-password")
);

// @route POST api/users/change-password-outside/:token
// @desc Get an encrypted token and if its valid then it will replace the old password for a new one
// @access Public
router.post(
  "/change-password-outside/:token",
  checkBody(changePasswordOutsideValidator),
  require("./change-password-outside")
);

// @route POST api/users/change-password-inside
// @desc Change the password inside the application
// @access Protected
router.post(
  "/change-password-inside",
  checkAuth,
  checkBody(changePasswordInsideValidator),
  require("./change-password-inside")
);

// Error handling
router.use((error, req, res, next) => handleError(error, res));

module.exports = router;
