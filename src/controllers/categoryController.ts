import { Handler } from "express";
import { CategoryService } from "../service/categoryService";
import { HttpError } from "../error/HttpError";

export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
    create: Handler = async (req, res) => {
        const { name } = req.body;

        try {
            const category = await this.categoryService.createCategory(name);
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
}
