export const __prod__ = process.env["NODE_ENV"] === "production";
export const COOKIE_SIGNATURE = String(process.env["COOKIE_SIGNATURE"]);
export const JWTSignature = String(process.env["JWT_SIGNATURE"]);
