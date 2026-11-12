import { ErrorRequestHandler } from "express";
import { HttpError } from "../error/HttpError";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json(err.message);
    } else if (err instanceof ZodError) {
        return res.status(400).json({
            message: "Invalid Data",
            errors: err.issues.map((error) => ({
                field: error.path.join("."),
                message: error.message,
            })),
        });
    } else if (err instanceof Error) {
        return res.status(500).json(err.message);
    } else {
        return res.status(500).json({ message: "Internal server error" });
    }
};
