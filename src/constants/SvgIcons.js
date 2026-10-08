import { Circle, Ellipse, Path, Svg } from 'react-native-svg';

const DEFAULT_ICON_COLOR = '#212121';
const ACTIVE_ICON_INNER_STROKE = '#F9F9F9';

const getStrokeColor = ({ color, pathStroke } = {}) =>
    pathStroke || color || DEFAULT_ICON_COLOR;

const getSvgFill = (fill) => fill || 'none';

const getInnerStrokeColor = ({
    color,
    fill,
    innerStroke,
    pathStroke,
    secondaryStroke,
} = {}) =>
    innerStroke ||
    secondaryStroke ||
    (fill ? ACTIVE_ICON_INNER_STROKE : getStrokeColor({ color, pathStroke }));

const IconHome = ({ width, height, fill, pathStroke, color }) => {
    const strokeColor = getStrokeColor({ color, pathStroke });
    const fillColor = getSvgFill(fill);

    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox='0 0 24 24'
            fill='none'
        >
            <Path
                d='M9.15722 20.7714V17.7047C9.1572 16.9246 9.79312 16.2908 10.581 16.2856H13.4671C14.2587 16.2856 14.9005 16.9209 14.9005 17.7047V17.7047V20.7809C14.9003 21.4432 15.4343 21.9845 16.103 22H18.0271C19.9451 22 21.5 20.4607 21.5 18.5618V18.5618V9.83784C21.4898 9.09083 21.1355 8.38935 20.538 7.93303L13.9577 2.6853C12.8049 1.77157 11.1662 1.77157 10.0134 2.6853L3.46203 7.94256C2.86226 8.39702 2.50739 9.09967 2.5 9.84736V18.5618C2.5 20.4607 4.05488 22 5.97291 22H7.89696C8.58235 22 9.13797 21.4499 9.13797 20.7714V20.7714'
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </Svg>
    );
};
const IconServices = ({
    width,
    height,
    fill,
    pathStroke,
    color,
    innerStroke,
    secondaryStroke,
}) => {
    const strokeColor = getStrokeColor({ color, pathStroke });
    const innerStrokeColor = getInnerStrokeColor({
        color,
        fill,
        innerStroke,
        pathStroke,
        secondaryStroke,
    });

    return (
        <Svg
            width={width || 41}
            height={height || 33}
            viewBox='0 0 41 33'
            fill={getSvgFill(fill)}
        >
            <Path
                d='M12.7658 12.1522C12.3983 12 11.9324 12 11.0005 12C10.0686 12 9.60265 12 9.23511 12.1522C8.74505 12.3552 8.35571 12.7446 8.15272 13.2346C8.06005 13.4583 8.02379 13.7185 8.0096 14.098C7.98875 14.6557 7.70274 15.1719 7.21943 15.4509C6.73612 15.73 6.14608 15.7195 5.65268 15.4588C5.31693 15.2813 5.07349 15.1826 4.83342 15.151C4.30753 15.0818 3.77567 15.2243 3.35485 15.5472C3.03923 15.7894 2.80626 16.1929 2.34032 16.9999C1.87438 17.807 1.64141 18.2105 1.58948 18.6049C1.52025 19.1308 1.66276 19.6627 1.98566 20.0835C2.13305 20.2756 2.34019 20.437 2.66167 20.639C3.13429 20.936 3.43838 21.4419 3.43835 22C3.43832 22.5581 3.13424 23.0639 2.66167 23.3608C2.34013 23.5629 2.13297 23.7244 1.98557 23.9165C1.66266 24.3373 1.52015 24.8691 1.58938 25.395C1.64131 25.7894 1.87428 26.193 2.34022 27C2.80616 27.807 3.03913 28.2106 3.35475 28.4527C3.77557 28.7756 4.30743 28.9181 4.83333 28.8489C5.07338 28.8173 5.31681 28.7186 5.65253 28.5412C6.14596 28.2804 6.73605 28.27 7.21939 28.549C7.70273 28.8281 7.98874 29.3443 8.0096 29.9021C8.0238 30.2815 8.06006 30.5417 8.15272 30.7654C8.35571 31.2554 8.74505 31.6448 9.23511 31.8478C9.60265 32 10.0686 32 11.0005 32C11.9324 32 12.3983 32 12.7658 31.8478C13.2559 31.6448 13.6452 31.2554 13.8482 30.7654C13.9409 30.5417 13.9772 30.2815 13.9914 29.902C14.0122 29.3443 14.2982 28.8281 14.7815 28.549C15.2648 28.2699 15.8549 28.2804 16.3484 28.5412C16.6841 28.7186 16.9275 28.8172 17.1675 28.8488C17.6934 28.9181 18.2253 28.7756 18.6461 28.4527C18.9617 28.2105 19.1947 27.807 19.6606 26.9999C20.1266 26.1929 20.3595 25.7894 20.4115 25.395C20.4807 24.8691 20.3382 24.3372 20.0153 23.9164C19.8679 23.7243 19.6607 23.5628 19.3392 23.3608C18.8666 23.0639 18.5626 22.558 18.5626 21.9999C18.5626 21.4418 18.8667 20.9361 19.3392 20.6392C19.6608 20.4371 19.868 20.2757 20.0154 20.0835C20.3383 19.6627 20.4808 19.1309 20.4116 18.605C20.3596 18.2106 20.1267 17.807 19.6607 17C19.1948 16.193 18.9618 15.7894 18.6462 15.5473C18.2254 15.2244 17.6935 15.0818 17.1676 15.1511C16.9276 15.1827 16.6841 15.2814 16.3484 15.4588C15.855 15.7196 15.2649 15.73 14.7816 15.451C14.2982 15.1719 14.0122 14.6557 13.9914 14.0979C13.9772 13.7185 13.9409 13.4583 13.8482 13.2346C13.6452 12.7446 13.2559 12.3552 12.7658 12.1522Z'
                stroke={strokeColor}
                strokeWidth={1.5}
            />
            <Circle
                cx={11}
                cy={22}
                r={3}
                stroke={innerStrokeColor}
                strokeWidth={1.5}
            />
            <Path
                d='M39.8478 12.1936C40 11.826 40 11.3601 40 10.4282C40 9.49633 40 9.03039 39.8478 8.66284C39.6448 8.17279 39.2554 7.78344 38.7654 7.58045C38.5417 7.48779 38.2815 7.45153 37.902 7.43734C37.3443 7.41648 36.8281 7.13048 36.5491 6.64717C36.27 6.16386 36.2805 5.57381 36.5412 5.08042C36.7187 4.74467 36.8174 4.50123 36.849 4.26116C36.9182 3.73526 36.7757 3.2034 36.4528 2.78258C36.2106 2.46697 35.8071 2.234 35.0001 1.76805C34.193 1.30211 33.7895 1.06914 33.3951 1.01722C32.8692 0.947981 32.3373 1.09049 31.9165 1.4134C31.7244 1.56079 31.563 1.76793 31.361 2.08941C31.064 2.56202 30.5581 2.86611 30 2.86608C29.4419 2.86605 28.9361 2.56197 28.6392 2.08941C28.4371 1.76787 28.2756 1.5607 28.0835 1.4133C27.6627 1.09039 27.1309 0.947883 26.605 1.01712C26.2106 1.06904 25.807 1.30202 25 1.76796C24.193 2.2339 23.7894 2.46687 23.5473 2.78248C23.2244 3.20331 23.0819 3.73517 23.1511 4.26106C23.1827 4.50112 23.2814 4.74454 23.4588 5.08026C23.7196 5.57369 23.73 6.16378 23.451 6.64712C23.1719 7.13046 22.6557 7.41648 22.0979 7.43734C21.7185 7.45153 21.4583 7.48779 21.2346 7.58045C20.7446 7.78344 20.3552 8.17279 20.1522 8.66284C20 9.03039 20 9.49633 20 10.4282C20 11.3601 20 11.826 20.1522 12.1936C20.3552 12.6836 20.7446 13.073 21.2346 13.276C21.4583 13.3686 21.7185 13.4049 22.098 13.4191C22.6557 13.4399 23.1719 13.7259 23.451 14.2092C23.7301 14.6925 23.7196 15.2826 23.4588 15.7761C23.2814 16.1118 23.1828 16.3552 23.1512 16.5953C23.0819 17.1212 23.2244 17.653 23.5473 18.0738C23.7895 18.3895 24.193 18.6224 25.0001 19.0884C25.8071 19.5543 26.2106 19.7873 26.605 19.8392C27.1309 19.9084 27.6628 19.7659 28.0836 19.443C28.2757 19.2956 28.4372 19.0885 28.6392 18.767C28.9361 18.2944 29.442 17.9903 30.0001 17.9903C30.5582 17.9904 31.0639 18.2944 31.3608 18.767C31.5629 19.0885 31.7243 19.2957 31.9165 19.4431C32.3373 19.766 32.8691 19.9085 33.395 19.8393C33.7894 19.7874 34.193 19.5544 35 19.0885C35.807 18.6225 36.2106 18.3896 36.4527 18.0739C36.7756 17.6531 36.9182 17.1213 36.8489 16.5954C36.8173 16.3553 36.7186 16.1119 36.5412 15.7762C36.2804 15.2827 36.27 14.6926 36.549 14.2093C36.8281 13.726 37.3443 13.4399 37.9021 13.4191C38.2815 13.4049 38.5417 13.3686 38.7654 13.276C39.2554 13.073 39.6448 12.6836 39.8478 12.1936Z'
                stroke={strokeColor}
                strokeWidth={1.5}
            />
            <Circle
                cx={30.4277}
                cy={10}
                r={3}
                stroke={innerStrokeColor}
                strokeWidth={1.5}
            />
        </Svg>
    );
};

