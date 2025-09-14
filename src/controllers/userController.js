const { User, Sequelize } = require("../../models");
const { Op } = Sequelize;
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { username, email, mobilenumber, password } = req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { mobilenumber }],
      },
    });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with provided email, or mobile number.",
      });
    }
    const newUser = await User.create({
      username,
      email,
      mobilenumber,
      password: bcrypt.hashSync(password),
    });
    return res
      .status(201)
      .json({ message: "User created successfully!!!!", data: newUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

module.exports = { register };
