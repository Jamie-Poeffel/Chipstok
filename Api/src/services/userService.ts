import { User } from "../models/User";

export async function getUserById(id: string): Promise<User | null> {
    return User.findByPk(id)
}