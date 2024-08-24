import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { useRef } from "react";
import { useFonts } from "expo-font";

const lottie = () => {
  const animation = useRef(null);
  const [fontsLoaded] = useFonts({
    CustomFont: require("../assets/fonts/Matemasie-Regular.ttf"), // Update with your font path and name
  });

  if (!fontsLoaded) {
    return <Text>Loading</Text>;
  }

  return (
    <View style={{ backgroundColor: "black", flex: 1 }}>
      <Text
        style={{
          fontSize: 35,
          color: "white",
          padding: 20,
          textAlign: "center",
          fontFamily: 'CustomFont'
        }}
      >
        {" "}
        Hello, Welcome!{" "}
      </Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 300,
            height: 300,
          }}
          // Find more Lottie files at https://lottiefiles.com/featured
          source={require("../assets/animate/welcome2.json")}
        />
      </View>
      <TouchableOpacity onPress={() =>{
        animation.current?.reset();
        animation.current?.play();
        //animation.current?.pause();
      }}>
      <Text style={{color:'white',fontFamily:'CustomFont',textAlign:'center',fontSize:24}} > I am Ko Win Htike </Text>
      </TouchableOpacity>
    </View>
  );
};

export default lottie;

const styles = StyleSheet.create({});
