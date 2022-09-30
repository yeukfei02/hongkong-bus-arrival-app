import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import RoutesView from "../routesView/RoutesView";
import SettingsView from "../settingsView/SettingsView";

const Tab = createBottomTabNavigator();

function TabView() {
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let icon = null;

            switch (route.name) {
              case "Routes":
              case "路線":
              case "路线":
                if (focused) {
                  icon = (
                    <MaterialCommunityIcons
                      name="routes"
                      size={size}
                      color={color}
                    />
                  );
                } else {
                  icon = (
                    <MaterialCommunityIcons
                      name="routes"
                      size={size}
                      color={color}
                    />
                  );
                }
                break;
              case "Settings":
              case "設定":
                if (focused) {
                  icon = <Ionicons name="settings" size={size} color={color} />;
                } else {
                  icon = (
                    <Ionicons
                      name="settings-outline"
                      size={size}
                      color={color}
                    />
                  );
                }
                break;
              default:
                break;
            }

            return icon;
          },
          tabBarActiveTintColor: "orange",
          tabBarInactiveTintColor: "gray",
          headerShown: false,
        })}
      >
        <Tab.Screen name={t("routes")} component={RoutesView} />
        <Tab.Screen name={t("settings")} component={SettingsView} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default TabView;
