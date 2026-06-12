export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    img?: string;
}

export interface LoginResponse {
    token: string;
    type: string;
    email: string;
    name: string;
}
