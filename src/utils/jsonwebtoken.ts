import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

type IPayload = {
    id: string;
    name: string;
    email: string;
};

export function signToken(params: IPayload): string {
    if (!jwtSecret) {
        throw new Error("missing secret key");
    }

    const token = jwt.sign(params, jwtSecret, {
        expiresIn: "1h",
    });

    return token;
}