const IconEnquiry = ({
    width,
    height,
    fill,
    pathStroke,
    color,
    innerStroke,
    secondaryStroke,
}) => {
    const strokeColor = getStrokeColor({ color, pathStroke });
    const innerStrokeColor = getInnerStrokeColor({
        color,
        fill,
        innerStroke,
        pathStroke,
        secondaryStroke,
    });

    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox='0 0 24 24'
            fill={getSvgFill(fill)}
        >
            <Path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M14.7377 2.76175H8.08468C6.00468 2.75375 4.29968 4.41175 4.25068 6.49075V17.2037C4.20468 19.3167 5.87968 21.0677 7.99268 21.1147C8.02368 21.1147 8.05368 21.1157 8.08468 21.1147H16.0737C18.1677 21.0297 19.8177 19.2997 19.8027 17.2037V8.03775L14.7377 2.76175Z'
                stroke={strokeColor}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <Path
                d='M14.4751 2.75V5.659C14.4751 7.079 15.6231 8.23 17.0431 8.234H19.7981'
                stroke={innerStrokeColor}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <Path
                d='M14.2879 15.3585H8.88794'
                stroke={innerStrokeColor}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <Path
                d='M12.243 11.606H8.88696'
                stroke={innerStrokeColor}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </Svg>
    );
};

