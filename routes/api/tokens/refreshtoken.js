const jwt = require("jsonwebtoken");

const { getPrivateKey } = require("../../../utils/keys");
const { createSessionID } = require("../../../utils/jwtSessionStore");

async function refreshToken(req, res) {
  try {
    const { sub, name, role } = req.payload;
    const tokenLifeID = createSessionID(60 * 1000);

    const pirvateKey = await getPrivateKey();
    const accessToken = jwt.sign(
      { sub, name, role, jwti: tokenLifeID },
      pirvateKey,
      {
        algorithm: "RS256",
        expiresIn: "1m"
      }
    );

    res.json({ status: "success", accessToken: `Bearer ${accessToken}` });
  } catch (error) {
    return res
      .status(403)
      .json({ status: "error", message: "Kérjük jelentkezz be" });
  }
}

module.exports = refreshToken;
