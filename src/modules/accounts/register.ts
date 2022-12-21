import bcrypt from "bcryptjs";
const { genSalt, hash } = bcrypt;
import { prisma } from "../../utils/prisma.js";

export async function registerUser(email: string, password: string) {
    // generate salt
    const salt = await genSalt(10);

    // hash with salt
    const hashedPassword = await hash(password, salt);

    // store in db
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword
        }
    });

    // return user from db
    return user.id;
}
