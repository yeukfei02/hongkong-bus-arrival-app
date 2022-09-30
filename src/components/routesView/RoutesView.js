import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import Routes from "../routes/Routes";

const Stack = createNativeStackNavigator();

function RoutesView() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen name={t("routes")} component={Routes} />
    </Stack.Navigator>
  );
}

export default RoutesView;
