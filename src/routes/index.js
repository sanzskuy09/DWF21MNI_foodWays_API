const express = require("express");

const router = express.Router();

const {
  getUser,
  getDetailUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

const {
  getProduct,
  getDetailProduct,
  getProductByPartner,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

const { registerUser, loginUser } = require("../controllers/auth");
const { authenticated } = require("../middlewares/auth");
const { checkRolePartner, checkRoleUser } = require("../middlewares/checkRole");
const { uploadFile } = require("../middlewares/upload");

router.get("/users", getUser);
router.get("/user/:id", getDetailUser);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", authenticated, deleteUser);

router.get("/products", getProduct);
router.get("/product/:id", getDetailProduct);
router.get("/products/:id", getProductByPartner);
router.post(
  "/product",
  authenticated,
  checkRolePartner,
  uploadFile("imageFile"),
  addProduct
);
router.patch("/product/:id", authenticated, checkRolePartner, updateProduct);
router.delete("/product/:id", authenticated, checkRolePartner, deleteProduct);

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
