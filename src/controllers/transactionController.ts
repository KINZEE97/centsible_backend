import { Handler } from "express";
import { transactionRequestSchema } from "./schema/transaction.schema";

export class TransactionController {
    create: Handler = async (req, res, next) => {
        const data = transactionRequestSchema.parse(req.body);
        try {
        } catch (error) {
            next(error);
        }
    };
}
