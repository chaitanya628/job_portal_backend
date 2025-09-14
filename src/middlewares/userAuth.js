const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../../models");

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findOne({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    return res
      .status(403)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};

module.exports = authenticateUser;
