import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function App() {
  const [html, setHtml] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      const asset = Asset.fromModule(
        require("../assets/web/dist/index.html")
      );
      await asset.downloadAsync();

      const htmlString = await FileSystem.readAsStringAsync(
        asset.localUri!
      );

      setHtml(htmlString);
    })();
  }, []);

  if (!html) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FBFAF9" }}>
      <WebView
        originWhitelist={["*"]}
        source={{ html, baseUrl: "https://app.local" }}
        javaScriptEnabled
        domStorageEnabled
        style={{
          marginTop: insets.top, // ✅ dynamic, per device
        }}
      />
    </SafeAreaView>
  );
}
