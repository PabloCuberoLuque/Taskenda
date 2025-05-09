export interface Task {
    id: number;
    title: string;
    description: string;
    finished: boolean;
    important: boolean;
    date: string;
    user?: {
        id: number;
        username: string;
    };
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        username: string;
        email: string;
        firstname: string;
        lastname: string;
    };
} 