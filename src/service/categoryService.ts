import {
    CategoryType,
    PaginationQueryType,
} from "../controllers/schema/category.schema";
import { HttpError } from "../error/HttpError";
import { db } from "../lib/prisma";

export interface IUser {
    id: string;
    name: string;
    email: string;
}

export class CategoryService {
    async createCategory(requestData: CategoryType, user: IUser) {
        const category = await db.category.create({
            data: {
                name: requestData.name,
                type: requestData.type,
                userId: user.id,
            },
        });

        return category;
    }

    async getAllCategories(query: PaginationQueryType, user: IUser) {
        const allCategories = await db.category.findMany({
            where: { userId: user.id },
            orderBy: { name: "asc" },
            skip: (query.page - 1) * query.limit,
            take: query.limit,
            omit: { userId: true },
        });

        if (!allCategories) throw new HttpError(404, "Categories Not found");

        const count = await db.category.count({
            where: { userId: user.id },
        });

        return {
            data: allCategories,
            page: query.page,
            limit: query.limit,
            total: count,
        };
    }

    async getCategoryById(id: string, user: IUser) {
        const categoryExists = await db.category.findUnique({
            where: { id, userId: user.id },
            include: {
                transactions: {
                    where: { userId: user.id },
                    orderBy: { date: "desc" },
                },
            },
        });

        if (!categoryExists) {
            throw new HttpError(404, "Category not found");
        }

        return categoryExists;
    }

    async updateCategory(id: string, data: Partial<CategoryType>, user: IUser) {
        const category = await db.category.findUnique({
            where: { id, userId: user.id },
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

    async deleteCategory(id: string, user: IUser) {
        const categoryExists = await db.category.findUnique({
            where: { id, userId: user.id },
        });

        if (!categoryExists) {
            throw new HttpError(404, "category not found");
        }

        const deletedCategory = await db.category.delete({
            where: { id, userId: user.id },
        });

        return deletedCategory;
    }
}
