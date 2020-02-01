import { Db, FilterQuery } from "mongodb";
import {
    ISessionData,
    ISession,
    ISessionFilter,
    IPagination,
    ISessionListResponse
} from "../../schemas/session";
import { v4 as generateId } from "uuid";
import { SESSIONS_COLLECTION_NAME } from "../collections";
import { isWriteOpSuccessful } from "../utils";
import { IUser } from "../../schemas/user";

export default class SessionsService {
    constructor(private databaseConnectionFactory: () => Promise<Db>) {}

    async createSession(sessionData: ISessionData, user: IUser) {
        if (
            !user?._id ||
            !sessionData?.start ||
            !sessionData.end ||
            !sessionData.name
        ) {
            return false;
        }
        const session: ISession = {
            _id: generateId(),
            start: sessionData.start,
            end: sessionData.end,
            name: sessionData.name,
            userId: user._id
        };
        const db = await this.databaseConnectionFactory();
        return db
            .collection(SESSIONS_COLLECTION_NAME)
            .insertOne(session)
            .then(isWriteOpSuccessful);
    }

    async getSessions(
        user: IUser,
        filter?: ISessionFilter,
        pagination?: IPagination
    ) {
        if (!user?._id) {
            return [];
        }
        const serverFilter: FilterQuery<ISession> = { userId: user._id };
        if (filter?.start) {
            serverFilter.start = { $gte: filter.start };
        }
        if (filter?.end) {
            serverFilter.end = { $lte: filter.end };
        }
        const db = await this.databaseConnectionFactory();
        let cursor = db
            .collection(SESSIONS_COLLECTION_NAME)
            .find<ISession>(serverFilter);
        if (typeof pagination?.page === "number") {
            const pageSize = (pagination.pageSize || 10);
            const skip = pagination.page * pageSize;
            cursor = cursor.skip(skip).limit(pageSize);
        }
        if (pagination?.sortParam) {
            cursor = cursor.sort(pagination.sortParam, pagination.sortOrder || 1);
        }
        const sessions = await cursor.toArray();
        const count = await cursor.count();
        return {
            elements: sessions,
            totalCount: count,
        } as ISessionListResponse;
    }
}