const IconProfile = ({ width, height, fill, pathStroke, color }) => {
    const strokeColor = getStrokeColor({ color, pathStroke });
    const fillColor = getSvgFill(fill);

    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox='0 0 24 24'
            fill='none'
        >
            <Path
                clipRule='evenodd'
                d='M11.985 15.346c-3.868 0-7.17.585-7.17 2.927s3.281 2.948 7.17 2.948c3.867 0 7.17-.586 7.17-2.927s-3.282-2.948-7.17-2.948'
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <Path
                clipRule='evenodd'
                d='M11.985 12.006A4.596 4.596 0 1 0 7.388 7.41a4.58 4.58 0 0 0 4.564 4.596z'
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={1.429}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </Svg>
    );
};

const IconArrowRight = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox='0 0 24 24'
            fill='none'
        >
            <Path
                d='m8.5 5 7 7-7 7'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </Svg>
    );
};

const IconMail = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox={`0 0 24 24`}
            fill='none'
        >
            <Path
                d='m17.903 8.851-4.444 3.613c-.84.666-2.02.666-2.86 0L6.12 8.851'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <Path
                clipRule='evenodd'
                d='M16.909 21C19.95 21.008 22 18.51 22 15.438V8.57C22 5.499 19.95 3 16.909 3H7.09C4.05 3 2 5.499 2 8.57v6.868C2 18.51 4.05 21.008 7.091 21z'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </Svg>
    );
};

const IconLock = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox={`0 0 24 24`}
            fill='none'
        >
            <Path
                d='M16.424 9.448V7.3a4.55 4.55 0 0 0-4.551-4.551 4.55 4.55 0 0 0-4.57 4.53v2.168'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <Path
                clipRule='evenodd'
                d='M15.683 21.25h-7.64a3.79 3.79 0 0 1-3.793-3.792v-4.29a3.79 3.79 0 0 1 3.792-3.791h7.641a3.79 3.79 0 0 1 3.792 3.792v4.289a3.79 3.79 0 0 1-3.792 3.792'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <Path
                d='M11.863 14.203v2.22'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </Svg>
    );
};

const IconShow = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox={`0 0 24 24`}
            fill='none'
        >
            <Path
                clipRule='evenodd'
                d='M15.161 12.053a3.162 3.162 0 1 1-6.323-.001 3.162 3.162 0 0 1 6.323.001'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <Path
                clipRule='evenodd'
                d='M11.998 19.355c3.808 0 7.291-2.738 9.252-7.302-1.961-4.564-5.444-7.302-9.252-7.302h.004c-3.808 0-7.291 2.738-9.252 7.302 1.961 4.564 5.444 7.302 9.252 7.302z'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </Svg>
    );
};

const IconHide = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox={`0 0 24 24`}
            fill='none'
        >
            <Path
                d='M9.76 14.367a3.12 3.12 0 0 1-.925-2.23A3.16 3.16 0 0 1 12 8.973c.867 0 1.665.35 2.23.925m.875 2.801a3.16 3.16 0 0 1-2.537 2.542'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <Path
                d='M6.655 17.472c-1.587-1.246-2.931-3.066-3.905-5.335.984-2.279 2.337-4.109 3.934-5.365C8.27 5.516 10.1 4.834 11.999 4.834c1.91 0 3.74.692 5.336 1.957m2.113 2.199a15.4 15.4 0 0 1 1.802 3.147c-1.968 4.557-5.443 7.302-9.25 7.302a8 8 0 0 1-2.532-.413M19.887 4.25 4.113 20.024'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </Svg>
    );
};

const IconPhone = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox={`0 0 24 24`}
            fill='none'
        >
            <Path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M6.007 3.407c1.68-1.68 4.516-1.552 5.686.544l.649 1.163c.763 1.368.438 3.095-.68 4.227a.63.63 0 0 0-.104.337c-.013.256.078.849.997 1.767.918.918 1.51 1.01 1.767.997a.63.63 0 0 0 .337-.104c1.131-1.118 2.859-1.443 4.227-.68l1.163.65c2.096 1.17 2.224 4.004.544 5.685-.899.898-2.093 1.697-3.498 1.75-2.08.079-5.536-.459-8.958-3.88-3.421-3.422-3.959-6.877-3.88-8.958.053-1.405.852-2.6 1.75-3.498m4.376 1.275c-.6-1.074-2.21-1.32-3.315-.214-.775.775-1.28 1.63-1.312 2.493-.066 1.736.363 4.762 3.442 7.84 3.08 3.08 6.105 3.509 7.84 3.443.863-.033 1.72-.537 2.494-1.312 1.106-1.106.86-2.716-.214-3.315l-1.163-.649c-.723-.403-1.74-.266-2.453.448-.07.07-.516.486-1.307.524-.81.04-1.791-.324-2.9-1.434-1.111-1.11-1.475-2.091-1.435-2.902.038-.791.455-1.237.524-1.307.714-.713.851-1.729.448-2.452z'
                fill={pathStroke || '#212121'}
            />
        </Svg>
    );
};

