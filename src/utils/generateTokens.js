import jwt from "jsonwebtoken";
import Token from "../models/Token.js";

const generateTokens = async (user) => {
    try {
        const payload = { id: user.id, roles: user.roles };
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: "14m" }
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: "30d" }
        );

        const userToken = await Token.findOne({ where: { userId: user.id } });
        if (userToken) await userToken.remove();

        await new Token({ userId: user._id, token: refreshToken }).save();
        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};

export default generateTokens;