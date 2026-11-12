import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { api } from "../services/api";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api("/api/profile").then(j => { setProfile(j.data); setLoading(false); }).catch(() => setLoading(false)); }, []);
  if (loading) return <View style={styles.center}><ActivityIndicator/></View>;
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{profile?.fullName}</Text>
      <Text style={styles.title}>{profile?.professionalTitle}</Text>
      <Text style={styles.bio}>{profile?.biography}</Text>
      <Text style={styles.meta}>Location: {profile?.location}</Text>
      <Text style={styles.meta}>Email: {profile?.email}</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080B14", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#080B14" },
  name: { color: "#F8FAFC", fontSize: 24, fontWeight: "bold" },
  title: { color: "#06B6D4", marginTop: 4 },
  bio: { color: "#94A3B8", marginTop: 12, lineHeight: 20 },
  meta: { color: "#94A3B8", marginTop: 8 },
});
