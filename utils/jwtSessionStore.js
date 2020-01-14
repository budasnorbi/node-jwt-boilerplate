const randToken = require("rand-token");

const jwtSessions = {};

function createSessionID(expirationTime) {
  let id = randToken.generate(3);

  while (jwtSessions[id]) {
    id = randToken.generate(3);
  }

  jwtSessions[id] = true;

  setTimeout(() => {
    delete jwtSessions[id];
  }, expirationTime);

  return id;
}

function getSessionID(id) {
  return jwtSessions[id] ? id : false;
}

function removeSession(id) {
  delete jwtSessions[id];
}

module.exports = {
  createSessionID,
  getSessionID,
  removeSession
};
