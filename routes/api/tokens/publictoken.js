const { getPublicKey } = require("../../../utils/keys");

async function publicToken(req, res) {
  const publicKey = await getPublicKey();

  return res.send(publicKey);
}

module.exports = publicToken;
