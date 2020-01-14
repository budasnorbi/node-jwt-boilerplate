class ErrorHandler extends Error {
  constructor(statusCode, message, type = "message") {
    super();
    this.statusCode = statusCode;
    this.type = type;
    this[type] = message;
  }
}

const handleError = (err, res) => {
  console.log("heló: ", err);
  const { statusCode, message, type } = err;
  res.status(statusCode).json({
    status: "error",
    [err.type]: err[type]
  });
};

module.exports = {
  ErrorHandler,
  handleError
};
