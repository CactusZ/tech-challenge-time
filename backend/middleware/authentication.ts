import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../utils";
import UsersService from "../services/users-service";

export function getAuthMiddleware(usersService: UsersService) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies["auth-token"];
        try {
            const payload = await decodeToken(token);
            if (payload) {
                const user = await usersService.getUser({
                    username: payload.username
                });
                res.locals.user = user;
                
                next();
            } else {
                res.redirect(401, "/login");
            }
        } catch (e) {
            res.redirect(401, "/login");
        }
    };
}
