import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { api } from "../services/api";

export default function ArticleDetailScreen({ route }: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api(`/api/blog/${route.params.slug}`).then(j => { setData(j.data); setLoading(false); }).catch(() => setLoading(false)); }, [route.params.slug]);
  if (loading) return <View style={styles.center}><ActivityIndicator/></View>;
  if (!data?.post) return <View style={styles.center}><Text style={{ color: "#94A3B8" }}>Not found</Text></View>;
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{data.post.title}</Text>
      <Text style={styles.content}>{data.post.content}</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080B14", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#080B14" },
  title: { color: "#F8FAFC", fontSize: 22, fontWeight: "bold" },
  content: { color: "#F8FAFC", marginTop: 12, lineHeight: 20 },
});
