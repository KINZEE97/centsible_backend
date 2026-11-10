import { z } from "zod";

export const categorySchema = z
    .object({
        name: z.string().trim().min(2, "The name cannot be empty").optional(),
        type: z.enum(["INCOME", "EXPENSE"]).optional(),
    })
    .strict();

export type CategoryType = z.infer<typeof categorySchema>;
