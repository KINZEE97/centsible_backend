import { z } from "zod";

export const transactionRequestSchema = z.object({
    description: z.string().trim().min(3, "Description required"),
    amount: z.number().int().positive(),
    transactionType: z.enum(["INCOME", "EXPENSE"]),
    date: z.iso
        .date("Invalid date format, expected YYYY-MM-DD")
        .transform((value) => new Date(value)),
    categoryId: z.string().trim().min(1, "Category ID required"),
});

export type TransactionType = z.infer<typeof transactionRequestSchema>;
