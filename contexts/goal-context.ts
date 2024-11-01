import { ViewPagerRef } from "@/components/ViewPager/react-augment";
import { DI } from "@/controllers/DI";
import { Goal } from "@/entities/goal";
import { asyncArrayToState } from "@/utils/use-async";
import { create } from "zustand";

type AsyncState<Data> =
  | { state: 'LOADING' }
  | { state: 'ERROR' }
  | { state: 'SUCCESS'; data: Data };

type Context = {
  // VP = view pager
  goalVPRef: React.RefObject<ViewPagerRef<Goal>>;
  goals: AsyncState<Goal[]>;
  selectedGoal: {
    state: Goal | null;
    index: number;
  };
  onChangeSelection(goal: Goal): void;
}

const goalVPRef = { current: null } as React.RefObject<ViewPagerRef<Goal>>;

export const useGoal = create<Context>((set) => {
  DI.goal.GetGoals()
    .then(data => set({ goals: { state: 'SUCCESS', data } }))
    .catch(() => set({ goals: { state: 'ERROR' } }))

  return {
    goalVPRef,
    goals: { state: 'LOADING' },
    selectedGoal: { state: null, index: 0 },
    onChangeSelection: (_goal) => {
      set(({ goals }) => ({
        selectedGoal: {
          state: _goal,
          index: asyncArrayToState(goals)
            .findIndex(g => g.$clientId === _goal.$clientId)
        }
      }));
    }
  };
})