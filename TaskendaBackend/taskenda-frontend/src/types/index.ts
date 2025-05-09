export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
}

export interface AuthResponse {
    token: string;
    user: User;
} 