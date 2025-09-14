const { User, Sequelize } = require("../../models");
const { Op } = Sequelize;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: { username: username },
    });
    if (!user) {
      return res.status(404).json({ message: "User Not Found", data: null });
    }
    const passwordCheck = bcrypt.compareSync(password, user.password);
    if (!passwordCheck) {
      return res
        .status(401)
        .send({ message: "Invalid credentials", data: null });
    }

    const accesstoken = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.status(200).send({
      message: "Logged in successfully",
      data: { userId: user.id, userName: user.username, token: accesstoken },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const userDetails = async (req, res) => {
  const userResult = await User.findOne({
    where: { id: req.userId },
    attributes: [
      "id",
      "email",
      "mobilenumber",
      "createdAt",
      "updatedAt",
      "username",
    ],
  });
  if (!userResult) {
    res.status(404).send({ code: 404, message: "User not found" });
  } else {
    res.status(200).send({
      code: 200,
      message: "User details fetched successfully",
      data: userResult,
    });
  }
};

module.exports = { register, login, userDetails };
