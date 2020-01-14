const urlCrypt = require("url-crypt")(process.env.URL_SECRET);
const transporter = require("../../../config/emailConfig");
const { createSessionID } = require("../../../utils/jwtSessionStore");
const { ErrorHandler } = require("../../../utils/errorHandler");

// Load models
const User = require("../../../models/User");

async function forgetPassword(req, res, next) {
  const { email, name } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ErrorHandler(400, "Nem létező fiók");
    }

    if (user.name !== name) {
      throw new ErrorHandler(400, "Nem létező fiók");
    }

    const tokenID = createSessionID(60 * 60 * 1000);

    const data = JSON.stringify({
      userID: user._id,
      createdAt: new Date().getTime(),
      tokenID
    });

    const encryptedToken = urlCrypt.cryptObj(data);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Jelszó visszaállítás",
      text: `A következő linken tudod visszaállítani a jelszavad: ${process.env.PROTOCOL}://${process.env.HOST}:${process.env.FRONT_PORT}/reset-password?token=${encryptedToken}`
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      status: "success",
      message: "Email címedre kiküldtünk egy jelszó visszaállító emailt"
    });
  } catch (error) {
    next(error);
  }
}

module.exports = forgetPassword;
