module.exports = validator => (req, res, next) => {
  const validatorResult = validator(req.body);

  if (validatorResult.status === "error") {
    return res.status(400).json(validatorResult);
  }

  next();
};
