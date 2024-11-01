import { SingleViewPager } from "@/components/SingleViewPager";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Intro() {
  const router = useRouter();

  function handleNext() {
    router.push('/main');
  }

  return (
    <SafeAreaView
      style={{ flex: 1, gap: 32, paddingTop: 32 }}
    >
      <Text style={{ fontSize: 24, color: 'white', paddingHorizontal: 24 }}>Introdução</Text>

      <SingleViewPager
        onNext={handleNext}
        renderItem={() => (
          <View
            style={{
              flex: 1,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: 'gray',
              marginHorizontal: 24,
            }}
          >
            <TouchableOpacity onPress={handleNext}>
              <Text style={{ fontSize: 18, color: 'white' }}>Próximo</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  )
}