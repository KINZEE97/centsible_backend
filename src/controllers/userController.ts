import { Handler } from "express";
import { UserService } from "../service/userService";
import { userRequestSchema } from "./schema/user.schema";

export class UserController {
    constructor(private readonly userService: UserService) {}

    create: Handler = async (req, res, next) => {
        const userInfo = userRequestSchema.parse(req.body);
        try {
            const result = await this.userService.createUser(userInfo);

            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };
}
