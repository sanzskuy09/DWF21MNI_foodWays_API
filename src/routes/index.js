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

const {
  getOrder,
  getTransaction,
  getDetailTransaction,
  deleteTransaction,
  addTransaction,
  updateTransaction,
  getMyTransaction,
} = require("../controllers/transaction");

const { registerUser, loginUser, checkAuth } = require("../controllers/auth");
const { authenticated } = require("../middlewares/auth");
const { checkRolePartner, checkRoleUser } = require("../middlewares/checkRole");
const { uploadFile } = require("../middlewares/upload");

// Users
router.get("/users", getUser);
router.get("/user/:id", authenticated, getDetailUser);
router.patch("/user/:id", authenticated, uploadFile("image"), updateUser);
router.delete("/user/:id", authenticated, deleteUser);

// Products
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

// Transactions
router.get("/orders", getOrder);
router.get("/transactions", authenticated, getTransaction);
router.get("/my-transactions", authenticated, getMyTransaction);
router.get("/transaction/:id", authenticated, getDetailTransaction);
router.post("/transaction", authenticated, addTransaction);
router.patch(
  "/transaction/:id",
  authenticated,
  checkRolePartner,
  updateTransaction
);
router.delete("/transaction/:id", authenticated, deleteTransaction);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authenticated, checkAuth);

module.exports = router;
