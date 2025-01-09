import { Circle, Path, Svg } from "react-native-svg";

const IconHome = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox="0 0 24 24"
            fill={fill || "none"}
        >
            <Path
                d="M9.15722 20.7714V17.7047C9.1572 16.9246 9.79312 16.2908 10.581 16.2856H13.4671C14.2587 16.2856 14.9005 16.9209 14.9005 17.7047V17.7047V20.7809C14.9003 21.4432 15.4343 21.9845 16.103 22H18.0271C19.9451 22 21.5 20.4607 21.5 18.5618V18.5618V9.83784C21.4898 9.09083 21.1355 8.38935 20.538 7.93303L13.9577 2.6853C12.8049 1.77157 11.1662 1.77157 10.0134 2.6853L3.46203 7.94256C2.86226 8.39702 2.50739 9.09967 2.5 9.84736V18.5618C2.5 20.4607 4.05488 22 5.97291 22H7.89696C8.58235 22 9.13797 21.4499 9.13797 20.7714V20.7714"
                stroke={pathStroke}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
const IconServices = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 41}
            height={height || 33}
            viewBox="0 0 41 33"
            fill={fill || "none"}
        >
            <Path
                d="M12.7658 12.1522C12.3983 12 11.9324 12 11.0005 12C10.0686 12 9.60265 12 9.23511 12.1522C8.74505 12.3552 8.35571 12.7446 8.15272 13.2346C8.06005 13.4583 8.02379 13.7185 8.0096 14.098C7.98875 14.6557 7.70274 15.1719 7.21943 15.4509C6.73612 15.73 6.14608 15.7195 5.65268 15.4588C5.31693 15.2813 5.07349 15.1826 4.83342 15.151C4.30753 15.0818 3.77567 15.2243 3.35485 15.5472C3.03923 15.7894 2.80626 16.1929 2.34032 16.9999C1.87438 17.807 1.64141 18.2105 1.58948 18.6049C1.52025 19.1308 1.66276 19.6627 1.98566 20.0835C2.13305 20.2756 2.34019 20.437 2.66167 20.639C3.13429 20.936 3.43838 21.4419 3.43835 22C3.43832 22.5581 3.13424 23.0639 2.66167 23.3608C2.34013 23.5629 2.13297 23.7244 1.98557 23.9165C1.66266 24.3373 1.52015 24.8691 1.58938 25.395C1.64131 25.7894 1.87428 26.193 2.34022 27C2.80616 27.807 3.03913 28.2106 3.35475 28.4527C3.77557 28.7756 4.30743 28.9181 4.83333 28.8489C5.07338 28.8173 5.31681 28.7186 5.65253 28.5412C6.14596 28.2804 6.73605 28.27 7.21939 28.549C7.70273 28.8281 7.98874 29.3443 8.0096 29.9021C8.0238 30.2815 8.06006 30.5417 8.15272 30.7654C8.35571 31.2554 8.74505 31.6448 9.23511 31.8478C9.60265 32 10.0686 32 11.0005 32C11.9324 32 12.3983 32 12.7658 31.8478C13.2559 31.6448 13.6452 31.2554 13.8482 30.7654C13.9409 30.5417 13.9772 30.2815 13.9914 29.902C14.0122 29.3443 14.2982 28.8281 14.7815 28.549C15.2648 28.2699 15.8549 28.2804 16.3484 28.5412C16.6841 28.7186 16.9275 28.8172 17.1675 28.8488C17.6934 28.9181 18.2253 28.7756 18.6461 28.4527C18.9617 28.2105 19.1947 27.807 19.6606 26.9999C20.1266 26.1929 20.3595 25.7894 20.4115 25.395C20.4807 24.8691 20.3382 24.3372 20.0153 23.9164C19.8679 23.7243 19.6607 23.5628 19.3392 23.3608C18.8666 23.0639 18.5626 22.558 18.5626 21.9999C18.5626 21.4418 18.8667 20.9361 19.3392 20.6392C19.6608 20.4371 19.868 20.2757 20.0154 20.0835C20.3383 19.6627 20.4808 19.1309 20.4116 18.605C20.3596 18.2106 20.1267 17.807 19.6607 17C19.1948 16.193 18.9618 15.7894 18.6462 15.5473C18.2254 15.2244 17.6935 15.0818 17.1676 15.1511C16.9276 15.1827 16.6841 15.2814 16.3484 15.4588C15.855 15.7196 15.2649 15.73 14.7816 15.451C14.2982 15.1719 14.0122 14.6557 13.9914 14.0979C13.9772 13.7185 13.9409 13.4583 13.8482 13.2346C13.6452 12.7446 13.2559 12.3552 12.7658 12.1522Z"
                stroke={pathStroke}
                strokeWidth={1.5}
            />
            <Circle
                cx={11}
                cy={22}
                r={3}
                stroke={fill ? "#F9F9F9" : pathStroke}
                strokeWidth={1.5}
            />
            <Path
                d="M39.8478 12.1936C40 11.826 40 11.3601 40 10.4282C40 9.49633 40 9.03039 39.8478 8.66284C39.6448 8.17279 39.2554 7.78344 38.7654 7.58045C38.5417 7.48779 38.2815 7.45153 37.902 7.43734C37.3443 7.41648 36.8281 7.13048 36.5491 6.64717C36.27 6.16386 36.2805 5.57381 36.5412 5.08042C36.7187 4.74467 36.8174 4.50123 36.849 4.26116C36.9182 3.73526 36.7757 3.2034 36.4528 2.78258C36.2106 2.46697 35.8071 2.234 35.0001 1.76805C34.193 1.30211 33.7895 1.06914 33.3951 1.01722C32.8692 0.947981 32.3373 1.09049 31.9165 1.4134C31.7244 1.56079 31.563 1.76793 31.361 2.08941C31.064 2.56202 30.5581 2.86611 30 2.86608C29.4419 2.86605 28.9361 2.56197 28.6392 2.08941C28.4371 1.76787 28.2756 1.5607 28.0835 1.4133C27.6627 1.09039 27.1309 0.947883 26.605 1.01712C26.2106 1.06904 25.807 1.30202 25 1.76796C24.193 2.2339 23.7894 2.46687 23.5473 2.78248C23.2244 3.20331 23.0819 3.73517 23.1511 4.26106C23.1827 4.50112 23.2814 4.74454 23.4588 5.08026C23.7196 5.57369 23.73 6.16378 23.451 6.64712C23.1719 7.13046 22.6557 7.41648 22.0979 7.43734C21.7185 7.45153 21.4583 7.48779 21.2346 7.58045C20.7446 7.78344 20.3552 8.17279 20.1522 8.66284C20 9.03039 20 9.49633 20 10.4282C20 11.3601 20 11.826 20.1522 12.1936C20.3552 12.6836 20.7446 13.073 21.2346 13.276C21.4583 13.3686 21.7185 13.4049 22.098 13.4191C22.6557 13.4399 23.1719 13.7259 23.451 14.2092C23.7301 14.6925 23.7196 15.2826 23.4588 15.7761C23.2814 16.1118 23.1828 16.3552 23.1512 16.5953C23.0819 17.1212 23.2244 17.653 23.5473 18.0738C23.7895 18.3895 24.193 18.6224 25.0001 19.0884C25.8071 19.5543 26.2106 19.7873 26.605 19.8392C27.1309 19.9084 27.6628 19.7659 28.0836 19.443C28.2757 19.2956 28.4372 19.0885 28.6392 18.767C28.9361 18.2944 29.442 17.9903 30.0001 17.9903C30.5582 17.9904 31.0639 18.2944 31.3608 18.767C31.5629 19.0885 31.7243 19.2957 31.9165 19.4431C32.3373 19.766 32.8691 19.9085 33.395 19.8393C33.7894 19.7874 34.193 19.5544 35 19.0885C35.807 18.6225 36.2106 18.3896 36.4527 18.0739C36.7756 17.6531 36.9182 17.1213 36.8489 16.5954C36.8173 16.3553 36.7186 16.1119 36.5412 15.7762C36.2804 15.2827 36.27 14.6926 36.549 14.2093C36.8281 13.726 37.3443 13.4399 37.9021 13.4191C38.2815 13.4049 38.5417 13.3686 38.7654 13.276C39.2554 13.073 39.6448 12.6836 39.8478 12.1936Z"
                stroke={pathStroke}
                strokeWidth={1.5}
            />
            <Circle
                cx={30.4277}
                cy={10}
                r={3}
                stroke={fill ? "#F9F9F9" : pathStroke}
                strokeWidth={1.5}
            />
        </Svg>
    );
};

