const express = require("express");
const { Op } = require("sequelize");
const Joi = require("joi");
const { Order, Product, Transaction, User } = require("../../models");

// get All Order
exports.getOrder = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: {
        model: Product,
        as: "product",
        attributes: {
          exclude: ["createdAt", "updatedAt", "UserId"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "ProductId", "product"],
      },
    });

    res.send({
      status: "success",
      data: {
        orders,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
    });
  }
};

// add Transaction
exports.addTransaction = async (req, res) => {
  try {
    const { body } = req;

    const ids = body.products.map((product) => product.id);
    const quantities = body.products.map((product) => product.qty);

    const { id: transactionId } = await Transaction.create({
      userId: req.userId.id,
      status: "On the Way",
    });

    const productData = await Product.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
    });

    await Order.bulkCreate(
      productData.map((product, index) => ({
        transactionId,
        productId: product.id,
        qty: quantities[index],
      }))
    );

    const transaction = await Transaction.findOne({
      where: {
        id: transactionId,
      },
      include: [
        {
          model: User,
          as: "userOrder",
          attributes: ["id", "fullName", "location", "email"],
        },
        {
          model: Order,
          as: "orders",
          attributes: ["qty"],
          include: {
            model: Product,
            as: "product",
            attributes: ["id", "title", "price", "image"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "UserId"],
      },
    });

    res.send({
      status: "success",
      message: "Success add transaction",
      data: {
        transaction,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

// get All transaction By Partner
exports.getTransaction = async (req, res) => {
  try {
    console.log(req.userId);
    const transactions = await Transaction.findAll({
      include: [
        {
          model: User,
          as: "userOrder",
          attributes: ["id", "fullName", "location", "email"],
        },
        {
          model: Order,
          as: "orders",
          attributes: ["qty"],
          include: {
            model: Product,
            as: "product",
            where: {
              userId: req.userId.id,
            },
            attributes: ["id", "title", "price", "image"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "UserId"],
      },
    });

    res.send({
      status: "success",
      data: {
        transactions,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

// get Detail transaction
exports.getDetailTransaction = async (req, res) => {
  try {
    console.log(req.userId);
    const { id } = req.params;

    const transactions = await Transaction.findOne({
      where: {
        id,
      },
      include: [
        {
          model: User,
          as: "userOrder",
          attributes: ["id", "fullName", "location", "email"],
        },
        {
          model: Order,
          as: "orders",
          attributes: ["qty"],
          include: {
            model: Product,
            as: "product",
            attributes: ["id", "title", "price", "image"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "UserId"],
      },
    });

    res.send({
      status: "success",
      data: {
        transactions,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

// Update Transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    await Transaction.update(body, {
      where: {
        id,
      },
    });

    const transactions = await Transaction.findOne({
      where: {
        id,
      },
      include: [
        {
          model: User,
          as: "userOrder",
          attributes: ["id", "fullName", "location", "email"],
        },
        {
          model: Order,
          as: "orders",
          attributes: ["qty"],
          include: {
            model: Product,
            as: "product",
            attributes: ["id", "title", "price", "image"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "UserId"],
      },
    });

    res.send({
      status: "success",
      message: "Success updated transaction",
      data: {
        transactions,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

// Get Customer transaction
exports.getMyTransaction = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: {
        userId: req.userId.id,
      },
      include: [
        {
          model: Order,
          as: "orders",
          attributes: ["qty"],
          include: {
            model: Product,
            as: "product",
            attributes: ["id", "title", "price", "image"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "UserId"],
      },
    });

    res.send({
      status: "success",
      message: "Success",
      data: {
        transactions,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

// Delete Transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteTransaction = await Transaction.destroy({
      where: {
        id,
        userId: req.userId.id,
      },
    });

    if (!deleteTransaction)
      return res.send({
        status: "Failed",
        message: "This Transaction is not allowed to be deleted by you",
      });

    res.send({
      status: "success",
      message: "Transaction successfully deleted",
      data: {
        id,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};
