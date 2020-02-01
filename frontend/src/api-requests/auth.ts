import { IUserCredentials } from "../../../schemas/user";
import { IRequestResult } from "../../../schemas/request";
import axios from "axios";

export async function loginRequest(
    credentials: IUserCredentials,
    isSignUp = false
) {
    try {
        const response = await axios.post(
            "/login" + (isSignUp ? "/signup" : "/login"),
            credentials,
            {
                withCredentials: true,
                validateStatus: () => {
                    return true; 
                }
            }
        );
        const requestResult: IRequestResult = response.data;
        return {
            result: response.status === 200,
            description: requestResult && requestResult.description
        };
    } catch (e) {
        return {
            result: false,
            description: "Unknown error"
        };
    }
}
