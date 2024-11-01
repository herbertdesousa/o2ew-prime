import { Link } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Intro() {
  return (
    <SafeAreaView style={{ gap: 32, paddingHorizontal: 24, paddingTop: 32 }}>
      <Text style={{ fontSize: 24, color: 'white' }}>Introdução</Text>

      <Link href="/main">
        <Text style={{ fontSize: 18, color: 'white' }}>Próximo</Text>
      </Link>
    </SafeAreaView>
  )
}