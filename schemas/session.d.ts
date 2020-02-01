export interface ISession extends ISessionData {
    _id: string;
    userId: string;    
}

export interface ISessionData {
    name: string;

    // timestamp
    start: number;
    end: number; 
}

export interface ISessionFilter {
    start?: number;
    end?: number;
}

export interface ISessionListRequest {
    filter: ISessionFilter;
    pagination: IPagination;
}

export interface ISessionListResponse {
    elements: ISession[];
    totalCount: number;
}

export interface IPagination {
    page: number;
    pageSize: number;
    sortParam?: string;
    sortOrder?: -1 | 1;
}