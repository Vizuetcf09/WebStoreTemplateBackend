// vamos a crear un modelo primero para regsitrar usuarios, luego lo usaremos para crear un nuevo usuario en la base de datos

import { IUser } from "../types/userTypes.js";
import UserSchema from "../schemas/userSchema.js";

class UserModel {
    // CRUD operations models

    // CRETE a new user
    async create(user: IUser) {
        return await UserSchema.create(user);
    }

    // READ users

    // Get all users
    async getAll() {
        return await UserSchema.find();
    }

    // Get a single user by ID
    async getOne(filter: Partial<IUser>) {
        return await UserSchema.findOne(filter);
    }

    // UPDATE a user by ID
    async update(id: IUser["id"], user: IUser) {
        return await UserSchema.findByIdAndUpdate(id, user, { new: true });
    }


    // DELETE a user by ID
    async delete(id: IUser["id"]) {
        return await UserSchema.findByIdAndDelete(id);
    }

}

export default new UserModel();