const IconDelete = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox={`0 0 24 24`}
            fill='none'
        >
            <Path
                d='M19.325 9.468s-.543 6.735-.858 9.572c-.15 1.355-.987 2.15-2.358 2.174-2.609.047-5.221.05-7.829-.005-1.319-.027-2.142-.83-2.289-2.162-.317-2.862-.857-9.579-.857-9.579M20.708 6.24H3.75m13.69 0a1.65 1.65 0 0 1-1.614-1.324L15.583 3.7a1.28 1.28 0 0 0-1.237-.95h-4.233a1.28 1.28 0 0 0-1.237.95l-.243 1.216A1.65 1.65 0 0 1 7.018 6.24'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </Svg>
    );
};

const IconEdit = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox={`0 0 24 24`}
            fill='none'
        >
            <Path
                d='M11.492 2.789H7.753c-3.075 0-5.003 2.177-5.003 5.259v8.314c0 3.082 1.92 5.259 5.003 5.259h8.824c3.085 0 5.004-2.177 5.004-5.26v-4.027'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <Path
                clipRule='evenodd'
                d='M8.828 10.92 16.3 3.449c.93-.93 2.44-.93 3.37 0l1.218 1.217a2.383 2.383 0 0 1 0 3.37l-7.51 7.51a2.17 2.17 0 0 1-1.534.636H8.099l.094-3.78a2.17 2.17 0 0 1 .635-1.48'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <Path
                d='m15.165 4.602 4.566 4.566'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </Svg>
    );
};

const IconLocation = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox={`0 0 24 24`}
            fill='none'
        >
            <Path
                clipRule='evenodd'
                d='M14.5 10.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <Path
                clipRule='evenodd'
                d='M12 21c-1.199 0-7.5-5.102-7.5-10.437C4.5 6.387 7.857 3 12 3s7.5 3.387 7.5 7.563C19.5 15.898 13.198 21 12 21'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </Svg>
    );
};

const IconSearch = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox={`0 0 24 24`}
            fill='none'
        >
            <Circle
                cx={11.767}
                cy={11.767}
                r={8.989}
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <Path
                d='M18.018 18.485 21.542 22'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </Svg>
    );
};

const IconSolarArrowLeft = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox='0 0 24 24'
            fill={fill || 'none'}
        >
            <Path
                d='M20 12H4M4 12L10 6M4 12L10 18'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </Svg>
    );
};

const IconSolarLetter = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox='0 0 24 24'
            fill={fill || 'none'}
        >
            <Path
                d='M2 12C2 8.2288 2 6.3431 3.1716 5.1716C4.3431 4 6.2288 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.1716C22 6.3431 22 8.2288 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.2288 20 4.3431 20 3.1716 18.8284C2 17.6569 2 15.7712 2 12Z'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
            />
            <Path
                d='M6 8L8.1589 9.7991C9.9955 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.7991L18 8'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
            />
        </Svg>
    );
};

const IconSolarLockPassword = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox='0 0 24 24'
            fill={fill || 'none'}
        >
            <Path
                d='M2 16C2 13.1716 2 11.7574 2.8787 10.8787C3.7574 10 5.1716 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.1716 22 3.7574 22 2.8787 21.1213C2 20.2426 2 18.8284 2 16Z'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
            />
            <Path
                d='M6 10V8C6 4.6863 8.6863 2 12 2C15.3137 2 18 4.6863 18 8V10'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
            />
            <Path
                d='M8 16H8.009M11.991 16H12M15.991 16H16'
                stroke={pathStroke || '#212121'}
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </Svg>
    );
};

const IconSolarEye = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox='0 0 24 24'
            fill={fill || 'none'}
        >
            <Path
                d='M3.2749 15.2957C2.425 14.1915 2 13.6394 2 12C2 10.3606 2.425 9.8085 3.2749 8.7043C4.972 6.4996 7.8181 4 12 4C16.1819 4 19.028 6.4996 20.7251 8.7043C21.575 9.8085 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.8181 20 4.972 17.5004 3.2749 15.2957Z'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
            />
            <Path
                d='M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
            />
        </Svg>
    );
};

