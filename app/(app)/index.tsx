import { ViewPager } from "@/components/ViewPager/ViewPager";
import { useGoal } from "@/contexts/goal-context";
import { DI } from "@/controllers/DI";
import { Goal } from "@/entities/goal";
import { delay } from "@/utils/delay";
import { useAsync } from "@/utils/use-async";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function HomeScreen() {
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
  const { goalVPRef } = useGoal();

  const details = useAsync(
    async () => DI.goal.FindGoalStep(goal.$clientId),
    [goal.$clientId],
  );

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

  const steps = details.data?.steps || [];

  return (
    <ViewPager
      data={steps}
      style={{ flex: 1 }}
      renderItem={item => (
        <View
          style={{
            borderWidth: 1,
            borderColor: details.data?.color,
            borderRadius: 8,
            marginHorizontal: 24,
            padding: 8
          }}
        >
          {item.description && (
            <Text style={{ color: 'white', fontSize: 18 }}>{item.description}</Text>
          )}
          {!item.description && (
            <Text style={{ color: 'white', fontStyle: 'italic', fontSize: 18 }}>
              Nenhuma descrição
            </Text>
          )}
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