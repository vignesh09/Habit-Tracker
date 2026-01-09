import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, View } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.background}>
        <View style={styles.blobTop} />
        <View style={styles.blobBottom} />
      </View>
      <HomeScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3EC",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  blobTop: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 160,
    backgroundColor: "#F1D6AE",
    top: -120,
    right: -80,
    opacity: 0.6,
  },
  blobBottom: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 190,
    backgroundColor: "#D6E3D2",
    bottom: -160,
    left: -120,
    opacity: 0.65,
  },
});
