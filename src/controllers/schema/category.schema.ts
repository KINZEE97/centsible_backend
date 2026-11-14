import { z } from "zod";

export const categorySchema = z
    .object({
        name: z.string().trim().min(2, "The name cannot be empty"),
        type: z.enum(["INCOME", "EXPENSE"]).optional(),
    })
    .strict();

export const paginationQuerySchema = z.object({
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().nonnegative().optional().default(10),
});

export type CategoryType = z.infer<typeof categorySchema>;
export type PaginationQueryType = z.infer<typeof paginationQuerySchema>;
