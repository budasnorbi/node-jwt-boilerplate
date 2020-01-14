const bcrypt = require("bcryptjs");
const urlCrypt = require("url-crypt")(process.env.URL_SECRET);
const transporter = require("../../../config/emailConfig");
const { createSessionID } = require("../../../utils/jwtSessionStore");

const { ErrorHandler } = require("../../../utils/errorHandler");

// Load models
const User = require("../../../models/User");

async function register(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      throw new ErrorHandler(400, "Az email cím már létezik", "email");
    }

    const newUser = new User(req.body);

    const salt = await bcrypt.genSalt(10);

    if (!salt) {
      throw new ErrorHandler(400, "Szerver hiba");
    }

    const passwordHash = await bcrypt.hash(newUser.password, salt);

    if (!passwordHash) {
      throw new ErrorHandler(400, "Szerver hiba");
    }

    newUser.password = passwordHash;

    const savedUser = await newUser.save();

    const tokenID = createSessionID(60 * 60 * 1000);
    const encryptedData = urlCrypt.cryptObj(
      JSON.stringify({
        userID: savedUser._id,
        createdAt: new Date().getTime(),
        tokenID
      })
    );

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: savedUser.email,
      subject: "Edzésrend fiók megerősítés",
      text: `Erre a linkre kattintva aktiválhatod az email címed: http://${process.env.HOST}:${process.env.FRONT_PORT}/verify-email?token=${encryptedData}`
    };

    await transporter.sendMail(mailOptions);

    res.json({
      status: "success",
      message:
        "Sikeres regisztráció, e-mail címedre kiküldtünk egy aktiváló e-mailt."
    });
  } catch (error) {
    next(error);
  }
}

module.exports = register;
