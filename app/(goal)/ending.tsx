import { SingleViewPager } from "@/components/SingleViewPager";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Ending() {
  const router = useRouter();

  function handlePrevious() {
    router.back(); // volta (provavelmente para o inicio)
    router.push('/main'); // volta para o inicio dos passos
  }

  return (
    <SafeAreaView style={{ flex: 1, gap: 32, paddingTop: 32 }}>
      <Text style={{ fontSize: 24, color: 'white', paddingHorizontal: 24 }}>Conclusão</Text>

      <SingleViewPager
        onPrevious={handlePrevious}
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
            <TouchableOpacity onPress={handlePrevious}>
              <Text style={{ fontSize: 18, color: 'white' }}>
                {"<- Voltar"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}