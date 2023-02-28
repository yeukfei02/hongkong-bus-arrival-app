import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { List, TextInput } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { getRootUrl } from "../../helper/helper";
import _ from "lodash";

const rootUrl = getRootUrl();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "azure",
    paddingVertical: 15,
  },
  textInputContainer: {
    marginHorizontal: 25,
    marginVertical: 10,
  },
  dropdownContainer: {
    marginHorizontal: 25,
    marginVertical: 15,
  },
  accordionContainer: {
    marginHorizontal: 25,
    marginVertical: 3,
  },
});

function SearchBusRoutes() {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const [busCompanyOpen, setBusCompanyOpen] = useState(false);
  const [busCompanyValue, setBusCompanyValue] = useState(t("nwfbAndCtb"));
  const [busCompanyItems, setBusCompanyItems] = useState([
    {
      label: t("nwfbAndCtb"),
      value: t("nwfbAndCtb"),
    },
    {
      label: t("kmb"),
      value: t("kmb"),
    },
    {
      label: t("nlb"),
      value: t("nlb"),
    },
  ]);

  const [directionOpen, setDirectionOpen] = useState(false);
  const [directionValue, setDirectionValue] = useState(t("outbound"));
  const [directionItems, setDirectionItems] = useState([
    {
      label: t("outbound"),
      value: t("outbound"),
    },
    {
      label: t("inbound"),
      value: t("inbound"),
    },
  ]);

  const [nwfbAndCtbRoutes, setNwfbAndCtbRoutes] = useState([]);
  const [kmbRoutes, setKmbRoutes] = useState([]);
  const [nlbRoutes, setNlbRoutes] = useState([]);

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getNwfbAndCtbRoutes();
    getKmbRoutes();
    getNlbRoutes();
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
        const uniqBusRouteList = _.uniqBy(responseData.busRouteList, "route");
        setKmbRoutes(uniqBusRouteList);
      }
    }
  };

  const getNlbRoutes = async () => {
    const response = await axios.get(`${rootUrl}/nlb/bus-route-list`);
    if (response && response.status === 200) {
      const responseData = response.data;
      console.log("responseData = ", responseData);

      if (responseData) {
        // const uniqBusRouteList = _.uniqBy(responseData.busRouteList, "routeNo");
        setNlbRoutes(responseData.busRouteList);
      }
    }
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const handleListItemClick = async (companyId, routeStr, busRouteId) => {
    let direction = "";
    if (directionValue === t("outbound")) {
      direction = "outbound";
    } else if (directionValue === t("inbound")) {
      direction = "inbound";
    }

    let from = "";
    let to = "";
    if (companyId === "NLB") {
      const data = await getBusRouteStop(busRouteId);
      if (data) {
        from = data.from;
        to = data.to;
      }
    }

    navigation.navigate(t("busRoute"), {
      companyId: companyId,
      routeStr: routeStr,
      direction: direction,
      busRouteId: busRouteId,
      from: from,
      to: to,
    });
  };

  const getBusRouteStop = async (busRouteId) => {
    let data = {};

    const response = await axios.get(`${rootUrl}/nlb/bus-route-stop`, {
      params: {
        busRouteId: busRouteId,
      },
    });

    if (response && response.status === 200) {
      const responseData = response.data;
      console.log("responseData = ", responseData);

      if (responseData) {
        const busRouteStopsNlb = responseData.busRouteStopNlb;
        const from = getStopNameText(busRouteStopsNlb[0]);
        const to = getStopNameText(
          busRouteStopsNlb[busRouteStopsNlb.length - 1]
        );
        data["from"] = from;
        data["to"] = to;
      }
    }

    return data;
  };

  const getStopNameText = (stop) => {
    let stopNameText = "";

    if (i18n.language) {
      switch (i18n.language) {
        case "eng":
          stopNameText = stop.stopName_e;
          break;
        case "zh_hk":
          stopNameText = stop.stopName_c;
          break;
        case "zh_cn":
          stopNameText = stop.stopName_s;
          break;
        default:
          break;
      }
    }

    return stopNameText;
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

  const renderNlbRoutes = (nlbRoutes) => {
    let nlbRoutesView = null;

    if (nlbRoutes) {
      let nlbRoutesList = nlbRoutes;

      if (searchText) {
        nlbRoutesList = nlbRoutes.filter((item) => {
          return item.routeNo.toUpperCase().includes(searchText.toUpperCase());
        });
      }

      const nlbRoutesItemList = nlbRoutesList.map((item, i) => {
        return (
          <List.Item
            key={i}
            title={item.routeNo}
            onPress={() =>
              handleListItemClick("NLB", item.routeNo, item.routeId)
            }
            left={(props) => <List.Icon {...props} icon="bus" />}
          />
        );
      });

      nlbRoutesView = (
        <List.Section>
          <List.Accordion
            title={t("nlb")}
            left={(props) => <List.Icon {...props} icon="bus" />}
          >
            {nlbRoutesItemList}
          </List.Accordion>
        </List.Section>
      );
    }

    return nlbRoutesView;
  };

  const onChangeValue = (value) => {
    if (value) {
      switch (value) {
        case t("nwfbAndCtb"):
          setBusCompanyValue(t("nwfbAndCtb"));
          break;
        case t("kmb"):
          setBusCompanyValue(t("kmb"));
          break;
        case t("nlb"):
          setBusCompanyValue(t("nlb"));
          break;
        default:
      }
    }
  };

  const onChangeValue2 = (value) => {
    if (value) {
      switch (value) {
        case t("outbound"):
          setDirectionValue(t("outbound"));
          break;
        case t("inbound"):
          setDirectionValue(t("inbound"));
          break;
        default:
      }
    }
  };

  const renderBusCompanySelectDropdown = () => {
    const selectDropdown = (
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={busCompanyOpen}
          value={busCompanyValue}
          items={busCompanyItems}
          setOpen={setBusCompanyOpen}
          setValue={setBusCompanyValue}
          setItems={setBusCompanyItems}
          onChangeValue={onChangeValue}
        />
      </View>
    );

    return selectDropdown;
  };

  const renderDirectionSelectDropdown = () => {
    const selectDropdown = (
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={directionOpen}
          value={directionValue}
          items={directionItems}
          setOpen={setDirectionOpen}
          setValue={setDirectionValue}
          setItems={setDirectionItems}
          onChangeValue={onChangeValue2}
        />
      </View>
    );

    return selectDropdown;
  };

  const renderRoutesView = () => {
    let finalRoutesView = null;

    let routesView = null;
    if (busCompanyValue === t("nwfbAndCtb") && nwfbAndCtbRoutes) {
      routesView = (
        <View style={styles.accordionContainer}>
          {renderNwfbAndCtbRoutes(nwfbAndCtbRoutes)}
        </View>
      );
    }
    if (busCompanyValue === t("kmb") && kmbRoutes) {
      routesView = (
        <View style={styles.accordionContainer}>
          {renderKmbRoutes(kmbRoutes)}
        </View>
      );
    }
    if (busCompanyValue === t("nlb") && nlbRoutes) {
      routesView = (
        <View style={styles.accordionContainer}>
          {renderNlbRoutes(nlbRoutes)}
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
      <View style={{ zIndex: 1000 }}>{renderBusCompanySelectDropdown()}</View>
      <View style={{ zIndex: 900 }}>{renderDirectionSelectDropdown()}</View>
      <View style={{ zIndex: 800 }}>{renderRoutesView()}</View>
    </ScrollView>
  );
}

export default SearchBusRoutes;
