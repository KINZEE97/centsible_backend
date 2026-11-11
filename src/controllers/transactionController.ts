import { Handler } from "express";
import { transactionRequestSchema } from "./schema/transaction.schema";
import { TransactionService } from "../service/transactionService";

export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}
    create: Handler = async (req, res, next) => {
        const data = transactionRequestSchema.parse(req.body);
        try {
            const result =
                await this.transactionService.createTransaction(data);

            res.status(201).json({ success: "Created", data: result });
        } catch (error) {
            next(error);
        }
    };

    list: Handler = async (req, res, next) => {
        try {
            const result = await this.transactionService.getTransactions();
            res.status(200).json({ data: result });
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
}
