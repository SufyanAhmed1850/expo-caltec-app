const appJson = require('./app.json');

const config = {
    ...appJson.expo,
    extra: {
        ...(appJson.expo.extra || {}),
    },
};

const enableRemoteUpdates =
    process.env.EAS_BUILD === 'true' ||
    process.env.CALTEC_ENABLE_REMOTE_UPDATES === '1';

if (!enableRemoteUpdates) {
    delete config.updates;
    delete config.runtimeVersion;

    if (config.extra.eas) {
        delete config.extra.eas;
    }
}

module.exports = {
    expo: config,
};