const IconSolarEyeClosed = ({ width, height, fill, pathStroke }) => {
    const iconColor = pathStroke || '#212121';

    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox='0 0 24 24'
            fill={fill || 'none'}
        >
            <Path
                d='M2.6894 6.7046C2.5262 6.3238 2.0853 6.1475 1.7046 6.3106C1.3238 6.4738 1.1475 6.9147 1.3106 7.2954L2.6894 6.7046ZM15.5872 13.3287L15.3125 12.6308L15.5872 13.3287ZM9.0414 13.7377C9.2674 13.3906 9.169 12.926 8.8219 12.7001C8.4747 12.4742 8.0101 12.5725 7.7842 12.9197L9.0414 13.7377ZM6.3714 15.091C6.1454 15.4381 6.2438 15.9027 6.591 16.1286C6.9381 16.3545 7.4027 16.2562 7.6286 15.909L6.3714 15.091ZM22.6894 7.2954C22.8525 6.9147 22.6762 6.4738 22.2954 6.3106C21.9147 6.1475 21.4738 6.3238 21.3106 6.7046L22.6894 7.2954ZM19 11.1288L18.4867 10.582L19 11.1288ZM19.9697 13.1592C20.2626 13.4521 20.7374 13.4521 21.0303 13.1592C21.3232 12.8663 21.3232 12.3914 21.0303 12.0985L19.9697 13.1592ZM11.25 16.5C11.25 16.9142 11.5858 17.25 12 17.25C12.4142 17.25 12.75 16.9142 12.75 16.5H11.25ZM16.3714 15.909C16.5973 16.2562 17.0619 16.3545 17.409 16.1286C17.7562 15.9027 17.8545 15.4381 17.6286 15.091L16.3714 15.909ZM5.5303 11.6592C5.8232 11.3663 5.8232 10.8914 5.5303 10.5985C5.2374 10.3056 4.7626 10.3056 4.4697 10.5985L5.5303 11.6592ZM2.9697 12.0985C2.6768 12.3914 2.6768 12.8663 2.9697 13.1592C3.2626 13.4521 3.7374 13.4521 4.0303 13.1592L2.9697 12.0985ZM12 13.25C8.7761 13.25 6.4613 11.6446 4.9246 9.9897C4.1564 9.1624 3.5932 8.3328 3.2226 7.7101C3.0377 7.3995 2.9019 7.1423 2.8134 6.9654C2.7692 6.877 2.7369 6.8088 2.7163 6.7641C2.706 6.7418 2.6986 6.7254 2.6941 6.7153C2.6919 6.7103 2.6904 6.7068 2.6896 6.705C2.6892 6.7041 2.689 6.7036 2.6889 6.7035C2.6889 6.7035 2.6889 6.7036 2.689 6.7037C2.689 6.7038 2.6891 6.704 2.6892 6.7041C2.6892 6.7043 2.6894 6.7046 2 7C1.3106 7.2954 1.3108 7.2958 1.3109 7.2961C1.311 7.2962 1.3111 7.2966 1.3113 7.2969C1.3115 7.2975 1.3118 7.2982 1.3122 7.299C1.3129 7.3006 1.3138 7.3027 1.3148 7.3051C1.317 7.31 1.3199 7.3166 1.3235 7.3248C1.3308 7.3413 1.3411 7.3641 1.3545 7.3931C1.3813 7.451 1.4203 7.5332 1.4718 7.6362C1.5747 7.8421 1.7279 8.1318 1.9337 8.4774C2.3442 9.1672 2.9686 10.0876 3.8254 11.0103C5.5387 12.8554 8.2239 14.75 12 14.75V13.25ZM15.3125 12.6308C14.3421 13.0128 13.2417 13.25 12 13.25V14.75C13.4382 14.75 14.7246 14.4742 15.8619 14.0266L15.3125 12.6308ZM7.7842 12.9197L6.3714 15.091L7.6286 15.909L9.0414 13.7377L7.7842 12.9197ZM22 7C21.3106 6.7046 21.3107 6.7044 21.3108 6.7043C21.3108 6.7042 21.3108 6.7041 21.3109 6.704C21.3109 6.7039 21.311 6.7038 21.311 6.7037C21.3111 6.7035 21.3111 6.7035 21.3111 6.7036C21.311 6.7038 21.3107 6.7045 21.3101 6.7058C21.309 6.7082 21.307 6.7128 21.3041 6.7192C21.2983 6.7322 21.2889 6.7531 21.2758 6.7812C21.2495 6.8376 21.2086 6.923 21.1526 7.0327C21.0406 7.2523 20.869 7.5683 20.6354 7.9432C20.1669 8.6952 19.4563 9.672 18.4867 10.582L19.5133 11.6757C20.6023 10.6535 21.3917 9.5659 21.9085 8.7365C22.1676 8.3207 22.36 7.9668 22.4889 7.7142C22.5533 7.5878 22.602 7.4864 22.6353 7.4151C22.6519 7.3794 22.6647 7.3512 22.6737 7.331C22.6782 7.321 22.6818 7.3129 22.6844 7.307C22.6857 7.304 22.6867 7.3015 22.6876 7.2996C22.688 7.2986 22.6883 7.2978 22.6886 7.2971C22.6888 7.2968 22.6889 7.2965 22.689 7.2962C22.6891 7.296 22.6892 7.2958 22.6892 7.2958C22.6893 7.2956 22.6894 7.2954 22 7ZM18.4867 10.582C17.6277 11.3882 16.5739 12.1343 15.3125 12.6308L15.8619 14.0266C17.3355 13.4466 18.5466 12.583 19.5133 11.6757L18.4867 10.582ZM18.4697 11.6592L19.9697 13.1592L21.0303 12.0985L19.5303 10.5985L18.4697 11.6592ZM11.25 14V16.5H12.75V14H11.25ZM14.9586 13.7377L16.3714 15.909L17.6286 15.091L16.2158 12.9197L14.9586 13.7377ZM4.4697 10.5985L2.9697 12.0985L4.0303 13.1592L5.5303 11.6592L4.4697 10.5985Z'
                fill={iconColor}
            />
        </Svg>
    );
};

const IconSolarUserRounded = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox='0 0 24 24'
            fill={fill || 'none'}
        >
            <Circle
                cx={12}
                cy={6}
                r={4}
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
            />
            <Ellipse
                cx={12}
                cy={17}
                rx={7}
                ry={4}
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
            />
        </Svg>
    );
};

const IconSolarShieldCheck = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox='0 0 24 24'
            fill={fill || 'none'}
        >
            <Path
                d='M3 10.4167C3 7.2191 3 5.6203 3.3775 5.0824C3.755 4.5445 5.2583 4.03 8.2649 3.0008L8.8377 2.8047C10.405 2.2682 11.1886 2 12 2C12.8114 2 13.595 2.2682 15.1623 2.8047L15.7351 3.0008C18.7417 4.03 20.245 4.5445 20.6225 5.0824C21 5.6203 21 7.2191 21 10.4167V11.9914C21 17.6294 16.761 20.3655 14.1014 21.5273C13.38 21.8424 13.0193 22 12 22C10.9807 22 10.62 21.8424 9.8986 21.5273C7.239 20.3655 3 17.6294 3 11.9914V10.4167Z'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
            />
            <Path
                d='M9.5 12.4L10.9286 14L14.5 10'
                stroke={pathStroke || '#212121'}
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </Svg>
    );
};

