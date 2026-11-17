import { Handler } from "express";
import { UserService } from "../service/userService";
import { loginRequestSchema, userRequestSchema } from "./schema/user.schema";

export class UserController {
    constructor(private readonly userService: UserService) {}

    register: Handler = async (req, res, next) => {
        const userInfo = userRequestSchema.parse(req.body);
        try {
            const result = await this.userService.createUser(userInfo);

            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    login: Handler = async (req, res, next) => {
        const loginData = loginRequestSchema.parse(req.body);

        try {
            const result = await this.userService.userLogin(loginData);
            res.status(200).json({ token: result });
        } catch (error) {
            next(error);
        }
    };
}
