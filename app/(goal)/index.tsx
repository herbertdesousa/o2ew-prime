import { GoalBottomTab, GroupedGoal } from "@/components/GoalBottomTab";
import { SingleViewPager } from "@/components/SingleViewPager";
import { useGoal } from "@/contexts/goal-context";
import { delay } from "@/utils/delay";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Intro() {
  const router = useRouter();
  const { goalVPRef } = useGoal();

  function handleNext() {
    router.push('/main');
  }

  function handleGoToGoal(goal: GroupedGoal) {
    router.replace('/main');

    delay(200).then(() => {
      goalVPRef.current?.gotoPageWhere(g => g.color === goal.color);
    });
  }

  return (
    <GestureHandlerRootView>
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

        <GoalBottomTab onGotoPage={handleGoToGoal} />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}