const IconSolarBellOff = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M18.7491 9.70957V9.00497C18.7491 5.13623 15.7274 2 12 2C8.27256 2 5.25087 5.13623 5.25087 9.00497V9.70957C5.25087 10.5552 5.00972 11.3818 4.5578 12.0854L3.45036 13.8095C2.43882 15.3843 3.21105 17.5249 4.97036 18.0229C9.57274 19.3257 14.4273 19.3257 19.0296 18.0229C20.789 17.5249 21.5612 15.3843 20.5496 13.8095L19.4422 12.0854C18.9903 11.3818 18.7491 10.5552 18.7491 9.70957Z' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M10 9H14L10 13H14' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' />
        <Path d='M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
    </Svg>
);

const IconSolarMoon = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M21.0672 11.8568L20.4253 11.469L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085L11.7553 2.29085L12.1432 2.93276ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM12 2.75C11.9115 2.75 11.8077 2.71008 11.7324 2.63168C11.6686 2.56527 11.6538 2.50244 11.6503 2.47703C11.6461 2.44587 11.6482 2.35557 11.7553 2.29085L12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25V2.75ZM21.7091 12.2447C21.6444 12.3518 21.5541 12.3539 21.523 12.3497C21.4976 12.3462 21.4347 12.3314 21.3683 12.2676C21.2899 12.1923 21.25 12.0885 21.25 12H22.75C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469L21.7091 12.2447Z' fill={pathStroke || '#212121'} />
    </Svg>
);

const IconSolarQuestionCircle = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Circle cx={12} cy={12} r={10} stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M10.125 8.875C10.125 7.83947 10.9645 7 12 7C13.0355 7 13.875 7.83947 13.875 8.875C13.875 9.56245 13.505 10.1635 12.9534 10.4899C12.478 10.7711 12 11.1977 12 11.75V13' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
        <Circle cx={12} cy={16} r={1} fill={pathStroke || '#212121'} />
    </Svg>
);

const IconSolarDocumentText = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M8 12H16' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
        <Path d='M8 8H16' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
        <Path d='M8 16H13' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
    </Svg>
);

const IconSolarGlobal = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M22 12C22 13.3132 21.7413 14.6136 21.2388 15.8268C20.7362 17.0401 19.9997 18.1425 19.0711 19.0711C18.1425 19.9997 17.0401 20.7362 15.8268 21.2388C14.6136 21.7413 13.3132 22 12 22C10.6868 22 9.38642 21.7413 8.17317 21.2388C6.95991 20.7362 5.85752 19.9997 4.92893 19.0711C4.00035 18.1425 3.26375 17.0401 2.7612 15.8268C2.25866 14.6136 2 13.3132 2 12C2 10.6868 2.25866 9.38642 2.76121 8.17316C3.26375 6.95991 4.00035 5.85752 4.92893 4.92893C5.85752 4.00035 6.95991 3.26375 8.17317 2.7612C9.38642 2.25866 10.6868 2 12 2C13.3132 2 14.6136 2.25866 15.8268 2.76121C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12L22 12Z' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M16 12C16 13.3132 15.8965 14.6136 15.6955 15.8268C15.4945 17.0401 15.1999 18.1425 14.8284 19.0711C14.457 19.9997 14.016 20.7362 13.5307 21.2388C13.0454 21.7413 12.5253 22 12 22C11.4747 22 10.9546 21.7413 10.4693 21.2388C9.98396 20.7362 9.54301 19.9997 9.17157 19.0711C8.80014 18.1425 8.5055 17.0401 8.30448 15.8268C8.10346 14.6136 8 13.3132 8 12C8 10.6868 8.10346 9.38642 8.30448 8.17316C8.5055 6.95991 8.80014 5.85752 9.17157 4.92893C9.54301 4.00035 9.98396 3.26375 10.4693 2.7612C10.9546 2.25866 11.4747 2 12 2C12.5253 2 13.0454 2.25866 13.5307 2.76121C14.016 3.26375 14.457 4.00035 14.8284 4.92893C15.1999 5.85752 15.4945 6.95991 15.6955 8.17317C15.8965 9.38642 16 10.6868 16 12L16 12Z' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M2 12H22' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
    </Svg>
);

const IconSolarSmartphone = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M7 6C7 4.11438 7 3.17157 7.58579 2.58579C8.17157 2 9.11438 2 11 2H13C14.8856 2 15.8284 2 16.4142 2.58579C17 3.17157 17 4.11438 17 6V18C17 19.8856 17 20.8284 16.4142 21.4142C15.8284 22 14.8856 22 13 22H11C9.11438 22 8.17157 22 7.58579 21.4142C7 20.8284 7 19.8856 7 18V6Z' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M11 5H13' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
        <Path d='M11 19H13' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
    </Svg>
);

