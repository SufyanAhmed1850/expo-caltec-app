import ISO14001Cert from '@assets/images/ISO-14001.jpg';
import ISO45001Cert from '@assets/images/ISO-45001.jpg';
import ISO9001Cert from '@assets/images/ISO-9001.jpg';
import ISO14001Badge from '@assets/images/ISO_14001-2015.png';
import ISO45001Badge from '@assets/images/ISO_45001-2018.png';
import ISO9001Badge from '@assets/images/ISO_9001-2015.png';

export const CALTEC_OFFICE = {
    latitude: 24.8353512,
    longitude: 67.1012182,
    latitudeDelta: 0.0085,
    longitudeDelta: 0.0085,
    title: 'Caltec Instrument Services Co.',
    address:
        'Office No. 203, 2nd Floor, Building No. LS-1, Plot No. S/T-3/1, Sector 15, Korangi Industrial Area, Karachi',
    googleMapsUrl:
        'https://www.google.com/maps/place/Caltec+Instrument+Services+Co./@24.835356,67.0986433,17z/data=!3m1!4b1!4m6!3m5!1s0x3eb33b004e594a5d:0x2fc612bafb20226b!8m2!3d24.8353512!4d67.1012182!16s%2Fg%2F11wxh90mf2',
};

export const HOME_HIGHLIGHTS = [
    {
        title: 'Industrial calibration coverage',
        description:
            'Support for temperature, pressure, flow, precision, electrical, and on-site field calibration programs.',
    },
    {
        title: 'Responsive service workflow',
        description:
            'Browse the live catalog, request pricing through enquiries, and track status updates from the app.',
    },
    {
        title: 'Compliance-led delivery',
        description:
            'Built around documented quality processes and certification-backed service execution.',
    },
];

export const HOME_OVERVIEW = [
    'Caltec Instrument Services delivers installation, servicing, and calibration support for a wide range of industrial instrumentation across Pakistan.',
    'The team works with manufacturing, pharmaceuticals, hospitals, textiles, cement, food processing, dairy, and oil & gas operations that need dependable readings and auditable quality processes.',
];

export const TRUSTED_CLIENT_LOGOS = [
    'https://res.cloudinary.com/dp28flpqp/image/upload/v1736099044/Caltec_Customers/alkaram.png',
    'https://res.cloudinary.com/dp28flpqp/image/upload/v1736099046/Caltec_Customers/archroma.png',
    'https://res.cloudinary.com/dp28flpqp/image/upload/v1736099048/Caltec_Customers/atlas%20autos.png',
    'https://res.cloudinary.com/dp28flpqp/image/upload/v1736099050/Caltec_Customers/brookes.png',
    'https://res.cloudinary.com/dp28flpqp/image/upload/v1736099053/Caltec_Customers/changan.png',
    'https://res.cloudinary.com/dp28flpqp/image/upload/v1736099055/Caltec_Customers/Dalda.png',
    'https://res.cloudinary.com/dp28flpqp/image/upload/v1736099061/Caltec_Customers/Ghani.png',
    'https://res.cloudinary.com/dp28flpqp/image/upload/v1736099065/Caltec_Customers/GSK.png',
    'https://res.cloudinary.com/dp28flpqp/image/upload/v1736099070/Caltec_Customers/herbion.png',
    'https://res.cloudinary.com/dp28flpqp/image/upload/v1736099078/Caltec_Customers/rajby.png',
    'https://res.cloudinary.com/dp28flpqp/image/upload/v1736099081/Caltec_Customers/scilife.png',
];

export const CERTIFICATIONS = [
    {
        id: '45001',
        title: 'ISO 45001:2018',
        badge: ISO45001Badge,
        certificateImage: ISO45001Cert,
        description: 'Occupational health and safety management.',
    },
    {
        id: '9001',
        title: 'ISO 9001:2015',
        badge: ISO9001Badge,
        certificateImage: ISO9001Cert,
        description: 'Quality management system compliance.',
    },
    {
        id: '14001',
        title: 'ISO 14001:2015',
        badge: ISO14001Badge,
        certificateImage: ISO14001Cert,
        description: 'Environmental management system standard.',
    },
];

export const CONTACT_ACTIONS = [
    {
        id: 'founder',
        label: 'Founder and CEO',
        value: 'Shafqat Khan Awan',
        type: 'static',
        icon: 'profile',
    },
    {
        id: 'address',
        label: 'Office address',
        value: CALTEC_OFFICE.address,
        type: 'maps',
        icon: 'location',
    },
    {
        id: 'postal',
        label: 'Postal address',
        value: 'PO Box: 8271',
        type: 'static',
        icon: 'document',
    },
    {
        id: 'fax',
        label: 'Fax',
        value: '021 35167999',
        type: 'phone',
        actionValue: '02135167999',
        icon: 'phone',
    },
    {
        id: 'landline',
        label: 'Landline',
        value: '021 35167530',
        type: 'phone',
        actionValue: '02135167530',
        icon: 'phone',
    },
    {
        id: 'mobile',
        label: 'Mobile',
        value: '+92 333 2283557',
        type: 'phone',
        actionValue: '+923332283557',
        icon: 'phone',
    },
    {
        id: 'whatsapp',
        label: 'WhatsApp',
        value: '300 8213260',
        type: 'whatsapp',
        actionValue: '+923008213260',
        icon: 'phone',
    },
    {
        id: 'email',
        label: 'Email',
        value: 'info@caltec.com.pk',
        type: 'email',
        actionValue: 'info@caltec.com.pk',
        icon: 'mail',
    },
    {
        id: 'website',
        label: 'Website',
        value: 'https://caltec.com.pk',
        type: 'website',
        actionValue: 'https://caltec.com.pk',
        icon: 'global',
    },
];
