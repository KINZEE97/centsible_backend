import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import { TransactionController } from "../controllers/transactionController";
import { CategoryService } from "../service/categoryService";
import { TransactionService } from "../service/transactionService";

export const router = Router();

//services
const categoryService = new CategoryService();
const transactionService = new TransactionService();
//controllers
const categoryController = new CategoryController(categoryService);
const transactionController = new TransactionController(transactionService);

// category routes
router.post("/category", categoryController.create);
router.get("/category", categoryController.list);
router.get("/category/:id", categoryController.listById);
router.patch("/category/:id", categoryController.update);
router.delete("/category/:id", categoryController.delete);

// transaction routes
router.post("/transaction", transactionController.create);
router.get("/transaction", transactionController.list);
router.get("/transaction/summary", transactionController.summary);
router.get("/transaction/:id", transactionController.getById);
router.patch("/transaction/:id", transactionController.update);
router.delete("/transaction/:id", transactionController.delete);
