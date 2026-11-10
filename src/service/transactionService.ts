import { TransactionType } from "../controllers/schema/transaction.schema";
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
    }
}
