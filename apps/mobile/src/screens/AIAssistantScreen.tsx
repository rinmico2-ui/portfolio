import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { api } from "../services/api";

export default function AIAssistantScreen() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([{ role: "assistant", content: "Hi! Ask me anything about the developer." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const send = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const j = await api("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text, sessionId: "mobile" }) });
      setMessages(m => [...m, { role: "assistant", content: j.data?.reply || "Sorry." }]);
    } catch { setMessages(m => [...m, { role: "assistant", content: "Network error." }]); }
    setLoading(false);
  };
  return (
    <View style={styles.container}>
      <ScrollView style={styles.chat}>
        {messages.map((m, i) => (
          <View key={i} style={[styles.bubble, m.role === "user" ? styles.user : styles.bot]}>
            <Text style={styles.bubbleText}>{m.content}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Ask..." placeholderTextColor="#94A3B8" />
        <TouchableOpacity style={styles.send} onPress={send}><Text style={{ color: "#fff" }}>Send</Text></TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080B14" },
  chat: { flex: 1, padding: 16 },
  bubble: { padding: 12, borderRadius: 12, marginBottom: 8, maxWidth: "80%" },
  user: { backgroundColor: "#6366F1", alignSelf: "flex-end" },
  bot: { backgroundColor: "#131C2D", alignSelf: "flex-start" },
  bubbleText: { color: "#F8FAFC" },
  inputRow: { flexDirection: "row", padding: 12, borderTopWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  input: { flex: 1, backgroundColor: "#131C2D", color: "#F8FAFC", padding: 10, borderRadius: 8, marginRight: 8 },
  send: { backgroundColor: "#6366F1", padding: 12, borderRadius: 8 },
});
