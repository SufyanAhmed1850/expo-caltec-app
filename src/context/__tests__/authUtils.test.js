import { describe, expect, it } from '@jest/globals';

import {
    getFriendlyAuthErrorMessage,
    getLocalPasswordValidationMessage,
    getPasswordValidationMessage,
    getRedirectPathForAuthStatus,
    isProfileComplete,
    isValidEmailFormat,
    normalizeEmail,
    normalizeName,
} from '../authUtils';

describe('authUtils', () => {
    it('normalizes email addresses and names', () => {
        expect(normalizeEmail('  USER@Example.COM ')).toBe('user@example.com');
        expect(normalizeName('  Sufyan   Ahmed  ')).toBe('Sufyan Ahmed');
    });

    it('validates email formatting and profile completion', () => {
        expect(isValidEmailFormat('user@example.com')).toBe(true);
        expect(isValidEmailFormat('bad-email')).toBe(false);
        expect(
            isProfileComplete({
                companyName: 'Caltec',
                designation: 'Manager',
                phone: '123456789',
            })
        ).toBe(true);
        expect(
            isProfileComplete({
                companyName: 'Caltec',
                designation: '',
                phone: '123456789',
            })
        ).toBe(false);
    });

    it('builds a helpful password policy message', () => {
        expect(
            getPasswordValidationMessage({
                isValid: false,
                meetsMinPasswordLength: false,
                containsUppercaseLetter: false,
                containsNumericCharacter: false,
                passwordPolicy: { minPasswordLength: 8 },
            })
        ).toBe(
            'Password must include at least 8 characters, an uppercase letter and a number.'
        );
        expect(getLocalPasswordValidationMessage('short')).toBe(
            'Password must include at least 8 characters.'
        );
    });

    it('maps auth statuses to route destinations', () => {
        expect(getRedirectPathForAuthStatus('authenticated')).toBe(
            '/(app)/home'
        );
        expect(getRedirectPathForAuthStatus('unverified')).toBe(
            '/(auth)/verify-email'
        );
        expect(getRedirectPathForAuthStatus('signedOut')).toBe(
            '/(auth)/signIn'
        );
    });

    it('normalizes safe public auth messages', () => {
        expect(
            getFriendlyAuthErrorMessage(
                { code: 'auth/invalid-credential' },
                'login'
            )
        ).toBe('Email or password is incorrect.');
        expect(
            getFriendlyAuthErrorMessage(
                { code: 'auth/email-already-in-use' },
                'register'
            )
        ).toBe('An account already exists for this email.');
        expect(
            getFriendlyAuthErrorMessage(
                { code: 'auth/user-not-found' },
                'resetPassword'
            )
        ).toBe(
            'If an account exists for this email, a reset code has been sent.'
        );
        expect(
            getFriendlyAuthErrorMessage(
                { code: 'INVALID_RESET_CODE' },
                'verifyResetCode'
            )
        ).toBe(
            'That code does not match or has expired. Check the latest email or request a new code.'
        );
        expect(
            getFriendlyAuthErrorMessage({ status: 404 }, 'verifyResetCode')
        ).toBe('We could not verify the reset code. Restart the server and try again.');
    });
});
