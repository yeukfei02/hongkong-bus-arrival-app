import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Platform,
  Linking,
  Text,
} from "react-native";
import { Button, Card, Paragraph, Title } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import * as Location from "expo-location";
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

function NearbyBusStop() {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(true);

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [nwfbOrCtbBusStopList, setNwfbOrCtbBusStopList] = useState([]);
  const [kmbBusStopList, setKmbBusStopList] = useState([]);

  useEffect(() => {
    getUserCurrentLocation();
  }, []);

  useEffect(() => {
    if (latitude !== 0 && longitude !== 0) {
      getNearMeList(latitude, longitude);
    }
  }, [latitude, longitude]);

  const getUserCurrentLocation = () => {
    const hongkongLatitude = 22.3193;
    const hongkongLongitude = 114.1694;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({});
          console.log("latitude = ", location.coords.latitude);
          console.log("longitude = ", location.coords.longitude);

          setLatitude(location.coords.latitude);
          setLongitude(location.coords.longitude);
        } else {
          setLatitude(hongkongLatitude);
          setLongitude(hongkongLongitude);
        }
      } catch (e) {
        console.log("error = ", e);
      }
    })();
  };

  const getNearMeList = async (latitude, longitude) => {
    const nwfbOrCtbResponse = await axios.get(`${rootUrl}/bus-stop-list`);
    if (nwfbOrCtbResponse && nwfbOrCtbResponse.status === 200) {
      const nwfbOrCtbBusStopListResponseData = nwfbOrCtbResponse.data;
      if (nwfbOrCtbBusStopListResponseData) {
        const filteredNwfbOrCtbNearMeList =
          nwfbOrCtbBusStopListResponseData.busStopList.filter((item) => {
            if (
              _.inRange(latitude, item.lat - 0.0015, item.lat + 0.0015) &&
              _.inRange(longitude, item.long - 0.0015, item.long + 0.0015)
            ) {
              return item;
            }
          });
        console.log(
          "filteredNwfbOrCtbNearMeList.length = ",
          filteredNwfbOrCtbNearMeList.length
        );
        setNwfbOrCtbBusStopList(filteredNwfbOrCtbNearMeList);
      }
    }

    const kmbBusStopListResponse = await axios.get(
      `${rootUrl}/kmb/bus-stop-list`
    );
    if (kmbBusStopListResponse && kmbBusStopListResponse.status === 200) {
      const kmbBusStopListResponseData = kmbBusStopListResponse.data;
      if (kmbBusStopListResponseData) {
        const filteredKmbNearMeList =
          kmbBusStopListResponseData.busStopList.filter((item) => {
            if (
              _.inRange(latitude, item.lat - 0.0015, item.lat + 0.0015) &&
              _.inRange(longitude, item.long - 0.0015, item.long + 0.0015)
            ) {
              return item;
            }
          });
        console.log(
          "filteredKmbNearMeList.length = ",
          filteredKmbNearMeList.length
        );
        setKmbBusStopList(filteredKmbNearMeList);
      }
    }

    setLoading(false);
  };

  const getNameText = (item) => {
    let nameText = "";

    if (i18n.language) {
      switch (i18n.language) {
        case "eng":
          nameText = item.name_en;
          break;
        case "zh_hk":
          nameText = item.name_tc;
          break;
        case "zh_cn":
          nameText = item.name_sc;
          break;
        default:
          break;
      }
    }

    return nameText;
  };

  const renderNearMe = () => {
    let nearMeView = (
      <View>
        <Card style={styles.cardContainer}>
          <Card.Content style={{ alignSelf: "center" }}>
            <Title>{t("pleaseWait")}</Title>
          </Card.Content>
        </Card>
      </View>
    );

    if (!loading) {
      if (!_.isEmpty(nwfbOrCtbBusStopList) || !_.isEmpty(kmbBusStopList)) {
        const formattedNwfbOrCtbBusStopList = nwfbOrCtbBusStopList.map(
          (item, i) => {
            return (
              <View key={i}>
                <Card style={styles.cardContainer}>
                  <Card.Content>
                    <Title>{getNameText(item)}</Title>
                    <Paragraph
                      style={styles.openInMap}
                      onPress={() => handleOpenInMap(item.lat, item.long)}
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
                      onPress={() => handleEnterButtonClick(item.stop, 'nwfbOrCtb')}
                    >
                      Enter
                    </Button>
                  </Card.Actions>
                </Card>
              </View>
            );
          }
        );

        const formattedKmbBusStopList = kmbBusStopList.map((item, i) => {
          return (
            <View key={i}>
              <Card style={styles.cardContainer}>
                <Card.Content>
                  <Title>{getNameText(item)}</Title>
                  <Paragraph
                    style={styles.openInMap}
                    onPress={() => handleOpenInMap(item.lat, item.long)}
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
                    onPress={() => handleEnterButtonClick(item.stop, 'kmb')}
                  >
                    Enter
                  </Button>
                </Card.Actions>
              </Card>
            </View>
          );
        });

        nearMeView = (
          <>
            {!_.isEmpty(formattedNwfbOrCtbBusStopList) ? (
              <View>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "black",
                    marginHorizontal: 25,
                    marginVertical: 15,
                  }}
                >
                  {t("nwfbAndCtb")}
                </Text>
                {formattedNwfbOrCtbBusStopList}
              </View>
            ) : null}
            {!_.isEmpty(formattedKmbBusStopList) ? (
              <View>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "black",
                    marginHorizontal: 25,
                    marginVertical: 15,
                  }}
                >
                  {t("kmb")}
                </Text>
                {formattedKmbBusStopList}
              </View>
            ) : null}
          </>
        );
      } else {
        nearMeView = (
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

    return nearMeView;
  };

  const handleEnterButtonClick = (busStopId, company) => {
    navigation.navigate(t("busStopArrivalTime"), {
      busStopId: busStopId,
      company: company
    });
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
      {renderNearMe()}
    </ScrollView>
  );
}

export default NearbyBusStop;
