import { useMemo } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useGoal } from "@/contexts/goal-context";
import { Goal } from "@/entities/goal";
import { asyncArrayToState } from "@/utils/use-async";

export type GroupedGoal = {
  id: number;
  color: string;
}

function groupGoalsByColor(goals: Goal[]): GroupedGoal[] {
  const set = new Set<string>();

  goals.forEach(goal => set.add(goal.color));

  return [...set].map((color, id) => ({ id, color }));
}

type Props = {
  onGotoPage?(goal: GroupedGoal): void;
}

export function GoalBottomTab({ onGotoPage }: Props) {
  const { goalVPRef, goals } = useGoal();

  const goalsState = asyncArrayToState(goals);

  const groupedGoals = useMemo((): GroupedGoal[] => {
    return groupGoalsByColor(goalsState)
  }, [goalsState]);

  function handleGotoPage(goal: GroupedGoal) {
    if (onGotoPage) {
      onGotoPage(goal);
    } else {
      goalVPRef.current?.gotoPageWhere(g => g.color === goal.color);
    }
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
      {groupedGoals.map(goal => (
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
          onPress={() => handleGotoPage(goal)}
        >
        </TouchableOpacity>
      ))}
    </View>
  )
}