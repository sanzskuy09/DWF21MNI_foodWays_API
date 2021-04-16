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

    const partnerId = productData[0].UserId;

    const checkPartnerId = productData.every(
      (product) => product.UserId == partnerId
    );

    if (!checkPartnerId)
      return res.status(400).send({
        status: "Failed",
        message: "You must order from the same partner",
      });

    const { id: transactionId } = await Transaction.create({
      userId: req.userId.id,
      status: "Waiting Approve",
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
        id: transaction.id,
        userOrder: transaction.userOrder,
        partnerId,
        orders: transaction.orders,
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
            attributes: ["id", "title", "price", "image", "UserId"],
          },
        },
      ],
      attributes: {
        exclude: ["updatedAt", "userId", "UserId"],
      },
    });

    const filterByPartnerId = transactions.filter(
      (e) => e.orders[0]?.product?.UserId == req.userId.id
    );

    res.send({
      status: "success",
      data: {
        transactions: filterByPartnerId,
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

    const checkId = await Transaction.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Order,
          as: "orders",
          include: {
            model: Product,
            as: "product",
            attributes: ["id", "UserId"],
          },
        },
      ],
    });

    const checkIdPartner = checkId.orders[0].product.UserId;

    if (checkIdPartner !== req.userId.id)
      return res.status(400).send({
        status: "Failed",
        message: "You cannot updated this transaction",
      });

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

// Get My transaction
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
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "title", "price", "image"],
              include: {
                model: User,
                as: "user",
                attributes: ["fullName"],
              },
            },
          ],
        },
      ],
      attributes: {
        exclude: ["updatedAt", "userId", "UserId"],
      },
    });

    res.send({
      status: "success",
      message: "Success get all your transaction",
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
