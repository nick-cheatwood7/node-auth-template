import bcrypt from "bcryptjs";
const { compare } = bcrypt;

export async function authorizeUser(email: string, password: string) {
    const { user } = await import("../db/user/user");
    const userData = await user.findOne({
        "email.address": email
    });
    const savedPassword = userData?.["password"];
    const isAuthorized = await compare(password, savedPassword);
    return { isAuthorized, userId: userData?._id };
}
