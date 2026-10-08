const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const hashToken = (token) =>
    crypto.createHash('sha256').update(token).digest('hex');

const getRefreshExpiry = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

const createAccessToken = (user) =>
    jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role,
            email: user.email,
            type: 'access',
        },
        env.jwtAccessSecret,
        { expiresIn: env.jwtAccessExpiresIn }
    );

const createRefreshToken = (user) =>
    jwt.sign(
        {
            sub: user._id.toString(),
            tokenId: crypto.randomUUID(),
            type: 'refresh',
        },
        env.jwtRefreshSecret,
        { expiresIn: env.jwtRefreshExpiresIn }
    );

const verifyAccessToken = (token) => jwt.verify(token, env.jwtAccessSecret);

const verifyRefreshToken = (token) => {
    const payload = jwt.verify(token, env.jwtRefreshSecret);
    if (payload.type !== 'refresh') {
        throw new Error('Invalid refresh token.');
    }
    return payload;
};

const issueTokenPair = async (user) => {
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshTokenHashes = [
        ...(user.refreshTokenHashes || []).filter(
            (item) => item.expiresAt > new Date()
        ),
        {
            hash: hashToken(refreshToken),
            expiresAt: getRefreshExpiry(),
        },
    ];
    await user.save();

    return { accessToken, refreshToken };
};

module.exports = {
    createAccessToken,
    createRefreshToken,
    hashToken,
    issueTokenPair,
    verifyAccessToken,
    verifyRefreshToken,
};
