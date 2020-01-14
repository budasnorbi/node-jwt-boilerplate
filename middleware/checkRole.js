module.exports = roleList => (req, res, next) => {
  const role = req.payload.role;

  if (roleList.indexOf(role) === -1) {
    return res.status(403).json({
      status: "Nincs engedélyed a végpont eléréséhez"
    });
  }

  next();
};
