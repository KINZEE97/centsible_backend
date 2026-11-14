import { Handler } from "express";
import { CategoryService } from "../service/categoryService";
import { HttpError } from "../error/HttpError";
import { categorySchema } from "./schema/category.schema";

export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
    create: Handler = async (req, res) => {
        const requestData = categorySchema.parse(req.body);

        try {
            const category =
                await this.categoryService.createCategory(requestData);
            res.status(201).json({ message: "Created", data: category });
        } catch (error) {
            res.status(400).json(error);
        }
    };

    list: Handler = async (req, res) => {
        try {
            const categories = await this.categoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            res.status(400).json(error);
        }
    };

    listById: Handler = async (req, res) => {
        const { id } = req.params;
        if (typeof id !== "string")
            return res.status(400).json({ message: "Invalid ID" });
        try {
            const result = await this.categoryService.getCategoryById(id);
            res.status(200).json({ data: result });
        } catch (error) {
            if (error instanceof HttpError) {
                res.status(error.statusCode).json({ message: error.message });
                return;
            }
        }
    };

    update: Handler = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (typeof id !== "string")
                return res.status(400).json({ message: "Invalid ID" });

            const data = categorySchema.parse(req.body);
            const result = await this.categoryService.updateCategory(id, data);

            res.status(200).json({ message: "success", result });
        } catch (error) {
            next(error);
        }
    };

    delete: Handler = async (req, res, next) => {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({ message: "Invalid ID" });
        }
        try {
            const result = await this.categoryService.deleteCategory(id);
            res.status(200).json({ message: "category deleted", result });
        } catch (error) {
            next(error);
        }
    };
}
