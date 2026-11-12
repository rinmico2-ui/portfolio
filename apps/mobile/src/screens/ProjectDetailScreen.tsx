import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { api } from "../services/api";

export default function ProjectDetailScreen({ route }: any) {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api(`/api/projects/${route.params.slug}`).then(j => { setProject(j.data); setLoading(false); }).catch(() => setLoading(false)); }, [route.params.slug]);
  if (loading) return <View style={styles.center}><ActivityIndicator/></View>;
  if (!project) return <View style={styles.center}><Text style={{ color: "#94A3B8" }}>Not found</Text></View>;
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{project.title}</Text>
      <Text style={styles.summary}>{project.summary}</Text>
      <Text style={styles.desc}>{project.description}</Text>
      <Text style={styles.tech}>{(project.techStack || []).join(", ")}</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080B14", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#080B14" },
  title: { color: "#F8FAFC", fontSize: 22, fontWeight: "bold" },
  summary: { color: "#94A3B8", marginTop: 8 },
  desc: { color: "#F8FAFC", marginTop: 12, lineHeight: 20 },
  tech: { color: "#06B6D4", marginTop: 12 },
});
