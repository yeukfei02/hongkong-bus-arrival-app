import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Button, Card, Paragraph } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import axios from "axios";
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

  const [busRoute, setBusRoute] = useState([]);

  useEffect(() => {
    if (route.params) {
      const companyId = route.params.companyId;
      const routeStr = route.params.routeStr;
      if (companyId && routeStr) {
        getBusRoute(companyId, routeStr);
      }
    }
  }, [route.params]);

  const getBusRoute = async (companyId, routeStr) => {
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
          setBusRoute(responseData.busRoute);
        }
      }
    } else if (companyId === "KMB") {
      const response = await axios.get(`${rootUrl}/kmb/bus-route`, {
        params: {
          route: routeStr,
          direction: "outbound",
          serviceType: 1,
        },
      });

      if (response && response.status === 200) {
        const responseData = response.data;
        console.log("responseData = ", responseData);

        if (responseData) {
          setBusRoute(responseData.busRouteKmb);
        }
      }
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

  const renderBusRouteView = () => {
    let busRouteView = null;

    if (busRoute) {
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
                  route.params.routeStr
                )
              }
            >
              Enter
            </Button>
          </Card.Actions>
        </Card>
      );
    }

    return busRouteView;
  };

  const handleEnterButtonClick = (companyId, routeStr) => {
    navigation.navigate(t("busRouteStop"), {
      companyId: companyId,
      routeStr: routeStr,
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
