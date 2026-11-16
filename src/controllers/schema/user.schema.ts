import { z } from "zod";

export const userRequestSchema = z.object({
    name: z.string().min(3, {
        message: "Name is required and must be at least 3 characters long",
    }),
    email: z
        .email({ message: "Invalid email address" })
        .regex(/^[^\s@.]+(\.[^\s@.]+)*@[^\s@.]+(\.[^\s@.]+)+$/),
    password: z
        .string()
        .min(6, { message: "Password is required" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/),
});

export type userRequestType = z.infer<typeof userRequestSchema>;
