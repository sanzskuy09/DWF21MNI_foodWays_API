const { User } = require("../../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const schema = Joi.object({
      email: Joi.string().email().min(10).max(50).required(),
      password: Joi.string().min(8).required(),
      fullName: Joi.string().required(),
      gender: Joi.string().required(),
      phone: Joi.string().min(7).max(13).required(),
      role: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message,
      });

    const checkEmail = await User.findOne({
      where: {
        email,
      },
    });

    if (checkEmail)
      return res.status(400).send({
        status: "Register Failed",
        message: "Email already registered",
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    const secretKey = "lvj3lkas82r17kj";
    const token = jwt.sign(
      {
        id: user.id,
      },
      secretKey
    );

    res.send({
      status: "success",
      data: {
        user: {
          fullName: user.fullName,
          token,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Server Error",
    });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().min(10).max(50).required(),
      password: Joi.string().min(8).required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message,
      });

    const checkEmail = await User.findOne({
      where: {
        email,
      },
    });

    if (!checkEmail)
      return res.status(400).send({
        status: "Login Failed",
        message: "Your Credentials is not Valid",
      });

    const validPassword = await bcrypt.compare(password, checkEmail.password);

    if (!validPassword)
      return res.status(400).send({
        status: "Login Failed",
        message: "Your Credentials is not Valid",
      });

    const secretKey = "lvj3lkas82r17kj";
    const token = jwt.sign(
      {
        id: checkEmail.id,
      },
      secretKey
    );

    res.send({
      status: "success",
      message: "Login Success",
      data: {
        user: {
          id: checkEmail.id,
          fullName: checkEmail.fullName,
          email: checkEmail.email,
          token,
          phone: checkEmail.phone,
          image: checkEmail.image,
          role: checkEmail.role,
        },
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Server Error",
    });
  }
};

// Check Auth
exports.checkAuth = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.userId.id,
      },
    });

    res.send({
      status: "success",
      message: "User Valid",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error",
    });
  }
};
