import {
    DateQueryType,
    TransactionType,
    UpdateTransactionType,
} from "../controllers/schema/transaction.schema.js";
import { HttpError } from "../error/HttpError.js";
import { TransactionWhereInput } from "../generated/prisma/models.js";
import { db } from "../lib/prisma.js";
import { getMonthRange } from "../utils/dateRange.js";
import { IUser } from "./categoryService.js";

interface ISummaryCategoryItem {
    categoryId: string;
    categoryName: string;
    type?: "INCOME" | "EXPENSE";
    total: number;
}

interface IGroupedTransactionItem {
    categoryId: string;
    _sum: {
        amount: number | null;
    };
}

interface ICategorySummaryItem {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
}

export class TransactionService {
    async createTransaction(data: TransactionType, user: IUser) {
        const categoryExists = await db.category.findUnique({
            where: {
                id: data.categoryId,
                userId: user.id,
            },
        });

        if (!categoryExists) {
            throw new HttpError(404, "Category not found");
        }

        if (categoryExists.type !== data.transactionType) {
            throw new HttpError(
                400,
                "Transaction type does not match category type",
            );
        }

        const transaction = await db.transaction.create({
            data: {
                description: data.description,
                amount: data.amount,
                transactionType: data.transactionType,
                date: data.date,
                categoryId: data.categoryId,
                userId: user.id,
            },
        });

        return transaction;
    }

    //implement the pagination and filtering logic in the future
    async getTransactions(data: DateQueryType, user: IUser) {
        let where: TransactionWhereInput = {
            userId: user.id,
        };

        if (data.month) {
            const { start, end } = getMonthRange(data.month);
            where.date = {
                gte: start,
                lt: end,
            };
        }

        const [total, transactions] = await Promise.all([
            db.transaction.count({ where }),
            db.transaction.findMany({
                where,
                orderBy: [{ date: "desc" }, { id: "desc" }],
                skip: (data.page - 1) * data.limit,
                take: data.limit,
            }),
        ]);

        return {
            data: transactions,
            page: data.page,
            limit: data.limit,
            total,
            TotalPages: Math.ceil(total / data.limit),
        };
    }

    async getTransactionById(id: string, user: IUser) {
        const transaction = await db.transaction.findUnique({
            where: { id, userId: user.id },
        });

        if (!transaction) {
            throw new HttpError(404, "Transaction not found");
        }

        return transaction;
    }

    async updateTransaction(
        id: string,
        info: UpdateTransactionType,
        user: IUser,
    ) {
        const transaction = await this.getTransactionById(id, user);

        const finalCategoryId = info.categoryId ?? transaction.categoryId;
        const finalType = info.transactionType ?? transaction.transactionType;

        if (info.categoryId || info.transactionType) {
            const category = await db.category.findFirst({
                where: { id: finalCategoryId, userId: user.id },
            });

            if (!category) throw new HttpError(404, "Category not found");
            if (category.type !== finalType) {
                throw new HttpError(
                    400,
                    "Transaction type does not match category type",
                );
            }
        }

        return db.transaction.update({
            where: { id },
            data: info,
        });
    }

    async deleteTransaction(id: string, user: IUser) {
        await this.getTransactionById(id, user);

        await db.transaction.delete({
            where: { id, userId: user.id },
        });

        return { message: "transaction deleted successfully" };
    }

    async getSummary(month: string, user: IUser) {
        const { start, end } = getMonthRange(month);
        const grouped = await db.transaction.groupBy({
            by: ["categoryId"],
            where: {
                date: {
                    gte: start,
                    lt: end,
                },

                userId: user.id,
            },
            _sum: { amount: true },
            orderBy: { _sum: { amount: "desc" } },
        });

        const categoryIds = grouped.map(
            (item: { categoryId: string }) => item.categoryId,
        );
        const categories = await db.category.findMany({
            where: { id: { in: categoryIds }, userId: user.id },
        });

        const items: ISummaryCategoryItem[] = grouped.map(
            (item: IGroupedTransactionItem) => {
                const category = categories.find(
                    (c: ICategorySummaryItem) => c.id === item.categoryId,
                );
                return {
                    categoryId: item.categoryId,
                    categoryName: category?.name || "Unknown",
                    type: category?.type,
                    total: item._sum.amount || 0,
                };
            },
        );

        const incomeTotal = items
            .filter((i) => i.type === "INCOME")
            .reduce((sum, i) => sum + i.total, 0);

        const expenseTotal = items
            .filter((i) => i.type === "EXPENSE")
            .reduce((sum, i) => sum + i.total, 0);

        const categoriesWithPercent = items.map((i) => {
            const typeTotal = i.type === "INCOME" ? incomeTotal : expenseTotal;

            return {
                ...i,
                percentage:
                    typeTotal > 0
                        ? Math.round((i.total / typeTotal) * 1000) / 10
                        : 0,
            };
        });
        return {
            monthSelected: month,
            incomeTotal,
            expenseTotal,
            categories: categoriesWithPercent,
        };
    }
}
