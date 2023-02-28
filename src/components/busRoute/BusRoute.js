import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Button, Card, Paragraph, Title } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
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
});

function BusRoute() {
  const route = useRoute();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [busRoute, setBusRoute] = useState({});

  useEffect(() => {
    if (route.params) {
      const companyId = route.params.companyId;
      const routeStr = route.params.routeStr;
      const direction = route.params.direction;
      if (companyId && routeStr && direction) {
        getBusRoute(companyId, routeStr, direction);
      }
    }
  }, [route.params]);

  const getBusRoute = async (companyId, routeStr, direction) => {
    if (companyId === "NWFB" || companyId === "CTB") {
      const response = await axios.get(`${rootUrl}/bus-route`, {
        params: {
          companyId: companyId,
          routeStr: routeStr,
        },
      });

      if (response && response.status === 200) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (responseData) {
          setLoading(false);
          setBusRoute(responseData.busRoute);
        }
      }
    } else if (companyId === "KMB") {
      const response = await axios.get(`${rootUrl}/kmb/bus-route`, {
        params: {
          route: routeStr,
          direction: direction,
          serviceType: 1,
        },
      });

      if (response && response.status === 200) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (responseData) {
          setLoading(false);
          setBusRoute(responseData.busRouteKmb);
        }
      }
    } else if (companyId === "NLB") {
      setLoading(false);
    }
  };

  const getCompanyText = (co) => {
    let companyText = "";

    if (co === "NWFB") {
      companyText = t("nwfb");
    } else if (co === "CTB") {
      companyText = t("ctb");
    } else {
      companyText = t("kmb");
    }

    return companyText;
  };

  const getDirectionText = (busRoute) => {
    let directionText = "";

    if (busRoute.co && (busRoute.co === "NWFB" || busRoute.co === "CTB")) {
      const direction = route.params.direction;
      if (direction === "outbound") {
        directionText = formatDirectionText();
      } else if (direction === "inbound") {
        directionText = formatDirectionTextReversed();
      }
    } else {
      directionText = formatDirectionText();
    }

    return directionText;
  };

  const formatDirectionText = () => {
    let directionText = "";

    if (i18n.language) {
      switch (i18n.language) {
        case "eng":
          directionText = `From ${busRoute.orig_en} to ${busRoute.dest_en}`;
          break;
        case "zh_hk":
          directionText = `From ${busRoute.orig_tc} to ${busRoute.dest_tc}`;
          break;
        case "zh_cn":
          directionText = `From ${busRoute.orig_sc} to ${busRoute.dest_sc}`;
          break;
        default:
          break;
      }
    }

    return directionText;
  };

  const formatDirectionTextReversed = () => {
    let directionText = "";

    if (i18n.language) {
      switch (i18n.language) {
        case "eng":
          directionText = `From ${busRoute.dest_en} to ${busRoute.orig_en}`;
          break;
        case "zh_hk":
          directionText = `From ${busRoute.dest_tc} to ${busRoute.orig_tc}`;
          break;
        case "zh_cn":
          directionText = `From ${busRoute.dest_sc} to ${busRoute.orig_sc}`;
          break;
        default:
          break;
      }
    }

    return directionText;
  };

  const renderBusRouteView = () => {
    let busRouteView = (
      <Card style={styles.cardContainer}>
        <Card.Content style={{ alignSelf: "center" }}>
          <Title>{t("pleaseWait")}</Title>
        </Card.Content>
      </Card>
    );

    if (!loading) {
      const companyId = route.params.companyId;
      if (companyId !== "NLB") {
        if (!_.isEmpty(busRoute)) {
          busRouteView = (
            <Card style={styles.cardContainer}>
              <Card.Title
                title={busRoute.route}
                subtitle={getCompanyText(busRoute.co)}
              />
              <Card.Content>
                <Paragraph>{getDirectionText(busRoute)}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button
                  mode="outlined"
                  style={{ padding: 5 }}
                  labelStyle={{ fontSize: 15 }}
                  uppercase={false}
                  onPress={() =>
                    handleEnterButtonClick(
                      route.params.companyId,
                      route.params.routeStr,
                      route.params.direction
                    )
                  }
                >
                  Enter
                </Button>
              </Card.Actions>
            </Card>
          );
        } else {
          busRouteView = (
            <Card style={styles.cardContainer}>
              <Card.Content style={{ alignSelf: "center" }}>
                <Title style={{ color: "red" }}>{t("noData")}</Title>
              </Card.Content>
            </Card>
          );
        }
      } else {
        busRouteView = (
          <Card style={styles.cardContainer}>
            <Card.Title title={route.params.routeStr} subtitle={t("nlb")} />
            <Card.Content>
              <Paragraph>{`From ${route.params.from} to ${route.params.to}`}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="outlined"
                style={{ padding: 5 }}
                labelStyle={{ fontSize: 15 }}
                uppercase={false}
                onPress={() =>
                  handleEnterButtonClick(
                    route.params.companyId,
                    route.params.routeStr,
                    route.params.direction
                  )
                }
              >
                Enter
              </Button>
            </Card.Actions>
          </Card>
        );
      }
    }

    return busRouteView;
  };

  const handleEnterButtonClick = (companyId, routeStr, direction) => {
    const busRouteId = route.params.busRouteId;

    navigation.navigate(t("busRouteStop"), {
      companyId: companyId,
      routeStr: routeStr,
      direction: direction,
      busRouteId: busRouteId,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      {renderBusRouteView()}
    </ScrollView>
  );
}

export default BusRoute;
