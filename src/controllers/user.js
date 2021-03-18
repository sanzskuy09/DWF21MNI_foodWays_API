const { response } = require("express");
const { User, Product } = require("../../models");

// Get All users
exports.getUser = async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Product,
        as: "products",
        attributes: {
          exclude: ["createdAt", "updatedAt", "UserId", "userId"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    // const user = users.map((user) => ({
    //   products: user.products,
    // }));

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

// get All Product
exports.getProduct = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: {
        model: User,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "image", "role"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "UserId"],
      },
    });

    res.send({
      data: {
        products,
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
        exclude: ["createdAt", "updatedAt"],
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

//  Get Product By Partner
exports.getProductByPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.findAll({
      where: {
        userId: id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "UserId"],
      },
    });

    res.send({
      status: "success",
      data: {
        products,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
    });
  }
};

// Get Detail Product
exports.getDetailProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.findOne({
      where: {
        id,
      },
      include: {
        model: User,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "image", "role"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "UserId", "userId"],
      },
    });

    res.send({
      status: "success",
      data: {
        products,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
    });
  }
};

// Add User
exports.addUser = async (req, res) => {
  try {
    const { body } = req;

    const user = await User.create(body);

    res.send({
      status: "success",
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

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const checkId = await User.findOne({
      where: {
        id,
      },
    });

    if (!checkId)
      return res.send({
        status: "Fail",
        message: `User with id ${id} not found`,
      });

    const updateUserId = await User.update(body, {
      where: {
        id,
      },
    });

    const user = await User.findOne({
      where: {
        id: updateUserId,
      },
    });

    res.send({
      status: "success",
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

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const checkId = await Product.findOne({
      where: {
        id,
      },
    });

    if (!checkId)
      return res.send({
        status: "Fail",
        message: `Product with id ${id} not found`,
      });

    await Product.update(body, {
      where: {
        id,
      },
    });

    const productU = await Product.findOne({
      where: {
        id,
      },
      include: {
        model: User,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "image", "role"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "UserId"],
      },
    });

    res.send({
      status: "success",
      data: {
        productU,
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

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
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
