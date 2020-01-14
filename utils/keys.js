// generate Rsa Keypair
const keypair = require("keypair");
const fs = require("fs");
const path = require("path");
const appDir = path.dirname(require.main.filename);

async function createKeys() {
  const privateKey = await getPrivateKey();
  const publicKey = await getPublicKey();

  try {
    const keys = keypair();

    if (!privateKey) {
      fs.appendFile(appDir + "/id_rsa.key", keys.private, err => {
        if (err) throw err;
      });
    }

    if (!publicKey) {
      fs.appendFile(appDir + "/id_rsa.pem", keys.public, err => {
        if (err) throw err;
      });
    }
  } catch (err) {
    console.log(err);
  }
}

async function getPrivateKey() {
  return new Promise((res, rej) => {
    fs.readFile(appDir + "/id_rsa.key", { encoding: "utf8" }, (err, data) => {
      if (err) {
        return res(null);
      }

      return res(data);
    });
  });
}

async function getPublicKey() {
  return new Promise((res, rej) => {
    fs.readFile(appDir + "/id_rsa.pem", { encoding: "utf8" }, (err, data) => {
      if (err) {
        return res(null);
      }

      return res(data);
    });
  });
}

module.exports = {
  createKeys,
  getPublicKey,
  getPrivateKey
};
