const bcrypt = require("bcryptjs");
const urlCrypt = require("url-crypt")(process.env.URL_SECRET);
const transporter = require("../../../config/emailConfig");
const jwt = require("jsonwebtoken");
const { getPrivateKey } = require("../../../utils/keys");
const { createSessionID } = require("../../../utils/jwtSessionStore");

const { ErrorHandler } = require("../../../utils/errorHandler");

// Load models
const User = require("../../../models/User");

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ErrorHandler(400, "Hibás bejelentkezési adatok");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ErrorHandler(400, "Hibás bejelentkezési adatok");
    }

    if (!user.emailVerified) {
      const encryptedData = urlCrypt.cryptObj(
        JSON.stringify({
          userID: user._id,
          createdAt: new Date().getTime()
        })
      );

      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Edzésrend fiók megerősítés",
        text: `Erre a linkre kattintva aktiválhatod az email címed: http://${process.env.HOST}:${process.env.FRONT_PORT}/verify-email?token=${encryptedData}`
      };

      await transporter.sendMail(mailOptions);

      throw new ErrorHandler(
        400,
        "Email cím nem lett megerősítve, kérlek ellenőrízd e-mail fiókod"
      );
    }

    const jwtiAccessToken = createSessionID(60 * 1000);

    const privateKey = await getPrivateKey();

    if (!privateKey) {
      throw new ErrorHandler(400, "Szerver hiba");
    }

    const accessToken = jwt.sign(
      {
        sub: user._id,
        name: user.name,
        role: user.role,
        jwti: jwtiAccessToken
      },
      privateKey + jwtiAccessToken,
      {
        algorithm: "RS256",
        expiresIn: "1m"
      }
    );

    const jwtiRefreshToken = createSessionID(7 * 24 * 60 * 60 * 1000);

    const refreshToken = jwt.sign(
      {
        sub: user._id,
        name: user.name,
        role: user.role,
        jwti: jwtiRefreshToken
      },
      process.env.REFRESH_TOKEN_SECRET + jwtiRefreshToken,
      {
        algorithm: "HS256",
        expiresIn: "7d"
      }
    );

    res.cookie("refreshToken", `Bearer ${refreshToken}`, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "Strict"
    });

    return res.json({
      status: "success",
      message: "Sikeres bejelentkezés",
      accessToken: `Bearer ${accessToken}`
    });
  } catch (error) {
    next(error);
  }
}

module.exports = login;
