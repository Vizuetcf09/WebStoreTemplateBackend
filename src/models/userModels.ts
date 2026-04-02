// vamos a crear un modelo primero para regsitrar usuarios, luego lo usaremos para crear un nuevo usuario en la base de datos

import { UserTypes } from "../types/userTypes.js";
import UserSchema from "../schemas/userSchema.js";

class UserModel {
    // CRUD operations models

    // CRETE a new user
    async create(user: UserTypes) {
        return await UserSchema.create(user);
    }

    // READ users

    // Get all users
    async getAll() {
        return await UserSchema.find();
    }

    // Get a single user by ID
    async getOne(id: UserTypes["id"]) {
        return await UserSchema.findById(id);
    }

    // UPDATE a user by ID
    async update(id: UserTypes["id"], user: UserTypes) {
        return await UserSchema.findByIdAndUpdate(id, user, { new: true });
    }


    // DELETE a user by ID
    async delete(id: UserTypes["id"]) {
        return await UserSchema.findByIdAndDelete(id);
    }

}

export default new UserModel();