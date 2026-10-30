import { Handler } from "express";
import { CategoryService } from "../service/categoryService";

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
}
