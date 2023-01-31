import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import NearbyBusStop from "../nearbyBusStop/NearbyBusStop";
import BusStopArrivalTime from "../busStopArrivalTime/BusStopArrivalTime";

const Stack = createNativeStackNavigator();

function NearMeView() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen name={t("nearbyBusStop")} component={NearbyBusStop} />
      <Stack.Screen
        name={t("busStopArrivalTime")}
        component={BusStopArrivalTime}
      />
    </Stack.Navigator>
  );
}

export default NearMeView;
