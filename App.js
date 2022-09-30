import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import TabView from "./src/components/tabView/TabView";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "orange",
    accent: "red",
  },
};

// translations
import "./i18n";

function App() {
  return (
    <PaperProvider theme={theme}>
      <TabView />
    </PaperProvider>
  );
}

export default App;
