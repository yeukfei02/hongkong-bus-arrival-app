import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
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

function BusStopArrivalTime() {
  const route = useRoute();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [busStopArrivalTime, setBusStopArrivalTime] = useState({});

  useEffect(() => {
    if (route.params) {
      const busStopId = route.params.busStopId;
      console.log("busStopId = ", busStopId);
      if (busStopId) {
        getBusStopArrivalTime(busStopId);
      }
    }
  }, [route.params]);

  const getBusStopArrivalTime = async (busStopId) => {
    const response = await axios.get(`${rootUrl}/kmb/bus-stop-arrival-time`, {
      params: {
        busStopId: busStopId,
      },
    });
    if (response && response.status === 200) {
      const responseData = response.data;
      console.log("responseData = ", responseData);

      if (responseData) {
        setLoading(false);
        setBusStopArrivalTime(responseData.busStopArrivalTimeKmb);
      }
    }
  };

  const renderBusStopArrivalTime = () => {
    let busStopArrivalTimeView = (
      <View>
        <Card style={styles.cardContainer}>
          <Card.Content style={{ alignSelf: "center" }}>
            <Title>{t("pleaseWait")}</Title>
          </Card.Content>
        </Card>
      </View>
    );

    if (!loading) {
      if (!_.isEmpty(busStopArrivalTime)) {
        busStopArrivalTimeView = Object.entries(busStopArrivalTime).map(
          ([key, value], i) => {
            const valueListView = value.map((item, i) => {
              return (
                <View key={i}>
                  <Card style={styles.cardContainer}>
                    <Card.Title
                      title={`${t("next")} ${item.eta_seq} ${t("bus")}`}
                    />
                    <Card.Content>
                      <Title>
                        {t("remainingTime")} {getMinutesDiffStr(item.eta)}
                      </Title>
                    </Card.Content>
                  </Card>
                </View>
              );
            });

            const view = (
              <View key={i}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "black",
                    marginHorizontal: 25,
                    marginVertical: 10,
                  }}
                >
                  {key}
                </Text>
                {valueListView}
              </View>
            );
            return view;
          }
        );
      } else {
        busStopArrivalTimeView = (
          <View>
            <Card style={styles.cardContainer}>
              <Card.Content style={{ alignSelf: "center" }}>
                <Title style={{ color: "red" }}>{t("noData")}</Title>
              </Card.Content>
            </Card>
          </View>
        );
      }
    }

    return busStopArrivalTimeView;
  };

  const getMinutesDiffStr = (timestamp) => {
    let minutesDiffStr = t("noData");

    if (timestamp) {
      const now = moment().tz("Asia/Hong_Kong");
      const itemTime = moment(timestamp).tz("Asia/Hong_Kong");
      console.log("now = ", now);
      console.log("itemTime = ", itemTime);

      const minutesDiff = itemTime.diff(now, "minute");
      console.log("minutesDiff = ", minutesDiff);

      if (minutesDiff <= 1) {
        minutesDiffStr = `Arriving`;
      } else {
        minutesDiffStr = `${minutesDiff} minutes`;
      }
    }

    return minutesDiffStr;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      {renderBusStopArrivalTime()}
    </ScrollView>
  );
}

export default BusStopArrivalTime;
