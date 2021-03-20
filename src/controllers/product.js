const Joi = require("joi");
const { User, Product } = require("../../models");

// get All Product
exports.getProduct = async (req, res) => {
  try {
    const products = await Product.findAll({
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

    const product = await Product.create({
      ...body,
      image: req.files.imageFile[0].filename,
      userId: req.userId.id,
    });

    const products = await Product.findOne({
      where: {
        id: product.id,
      },
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
        exclude: ["createdAt", "updatedAt", "UserId", "userId"],
      },
    });

    const url = "http://localhost:5000/uploads/";

    res.send({
      status: "success",
      data: {
        id: products.id,
        title: products.title,
        price: products.price,
        image: url + products.image,
        user: products.user,
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

    res.send({
      status: "success",
      data: {
        productPartner,
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

    const deleteProduct = await Product.destroy({
      where: {
        userId: req.userId.id,
      },
    });

    if (!deleteProduct)
      return res.send({
        status: "Failed",
        message: "This product is not allowed to be deleted by you",
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