const IconSolarFax = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M7 9V5C7 3.586 7 2.879 7.439 2.439C7.879 2 8.586 2 10 2H14C15.414 2 16.121 2 16.561 2.439C17 2.879 17 3.586 17 5V9' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M7 18C5.114 18 4.172 18 3.586 17.414C3 16.828 3 15.886 3 14V13C3 11.114 3 10.172 3.586 9.586C4.172 9 5.114 9 7 9H17C18.886 9 19.828 9 20.414 9.586C21 10.172 21 11.114 21 13V14C21 15.886 21 16.828 20.414 17.414C19.828 18 18.886 18 17 18' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M8 16C8 14.586 8 13.879 8.439 13.439C8.879 13 9.586 13 11 13H13C14.414 13 15.121 13 15.561 13.439C16 13.879 16 14.586 16 16V18C16 19.886 16 20.828 15.414 21.414C14.828 22 13.886 22 12 22C10.114 22 9.172 22 8.586 21.414C8 20.828 8 19.886 8 18V16Z' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M17.5 13H18' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
    </Svg>
);

const IconSolarChatRound = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M20 11.5C20 15.6421 16.4183 19 12 19C10.9565 19 9.95965 18.8127 9.04556 18.4718C8.71729 18.3494 8.55316 18.2882 8.42152 18.2743C8.28987 18.2604 8.14164 18.2939 7.84518 18.361L4.5 19.1182C4.07334 19.2148 3.85999 19.2631 3.73192 19.135C3.60385 19.0069 3.65216 18.7936 3.74879 18.3669L4.50598 15.0218C4.57309 14.7253 4.60664 14.5771 4.59272 14.4454C4.5788 14.3138 4.5176 14.1497 4.39521 13.8214C4.05427 12.9073 3.86699 11.9565 4.00009 10.913C4.47485 7.1901 7.82932 4 12 4C16.4183 4 20 7.35786 20 11.5Z' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinejoin='round' />
        <Path d='M8.5 11.5H8.51M12 11.5H12.01M15.5 11.5H15.51' stroke={pathStroke || '#212121'} strokeWidth={2} strokeLinecap='round' />
    </Svg>
);

const IconSolarMailbox = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M4 11C4 7.68629 6.68629 5 10 5H14C17.3137 5 20 7.68629 20 11V16C20 17.8856 20 18.8284 19.4142 19.4142C18.8284 20 17.8856 20 16 20H8C6.11438 20 5.17157 20 4.58579 19.4142C4 18.8284 4 17.8856 4 16V11Z' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M4 11H10C11.8856 11 12.8284 11 13.4142 11.5858C14 12.1716 14 13.1144 14 15V20' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M8 8H12' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
    </Svg>
);

const IconSolarLogout = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
        <Path d='M10 12H20M20 12L17 9M20 12L17 15' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' />
    </Svg>
);

const IconSolarCamera = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Circle cx={12} cy={13} r={3} stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M9.77778 21H14.2222C17.3433 21 18.9038 21 20.0248 20.2646C20.51 19.9462 20.9267 19.5371 21.251 19.0607C22 17.9601 22 16.4279 22 13.3636C22 10.2994 22 8.76721 21.251 7.6666C20.9267 7.19014 20.51 6.78104 20.0248 6.46268C19.3044 5.99013 18.4027 5.82123 17.022 5.76086C16.3631 5.76086 15.7959 5.27068 15.6667 4.63636C15.4728 3.68489 14.6219 3 13.6337 3H10.3663C9.37805 3 8.52715 3.68489 8.33333 4.63636C8.20412 5.27068 7.63685 5.76086 6.978 5.76086C5.59733 5.82123 4.69555 5.99013 3.97524 6.46268C3.48995 6.78104 3.07328 7.19014 2.74902 7.6666C2 8.76721 2 10.2994 2 13.3636C2 16.4279 2 17.9601 2.74902 19.0607C3.07328 19.5371 3.48995 19.9462 3.97524 20.2646C5.09624 21 6.65675 21 9.77778 21Z' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M19 10H18' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
    </Svg>
);

const IconSolarArrowLeftAlt = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M15 5L9 12L15 19' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' />
    </Svg>
);

const IconSolarArrowRightAlt = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M9 5L15 12L9 19' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' />
    </Svg>
);

const IconSolarChevronDown = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M19 9L12 15L5 9' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' />
    </Svg>
);

const IconSolarUsersGroupRounded = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Circle cx={9} cy={6} r={4} stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M15 9C16.6569 9 18 7.65685 18 6C18 4.34315 16.6569 3 15 3' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
        <Ellipse cx={9} cy={17} rx={7} ry={4} stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M18 14C19.7542 14.3847 21 15.3589 21 16.5C21 17.5293 19.9863 18.4229 18.5 18.8704' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
    </Svg>
);

const IconSolarBuildings = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M22 22L2 22' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
        <Path d='M17 22V6C17 4.11438 17 3.17157 16.4142 2.58579C15.8284 2 14.8856 2 13 2H11C9.11438 2 8.17157 2 7.58579 2.58579C7 3.17157 7 4.11438 7 6V22' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M21 22V11.5C21 10.0955 21 9.39331 20.6629 8.88886C20.517 8.67048 20.3295 8.48298 20.1111 8.33706C19.6067 8 18.9045 8 17.5 8' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M3 22V11.5C3 10.0955 3 9.39331 3.33706 8.88886C3.48298 8.67048 3.67048 8.48298 3.88886 8.33706C4.39331 8 5.09554 8 6.5 8' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M12 22V19' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
        <Path d='M10 5H14' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
        <Path d='M10 8H14' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
        <Path d='M10 11H14' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
        <Path d='M10 14H14' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
    </Svg>
);

