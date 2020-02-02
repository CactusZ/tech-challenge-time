import { ISessionFilter, IPagination, ISession, ISessionData } from "../../../schemas/session";

export function fetchLocalSessions(filter: ISessionFilter, pagination: IPagination) {
    const sessionsStr = localStorage.getItem("sessions");
    const sessions: ISession[] = sessionsStr ? JSON.parse(sessionsStr): [];
    const filtered = sessions.filter((session) => {
        let result = true;
        if (filter?.start) {
            result = result && session.start >= filter.start;
        }
        if (filter?.end) {
            result = result && session.end <= filter.end;
        }
        return result;
    });
    const sortOrder = pagination?.sortOrder || 1;
    const sorted = pagination?.sortParam ? filtered.sort((a, b) => {
        if (a[pagination.sortParam] === b[pagination.sortParam]) {
            return 0;
        } else if (a[pagination.sortParam] > b[pagination.sortParam]) {
            return sortOrder;
        } else {
            return -sortOrder;
        }
    }) : filtered;
    const totalCount = sorted.length;
    if (typeof pagination?.page == "number" || pagination.pageSize) {
        const sliceStart = (pagination?.page || 0) * (pagination?.pageSize || 10);
        const sliceEnd = sliceStart + (pagination?.pageSize || 10);
        const sliced = sorted.slice(sliceStart, sliceEnd); 
        return {
            totalCount,
            elements: sliced,
        };
    } else {
        return {
            totalCount,
            elements: sorted,
        };
    }
}

export function clearLocalSessions() {
    localStorage.removeItem("sessions");
    clearCurrentSessionStartLocal();
}

export function addLocalSession(sessionData: ISessionData) {
    const session: ISession = {
        _id: Date.now() + sessionData.name,
        name: sessionData.name,
        start: sessionData.start,
        end: sessionData.end,
        userId: "offline",
    };
    const currentSessionsStr = localStorage.getItem("sessions");
    const currentSessions = currentSessionsStr ? JSON.parse(currentSessionsStr) : [];
    currentSessions.push(session);
    localStorage.setItem("sessions", JSON.stringify(currentSessions));
    return true;
}

export function storeCurrentSessionStartLocal(time: number) {
    localStorage.setItem("currentSessionStart", time.toString(10));
}

export function getCurrentSessionStartLocal(): number {
    const startStr = localStorage.getItem("currentSessionStart");
    return startStr ? Number(startStr) || 0 : 0;
}

export function clearCurrentSessionStartLocal() {
    localStorage.removeItem("currentSessionStart");
}