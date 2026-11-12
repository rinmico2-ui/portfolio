import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { api } from "../services/api";

export default function ProjectsScreen({ navigation }: any) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api("/api/projects").then(j => { setProjects(j.data?.items || []); setLoading(false); }).catch(() => setLoading(false)); }, []);
  if (loading) return <View style={styles.center}><ActivityIndicator/></View>;
  return (
    <FlatList
      style={styles.container}
      data={projects}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ProjectDetail", { slug: item.slug })}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.summary}>{item.summary}</Text>
          <Text style={styles.tech}>{(item.techStack || []).join(", ")}</Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No projects.</Text>}
    />
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080B14", padding: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#080B14" },
  card: { backgroundColor: "#131C2D", padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  title: { color: "#F8FAFC", fontSize: 16, fontWeight: "600" },
  summary: { color: "#94A3B8", fontSize: 13, marginTop: 4 },
  tech: { color: "#06B6D4", fontSize: 12, marginTop: 6 },
  empty: { color: "#94A3B8", textAlign: "center", marginTop: 40 },
});
