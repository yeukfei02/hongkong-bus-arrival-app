import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import Routes from "../routes/Routes";
import BusRoute from "../busRoute/BusRoute";
import BusRouteStop from "../busRouteStop/BusRouteStop";
import BusArrivalTime from "../busArrivalTime/BusArrivalTime";

const Stack = createNativeStackNavigator();

function RoutesView() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen name={t("routes")} component={Routes} />
      <Stack.Screen name={t("busRoute")} component={BusRoute} />
      <Stack.Screen name={t("busRouteStop")} component={BusRouteStop} />
      <Stack.Screen name={t("busArrivalTime")} component={BusArrivalTime} />
    </Stack.Navigator>
  );
}

export default RoutesView;
