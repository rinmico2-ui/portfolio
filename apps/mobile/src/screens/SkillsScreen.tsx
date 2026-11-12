import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { api } from "../services/api";

export default function SkillsScreen() {
  const [data, setData] = useState<any>({ categories: [], skills: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => { api("/api/skills").then(j => { setData(j.data); setLoading(false); }).catch(() => setLoading(false)); }, []);
  if (loading) return <View style={styles.center}><ActivityIndicator/></View>;
  return (
    <ScrollView style={styles.container}>
      {(data.categories || []).map((c: any) => (
        <View key={c.id} style={styles.card}>
          <Text style={styles.cat}>{c.name}</Text>
          <View style={styles.row}>
            {(data.skills || []).filter((s: any) => s.categoryId === c.id).map((s: any) => (
              <Text key={s.id} style={styles.skill}>{s.name}</Text>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080B14", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#080B14" },
  card: { backgroundColor: "#131C2D", padding: 16, borderRadius: 12, marginBottom: 12 },
  cat: { color: "#F8FAFC", fontSize: 16, fontWeight: "600" },
  row: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  skill: { color: "#06B6D4", marginRight: 8, marginBottom: 4 },
});
