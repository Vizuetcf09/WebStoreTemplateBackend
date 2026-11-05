import { IUser } from "../types/userTypes.js";
import UserSchema from "../schemas/userSchema.js";

class UserModel {
    // CREATE a new user
    async create(user: IUser) {
        return await UserSchema.create(user);
    }

    // READ users
    async getAll() {
        return await UserSchema.find();
    }

    // Get a single user by filter
    async getOne(filter: Record<string, any>) {
        return await UserSchema.findOne(filter);
    }

    // UPDATE a user by ID
    async update(id: any, updateData: Record<string, any>) {
        return await UserSchema.findByIdAndUpdate(id, updateData, { new: true });
    }

    // DELETE a user by ID
    async delete(id: any) {
        return await UserSchema.findByIdAndDelete(id);
    }
}

export default new UserModel();
