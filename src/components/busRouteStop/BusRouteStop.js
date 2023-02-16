import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Platform, Linking } from "react-native";
import { Button, Card, Paragraph, Title } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import axios from "axios";
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
  arrowDownIcon: {
    alignSelf: "center",
  },
  openInMap: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

function BusRouteStop() {
  const route = useRoute();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [busRouteStop, setBusRouteStop] = useState([]);

  useEffect(() => {
    if (route.params) {
      const companyId = route.params.companyId;
      const routeStr = route.params.routeStr;
      const direction = route.params.direction;
      const busRouteId = route.params.busRouteId;
      if (companyId && routeStr && direction) {
        getBusRouteStop(companyId, routeStr, direction, busRouteId);
      }
    }
  }, [route.params]);

  const getBusRouteStop = async (
    companyId,
    routeStr,
    direction,
    busRouteId
  ) => {
    if (companyId === "NWFB" || companyId === "CTB") {
      const response = await axios.get(`${rootUrl}/bus-route-stop`, {
        params: {
          companyId: companyId,
          routeStr: routeStr,
          direction: direction,
        },
      });

      if (response && response.status === 200) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (responseData) {
          setLoading(false);
          setBusRouteStop(responseData.busRouteStop);
        }
      }
    } else if (companyId === "KMB") {
      const response = await axios.get(`${rootUrl}/kmb/bus-route-stop`, {
        params: {
          route: routeStr,
          direction: direction,
        },
      });

      if (response && response.status === 200) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (responseData) {
          setLoading(false);
          setBusRouteStop(responseData.busRouteStopKmb);
        }
      }
    } else if (companyId === "NLB") {
      const response = await axios.get(`${rootUrl}/nlb/bus-route-stop`, {
        params: {
          busRouteId: busRouteId,
        },
      });

      if (response && response.status === 200) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (responseData) {
          setLoading(false);
          setBusRouteStop(responseData.busRouteStopNlb);
        }
      }
    }
  };

  const getNameText = (stop) => {
    let nameText = "";

    if (i18n.language) {
      switch (i18n.language) {
        case "eng":
          nameText = stop.name_en;
          break;
        case "zh_hk":
          nameText = stop.name_tc;
          break;
        case "zh_cn":
          nameText = stop.name_sc;
          break;
        default:
          break;
      }
    }

    return nameText;
  };

  const getNlbBusStopNameText = (item) => {
    let nameText = "";

    if (i18n.language) {
      switch (i18n.language) {
        case "eng":
          nameText = item.stopName_e;
          break;
        case "zh_hk":
          nameText = item.stopName_c;
          break;
        case "zh_cn":
          nameText = item.stopName_s;
          break;
        default:
          break;
      }
    }

    return nameText;
  };

  const renderBusRouteStop = () => {
    let busRouteStopView = (
      <View>
        <Card style={styles.cardContainer}>
          <Card.Content style={{ alignSelf: "center" }}>
            <Title>{t("pleaseWait")}</Title>
          </Card.Content>
        </Card>
      </View>
    );

    if (!loading) {
      if (!_.isEmpty(busRouteStop)) {
        const companyId = route.params.companyId;
        if (
          companyId === "NWFB" ||
          companyId === "CTB" ||
          companyId === "KMB"
        ) {
          busRouteStopView = busRouteStop.map((item, i) => {
            return (
              <View key={i}>
                <Card style={styles.cardContainer}>
                  <Card.Content>
                    <Title>{getNameText(item.stop)}</Title>
                    <Paragraph
                      style={styles.openInMap}
                      onPress={() =>
                        handleOpenInMap(item.stop.lat, item.stop.long)
                      }
                    >
                      Open in map
                    </Paragraph>
                  </Card.Content>
                  <Card.Actions>
                    <Button
                      mode="outlined"
                      style={{ padding: 5 }}
                      labelStyle={{ fontSize: 15 }}
                      uppercase={false}
                      onPress={() => handleEnterButtonClick(item.stop.stop)}
                    >
                      Enter
                    </Button>
                  </Card.Actions>
                </Card>
                {renderArrowDownIcon(i)}
              </View>
            );
          });
        } else if (companyId === "NLB") {
          busRouteStopView = busRouteStop.map((item, i) => {
            return (
              <View key={i}>
                <Card style={styles.cardContainer}>
                  <Card.Content>
                    <Title>{getNlbBusStopNameText(item)}</Title>
                    <Paragraph
                      style={styles.openInMap}
                      onPress={() =>
                        handleOpenInMap(item.latitude, item.longitude)
                      }
                    >
                      Open in map
                    </Paragraph>
                  </Card.Content>
                  <Card.Actions>
                    <Button
                      mode="outlined"
                      style={{ padding: 5 }}
                      labelStyle={{ fontSize: 15 }}
                      uppercase={false}
                      onPress={() =>
                        handleEnterButtonClick(
                          item.stopId,
                          route.params.busRouteId
                        )
                      }
                    >
                      Enter
                    </Button>
                  </Card.Actions>
                </Card>
                {renderArrowDownIcon(i)}
              </View>
            );
          });
        }
      } else {
        busRouteStopView = (
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

    return busRouteStopView;
  };

  const handleEnterButtonClick = (busStopId, busRouteId) => {
    navigation.navigate(t("busArrivalTime"), {
      companyId: route.params.companyId,
      routeStr: route.params.routeStr,
      busStopId: busStopId,
      busRouteId: busRouteId,
    });
  };

  const renderArrowDownIcon = (i) => {
    let arrowDownIcon = null;

    if (i !== busRouteStop.length - 1) {
      arrowDownIcon = (
        <Ionicons name="arrow-down" size={30} style={styles.arrowDownIcon} />
      );
    }

    return arrowDownIcon;
  };

  const handleOpenInMap = async (lat, long) => {
    const latitude = lat;
    const longitude = long;
    if (latitude !== 0 && longitude !== 0) {
      openMap(latitude, longitude);
    }
  };

  const openMap = (latitude, longitude) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${latitude},${longitude}`;
    const label = "Bus Stop";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      {renderBusRouteStop()}
    </ScrollView>
  );
}

export default BusRouteStop;