const IconSolarBolt = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M13.4 2.5L4.9 13.2C4.3 14 4.8 15.2 5.8 15.2H11L10.6 21.5L19.1 10.8C19.7 10 19.2 8.8 18.2 8.8H13L13.4 2.5Z' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' />
    </Svg>
);

const IconSolarWaterdrop = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M12 22C15.866 22 19 18.936 19 15.156C19 12.321 16.81 9.308 14.917 7.186C13.48 5.576 12.762 4.771 12 4.771C11.238 4.771 10.52 5.576 9.083 7.186C7.19 9.308 5 12.321 5 15.156C5 18.936 8.134 22 12 22Z' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M9.5 15.5C9.75 16.95 10.75 18 12 18' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
        <Path d='M18.5 3L21 5.5M21 3L18.5 5.5' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
    </Svg>
);

const IconSolarWidget = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M3 7C3 5.114 3 4.172 3.586 3.586C4.172 3 5.114 3 7 3C8.886 3 9.828 3 10.414 3.586C11 4.172 11 5.114 11 7C11 8.886 11 9.828 10.414 10.414C9.828 11 8.886 11 7 11C5.114 11 4.172 11 3.586 10.414C3 9.828 3 8.886 3 7Z' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M13 17C13 15.114 13 14.172 13.586 13.586C14.172 13 15.114 13 17 13C18.886 13 19.828 13 20.414 13.586C21 14.172 21 15.114 21 17C21 18.886 21 19.828 20.414 20.414C19.828 21 18.886 21 17 21C15.114 21 14.172 21 13.586 20.414C13 19.828 13 18.886 13 17Z' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M13 6H21M13 10H21M3 14H11M3 18H11' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
    </Svg>
);

const IconSolarRuler = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M3.879 14.879L14.879 3.879C16.05 2.707 16.95 2.707 18.121 3.879L20.121 5.879C21.293 7.05 21.293 7.95 20.121 9.121L9.121 20.121C7.95 21.293 7.05 21.293 5.879 20.121L3.879 18.121C2.707 16.95 2.707 16.05 3.879 14.879Z' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M7 15L9 17M10 12L12 14M13 9L15 11M16 6L18 8' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
    </Svg>
);

const IconSolarGauge = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M4 14C4 9.582 7.582 6 12 6C16.418 6 20 9.582 20 14C20 15.717 19.459 17.308 18.538 18.611C18.163 19.142 17.492 19.333 16.857 19.193C13.655 18.488 10.345 18.488 7.143 19.193C6.508 19.333 5.837 19.142 5.462 18.611C4.541 17.308 4 15.717 4 14Z' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M12 14L15.5 10.5M7.5 14H8.5M15.5 14H16.5M12 9V10' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
    </Svg>
);

const IconSolarThermometer = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M10 14.536V5.5C10 3.567 11.567 2 13.5 2C15.433 2 17 3.567 17 5.5V14.536C18.215 15.45 19 16.904 19 18.542C19 21.28 16.538 23.369 13.846 22.93C11.902 22.612 10.302 21.012 9.984 19.068C9.688 17.252 10.453 15.595 11.762 14.612' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
        <Path d='M13.5 6V18M17 6H20M17 10H19' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
        <Path d='M5 7H8M4 11H8M5 15H8' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
    </Svg>
);

const IconSolarMapPointWave = ({ width, height, fill, pathStroke }) => (
    <Svg width={width || 24} height={height || 24} viewBox='0 0 24 24' fill={fill || 'none'}>
        <Path d='M12 22C10.8 22 5 17.5 5 11.5C5 7.634 8.134 4.5 12 4.5C15.866 4.5 19 7.634 19 11.5C19 17.5 13.2 22 12 22Z' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M14.5 11.5C14.5 12.881 13.381 14 12 14C10.619 14 9.5 12.881 9.5 11.5C9.5 10.119 10.619 9 12 9C13.381 9 14.5 10.119 14.5 11.5Z' stroke={pathStroke || '#212121'} strokeWidth={1.5} />
        <Path d='M3 5C4.2 3.4 5.8 2.2 7.8 1.5M21 5C19.8 3.4 18.2 2.2 16.2 1.5' stroke={pathStroke || '#212121'} strokeWidth={1.5} strokeLinecap='round' />
    </Svg>
);

export {
    IconHome,
    IconServices,
    IconEnquiry,
    IconProfile,
    IconSearch,
    IconArrowRight,
    IconMail,
    IconLock,
    IconShow,
    IconHide,
    IconPhone,
    IconDelete,
    IconEdit,
    IconLocation,
    IconSolarArrowLeft,
    IconSolarLetter,
    IconSolarLockPassword,
    IconSolarEye,
    IconSolarEyeClosed,
    IconSolarUserRounded,
    IconSolarShieldCheck,
    IconSolarBellOff,
    IconSolarMoon,
    IconSolarQuestionCircle,
    IconSolarDocumentText,
    IconSolarGlobal,
    IconSolarSmartphone,
    IconSolarFax,
    IconSolarChatRound,
    IconSolarMailbox,
    IconSolarLogout,
    IconSolarCamera,
    IconSolarArrowLeftAlt,
    IconSolarArrowRightAlt,
    IconSolarChevronDown,
    IconSolarUsersGroupRounded,
    IconSolarBuildings,
    IconSolarBolt,
    IconSolarWaterdrop,
    IconSolarWidget,
    IconSolarRuler,
    IconSolarGauge,
    IconSolarThermometer,
    IconSolarMapPointWave,
};
