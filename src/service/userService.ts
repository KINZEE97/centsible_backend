import { userRequestType } from "../controllers/schema/user.schema";
import { HttpError } from "../error/HttpError";
import { db } from "../lib/prisma";
import { hash } from "../utils/hash";

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
}
