import { ViewPagerRef } from "@/components/ViewPager/react-augment";
import { ViewPager } from "@/components/ViewPager/ViewPager";
import { useGoal } from "@/contexts/goal-context";
import { DI } from "@/controllers/DI";
import { Goal, GoalStep } from "@/entities/goal";
import { delay } from "@/utils/delay";
import { asyncArrayToState, useAsync } from "@/utils/use-async";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";

export function Steps() {
  const { selectedGoal } = useGoal();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /*
      usado para escutar transições de mudança de e assim disparar
      um fake loading e mudar os steps
    */
    setIsLoading(true);
    delay(500).then(() => setIsLoading(false));
  }, [selectedGoal]);

  if (!selectedGoal.state) return <></>;
  if (isLoading) {
    return <Text
      style={{ color: 'white', paddingHorizontal: 24 }}
    >
      Carregando Passos...
    </Text>
  }

  return <Main goal={selectedGoal.state} />
}

type Props = { goal: Goal };
function Main({ goal }: Props) {
  const { selectedGoal, goalVPRef } = useGoal();

  const stepsVPRef = useRef<ViewPagerRef<GoalStep>>(null);

  const details = useAsync(
    async () => DI.goal.FindGoalStep(goal.$clientId),
    [goal.$clientId],
  );

  const steps = details.state === 'SUCCESS' ? details.data?.steps ?? [] : [];

  useEffect(() => {
    const lastId = selectedGoal.state?.last_goal_answered_id;

    if (!lastId) return;

    stepsVPRef.current?.gotoPageWhere(p => p.id === lastId);
  }, [details.state]);

  if (details.state === 'LOADING') return <Text>Carregando...</Text>;
  if (details.state === 'ERROR') return <></>;

  function handleReachHead() {
    delay(100).then(() => {
      goalVPRef.current?.previousPage();
    });
  }

  function handleReachTail() {
    delay(100).then(() => {
      goalVPRef.current?.nextPage();
    });
  }

  return (
    <ViewPager
      ref={stepsVPRef}
      data={steps}
      style={{ flex: 1 }}
      renderItem={step => (
        <View style={{ marginHorizontal: 24, gap: 8 }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: details.data?.color,
              borderRadius: 8,
              padding: 8,
              gap: 8,
            }}
          >
            {step.description && (
              <Text style={{ color: 'white', fontSize: 18 }}>{step.description}</Text>
            )}
            {!step.description && (
              <Text style={{ color: 'white', fontStyle: 'italic', fontSize: 18 }}>
                Nenhuma descrição
              </Text>
            )}
          </View>

          <View style={{ gap: 4 }}>
            {step.asnwers.map(answer => (
              <View
                key={answer.$clientId}
                style={{
                  borderWidth: 1,
                  borderColor: details.data?.color,
                  borderRadius: 8,
                  padding: 8
                }}
              >
                <Text style={{ color: 'white', fontSize: 18 }}>{answer.description}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      // onChange={handleOnChange}
      onReachTail={handleReachTail}
      onReachHead={handleReachHead}
      renderHead={() => <Text style={{ color: 'white', fontSize: 18 }}>voltar passo</Text>}
      renderTail={() => <Text style={{ color: 'white', fontSize: 18 }}>ir passo a frente</Text>}
    />
  );
}