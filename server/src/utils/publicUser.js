const toPublicUser = (user) => {
    if (!user) {
        return null;
    }

    const doc = typeof user.toObject === 'function' ? user.toObject() : user;
    const profileImage = doc.profileImage || doc.avatar?.url || null;
    const profileCompleted = Boolean(
        doc.companyName?.trim() && doc.designation?.trim() && doc.phone?.trim()
    );

    return {
        id: doc._id?.toString?.() || doc.id,
        uid: doc._id?.toString?.() || doc.id,
        name: doc.name || '',
        email: doc.email || '',
        role: doc.role === 'admin' ? 'admin' : 'user',
        emailVerified: Boolean(doc.emailVerified),
        profileCompleted,
        companyName: doc.companyName || '',
        designation: doc.designation || '',
        phone: doc.phone || '',
        profileImage,
        notificationsPaused: Boolean(doc.notificationsPaused),
        themePreference: ['system', 'light', 'dark'].includes(
            doc.themePreference
        )
            ? doc.themePreference
            : 'system',
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
};

module.exports = toPublicUser;
