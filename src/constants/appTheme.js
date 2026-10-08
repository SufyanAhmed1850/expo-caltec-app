import { Colors } from './Colors';

export const getAppPalette = (mode = 'light') => {
    const isDark = mode === 'dark';

    return {
        isDark,
        page: isDark ? '#0E1118' : '#EEF2F8',
        card: isDark ? '#1A1D26' : Colors.light.background,
        cardSoft: isDark ? '#202532' : '#F7F9FC',
        input: isDark ? '#202532' : '#F7F9FC',
        border: isDark ? '#2B3140' : '#E7ECF4',
        text: isDark ? '#F6F8FC' : Colors.light.text,
        muted: isDark ? '#AEB6C7' : Colors.light.black30,
        secondary: isDark ? '#C8CEDB' : Colors.light.black60,
        primary: Colors.light.blue90,
        accent: Colors.light.red90,
        success: Colors.light.green90,
        warning: '#FF8F00',
        danger: Colors.light.red90,
        white: Colors.light.white90,
        shadow: isDark ? '#000000' : '#A9B6C9',
        overlay: 'rgba(3,8,16,0.78)',
    };
};

export const AppTypography = {
    screenTitle: {
        fontSize: 24,
        lineHeight: 30,
        fontWeight: '900',
    },
    screenTitleCompact: {
        fontSize: 22,
        lineHeight: 28,
        fontWeight: '900',
    },
    sectionTitle: {
        fontSize: 20,
        lineHeight: 26,
        fontWeight: '900',
    },
    cardTitle: {
        fontSize: 17,
        lineHeight: 22,
        fontWeight: '900',
    },
    body: {
        fontSize: 14,
        lineHeight: 21,
    },
    caption: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '700',
    },
    eyebrow: {
        fontSize: 11,
        lineHeight: 14,
        fontWeight: '800',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
};

export const AppRadii = {
    xs: 12,
    sm: 16,
    md: 18,
    lg: 22,
    xl: 24,
    sheet: 28,
    pill: 999,
};

export const AppSpacing = {
    screenX: 18,
    screenTop: 14,
    card: 16,
    sectionGap: 14,
};

export const resolveThemePreference = (preference, systemScheme) => {
    if (preference === 'dark' || preference === 'light') {
        return preference;
    }

    return systemScheme === 'dark' ? 'dark' : 'light';
};

export const formatCurrency = (value) =>
    `PKR ${(Number(value) || 0).toLocaleString('en-US')}`;

export const formatDate = (value) => {
    const date = value ? new Date(value) : null;

    if (!date || Number.isNaN(date.getTime())) {
        return 'Not available';
    }

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const sanitizeNumberInput = (value, { allowDecimal = false } = {}) => {
    const pattern = allowDecimal ? /[^0-9.]/g : /[^0-9]/g;
    const sanitized = String(value || '').replace(pattern, '');

    if (!allowDecimal) {
        return sanitized;
    }

    const [first, ...rest] = sanitized.split('.');
    return rest.length ? `${first}.${rest.join('')}` : first;
};
