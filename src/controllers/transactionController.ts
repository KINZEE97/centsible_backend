import { Handler } from "express";
import {
    transactionRequestSchema,
    dateQueryRequestSchema,
} from "./schema/transaction.schema";
import { TransactionService } from "../service/transactionService";
import { HttpError } from "../error/HttpError";

export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}
    create: Handler = async (req, res, next) => {
        const data = transactionRequestSchema.parse(req.body);
        const user = req.user;

        if (!user) throw new HttpError(401, "Unauthorized");
        try {
            const result = await this.transactionService.createTransaction(
                data,
                user,
            );

            res.status(201).json({ success: "Created", data: result });
        } catch (error) {
            next(error);
        }
    };

    list: Handler = async (req, res, next) => {
        const date = dateQueryRequestSchema.parse(req.query);
        try {
            const result = await this.transactionService.getTransactions(date);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getById: Handler = async (req, res, next) => {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({ error: "Invalid ID" });
        }
        try {
            const result = await this.transactionService.getTransactionById(id);
            res.status(200).json({ data: result });
        } catch (error) {
            next(error);
        }
    };

    update: Handler = async (req, res, next) => {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({ error: "Invalid ID" });
        }

        const data = transactionRequestSchema.parse(req.body);
        try {
            const result = await this.transactionService.updateTransaction(
                id,
                data,
            );

            res.status(200).json({ success: "Updated", data: result });
        } catch (error) {
            next(error);
        }
    };

    delete: Handler = async (req, res, next) => {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({ error: "Invalid ID" });
        }

        try {
            const result = await this.transactionService.deleteTransaction(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    summary: Handler = async (req, res, next) => {
        const query = dateQueryRequestSchema.parse(req.query);
        if (!query.month || typeof query.month !== "string") {
            return res.status(400).json({ error: "invalid month" });
        }

        try {
            const result = await this.transactionService.getSummary(
                query.month,
            );

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}
