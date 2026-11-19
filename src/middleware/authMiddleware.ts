import { NextFunction, Request, Response } from "express";
import { HttpError } from "../error/HttpError";
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
    throw new HttpError(500, "Internal server error");
}

const JWT_SECRET = process.env.JWT_SECRET;

interface jwtCostumPayload {
    id: string;
    name: string;
    email: string;
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            throw new HttpError(401, "Unauthorized");
        }

        const decoded = jwt.verify(token, JWT_SECRET) as jwtCostumPayload;

        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
};
