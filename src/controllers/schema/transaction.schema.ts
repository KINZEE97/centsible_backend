import { z } from "zod";

export const transactionRequestSchema = z
    .object({
        description: z.string().trim().min(3, "Description required"),
        amount: z.number().int().positive(),
        transactionType: z.enum(["INCOME", "EXPENSE"]),
        date: z.iso
            .date("Invalid date format, expected YYYY-MM-DD")
            .transform((value) => new Date(value)),
        categoryId: z.string().trim().min(1, "Category ID required"),
    })
    .strict();

export const updateTransactionRequestSchema = z.object({
    description: z.string().trim().min(3, "Description required").optional(),
    amount: z.number().int().positive().optional(),
    transactionType: z.enum(["INCOME", "EXPENSE"]).optional(),
    date: z.iso
        .date("Invalid date format, expected YYYY-MM-DD")
        .transform((value) => new Date(value))
        .optional(),
    categoryId: z.string().trim().min(1, "Category ID required").optional(),
});

export type TransactionType = z.infer<typeof transactionRequestSchema>;
export type UpdateTransactionType = z.infer<
    typeof updateTransactionRequestSchema
>;
