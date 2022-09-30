import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import resources from "./src/translations/common.json";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources: resources,
  lng: "zh_hk",
  fallbackLng: "zh_hk",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
