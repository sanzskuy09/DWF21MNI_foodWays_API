const Joi = require("joi");
const { User, Product, Transaction } = require("../../models");

const url = "http://localhost:5000/uploads/";

// get All Product
exports.getProduct = async (req, res) => {
  try {
    const productsFromDB = await Product.findAll({
      include: {
        model: User,
        as: "user",
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "image",
            "role",
            "password",
            "gender",
          ],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "UserId"],
      },
    });

    const productString = JSON.stringify(productsFromDB);
    const productObject = JSON.parse(productString);

    const products = productObject.map((product) => ({
      ...product,
      image: url + product.image,
    }));

    res.send({
      status: "success",
      data: {
        products,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

//  Get Product By Partner
exports.getProductByPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const productsFromDB = await Product.findAll({
      where: {
        userId: id,
      },
      include: {
        model: User,
        as: "user",
        attributes: ["fullName"],
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "UserId"],
      },
    });

    const productString = JSON.stringify(productsFromDB);
    const productObject = JSON.parse(productString);

    const products = productObject.map((product) => ({
      ...product,
      image: url + product.image,
    }));

    res.send({
      status: "success",
      data: {
        products,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

// Get Detail Product
exports.getDetailProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productsFromDB = await Product.findOne({
      where: {
        id,
      },
      include: {
        model: User,
        as: "user",
        attributes: ["id", "fullName", "email", "phone", "location"],
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "UserId", "userId"],
      },
    });

    const productString = JSON.stringify(productsFromDB);
    const productObject = JSON.parse(productString);

    const products = productObject.map((product) => ({
      ...product,
      image: url + product.image,
    }));

    res.send({
      status: "success",
      data: {
        products,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

// Add Product
exports.addProduct = async (req, res) => {
  try {
    const { body } = req;

    const schema = Joi.object({
      title: Joi.string().min(5).max(50).required(),
      price: Joi.string().min(5).required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message,
      });

    const productNew = await Product.create({
      ...body,
      image: req.files.imageFile[0].filename,
      userId: req.userId.id,
    });

    const rawProduct = await Product.findOne({
      where: {
        id: productNew.id,
      },
      include: {
        model: User,
        as: "user",
        attributes: ["id", "fullName", "email", "phone", "location"],
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "UserId", "userId"],
      },
    });

    const productString = JSON.stringify(rawProduct);
    const productObject = JSON.parse(productString);
    const product = {
      ...productObject,
      image: url + productObject.image,
    };

    res.send({
      status: "success",
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
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
        userId: req.userId.id,
      },
    });

    if (!checkId)
      return res.send({
        status: "Fail",
        message: `This product is not allowed to be updated by you`,
      });

    const schema = Joi.object({
      title: Joi.string().min(5).max(50),
      price: Joi.string().min(5),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message,
      });

    await Product.update(body, {
      where: {
        id,
      },
    });

    const productPartner = await Product.findOne({
      where: {
        id,
      },
      include: {
        model: User,
        as: "user",
        attributes: ["id", "fullName", "email", "phone", "location"],
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "UserId"],
      },
    });

    res.send({
      status: "success",
      data: {
        productPartner,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const checkId = await Product.findOne({
      where: {
        id,
        userId: req.userId.id,
      },
    });

    if (!checkId)
      return res.status(400).send({
        status: "error",
        message: "You not allowed to delete this product",
      });

    await Product.destroy({
      where: {
        id: checkId.id,
      },
    });

    res.send({
      status: "success",
      message: "Product has been successfully removed",
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
