export interface UserTypes extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}