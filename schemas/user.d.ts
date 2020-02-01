export interface IUserCredentials {
    username: string;
    password: string;
}

export interface IUser extends IUserCredentials {
    _id: string;
}

export interface ITokenPayload {
    username: string;
}