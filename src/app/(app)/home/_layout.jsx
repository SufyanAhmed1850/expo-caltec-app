import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { Colors } from "@constants/Colors";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext(Navigator);

const Layout = () => {
    return (
        <MaterialTopTabs
            screenOptions={{
                tabBarIndicatorStyle: { backgroundColor: Colors.light.red90 },
                tabBarLabelStyle: {
                    fontSize: 14,
                    fontWeight: "bold",
                    textTransform: "capitalize",
                },
            }}
        >
            <MaterialTopTabs.Screen name="index" options={{ title: "Home" }} />
            <MaterialTopTabs.Screen
                name="contact"
                options={{ title: "Contact" }}
            />
        </MaterialTopTabs>
    );
};

export default Layout;
