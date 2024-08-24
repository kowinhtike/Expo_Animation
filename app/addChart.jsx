import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  Image,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

const ProductItem = ({ item, handleAnimate }) => {
  const itemRef = useRef(null);

  const handleAddToCart = () => {
    itemRef.current.measure((fx, fy, width, height, px, py) => {
      handleAnimate(px, py, width, height, item);
    });
  };

  return (
    <View ref={itemRef} style={styles.itemContainer}>
      <Text style={styles.name}>{item.name}</Text>
      <Image style={styles.photo} source={{ uri: item.photo }} />
      <Button title="Add to Cart" onPress={handleAddToCart} />
    </View>
  );
};

const addChart = () => {
  const list = [
    {
      name: "Timex Men",
      price: "250",
      photo:
        "https://m.media-amazon.com/images/I/71z+YnT3J8L._AC_UL480_FMwebp_QL65_.jpg",
      id: "1",
    },
    {
      name: "Nine West Women",
      price: "500",
      photo:
        "https://m.media-amazon.com/images/I/81-HbGIsxVL._AC_UL480_FMwebp_QL65_.jpg",
      id: "2",
    },
    {
      name: "BOFAN Nurse",
      price: "1000",
      photo:
        "https://m.media-amazon.com/images/I/613T1jt71wL._AC_UL480_FMwebp_QL65_.jpg",
      id: "3",
    },
  ];

  const [cartItems, setCartItems] = useState([]);
  const numColumns = Platform.OS === "web" ? 3 : 1;

  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDetails, setAnimationDetails] = useState(null);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const cartRef = useRef(null);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      position: "absolute",
      zIndex: 1, // Ensure this is on top
      width: animationDetails?.width,
      height: animationDetails?.height,

      elevation: 5, // For Android
    };
  });

  const handleAnimate = (px, py, width, height, item) => {
    scale.value = 1;
    cartRef.current.measure((cfx, cfy, cWidth, cHeight, cpx, cpy) => {

        setIsAnimating(true);
        setAnimationDetails({ px, py, width, height, item });
        
        translateX.value = withTiming(cpx - px - 80, { duration: 500 });
        translateY.value = withTiming(cpy - py - 140, { duration: 500 });
        scale.value = withTiming(0.25, { duration: 500 }, () => {
          runOnJS(setCartItems)([...cartItems,item]);
          runOnJS(setIsAnimating)(false);
          translateX.value = 0;
          translateY.value = 0;
          scale.value = 0;
        });

    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        key={numColumns}
        numColumns={numColumns}
        data={list}
        renderItem={({ item }) => (
          <ProductItem
            key={item.id}
            item={item}
            handleAnimate={handleAnimate}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.cartRoot}>
        <View ref={cartRef} style={styles.cartContainer}>
          <Ionicons name="basket" size={30} />
          <Text style={styles.count}> {cartItems.length}</Text>
        </View>
      </View>
      {isAnimating && animationDetails && (
        <Animated.View
          style={[
            animatedStyle,
            {
              top: animationDetails.py,
              left: animationDetails.px,
            },
            { backgroundColor: "none" },
          ]}
        >
          <Image
            style={styles.photo}
            source={{ uri: animationDetails.item.photo }}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default addChart;

const styles = StyleSheet.create({
  container: { flex: 1 },
  itemContainer: {
    width: 200,
    padding: 12,
    backgroundColor: "white",
    margin: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
  cartContainer: {
    width: 50,
    height: 50,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 15,
  },
  photo: { width: 100, height: 100, margin: 10 },
  cartRoot: {
    padding: 12,
    alignItems: "flex-end",
    position: "absolute",
    top: 10,
    right: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
  },
  count: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "red",
    color: "white",
    padding: 2,
    borderRadius: 15,
    fontSize: 14,
  },
});
