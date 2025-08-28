import { Router } from "express";
import { register, login, refreshToken, logout } from "./controllers/authController";
import { getProfile } from "./controllers/userController";
import { getProducts, getProductById } from "./controllers/productController";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "./controllers/cartController";
import { requireAuth } from "./middleware/auth";
import { placeOrder, getMyOrders, getOrderById } from "./controllers/orderController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

router.get("/products", getProducts);
router.get("/products/:id", getProductById);

router.get("/cart", requireAuth, getCart);
router.post("/cartadd", requireAuth, addToCart);
router.put("/cart/:itemId", requireAuth, updateCartItem);
router.delete("/cart/:itemId", requireAuth, removeCartItem);
router.delete("/cart/clear/all", requireAuth, clearCart);

router.post("/order", requireAuth, placeOrder);
router.get("/order/my", requireAuth, getMyOrders);
router.get("/order/:id", requireAuth, getOrderById);

router.get("/profile", requireAuth, getProfile);

export default router;
