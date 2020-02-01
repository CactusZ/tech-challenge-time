import axios from "axios";
import {
    ISessionFilter,
    IPagination,
    ISessionListRequest,
    ISessionData,
    ISessionListResponse
} from "../../../schemas/session";

export async function getSessionList(
    filter: ISessionFilter,
    pagination?: IPagination
): Promise<ISessionListResponse> {
    const request: ISessionListRequest = {
        filter,
        pagination
    };
    const response = await axios.post<ISessionListResponse>("/list", request, { withCredentials: true });
    if (response.status === 200) {
        return response.data;
    }  else {
        return {
            elements: [],
            totalCount: 0,
        };
    }
}

export async function createSession(session: ISessionData) {
    const response = await axios.post<boolean>("/create", session, { withCredentials: true});
    if (response.status === 200) {
        return response.data;
    }  else {
        return false;
    }
}