import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { api } from "../services/api";

export default function ContactScreen() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    setLoading(true);
    try {
      const j = await api("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (j.success) { Alert.alert("Sent", "Message sent successfully."); setForm({ name: "", email: "", subject: "", message: "" }); }
      else Alert.alert("Error", j.error || "Failed");
    } catch { Alert.alert("Error", "Network error"); }
    setLoading(false);
  };
  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#94A3B8" value={form.name} onChangeText={v => setForm({ ...form, name: v })} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#94A3B8" value={form.email} onChangeText={v => setForm({ ...form, email: v })} />
      <TextInput style={styles.input} placeholder="Subject" placeholderTextColor="#94A3B8" value={form.subject} onChangeText={v => setForm({ ...form, subject: v })} />
      <TextInput style={[styles.input, { height: 120 }]} placeholder="Message" placeholderTextColor="#94A3B8" multiline value={form.message} onChangeText={v => setForm({ ...form, message: v })} />
      <TouchableOpacity style={styles.btn} onPress={submit} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "Sending..." : "Send"}</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080B14", padding: 16 },
  input: { backgroundColor: "#131C2D", color: "#F8FAFC", padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  btn: { backgroundColor: "#6366F1", padding: 14, borderRadius: 8, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "600" },
});
