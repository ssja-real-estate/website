interface User {
    id: string;
    userName: string;
    name?: string;
    password?: string;
    mobile: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

export type { User };
