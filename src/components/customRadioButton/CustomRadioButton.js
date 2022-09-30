import React from "react";
import { Text, View } from "react-native";

function CustomRadioButton(props) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <View
        style={[
          {
            height: 24,
            width: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: "black",
            alignItems: "center",
            justifyContent: "center",
          },
          props.style,
        ]}
      >
        {props.checked ? (
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: "black",
            }}
          />
        ) : null}
      </View>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          color: "black",
          marginLeft: 8,
        }}
      >
        {props.text}
      </Text>
    </View>
  );
}

export default CustomRadioButton;
