import React, { useRef, useEffect, useState } from "react";
import {
    View,
    Animated,
    Dimensions,
    StyleSheet,
    Easing,
    Text,
    Image,
} from "react-native";
import { Portal, Modal } from "react-native-paper";
import Card from "@components/Card";

import thermal from "@assets/icons/light/thermal.png";
import controlValve from "@assets/icons/light/control-valve.png";
import electrical from "@assets/icons/light/electrical.png";
import field from "@assets/icons/light/field.png";
import flowMeter from "@assets/icons/light/flow.png";
import hospital from "@assets/icons/light/hospital.png";
import mechanical from "@assets/icons/light/mechanical.png";
import precision from "@assets/icons/light/precision.png";
import pressure from "@assets/icons/light/pressure.png";
import temperature from "@assets/icons/light/temperature.png";
import thermalCatalog from "@assets/images/Thermal_Mapping_Validation.png";
import tempCatalog from "@assets/images/Temperature_Instrument_Calibration.png";
import precisionCatalog from "@assets/images/Precesion_Instrument_Calibration.png";
import mechanicalCatalog from "@assets/images/Mechanical_Instrument_Calibration.png";
import hospitalCatalog from "@assets/images/Hospital_Instrument_Calibration.png";
import flowMeterCatalog from "@assets/images/Flow_Meter_Calibration.png";
import fieldCatalog from "@assets/images/Field_Instrument_Calibration.png";
import electricalCatalog from "@assets/images/Electrical_Instrument_Calibration.png";
import controlValveCatalog from "@assets/images/Control_Valve_Service_Division.png";
import pressureCatalog from "@assets/images/Pressure_Instrument_Calibration.png";

const { width } = Dimensions.get("window");
const CARD_WIDTH = 320;

const SERVICES = [
    {
        icon: thermal,
        title: "Thermal Mapping",
        description:
            "Comprehensive thermal mapping services for validating temperature distribution in controlled environments. Ideal for warehouses, laboratories, and pharmaceutical facilities to ensure compliance with industry standards and regulations. Advanced tools and precise reporting deliver actionable insights for maintaining optimal conditions.",
        catalog: thermalCatalog,
    },
    {
        icon: temperature,
        title: "Temperature Instruments Calibration",
        description:
            "Accurate calibration services for temperature measuring instruments, including thermometers, data loggers, and thermal cameras. Ensures precise readings for industrial, commercial, and laboratory applications, helping you maintain compliance and achieve operational efficiency.",
        catalog: tempCatalog,
    },
    {
        icon: precision,
        title: "Precision Instrument Calibration",
        description:
            "High-accuracy calibration for precision instruments used in scientific research, engineering, and quality assurance. Services cover micrometers, calipers, and gauges to ensure precise measurements and adherence to stringent industry standards.",
        catalog: precisionCatalog,
    },
    {
        icon: mechanical,
        title: "Mechanical Instrument Calibration",
        description:
            "Professional calibration of mechanical instruments like torque wrenches, pressure gauges, and dial indicators. Enhance the reliability and accuracy of your tools for diverse industrial and commercial applications.",
        catalog: mechanicalCatalog,
    },
    {
        icon: hospital,
        title: "Hospital Instrument Calibration",
        description:
            "Specialized calibration services for medical devices such as infusion pumps, ventilators, and diagnostic equipment. Guarantees accurate readings and performance, ensuring patient safety and regulatory compliance.",
        catalog: hospitalCatalog,
    },
    {
        icon: flowMeter,
        title: "Flow Meter Calibration",
        description:
            "Precision calibration for flow meters, including turbine, magnetic, and ultrasonic types. Ensures accurate flow measurement critical for water management, oil & gas, and industrial processes.",
        catalog: flowMeterCatalog,
    },
    {
        icon: field,
        title: "Field Instrument Calibration",
        description:
            "On-site calibration of field instruments such as pressure transmitters, temperature sensors, and level measurement devices. Ideal for reducing downtime and maintaining operational efficiency in real-world conditions.",
        catalog: fieldCatalog,
    },
    {
        icon: electrical,
        title: "Electrical Instrument Calibration",
        description:
            "Comprehensive calibration services for electrical instruments like multimeters, insulation testers, and power analyzers. Ensures reliable performance for testing and measurement tasks in diverse industries.",
        catalog: electricalCatalog,
    },
    {
        icon: controlValve,
        title: "Control Valve Service Division",
        description:
            "Expert calibration and maintenance for control valves, actuators, and positioners. Helps optimize performance and reliability for process control systems in manufacturing and industrial facilities.",
        catalog: controlValveCatalog,
    },
    {
        icon: pressure,
        title: "Pressure Instrument Calibration",
        description:
            "Accurate calibration for pressure measuring instruments such as barometers, manometers, and transducers. Essential for industries requiring precise pressure monitoring and control.",
        catalog: pressureCatalog,
    },
];

const CardSlider = () => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCatalog, setSelectedCatalog] = useState(null);

    useEffect(() => {
        const animate = () => {
            Animated.timing(scrollX, {
                toValue: -CARD_WIDTH * SERVICES.length,
                duration: 100000,
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

    const handleViewCatalog = (catalog) => {
        console.log(catalog);

        setSelectedCatalog(catalog);
        setModalVisible(true);
    };

    const renderCards = () => {
        return (
            <>
                {SERVICES.map((service, index) => (
                    <View key={`card-${index}`} style={styles.cardContainer}>
                        <Card
                            icon={service.icon}
                            title={service.title}
                            description={service.description}
                            onViewCatalog={() =>
                                handleViewCatalog(service.catalog)
                            }
                        />
                    </View>
                ))}
                {SERVICES.map((service, index) => (
                    <View
                        key={`card-duplicate-${index}`}
                        style={styles.cardContainer}
                    >
                        <Card
                            icon={service.icon}
                            title={service.title}
                            description={service.description}
                            onViewCatalog={() =>
                                handleViewCatalog(service.catalog)
                            }
                        />
                    </View>
                ))}
            </>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Comprehensive Calibration Services</Text>
            <Text style={styles.subtitle}>
                We offer specialized calibration solutions for thermal mapping,
                precision instruments, mechanical tools, and more to ensure
                compliance and accuracy.
            </Text>
            <View style={styles.sliderContainer}>
                <Animated.View
                    style={[
                        styles.slider,
                        {
                            transform: [{ translateX: scrollX }],
                        },
                    ]}
                >
                    {renderCards()}
                </Animated.View>
            </View>
            <Portal>
                <Modal
                    visible={modalVisible}
                    onDismiss={() => setModalVisible(false)}
                    contentContainerStyle={styles.modalContainer}
                >
                    {selectedCatalog && (
                        <Image
                            source={selectedCatalog}
                            style={styles.catalogImage}
                            resizeMode="contain"
                        />
                    )}
                </Modal>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    slider: {
        flexDirection: "row",
        width: CARD_WIDTH * (SERVICES.length * 2),
    },
    title: {
        fontSize: 24,
        fontWeight: "500",
        marginBottom: 10,
        color: "#02203C",
        textAlign: "center",
        paddingHorizontal: 20,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "400",
        color: "#7C8E9A",
        textAlign: "center",
        paddingHorizontal: 20,
    },
    cardContainer: {
        width: CARD_WIDTH,
        paddingVertical: 24,
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "white",
        margin: 20,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    catalogImage: {
        width: "100%",
        height: "75%",
    },
});

export default CardSlider;
