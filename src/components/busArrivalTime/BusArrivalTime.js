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
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [busArrivalTime, setBusArrivalTime] = useState([]);

  useEffect(() => {
    if (route.params) {
      const companyId = route.params.companyId;
      const routeStr = route.params.routeStr;
      const busStopId = route.params.busStopId;
      const busRouteId = route.params.busRouteId;
      if (companyId && routeStr && busStopId) {
        getBusArrivalTime(companyId, routeStr, busStopId, busRouteId);
      }
    }
  }, [route.params]);

  const getBusArrivalTime = async (
    companyId,
    routeStr,
    busStopId,
    busRouteId
  ) => {
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
          setLoading(false);
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
          setLoading(false);
          setBusArrivalTime(responseData.busArrivalTimeKmb);
        }
      }
    } else if (companyId === "NLB") {
      const response = await axios.get(`${rootUrl}/nlb/bus-arrival-time`, {
        params: {
          busRouteId: busRouteId,
          busStopId: busStopId,
          language: getLanguageText(),
        },
      });
      if (response && response.status === 200) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (responseData) {
          setLoading(false);
          setBusArrivalTime(responseData.busArrivalTimeNlb);
        }
      }
    }
  };

  const getLanguageText = () => {
    let languageText = "zh-hant";

    if (i18n.language) {
      switch (i18n.language) {
        case "eng":
          languageText = "en";
          break;
        case "zh_hk":
          languageText = "zh";
          break;
        case "zh_cn":
          languageText = "cn";
          break;
        default:
          break;
      }
    }

    return languageText;
  };

  const renderBusArrivalTime = () => {
    let busArrivalTimeView = (
      <View>
        <Card style={styles.cardContainer}>
          <Card.Content style={{ alignSelf: "center" }}>
            <Title>{t("pleaseWait")}</Title>
          </Card.Content>
        </Card>
      </View>
    );

    if (!loading) {
      if (!_.isEmpty(busArrivalTime)) {
        busArrivalTimeView = busArrivalTime.map((item, i) => {
          if (item.eta_seq && item.eta) {
            return (
              <View key={i}>
                <Card style={styles.cardContainer}>
                  <Card.Title
                    title={`${t("next")} ${item.eta_seq || i + 1} ${t("bus")}`}
                  />
                  <Card.Content>
                    <Title>
                      {t("remainingTime")} {getMinutesDiffStr(item.eta)}
                    </Title>
                  </Card.Content>
                </Card>
              </View>
            );
          } else {
            return (
              <Card key={i} style={styles.cardContainer}>
                <Card.Content style={{ alignSelf: "center" }}>
                  <Title style={{ color: "red" }}>{t("noData")}</Title>
                </Card.Content>
              </Card>
            );
          }
        });
      } else {
        busArrivalTimeView = (
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

    return busArrivalTimeView;
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
        minutesDiffStr = `${t("arriving")}`;
      } else {
        minutesDiffStr = `${minutesDiff} ${t("minutes")}`;
      }
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
