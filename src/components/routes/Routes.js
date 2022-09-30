import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, TouchableOpacity } from "react-native";
import { List, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { getRootUrl } from "../../helper/helper";
import CustomRadioButton from "../customRadioButton/CustomRadioButton";

const rootUrl = getRootUrl();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "azure",
    paddingVertical: 15,
  },
  textInputContainer: {
    marginHorizontal: 25,
    marginVertical: 5,
  },
  radioButtonContainer: {
    flexDirection: "row",
    marginHorizontal: 25,
    marginVertical: 5,
  },
  accordionContainer: {
    marginHorizontal: 25,
    marginVertical: 3,
  },
});

function Routes() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [nwfbOrCtbChecked, setNwfbOrCtbChecked] = useState(true);
  const [kmbChecked, setKmbChecked] = useState(false);

  const [nwfbAndCtbRoutes, setNwfbAndCtbRoutes] = useState([]);
  const [kmbRoutes, setKmbRoutes] = useState([]);

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getNwfbAndCtbRoutes();
    getKmbRoutes();
  }, []);

  const getNwfbAndCtbRoutes = async () => {
    const response = await axios.get(`${rootUrl}/bus-route-list`);
    if (response && response.status === 200) {
      const responseData = response.data;
      console.log("responseData = ", responseData);

      if (responseData) {
        setNwfbAndCtbRoutes(responseData.busRouteList);
      }
    }
  };

  const getKmbRoutes = async () => {
    const response = await axios.get(`${rootUrl}/kmb/bus-route-list`);
    if (response && response.status === 200) {
      const responseData = response.data;
      console.log("responseData = ", responseData);

      if (responseData) {
        setKmbRoutes(responseData.busRouteList);
      }
    }
  };

  const handleNwfbOrCtbRadioButtonClick = () => {
    setNwfbOrCtbChecked(true);
    setKmbChecked(false);
  };

  const handleKmbRadioButtonClick = () => {
    setNwfbOrCtbChecked(false);
    setKmbChecked(true);
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const handleListItemClick = (companyId, routeStr) => {
    navigation.navigate(t("busRoute"), {
      companyId: companyId,
      routeStr: routeStr,
    });
  };

  const renderNwfbAndCtbRoutes = (nwfbAndCtbRoutes) => {
    let nwfbAndCtbRoutesView = null;

    if (nwfbAndCtbRoutes) {
      let nwfbAndCtbRoutesList = nwfbAndCtbRoutes;

      if (searchText) {
        nwfbAndCtbRoutesList = nwfbAndCtbRoutes.filter((item) => {
          return item.route.toUpperCase().includes(searchText.toUpperCase());
        });
      }

      const nwfbAndCtbRoutesItemList = nwfbAndCtbRoutesList.map((item, i) => {
        return (
          <List.Item
            key={i}
            title={item.route}
            onPress={() => handleListItemClick(item.co, item.route)}
            left={(props) => <List.Icon {...props} icon="bus" />}
          />
        );
      });

      nwfbAndCtbRoutesView = (
        <List.Section>
          <List.Accordion
            title={t("nwfbAndCtb")}
            left={(props) => <List.Icon {...props} icon="bus" />}
          >
            {nwfbAndCtbRoutesItemList}
          </List.Accordion>
        </List.Section>
      );
    }

    return nwfbAndCtbRoutesView;
  };

  const renderKmbRoutes = (kmbRoutes) => {
    let kmbRoutesView = null;

    if (kmbRoutes) {
      let kmbRoutesList = kmbRoutes;

      if (searchText) {
        kmbRoutesList = kmbRoutes.filter((item) => {
          return item.route.toUpperCase().includes(searchText.toUpperCase());
        });
      }

      const kmbRoutesItemList = kmbRoutesList.map((item, i) => {
        return (
          <List.Item
            key={i}
            title={item.route}
            onPress={() => handleListItemClick("KMB", item.route)}
            left={(props) => <List.Icon {...props} icon="bus" />}
          />
        );
      });

      kmbRoutesView = (
        <List.Section>
          <List.Accordion
            title={t("kmb")}
            left={(props) => <List.Icon {...props} icon="bus" />}
          >
            {kmbRoutesItemList}
          </List.Accordion>
        </List.Section>
      );
    }

    return kmbRoutesView;
  };

  const renderRadioButtonView = () => {
    const radioButtonView = (
      <View style={styles.radioButtonContainer}>
        <TouchableOpacity onPress={() => handleNwfbOrCtbRadioButtonClick()}>
          <CustomRadioButton
            text={t("nwfbAndCtb")}
            checked={nwfbOrCtbChecked}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => handleKmbRadioButtonClick()}
        >
          <CustomRadioButton text={t("kmb")} checked={kmbChecked} />
        </TouchableOpacity>
      </View>
    );
    return radioButtonView;
  };

  const renderRoutesView = () => {
    let finalRoutesView = null;

    let routesView = null;
    if (nwfbOrCtbChecked && nwfbAndCtbRoutes) {
      routesView = (
        <View style={styles.accordionContainer}>
          {renderNwfbAndCtbRoutes(nwfbAndCtbRoutes)}
        </View>
      );
    }
    if (kmbChecked && kmbRoutes) {
      routesView = (
        <View style={styles.accordionContainer}>
          {renderKmbRoutes(kmbRoutes)}
        </View>
      );
    }

    finalRoutesView = (
      <View>
        <View style={styles.textInputContainer}>
          <TextInput
            label={t("searchRoutes")}
            placeholder={t("searchRoutes")}
            value={searchText}
            onChangeText={(text) => handleSearchTextChange(text)}
          />
        </View>
        {routesView}
      </View>
    );

    return finalRoutesView;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      {renderRadioButtonView()}
      {renderRoutesView()}
    </ScrollView>
  );
}

export default Routes;
