const jwt = require("jsonwebtoken");
const { getPublicKey } = require("../utils/keys");
const { getSessionID } = require("../utils/jwtSessionStore");

module.exports = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  } else {
    return res.json({ status: "error", message: "Érvénytelen token" });
  }

  const { jwti } = jwt.decode(token);

  try {
    const publicKey = await getPublicKey();
    const sessionID = getSessionID(jwti);

    if (!sessionID) {
      return res
        .status(401)
        .json({ status: "error", message: "Érvénytelen token" });
    }

    const payload = jwt.verify(token, publicKey + sessionID, {
      algorithms: ["RS256"]
    });

    req.payload = payload;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: "error", message: "Érvénytelen token" });
  }
};
