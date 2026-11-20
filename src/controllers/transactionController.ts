import { Handler } from "express";
import {
    transactionRequestSchema,
    dateQueryRequestSchema,
    updateTransactionRequestSchema,
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
        const user = req.user;
        try {
            if (!user) {
                throw new HttpError(401, "user required");
            }
            const result = await this.transactionService.getTransactions(
                date,
                user,
            );
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getById: Handler = async (req, res, next) => {
        const { id } = req.params;
        const user = req.user;
        if (typeof id !== "string" || !user) {
            return res.status(400).json({ error: "Invalid ID" });
        }
        try {
            const result = await this.transactionService.getTransactionById(
                id,
                user,
            );
            res.status(200).json({ data: result });
        } catch (error) {
            next(error);
        }
    };

    update: Handler = async (req, res, next) => {
        const { id } = req.params;
        const user = req.user;
        if (typeof id !== "string") {
            return res.status(400).json({ error: "Invalid ID" });
        }

        const data = updateTransactionRequestSchema.parse(req.body);
        try {
            const result = await this.transactionService.updateTransaction(
                id,
                data,
                user!,
            );

            res.status(200).json({ success: "Updated", data: result });
        } catch (error) {
            next(error);
        }
    };

    delete: Handler = async (req, res, next) => {
        const { id } = req.params;
        const user = req.user;
        if (typeof id !== "string" || !user) {
            return res
                .status(400)
                .json({ error: "Invalid ID or Invalid user" });
        }

        try {
            const result = await this.transactionService.deleteTransaction(
                id,
                user,
            );
            res.status(204).json(result);
        } catch (error) {
            next(error);
        }
    };

    summary: Handler = async (req, res, next) => {
        const query = dateQueryRequestSchema.parse(req.query);
        const user = req.user;
        if (!query.month || typeof query.month !== "string") {
            return res.status(400).json({ error: "month is required" });
        }
        if (!user) throw new HttpError(401, "Unauthorized");

        try {
            const result = await this.transactionService.getSummary(
                query.month,
                user,
            );

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}
