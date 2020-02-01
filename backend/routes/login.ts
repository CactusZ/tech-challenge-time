import * as express from "express";
import { IUserCredentials } from "../../schemas/user";
import {
    MIN_USERNAME_LENGTH,
    MAX_USERNAME_LENGTH,
    MIN_PASSWORD_LENGTH
} from "../../settings/userCredentials";
import UsersService from "../services/users-service";
import * as bcrypt from "bcrypt";
import { isWriteOpSuccessful, sendError, generateToken } from "../utils";
import { PASSWORD_SALT_ROUNDS } from "../settings";

export default function getLoginRoutes(
    usersService: UsersService
): express.Router {
    const router = express.Router();

    router.use((req, res, next) => {
        if (isValidCredentialFormat(req.body, res)) {
            next();
        }
    });

    router.post("/login", async (req, res, next) => {
        try {
            const credentials: IUserCredentials = req.body;
            const user = await usersService.getUser({
                username: credentials.username
            });
            if (!user) {
                sendError(res, "Wrong credentials", 401);
            } else {
                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );
                if (isPasswordValid) {
                    await onSuccessfulLogin(credentials, res);
                } else {
                    sendError(res, "Wrong credentials", 401);
                }
            }
        } catch (e) {
            next(e);
        }
    });

    router.post("/signup", async (req, res, next) => {
        try {
            const credentials: IUserCredentials = req.body;
            const existingUser = await usersService.getUser({
                username: credentials.username
            });
            if (existingUser) {
                sendError(res, "Username exists!", 409);
                return;
            }
            const hash = await bcrypt.hash(credentials.password, PASSWORD_SALT_ROUNDS);
            const insertResult = await usersService.addUser({
                username: credentials.username,
                password: hash
            });
            if (isWriteOpSuccessful(insertResult)) {
                await onSuccessfulLogin(credentials, res);
            } else {
                sendError(res, "", 500);
            }
        } catch (e) {
            next(e);
        }
    });

    return router;

    async function onSuccessfulLogin(
        credentials: IUserCredentials,
        res: express.Response
    ) {
        const token = await generateToken({ username: credentials.username });
        res.cookie("auth-token", token, {
            maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
        });
        res.redirect("/home");
    }
}

function isValidCredentialFormat(
    credentials: IUserCredentials,
    res: express.Response
): boolean {
    const {
        result: isValidCredentialFormat,
        description
    } = validateCredentialsFormat(credentials);
    if (!isValidCredentialFormat) {
        sendError(res, description, 401);
        return false;
    }
    return true;
}

function validateCredentialsFormat(
    credentials: IUserCredentials
): {
    result: boolean;
    description?: string;
} {
    if (!credentials) {
        return { result: false, description: "Credentials undefined" };
    }
    if (!isValidUsername(credentials)) {
        return { result: false, description: "Username not valid" };
    }
    if (!isValidPassword(credentials)) {
        return { result: false, description: "Password not valid" };
    }
    return {
        result: true
    };
}
function isValidPassword(credentials: IUserCredentials): boolean {
    return (
        credentials.password &&
        credentials.password.length >= MIN_PASSWORD_LENGTH
    );
}

function isValidUsername(credentials: IUserCredentials): boolean {
    return (
        credentials.username &&
        credentials.username.length >= MIN_USERNAME_LENGTH &&
        credentials.username.length <= MAX_USERNAME_LENGTH
    );
}
