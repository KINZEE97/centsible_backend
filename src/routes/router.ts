import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import { CategoryService } from "../service/categoryService";

export const router = Router();

//services
const categoryService = new CategoryService();
//controllers
const categoryController = new CategoryController(categoryService);

// category routes
router.post("/category", categoryController.create);
router.get("/category", categoryController.list);
router.get("/category/:id", categoryController.listById);
