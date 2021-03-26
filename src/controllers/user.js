const express = require("express");
const Joi = require("joi");
const { User, Product } = require("../../models");

// Get All users
exports.getUser = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password", "gender"],
      },
    });

    res.send({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
    });
  }
};

//  Get Detail user
exports.getDetailUser = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password", "gender"],
      },
    });

    res.send({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const schema = Joi.object({
      fullName: Joi.string(),
      password: Joi.string().min(8),
      gender: Joi.string(),
      phone: Joi.string().min(7).max(13),
      location: Joi.string(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message,
      });

    const checkId = await User.findOne({
      where: {
        id: req.userId.id,
      },
    });

    if (!checkId)
      return res.send({
        status: "Fail",
        message: `User with id ${id} not found`,
      });

    const updateUserId = await User.update(body, {
      where: {
        id: req.userId.id,
      },
    });

    if (!updateUserId)
      return res.send({
        status: "Fail",
        message: `User with id ${id} not founds`,
      });

    const user = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password", "gender"],
      },
    });
    // const hashedPassword = await bcrypt.hash(user.password, 10);

    res.send({
      status: "success",
      message: "User successfully updated",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
    });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: "User successfully removed",
      data: {
        id,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
    });
  }
};
