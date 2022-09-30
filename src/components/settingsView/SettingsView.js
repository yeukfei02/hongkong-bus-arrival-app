import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import Settings from "../settings/Settings";

const Stack = createNativeStackNavigator();

function SettingsView() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen name={t("settings")} component={Settings} />
    </Stack.Navigator>
  );
}

export default SettingsView;
