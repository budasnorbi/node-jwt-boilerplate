const bcrypt = require("bcryptjs");
const { ErrorHandler } = require("../../../utils/errorHandler");

// Load models
const User = require("../../../models/User");

async function changePasswordInside(req, res, next) {
  const userID = req.payload.sub;
  const { currentPassword, password } = req.body;

  try {
    const user = await User.findById({ _id: userID });

    if (!user) {
      throw new ErrorHandler(400, "Érvénytelen token");
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      throw new ErrorHandler(400, "Érvénytelen jelenlegi jelszó");
    }

    const salt = await bcrypt.genSalt(10);

    if (!salt) {
      console.log(salt);
      throw new ErrorHandler(400, "Szerver hiba");
    }

    const hash = await bcrypt.hash(password, salt);

    if (!hash) {
      console.log(hash);
      throw new ErrorHandler(400, "Szerver hiba");
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: user._id },
      { $set: { password: hash } },
      { new: true }
    );

    if (updatedUser && updatedUser.password === hash) {
      res.json({
        status: "success",
        message: "Sikeresen frissítetted a jelszavad"
      });
    } else {
      throw new ErrorHandler(400, "Szerver hiba");
    }
  } catch (error) {
    next(error);
  }
}

module.exports = changePasswordInside;