const IconEnquiry = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox="0 0 24 24"
            fill={fill || "none"}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.7377 2.76175H8.08468C6.00468 2.75375 4.29968 4.41175 4.25068 6.49075V17.2037C4.20468 19.3167 5.87968 21.0677 7.99268 21.1147C8.02368 21.1147 8.05368 21.1157 8.08468 21.1147H16.0737C18.1677 21.0297 19.8177 19.2997 19.8027 17.2037V8.03775L14.7377 2.76175Z"
                stroke={pathStroke}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M14.4751 2.75V5.659C14.4751 7.079 15.6231 8.23 17.0431 8.234H19.7981"
                stroke={fill ? "#F9F9F9" : pathStroke}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M14.2879 15.3585H8.88794"
                stroke={fill ? "#F9F9F9" : pathStroke}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M12.243 11.606H8.88696"
                stroke={fill ? "#F9F9F9" : pathStroke}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

const IconProfile = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox="0 0 24 24"
            fill={fill || "none"}
        >
            <Path
                clipRule="evenodd"
                d="M11.985 15.346c-3.868 0-7.17.585-7.17 2.927s3.281 2.948 7.17 2.948c3.867 0 7.17-.586 7.17-2.927s-3.282-2.948-7.17-2.948"
                stroke={pathStroke}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                clipRule="evenodd"
                d="M11.985 12.006A4.596 4.596 0 1 0 7.388 7.41a4.58 4.58 0 0 0 4.564 4.596z"
                stroke={pathStroke}
                strokeWidth={1.429}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

