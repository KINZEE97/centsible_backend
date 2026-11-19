import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import { TransactionController } from "../controllers/transactionController";
import { CategoryService } from "../service/categoryService";
import { TransactionService } from "../service/transactionService";
import { UserService } from "../service/userService";
import { UserController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

export const router = Router();

//services
const categoryService = new CategoryService();
const transactionService = new TransactionService();
const userService = new UserService();
//controllers
const categoryController = new CategoryController(categoryService);
const transactionController = new TransactionController(transactionService);
const userController = new UserController(userService);

// category routes
router.post("/category", authMiddleware, categoryController.create);
router.get("/category", authMiddleware, categoryController.list);
router.get("/category/:id", authMiddleware, categoryController.listById);
router.patch("/category/:id", authMiddleware, categoryController.update);
router.delete("/category/:id", authMiddleware, categoryController.delete);

// transaction routes
router.post("/transaction", authMiddleware, transactionController.create);
router.get("/transaction", authMiddleware, transactionController.list);
router.get(
    "/transaction/summary",
    authMiddleware,
    transactionController.summary,
);
router.get("/transaction/:id", authMiddleware, transactionController.getById);
router.patch("/transaction/:id", authMiddleware, transactionController.update);
router.delete("/transaction/:id", authMiddleware, transactionController.delete);

// user routes
router.post("/register", userController.register);
router.post("/login", userController.login);
