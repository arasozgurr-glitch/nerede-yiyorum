import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useTheme } from "../theme/ThemeContext";

// Google Places API'de genel bir "menü" verisi yoktur; bu yüzden mekanın kendi
// web sitesi varsa onu uygulama içinde gösteriyoruz. Site yoksa Google'da
// isim + "menü" araması açan bir düğme sunuyoruz.
export default function MenuTab({ restaurantName, website }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [webViewLoading, setWebViewLoading] = useState(true);
  const [webViewFailed, setWebViewFailed] = useState(false);

  if (!website) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(restaurantName + " menü")}`;
    return (
      <View style={styles.centerBox}>
        <Text style={styles.emptyText}>Bu mekan için kayıtlı bir web sitesi bulunamadı.</Text>
        <TouchableOpacity style={styles.searchBtn} onPress={() => Linking.openURL(searchUrl)}>
          <Text style={styles.searchBtnText}>Google'da menüyü ara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (webViewFailed) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.emptyText}>Site uygulama içinde açılamadı.</Text>
        <TouchableOpacity style={styles.searchBtn} onPress={() => Linking.openURL(website)}>
          <Text style={styles.searchBtnText}>Tarayıcıda aç</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.webWrap}>
      {webViewLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={colors.accent} />
        </View>
      )}
      <WebView
        source={{ uri: website }}
        onLoadEnd={() => setWebViewLoading(false)}
        onError={() => setWebViewFailed(true)}
        style={styles.webview}
      />
      <TouchableOpacity style={styles.openExternal} onPress={() => Linking.openURL(website)}>
        <Text style={styles.openExternalText}>Tarayıcıda aç ↗</Text>
      </TouchableOpacity>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    webWrap: { flex: 1, minHeight: 420 },
    webview: { flex: 1 },
    loadingOverlay: {
      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
      alignItems: "center", justifyContent: "center", backgroundColor: colors.bg, zIndex: 1,
    },
    openExternal: { alignItems: "center", paddingVertical: 10, backgroundColor: colors.card },
    openExternalText: { color: colors.accent, fontSize: 13, fontWeight: "600" },
    centerBox: { alignItems: "center", justifyContent: "center", padding: 32, minHeight: 240 },
    emptyText: { fontSize: 14, color: colors.inkSoft, textAlign: "center", marginBottom: 16 },
    searchBtn: { backgroundColor: colors.ink, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20 },
    searchBtnText: { color: colors.bg, fontWeight: "700", fontSize: 14 },
  });
}
