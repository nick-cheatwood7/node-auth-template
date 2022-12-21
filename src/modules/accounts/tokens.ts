import jwt from "jsonwebtoken";

const JWTSignature = String(process.env["JWT_SIGNATURE"]);

export async function createTokens(sessionToken: string, userId: string) {
    try {
        // create refresh token -- sessionToken
        const refreshToken = jwt.sign(
            {
                sessionToken
            },
            JWTSignature
        );
        // create access token -- sessionToken, userId
        const accessToken = jwt.sign(
            {
                sessionToken,
                userId
            },
            JWTSignature
        );
        // return tokens
        return {
            refreshToken,
            accessToken
        };
    } catch (e) {
        console.error(e);
        throw new Error("Unable to generate JWT tokens");
    }
}
