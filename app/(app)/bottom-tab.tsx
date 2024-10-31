import { ViewPagerRef } from "@/components/ViewPager/react-augment";
import { Goal } from "@/entities/goal";
import { useMemo } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

type GoalGroupedColor = {
  id: number;
  color: string;
}

function groupGoalsByColor(goals: Goal[]): GoalGroupedColor[] {
  const set = new Set<string>();

  goals.forEach(goal => set.add(goal.color));

  return [...set].map((color, id) => ({ id, color }));
}

type Props = {
  goals: Goal[];
  pageViewRef: React.RefObject<ViewPagerRef<Goal>>;
}

export function BottomTab({ goals, pageViewRef }: Props) {
  const goalsColors = useMemo((): GoalGroupedColor[] => {
    return groupGoalsByColor(goals)
  }, [goals]);

  function hnadleGotoPage(goal: GoalGroupedColor) {
    pageViewRef.current?.gotoPageWhere(g => g.color === goal.color);
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        padding: 24,
      }}
    >
      {goalsColors.map(goal => (
        <TouchableOpacity
          key={goal.id}
          style={{
            backgroundColor: goal.color,
            height: 64,
            width: 64,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => hnadleGotoPage(goal)}
        >
        </TouchableOpacity>
      ))}
    </View>
  )
}