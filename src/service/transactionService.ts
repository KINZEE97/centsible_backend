import {
    TransactionType,
    UpdateTransactionType,
} from "../controllers/schema/transaction.schema";
import { HttpError } from "../error/HttpError";
import { db } from "../lib/prisma";

export class TransactionService {
    async createTransaction(data: TransactionType) {
        const categoryExists = await db.category.findUnique({
            where: { id: data.categoryId },
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
            },
        });

        return transaction;
    }

    //implement the pagination and filtering logic in the future
    async getTransactions() {
        const transactions = await db.transaction.findMany();
        return transactions;
    }

    async getTransactionById(id: string) {
        const transaction = await db.transaction.findUnique({
            where: { id },
        });

        if (!transaction) {
            throw new HttpError(404, "Transaction not found");
        }

        return transaction;
    }

    async updateTransaction(id: string, info: UpdateTransactionType) {
        const transaction = await db.transaction.findUnique({
            where: { id },
        });

        if (!transaction) {
            throw new HttpError(404, "Transaction not found");
        }

        const updatedTransaction = await db.transaction.update({
            where: { id },
            data: {
                ...info,
            },
        });

        return updatedTransaction;
    }

    async deleteTransaction(id: string) {
        const transaction = await db.transaction.findUnique({
            where: { id },
        });

        if (!transaction) {
            throw new HttpError(404, "Transaction not found");
        }

        await db.transaction.delete({
            where: { id },
        });

        return { message: "transaction deleted successfully" };
    }
}
