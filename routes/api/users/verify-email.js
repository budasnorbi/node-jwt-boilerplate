const urlCrypt = require("url-crypt")(process.env.URL_SECRET);

const {
  removeSession,
  getSessionID
} = require("../../../utils/jwtSessionStore");

const { ErrorHandler } = require("../../../utils/errorHandler");

// Load models
const User = require("../../../models/User");

async function verifyEmail(req, res, next) {
  if (!req.params.token) {
    throw new ErrorHandler(400, "Hibás token");
  }

  try {
    let data;

    try {
      data = urlCrypt.decryptObj(req.params.token);
    } catch (error) {
      throw new ErrorHandler(400, "Hibás token");
    }

    const { userID, createdAt, tokenID } = JSON.parse(data);

    if (!getSessionID(tokenID)) {
      throw new ErrorHandler(400, "Hibás token");
    }

    if (new Date().getTime() - createdAt > 3600 * 1000) {
      throw new ErrorHandler(400, "A link lejárt");
    }

    const user = await User.findOneAndUpdate(
      { _id: userID, emailVerified: false },
      { $set: { emailVerified: true } },
      { new: true }
    );

    if (!user) {
      throw new ErrorHandler(400, "Nem sikerült az email érvényesítése");
    }

    removeSession(tokenID);

    if (user) {
      res.json({
        status: "success",
        message: "Email cím sikeresen meg lett erősítve"
      });
    } else {
      throw new ErrorHandler(400, "Az email cím már meg van erősítve");
    }
  } catch (error) {
    next(error);
    //console.log(error);
  }
}

module.exports = verifyEmail;
