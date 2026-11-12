import React from "react";
import { View, Text, StyleSheet } from "react-native";
export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings</Text>
      <Text style={styles.sub}>Configure API base URL via EXPO_PUBLIC_API_BASE.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080B14", padding: 16 },
  text: { color: "#F8FAFC", fontSize: 20, fontWeight: "bold" },
  sub: { color: "#94A3B8", marginTop: 8 },
});
