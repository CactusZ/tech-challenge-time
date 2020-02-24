import * as express from "express";
import * as cookieParser from "cookie-parser";
import { getAuthMiddleware } from "./backend/middleware/authentication";
import { MongoClient, Db } from "mongodb";
import { config } from "./config";
import UsersService from "./backend/services/users-service";
import * as path from "path";
import getLoginRoutes from "./backend/routes/login";
import * as bodyParser from "body-parser";
import { sendError } from "./backend/utils";
import getSessionRoutes from "./backend/routes/sessions";
import SessionsService from "./backend/services/sessions-service";
import {
    SESSIONS_COLLECTION_NAME,
    USERS_COLLECTION_NAME
} from "./backend/collections";

(async () => {
    const dbPromiseFactory = await connectToDatabase();

    const usersService = new UsersService(dbPromiseFactory);
    const sessionsService = new SessionsService(dbPromiseFactory);

    const app = express();

    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "dist")));

    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "dist", "index.html"));
    });

    app.get("*", function(req, res) {
        res.redirect("/");
    });

    app.use("/login", getLoginRoutes(usersService));

    app.use(getAuthMiddleware(usersService));

    app.use(getSessionRoutes(sessionsService));

    app.use((req, res) => {
        sendError(res);
    });

    app.listen(config.serverPort, function() {
        console.log(`Example app listening on port ${config.serverPort}!`);
    });
})();

async function connectToDatabase() {
    let dbPromiseFactory: () => Promise<Db>;
    try {
        const client = new MongoClient(config.mongoUrl, {
            useUnifiedTopology: true
        });
        await client.connect();
        dbPromiseFactory = () =>
            Promise.resolve(client.db(config.databaseName));
        await ensureIndexes(dbPromiseFactory);
    } catch (e) {
        dbPromiseFactory = () => Promise.reject("Database not available!");
    }
    return dbPromiseFactory;
}

async function ensureIndexes(dbPromiseFactory: () => Promise<Db>) {
    const db = await dbPromiseFactory();
    await db.collection(SESSIONS_COLLECTION_NAME).createIndexes([
        {
            key: {
                userId: 1,
                start: 1
            },
            sparse: true
        },
        { key: { userId: 1, start: 1, end: 1 }, sparse: true }
    ]);
    await db.collection(USERS_COLLECTION_NAME).createIndex(
        {
            username: 1
        },
        { unique: true }
    );
}
