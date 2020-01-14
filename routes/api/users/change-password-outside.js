const bcrypt = require("bcryptjs");
const urlCrypt = require("url-crypt")(process.env.URL_SECRET);

const {
  removeSession,
  getSessionID
} = require("../../../utils/jwtSessionStore");

const { ErrorHandler } = require("../../../utils/errorHandler");

// Load models
const User = require("../../../models/User");

async function changePasswordOutside(req, res, next) {
  if (!req.params.token) {
    throw new ErrorHandler(400, "Hiányzó token");
  }

  let decryptData;

  try {
    decryptData = urlCrypt.decryptObj(req.params.token);
  } catch (error) {
    throw new ErrorHandler(400, "Hibás token");
  }

  try {
    const { userID, createdAt, tokenID } = JSON.parse(decryptData);

    if (!getSessionID(tokenID)) {
      throw new ErrorHandler(400, "Hibás token");
    }

    if (new Date().getTime() - createdAt > 3600 * 1000) {
      throw new ErrorHandler(400, "A link lejárt");
    }

    const { password } = req.body;

    const salt = await bcrypt.genSalt(10);

    if (!salt) {
      throw new Error(400, "Szerver hiba");
    }
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!hashedPassword) {
      throw new Error(400, "Szerver hiba");
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: userID },
      {
        $set: { password: hashedPassword }
      },
      { new: true }
    );

    if (updatedUser.password !== hashedPassword) {
      throw new ErrorHandler(400, "Jelszó frissítési hiba");
    }

    removeSession(tokenID);

    return res.json({
      status: "success",
      message: "Sikeres jelszó változtatás"
    });
  } catch (error) {
    next(error);
  }
}

module.exports = changePasswordOutside;
