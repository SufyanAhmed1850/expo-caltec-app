const cloudinary = require('cloudinary').v2;
const env = require('../config/env');

cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
});

const canUpload = () =>
    Boolean(
        env.cloudinary.cloudName &&
            env.cloudinary.apiKey &&
            env.cloudinary.apiSecret
    );

const uploadProfileImage = async (file, userId) => {
    if (!file) {
        return null;
    }

    if (!canUpload()) {
        throw new Error('Cloudinary is not configured.');
    }

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: env.cloudinary.folder,
                public_id: userId,
                overwrite: true,
                resource_type: 'image',
                transformation: [
                    { width: 500, height: 500, crop: 'fill', gravity: 'face' },
                    { quality: 'auto', fetch_format: 'auto' },
                ],
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }
        );

        uploadStream.end(file.buffer);
    });
};

module.exports = {
    uploadProfileImage,
};
