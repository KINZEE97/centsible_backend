import { HttpError } from "../error/HttpError";
import { db } from "../lib/prisma";

export class CategoryService {
    async createCategory(name: string) {
        const categoryExists = await db.category.findUnique({
            where: { name },
        });

        if (categoryExists) {
            return new HttpError(400, "Category name is already in use");
        }

        const category = await db.category.create({
            data: { name },
        });

        return category;
    }

    //Futuramente vamos implementar pagination.
    async getAllCategories() {
        const allCategories = await db.category.findMany();

        if (!allCategories) return new HttpError(404, "Categories Not found");

        return allCategories;
    }
}
