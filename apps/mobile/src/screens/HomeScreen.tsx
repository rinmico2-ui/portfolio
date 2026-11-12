import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { api } from "../services/api";

export default function HomeScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api("/api/profile").then(j => { setProfile(j.data); setLoading(false); }).catch(() => setLoading(false)); }, []);
  if (loading) return <View style={styles.center}><ActivityIndicator/></View>;
  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.name}>{profile?.fullName || "Developer"}</Text>
        <Text style={styles.title}>{profile?.professionalTitle}</Text>
        <Text style={styles.bio}>{profile?.biography}</Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080B14" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#080B14" },
  hero: { padding: 24 },
  name: { fontSize: 28, fontWeight: "bold", color: "#F8FAFC" },
  title: { fontSize: 16, color: "#06B6D4", marginTop: 4 },
  bio: { fontSize: 14, color: "#94A3B8", marginTop: 12, lineHeight: 20 },
});
