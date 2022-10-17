import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Linking } from "react-native";
import { Card } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "azure",
    paddingVertical: 15,
  },
  contactUsContainer: {
    padding: 20,
    marginHorizontal: 30,
    marginVertical: 15,
  },
  contactUsTextStyle: {
    fontSize: 18,
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  changeLanguageContainer: {
    padding: 20,
    marginHorizontal: 30,
    marginVertical: 15,
  },
  changeLanguageTitleStyle: {
    fontSize: 18,
    marginBottom: 10,
  },
});

function Settings() {
  const { t, i18n } = useTranslation();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [items, setItems] = useState([
    {
      label: t("selectLanguage"),
      value: t("selectLanguage"),
    },
    {
      label: t("english"),
      value: t("english"),
    },
    {
      label: t("traditionalChinese"),
      value: t("traditionalChinese"),
    },
    {
      label: t("simplifiedChinese"),
      value: t("simplifiedChinese"),
    },
  ]);

  useEffect(() => {
    if (i18n.language) {
      switch (i18n.language) {
        case "eng":
          setValue(t("english"));
          break;
        case "zh_hk":
          setValue(t("traditionalChinese"));
          break;
        case "zh_cn":
          setValue(t("simplifiedChinese"));
          break;
        default:
      }
    }
  }, [i18n.language]);

  const onChangeValue = (value) => {
    if (value) {
      switch (value) {
        case "English":
        case "英文":
        case "英语":
          i18n.changeLanguage("eng");
          break;
        case "Traditional Chinese":
        case "繁體中文":
        case "繁体中文":
          i18n.changeLanguage("zh_hk");
          break;
        case "Simplified Chinese":
        case "簡體中文":
        case "简体中文":
          i18n.changeLanguage("zh_cn");
          break;
        default:
      }
    }
  };

  const renderSelectDropdown = () => {
    const selectDropdown = (
      <View>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          onChangeValue={onChangeValue}
        />
      </View>
    );

    return selectDropdown;
  };

  const handleEmailClick = () => {
    Linking.openURL(`mailto:yeukfei02@gmail.com`);
  };

  const handleGithubClick = () => {
    Linking.openURL(`https://github.com/yeukfei02`);
  };

  const handleIosIconClick = () => {
    Linking.openURL(
      `https://apps.apple.com/us/app/hong-kong-minibus-arrival/id6443601128`
    );
  };

  const handleAndroidIconClick = () => {
    Linking.openURL(
      `https://play.google.com/store/apps/details?id=com.donaldwu.hongkongminibusarrivalapp`
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.contactUsContainer}>
        <Text style={styles.contactUsTextStyle}>{t("contactUsTitle")}</Text>

        <View style={{ marginVertical: 5 }}></View>

        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="email"
            size={40}
            color="black"
            onPress={() => handleEmailClick()}
          />
          <AntDesign
            name="github"
            size={40}
            color="black"
            onPress={() => handleGithubClick()}
          />
        </View>
      </Card>

      <Card style={styles.contactUsContainer}>
        <Text style={styles.contactUsTextStyle}>
          {t("hongkongMinibusArrivalApp")}
        </Text>

        <View style={{ marginVertical: 5 }}></View>

        <View style={styles.iconContainer}>
          <AntDesign
            name="apple1"
            size={40}
            color="black"
            onPress={() => handleIosIconClick()}
          />
          <AntDesign
            name="android1"
            size={40}
            color="black"
            onPress={() => handleAndroidIconClick()}
          />
        </View>
      </Card>

      <Card style={styles.changeLanguageContainer}>
        <Text style={styles.changeLanguageTitleStyle}>
          {t("changeLanguage")}
        </Text>

        <View style={{ marginVertical: 5 }}></View>

        {renderSelectDropdown()}
      </Card>
    </View>
  );
}

export default Settings;
