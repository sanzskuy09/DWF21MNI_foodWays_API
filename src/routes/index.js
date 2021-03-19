const express = require("express");

const router = express.Router();

const { registerUser, loginUser } = require("../controllers/auth");

const {
  getUser,
  getDetailUser,
  addUser,
  updateUser,
  deleteUser,
  getProduct,
  getDetailProduct,
  deleteProduct,
  getProductByPartner,
  updateProduct,
} = require("../controllers/user");

router.get("/users", getUser);
router.get("/user/:id", getDetailUser);
router.post("/user", addUser);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

router.get("/products", getProduct);
router.get("/product/:id", getDetailProduct);
router.get("/products/:id", getProductByPartner);
router.patch("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