const IconArrowRight = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox="0 0 24 24"
            fill="none"
        >
            <Path
                d="m8.5 5 7 7-7 7"
                stroke={pathStroke || "#212121"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
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
            fill="none"
        >
            <Path
                d="m17.903 8.851-4.444 3.613c-.84.666-2.02.666-2.86 0L6.12 8.851"
                stroke={pathStroke || "#212121"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                clipRule="evenodd"
                d="M16.909 21C19.95 21.008 22 18.51 22 15.438V8.57C22 5.499 19.95 3 16.909 3H7.09C4.05 3 2 5.499 2 8.57v6.868C2 18.51 4.05 21.008 7.091 21z"
                stroke={pathStroke || "#212121"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
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
            fill="none"
        >
            <Path
                d="M16.424 9.448V7.3a4.55 4.55 0 0 0-4.551-4.551 4.55 4.55 0 0 0-4.57 4.53v2.168"
                stroke={pathStroke || "#212121"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                clipRule="evenodd"
                d="M15.683 21.25h-7.64a3.79 3.79 0 0 1-3.793-3.792v-4.29a3.79 3.79 0 0 1 3.792-3.791h7.641a3.79 3.79 0 0 1 3.792 3.792v4.289a3.79 3.79 0 0 1-3.792 3.792"
                stroke={pathStroke || "#212121"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M11.863 14.203v2.22"
                stroke={pathStroke || "#212121"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
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
            fill="none"
        >
            <Path
                clipRule="evenodd"
                d="M15.161 12.053a3.162 3.162 0 1 1-6.323-.001 3.162 3.162 0 0 1 6.323.001"
                stroke={pathStroke || "#212121"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                clipRule="evenodd"
                d="M11.998 19.355c3.808 0 7.291-2.738 9.252-7.302-1.961-4.564-5.444-7.302-9.252-7.302h.004c-3.808 0-7.291 2.738-9.252 7.302 1.961 4.564 5.444 7.302 9.252 7.302z"
                stroke={pathStroke || "#212121"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
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
            fill="none"
        >
            <Path
                d="M9.76 14.367a3.12 3.12 0 0 1-.925-2.23A3.16 3.16 0 0 1 12 8.973c.867 0 1.665.35 2.23.925m.875 2.801a3.16 3.16 0 0 1-2.537 2.542"
                stroke={pathStroke || "#212121"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M6.655 17.472c-1.587-1.246-2.931-3.066-3.905-5.335.984-2.279 2.337-4.109 3.934-5.365C8.27 5.516 10.1 4.834 11.999 4.834c1.91 0 3.74.692 5.336 1.957m2.113 2.199a15.4 15.4 0 0 1 1.802 3.147c-1.968 4.557-5.443 7.302-9.25 7.302a8 8 0 0 1-2.532-.413M19.887 4.25 4.113 20.024"
                stroke={pathStroke || "#212121"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
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
            fill="none"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.007 3.407c1.68-1.68 4.516-1.552 5.686.544l.649 1.163c.763 1.368.438 3.095-.68 4.227a.63.63 0 0 0-.104.337c-.013.256.078.849.997 1.767.918.918 1.51 1.01 1.767.997a.63.63 0 0 0 .337-.104c1.131-1.118 2.859-1.443 4.227-.68l1.163.65c2.096 1.17 2.224 4.004.544 5.685-.899.898-2.093 1.697-3.498 1.75-2.08.079-5.536-.459-8.958-3.88-3.421-3.422-3.959-6.877-3.88-8.958.053-1.405.852-2.6 1.75-3.498m4.376 1.275c-.6-1.074-2.21-1.32-3.315-.214-.775.775-1.28 1.63-1.312 2.493-.066 1.736.363 4.762 3.442 7.84 3.08 3.08 6.105 3.509 7.84 3.443.863-.033 1.72-.537 2.494-1.312 1.106-1.106.86-2.716-.214-3.315l-1.163-.649c-.723-.403-1.74-.266-2.453.448-.07.07-.516.486-1.307.524-.81.04-1.791-.324-2.9-1.434-1.111-1.11-1.475-2.091-1.435-2.902.038-.791.455-1.237.524-1.307.714-.713.851-1.729.448-2.452z"
                fill={pathStroke || "#212121"}
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
            fill="none"
        >
            <Path
                d="M19.325 9.468s-.543 6.735-.858 9.572c-.15 1.355-.987 2.15-2.358 2.174-2.609.047-5.221.05-7.829-.005-1.319-.027-2.142-.83-2.289-2.162-.317-2.862-.857-9.579-.857-9.579M20.708 6.24H3.75m13.69 0a1.65 1.65 0 0 1-1.614-1.324L15.583 3.7a1.28 1.28 0 0 0-1.237-.95h-4.233a1.28 1.28 0 0 0-1.237.95l-.243 1.216A1.65 1.65 0 0 1 7.018 6.24"
                stroke={pathStroke || "#212121"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
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
            fill="none"
        >
            <Path
                d="M11.492 2.789H7.753c-3.075 0-5.003 2.177-5.003 5.259v8.314c0 3.082 1.92 5.259 5.003 5.259h8.824c3.085 0 5.004-2.177 5.004-5.26v-4.027"
                stroke={pathStroke || "#212121"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                clipRule="evenodd"
                d="M8.828 10.92 16.3 3.449c.93-.93 2.44-.93 3.37 0l1.218 1.217a2.383 2.383 0 0 1 0 3.37l-7.51 7.51a2.17 2.17 0 0 1-1.534.636H8.099l.094-3.78a2.17 2.17 0 0 1 .635-1.48"
                stroke={pathStroke || "#212121"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="m15.165 4.602 4.566 4.566"
                stroke={pathStroke || "#212121"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
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
            fill="none"
        >
            <Path
                clipRule="evenodd"
                d="M14.5 10.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0"
                stroke={pathStroke || "#212121"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                clipRule="evenodd"
                d="M12 21c-1.199 0-7.5-5.102-7.5-10.437C4.5 6.387 7.857 3 12 3s7.5 3.387 7.5 7.563C19.5 15.898 13.198 21 12 21"
                stroke={pathStroke || "#212121"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
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
            fill="none"
        >
            <Circle
                cx={11.767}
                cy={11.767}
                r={8.989}
                stroke={pathStroke || "#212121"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M18.018 18.485 21.542 22"
                stroke={pathStroke || "#212121"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

const IconDownload = ({ width, height, fill, pathStroke }) => {
    return (
        <Svg
            width={width || 24}
            height={height || 24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M12.1223 15.4361L12.1223 3.39514"
                stroke={pathStroke || "#212121"}
                stroke-width={1.5}
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <Path
                d="M15.0383 12.5084L12.1223 15.4364L9.20633 12.5084"
                stroke={pathStroke || "#212121"}
                stroke-width={1.5}
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <Path
                d="M16.7551 8.12805H17.6881C19.7231 8.12805 21.3721 9.77705 21.3721 11.8131V16.6971C21.3721 18.7271 19.7271 20.3721 17.6971 20.3721L6.55707 20.3721C4.52207 20.3721 2.87207 18.7221 2.87207 16.6871V11.8021C2.87207 9.77305 4.51807 8.12805 6.54707 8.12805L7.48907 8.12805"
                stroke={pathStroke || "#212121"}
                stroke-width={1.5}
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </Svg>
    );
};

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
    IconDownload,
};
