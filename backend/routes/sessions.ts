import * as express from "express";
import SessionsService from "../services/sessions-service";
import { sendError } from "../utils";
import { ISessionFilter, ISessionListRequest, IPagination } from "../../schemas/session";

export default function getSessionRoutes(sessionsService: SessionsService) {
    const router = express.Router();

    router.post("/create", async(req, res, next) => {
        try {
            const result = await sessionsService.createSession(req.body, res.locals.user);
            if (result) {
                res.json(true);
            } else {
                sendError(res);
            }
        } catch (e) {
            next(e);
        }
    });

    router.post("/list", async (req, res, next) => {
        try {
            const requestBody: ISessionListRequest = req.body;
            const filter: ISessionFilter = requestBody.filter;
            const pagination: IPagination = requestBody.pagination;
            const sessions = await sessionsService.getSessions(res.locals.user, filter, pagination);
            res.json(sessions);
        } catch (e) {
            next(e);
        }
    });

    return router;
}