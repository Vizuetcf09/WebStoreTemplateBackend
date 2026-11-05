export type UserRole = 'user' | 'admin';

export interface IUser {
    id?: string;
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    isVerified?: boolean;
    verificationToken?: string | null;
    verificationTokenExpires?: Date | null;
    createdAt?: Date;
}
