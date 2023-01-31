import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import SettingsOrContactUs from "../settingsOrContactUs/SettingsOrContactUs";

const Stack = createNativeStackNavigator();

function SettingsView() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={t("settingsOrContactUs")}
        component={SettingsOrContactUs}
      />
    </Stack.Navigator>
  );
}

export default SettingsView;
