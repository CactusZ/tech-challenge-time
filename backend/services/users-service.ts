import { Db } from "mongodb";
import { USERS_COLLECTION_NAME } from "../collections";
import { IUser, IUserCredentials } from "../../schemas/user";
import { v4 as generateId } from "uuid";

export default class UsersService {
    constructor(private databaseConnectionFactory: () => Promise<Db>) {}

    public async getUser(filter: Partial<IUser>) {
        const db = await this.databaseConnectionFactory();
        return await db
            .collection(USERS_COLLECTION_NAME)
            .findOne<IUser>(filter);
    }

    public async addUser(user: IUserCredentials) {
        const userRec: IUser = Object.assign(
            {
                _id: generateId()
            },
            user
        );
        const db = await this.databaseConnectionFactory();
        return await db.collection(USERS_COLLECTION_NAME).insertOne(userRec);
    }
}
