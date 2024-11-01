import { GoalBottomTab, GroupedGoal } from "@/components/GoalBottomTab";
import { SingleViewPager } from "@/components/SingleViewPager";
import { useGoal } from "@/contexts/goal-context";
import { delay } from "@/utils/delay";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Ending() {
  const router = useRouter();
  const { goalVPRef } = useGoal();

  function handlePrevious() {
    router.back(); // volta (provavelmente para o inicio)
    router.push('/main'); // volta para o inicio dos passos
  }

  function handleGoToGoal(goal: GroupedGoal) {
    router.replace('/main');

    delay(200).then(() => {
      goalVPRef.current?.gotoPageWhere(g => g.color === goal.color);
    });
  }

  return (
    <GestureHandlerRootView>
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

        <GoalBottomTab onGotoPage={handleGoToGoal} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}