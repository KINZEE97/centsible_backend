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

export const dateQueryRequestSchema = z
    .object({
        month: z
            .string()
            .regex(
                /^\d{4}-(0[1-9]|1[0-2])$/,
                "Invalid month format, expected YYYY-MM",
            )
            .optional(),
        page: z.coerce.number().int().positive().optional().default(1),
        limit: z.coerce.number().int().positive().optional().default(10),
    })
    .strict();

export type TransactionType = z.infer<typeof transactionRequestSchema>;
export type UpdateTransactionType = z.infer<
    typeof updateTransactionRequestSchema
>;
export type DateQueryType = z.infer<typeof dateQueryRequestSchema>;
