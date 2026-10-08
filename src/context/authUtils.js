export const PENDING_VERIFICATION_EMAIL_KEY =
    '@caltec/pending-verification-email';

export const normalizeEmail = (value = '') => value.trim().toLowerCase();

export const normalizeName = (value = '') =>
    value.trim().replace(/\s+/g, ' ');

export const isValidEmailFormat = (value = '') =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value));

export const isProfileComplete = (profile) =>
    Boolean(
        profile?.companyName?.trim() &&
            profile?.designation?.trim() &&
            profile?.phone?.trim()
    );

const joinRequirements = (requirements) => {
    if (requirements.length === 0) {
        return 'the current password policy';
    }

    if (requirements.length === 1) {
        return requirements[0];
    }

    return `${requirements.slice(0, -1).join(', ')} and ${requirements.at(-1)}`;
};

export const getPasswordValidationMessage = (status) => {
    if (!status || status.isValid) {
        return '';
    }

    const { passwordPolicy } = status;
    const requirements = [];

    if (status.meetsMinPasswordLength === false) {
        requirements.push(
            `at least ${passwordPolicy?.minPasswordLength ?? 6} characters`
        );
    }

    if (
        status.meetsMaxPasswordLength === false &&
        passwordPolicy?.maxPasswordLength
    ) {
        requirements.push(
            `no more than ${passwordPolicy.maxPasswordLength} characters`
        );
    }

    if (status.containsLowercaseLetter === false) {
        requirements.push('a lowercase letter');
    }

    if (status.containsUppercaseLetter === false) {
        requirements.push('an uppercase letter');
    }

    if (status.containsNumericCharacter === false) {
        requirements.push('a number');
    }

    if (status.containsNonAlphanumericCharacter === false) {
        requirements.push('a symbol');
    }

    return `Password must include ${joinRequirements(requirements)}.`;
};

export const getLocalPasswordValidationMessage = (password = '') => {
    if (password.length < 8) {
        return 'Password must include at least 8 characters.';
    }

    if (!/[A-Z]/.test(password)) {
        return 'Password must include an uppercase letter.';
    }

    if (!/[0-9]/.test(password)) {
        return 'Password must include a number.';
    }

    return '';
};

export const getFriendlyAuthErrorMessage = (error, context = 'default') => {
    const code = error?.code;

    if (error?.status === 0 || code === 'NETWORK_ERROR') {
        return 'We could not reach the server. Check your connection and try again.';
    }

    if (code === 'auth/network-request-failed') {
        return 'We could not reach the server. Check your connection and try again.';
    }

    if (code === 'auth/too-many-requests') {
        return 'Too many attempts. Please wait a bit and try again.';
    }

    if (code === 'auth/user-disabled') {
        return 'This account is disabled. Please contact support.';
    }

    if (context === 'login') {
        if (code === 'INVALID_CREDENTIALS') {
            return 'Email or password is incorrect.';
        }

        if (code === 'auth/invalid-email') {
            return 'Enter a valid email address.';
        }

        if (
            code === 'auth/invalid-credential' ||
            code === 'auth/user-not-found' ||
            code === 'auth/wrong-password'
        ) {
            return 'Email or password is incorrect.';
        }
    }

    if (context === 'register') {
        if (code === 'EMAIL_EXISTS') {
            return 'An account already exists for this email.';
        }

        if (code === 'auth/invalid-email') {
            return 'Enter a valid email address.';
        }

        if (code === 'auth/email-already-in-use') {
            return 'An account already exists for this email.';
        }

        if (
            code === 'auth/weak-password' ||
            code === 'auth/password-does-not-meet-requirements'
        ) {
            return 'Password does not meet the project requirements.';
        }
    }

    if (context === 'resetPassword') {
        if (code === 'auth/invalid-email') {
            return 'Enter a valid email address.';
        }

        return 'If an account exists for this email, a reset code has been sent.';
    }

    if (context === 'verifyResetCode') {
        if (code === 'INVALID_RESET_CODE') {
            return 'That code does not match or has expired. Check the latest email or request a new code.';
        }

        if (code === 'VALIDATION_ERROR') {
            return 'Enter the 6 digit reset code from your email.';
        }

        if (error?.status === 404) {
            return 'We could not verify the reset code. Restart the server and try again.';
        }

        return 'We could not verify that code. Please try again or request a new code.';
    }

    if (context === 'verifyEmail') {
        if (code === 'INVALID_VERIFICATION_CODE') {
            return 'The verification code is invalid or expired.';
        }

        if (code === 'auth/too-many-requests') {
            return 'Too many verification emails have been requested. Please try again later.';
        }
    }

    return error?.message || 'Something went wrong. Please try again.';
};

export const getRedirectPathForAuthStatus = (authStatus) => {
    if (authStatus === 'authenticated') {
        return '/(app)/home';
    }

    if (authStatus === 'unverified') {
        return '/(auth)/verify-email';
    }

    return '/(auth)/signIn';
};
