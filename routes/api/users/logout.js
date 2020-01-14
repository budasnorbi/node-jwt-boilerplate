const jwt = require("jsonwebtoken");
const { removeSession } = require("../../../utils/jwtSessionStore");

function logout(req, res) {
  try {
    removeSession(req.payload.jwti);

    const refreshToken = req.cookies.refreshToken.slice(
      7,
      req.cookies.refreshToken.length
    );

    const { jwti } = jwt.decode(refreshToken);

    removeSession(jwti);
    res.clearCookie("refreshToken");

    return res.json({ status: "success", message: "Sikeres kijelentkezés" });
  } catch (error) {
    console.log(error);
  }
}

module.exports = logout;
