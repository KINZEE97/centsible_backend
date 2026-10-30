import { CategoryType } from "../controllers/schema/category.schema";
import { HttpError } from "../error/HttpError";
import { db } from "../lib/prisma";

export class CategoryService {
    async createCategory(name: string) {
        const categoryExists = await db.category.findUnique({
            where: { name },
        });

        if (categoryExists) {
            throw new HttpError(400, "Category name is already in use");
        }

        const category = await db.category.create({
            data: { name },
        });

        return category;
    }

    //Futuramente vamos implementar pagination.
    async getAllCategories() {
        const allCategories = await db.category.findMany();

        if (!allCategories) throw new HttpError(404, "Categories Not found");

        return allCategories;
    }

    async getCategoryById(id: string) {
        const categoryExists = await db.category.findUnique({
            where: { id },
        });

        if (!categoryExists) {
            throw new HttpError(404, "Category not found");
        }

        return categoryExists;
    }

    async updateCategory(id: string, data: CategoryType) {
        const category = await db.category.findUnique({
            where: { id },
        });

        if (!category) {
            throw new HttpError(404, "Category not found");
        }

        const updatedCategory = await db.category.update({
            where: { id },
            data: {
                name: data.name,
            },
        });

        return updatedCategory;
    }

    async deleteCategory(id: string) {
        const categoryExists = await db.category.findUnique({
            where: { id },
        });

        if (!categoryExists) {
            throw new HttpError(404, "category not found");
        }

        const deletedCategory = await db.category.delete({
            where: { id },
        });

        return deletedCategory;
    }
}
