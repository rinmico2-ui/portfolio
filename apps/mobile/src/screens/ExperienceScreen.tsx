import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { api } from "../services/api";

export default function ExperienceScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api("/api/experience").then(j => { setItems(j.data || []); setLoading(false); }).catch(() => setLoading(false)); }, []);
  if (loading) return <View style={styles.center}><ActivityIndicator/></View>;
  return (
    <ScrollView style={styles.container}>
      {items.map((e: any) => (
        <View key={e.id} style={styles.card}>
          <Text style={styles.pos}>{e.position}</Text>
          <Text style={styles.company}>{e.company}</Text>
          <Text style={styles.meta}>{e.startDate?.slice(0, 10)}{e.current ? " - Present" : ""}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080B14", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#080B14" },
  card: { backgroundColor: "#131C2D", padding: 16, borderRadius: 12, marginBottom: 12 },
  pos: { color: "#F8FAFC", fontSize: 16, fontWeight: "600" },
  company: { color: "#06B6D4", marginTop: 2 },
  meta: { color: "#94A3B8", marginTop: 4 },
});
