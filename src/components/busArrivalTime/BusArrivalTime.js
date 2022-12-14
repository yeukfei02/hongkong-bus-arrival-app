import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Card, Title } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import axios from "axios";
import moment from "moment";
import "moment-timezone";
import _ from "lodash";
import { getRootUrl } from "../../helper/helper";

const rootUrl = getRootUrl();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "azure",
    paddingVertical: 15,
  },
  cardContainer: {
    marginHorizontal: 25,
    marginVertical: 15,
    padding: 5,
  },
});

function BusArrivalTime() {
  const route = useRoute();
  const { t } = useTranslation();

  const [busArrivalTime, setBusArrivalTime] = useState([]);

  useEffect(() => {
    if (route.params) {
      const companyId = route.params.companyId;
      const routeStr = route.params.routeStr;
      const busStopId = route.params.busStopId;
      if (companyId && routeStr && busStopId) {
        getBusArrivalTime(companyId, routeStr, busStopId);
      }
    }
  }, [route.params]);

  const getBusArrivalTime = async (companyId, routeStr, busStopId) => {
    if (companyId === "NWFB" || companyId === "CTB") {
      const response = await axios.get(`${rootUrl}/bus-arrival-time`, {
        params: {
          companyId: companyId,
          routeStr: routeStr,
          busStopId: busStopId,
        },
      });
      if (response && response.status === 200) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (responseData) {
          setBusArrivalTime(responseData.busArrivalTime);
        }
      }
    } else if (companyId === "KMB") {
      const response = await axios.get(`${rootUrl}/kmb/bus-arrival-time`, {
        params: {
          route: routeStr,
          busStopId: busStopId,
        },
      });
      if (response && response.status === 200) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (responseData) {
          setBusArrivalTime(responseData.busArrivalTimeKmb);
        }
      }
    }
  };

  const renderBusArrivalTime = () => {
    let busArrivalTimeView = null;

    if (!_.isEmpty(busArrivalTime)) {
      busArrivalTimeView = busArrivalTime.map((item, i) => {
        return (
          <View key={i}>
            <Card style={styles.cardContainer}>
              <Card.Title title={`${t("next")} ${item.eta_seq} ${t("bus")}`} />
              <Card.Content>
                <Title>
                  {t("remainingTime")} {getMinutesDiffStr(item.eta)}
                </Title>
              </Card.Content>
            </Card>
          </View>
        );
      });
    } else {
      busArrivalTimeView = (
        <View>
          <Card style={styles.cardContainer}>
            <Card.Content style={{ alignSelf: "center" }}>
              <Title>{t("pleaseWait")}</Title>
            </Card.Content>
          </Card>
        </View>
      );
    }

    return busArrivalTimeView;
  };

  const getMinutesDiffStr = (timestamp) => {
    let minutesDiffStr = "";

    const now = moment().tz("Asia/Hong_Kong");
    const itemTime = moment(timestamp).tz("Asia/Hong_Kong");

    // console.log("now = ", now);
    // console.log("itemTime = ", itemTime);

    const minutesDiff = itemTime.diff(now, "minute");

    // console.log("minutesDiff = ", minutesDiff);

    if (minutesDiff > 0) {
      minutesDiffStr = `${minutesDiff} minutes`;
    } else {
      minutesDiffStr = `Arriving`;
    }

    return minutesDiffStr;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      {renderBusArrivalTime()}
    </ScrollView>
  );
}

export default BusArrivalTime;
