export interface IValidationType {
    field: string[];
    constraint: string;
};

export interface IErrorResponse {
    name: string;
    message: string;
    validationErrors?: IValidationType[];
    stack?: string;
};

export interface IAPIResponse<T> {
    status: number;
    message: string;
    data?: T;
    error?: IErrorResponse;
};