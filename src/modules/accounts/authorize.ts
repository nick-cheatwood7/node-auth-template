import bcrypt from "bcryptjs";
const { compare } = bcrypt;
import { prisma } from "../../utils/prisma.js";

export async function authorizeUser(email: string, password: string) {
    const user = await prisma.user.findFirst({
        where: {
            email
        }
    });
    const savedPassword = user?.password;
    if (!user || !savedPassword) {
        return { isAuthorized: false, userId: undefined };
    }
    const isAuthorized = await compare(password, savedPassword);
    return { isAuthorized, userId: user.id };
}
