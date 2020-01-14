const jwt = require("jsonwebtoken");
const { getSessionID } = require("../utils/jwtSessionStore");

module.exports = async (req, res, next) => {
  let token = req.cookies.refreshToken;

  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  } else {
    return res
      .status(401)
      .json({ status: "error", message: "Érvénytelen token" });
  }

  const { jwti } = jwt.decode(token);
  const sessionID = getSessionID(jwti);

  if (!sessionID) {
    return res
      .status(401)
      .json({ status: "error", message: "Érvénytelen token" });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET + sessionID,
      {
        algorithm: "HS256"
      }
    );

    req.payload = payload;
    next();
  } catch (error) {
    res.status(401).json({ status: "error", message: "Érvénytelen token" });
  }
};
