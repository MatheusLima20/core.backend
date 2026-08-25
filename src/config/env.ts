const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured.");
}

if (!jwtExpiresIn) {
    throw new Error("JWT_EXPIRES_IN is not configured.");
}

export const env = {
    jwt: {
        secret: jwtSecret,
        expiresIn: jwtExpiresIn,
    },
};
