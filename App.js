import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import VoicePanel from "./components/VoicePanel";
import TextPanel from "./components/TextPanel";

export default function App() {
  // The filename of the currently active audio (set by VoicePanel, read by TextPanel)
  const [audioFilename, setAudioFilename] = useState(null);

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />

      {/* App header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Speech → Transcript</Text>
      </View>

      {/* Top panel: record / upload */}
      <VoicePanel onAudioReady={setAudioFilename} />

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom panel: extract text / to transcript */}
      <TextPanel audioFilename={audioFilename} />
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    backgroundColor: "#0f3460",
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: "#4facfe",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
  divider: {
    height: 2,
    backgroundColor: "#4facfe",
    opacity: 0.3,
  },
});
