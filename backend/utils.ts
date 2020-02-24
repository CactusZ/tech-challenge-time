import {InsertOneWriteOpResult} from "mongodb";
import * as jwt from "jsonwebtoken";
import {Response} from "express";
import { ITokenPayload } from "../schemas/user";
import { IRequestResult } from "../schemas/request";
import { config } from "../config";

export function isWriteOpSuccessful(insertResult: InsertOneWriteOpResult<null>): boolean {
    return (
        insertResult.result &&
        !!insertResult.result.ok &&
        insertResult.result.n === 1
    );
}

export function generateToken(payload: ITokenPayload): Promise<string> {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, config.secret, (err, token) => {
            if (!err) {
                resolve(token);
            } else {
                reject(err);
            }
        });
    });
}

export function decodeToken(token: string): Promise<ITokenPayload> {
    return new Promise((resolve) => {
        jwt.verify(token, config.secret, (err, payload) => {
            if (!err) {
                resolve(payload as ITokenPayload);
            } else {
                resolve(null);
            }
        });
    });
}

export function sendError(
    res: Response,
    description?: string,
    errorCode?: number,
): void {
    res.status(errorCode || 500).send({
        result: false,
        description: description || "Unknown error",
    } as IRequestResult);
}
