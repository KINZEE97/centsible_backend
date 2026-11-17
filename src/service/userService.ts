import {
    loginRequestType,
    userRequestType,
} from "../controllers/schema/user.schema";
import { HttpError } from "../error/HttpError";
import { db } from "../lib/prisma";
import { compareHash, hash } from "../utils/hash";
import { signToken } from "../utils/jsonwebtoken";

export class UserService {
    async createUser(userInfo: userRequestType) {
        const userExists = await db.user.findUnique({
            where: { email: userInfo.email },
        });

        if (userExists) {
            throw new HttpError(400, "Invalid Email");
        }

        const passwordHash = await hash(userInfo.password);

        const user = await db.user.create({
            data: {
                name: userInfo.name,
                email: userInfo.email,
                passwordHash,
            },
        });

        return { message: "User created", user };
    }

    async userLogin(loginData: loginRequestType) {
        const userExists = await db.user.findUnique({
            where: { email: loginData.email },
        });

        if (!userExists) {
            throw new HttpError(400, "Invalid email or password");
        }

        const passwrdCompared = await compareHash(
            loginData.password,
            userExists.passwordHash,
        );

        if (!passwrdCompared) {
            throw new HttpError(400, "Invalid email or password");
        }

        const payload = {
            id: userExists.id,
            name: userExists.name,
            email: userExists.email,
        };

        const token = signToken(payload);

        return token;
    }
}
