import React, { useRef, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    Animated,
    Dimensions,
    Easing,
} from "react-native";

const { width } = Dimensions.get("window");

const images = [
    // "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099042/Caltec_Customers/abbott.png",
    "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099044/Caltec_Customers/alkaram.png",
    "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099046/Caltec_Customers/archroma.png",
    "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099048/Caltec_Customers/atlas%20autos.png",
    "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099050/Caltec_Customers/brookes.png",
    "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099053/Caltec_Customers/changan.png",
    "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099055/Caltec_Customers/Dalda.png",
    // "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099058/Caltec_Customers/gerry%27s-dnata.png",
    "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099061/Caltec_Customers/Ghani.png",
    "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099065/Caltec_Customers/GSK.png",
    // "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099067/Caltec_Customers/haleon.png",
    "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099070/Caltec_Customers/herbion.png",
    // "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099072/Caltec_Customers/hilal.png",
    // "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099074/Caltec_Customers/Hoechst.png",
    // "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099076/Caltec_Customers/Indus-Pharma.png",
    "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099078/Caltec_Customers/rajby.png",
    "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099081/Caltec_Customers/scilife.png",
    // "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099083/Caltec_Customers/soorty.png",
    // "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099085/Caltec_Customers/tcs.png",
    // "https://res.cloudinary.com/dp28flpqp/image/upload/v1736099088/Caltec_Customers/US-Group.png",
];

const ITEM_WIDTH = width / 3;
const FULL_WIDTH = ITEM_WIDTH * images.length;

const ImageSlider = () => {
    const scrollX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = () => {
            Animated.timing(scrollX, {
                toValue: -FULL_WIDTH,
                duration: 8000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    scrollX.setValue(0);
                    animate();
                }
            });
        };

        animate();

        return () => {
            scrollX.stopAnimation();
        };
    }, []);

    const renderImages = () => {
        return (
            <>
                {images.map((uri, index) => (
                    <View key={`image-${index}`} style={styles.imageGroup}>
                        <Image source={{ uri }} style={styles.image} />
                    </View>
                ))}
                {images.map((uri, index) => (
                    <View
                        key={`image-duplicate-${index}`}
                        style={styles.imageGroup}
                    >
                        <Image source={{ uri }} style={styles.image} />
                    </View>
                ))}
            </>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Precision You Can Trust.</Text>
            <Text style={styles.subtitle}>
                Our calibration services are trusted by leading companies across
                industries for accurate and reliable results.
            </Text>

            <View style={styles.marqueeContainer}>
                <Animated.View
                    style={[
                        styles.marquee,
                        {
                            transform: [{ translateX: scrollX }],
                        },
                    ]}
                >
                    {renderImages()}
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "500",
        marginBottom: 10,
        color: "#02203C",
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "400",
        color: "#7C8E9A",
        textAlign: "center",
        paddingHorizontal: 20,
    },
    marqueeContainer: {
        width: width,
        height: 100,
        overflow: "hidden",
    },
    marquee: {
        flexDirection: "row",
        width: FULL_WIDTH * 2,
    },
    imageGroup: {
        width: ITEM_WIDTH,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "80%",
        height: "80%",
        resizeMode: "contain",
    },
});

export default ImageSlider;
