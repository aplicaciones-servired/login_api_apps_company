import { O } from "node_modules/react-router/dist/development/route-data-C12CLHiN.d.mts";

export interface User {
    id: string;
    names: string;
    lastnames: string;
    document: number;
    username: string;
    email: string;
    company: string;
    process: string;
    sub_process: string;
    state: string;
    iat: number;
    exp: number;
}

export type UserI = Omit<User, 'iat' | 'exp'> & {
    createdAt: string;
    updatedAt: string;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}