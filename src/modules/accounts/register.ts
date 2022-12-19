import bcrypt from "bcryptjs";
const { genSalt, hash } = bcrypt;

export async function registerUser(email: string, password: string) {
    const { user } = await import("../db/user/user.js");

    // generate salt
    const salt = await genSalt(10);

    // hash with salt
    const hashedPassword = await hash(password, salt);

    // store in db
    const result = await user.insertOne({
        email: {
            address: email,
            verified: false
        },
        password: hashedPassword
    });

    // return user from db
    return result.insertedId;
}
