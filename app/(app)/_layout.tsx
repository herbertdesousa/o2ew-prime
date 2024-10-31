import { Slot } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ViewPagerRef } from '@/components/ViewPager/react-augment';
import { ViewPager } from '@/components/ViewPager/ViewPager';
import { DI } from '@/controllers/DI';
import { Goal } from '@/entities/goal';
import { useAsync } from '@/utils/use-async';
import { BottomTab } from './bottom-tab';

export default function HomeScreen() {
  const goalsSt = useAsync(async () => await DI.goal.GetGoals());
  const goals = goalsSt.state === 'SUCCESS' ? goalsSt.data : [];

  const pageViewRef = useRef<ViewPagerRef<Goal>>(null);

  const [selectedGoal, setSelectedGoal] = useState<Goal>();
  const [selectedGoalIndex, setSelectedGoalIndex] = useState(0);

  function handleOnChange(goal: Goal) {
    setSelectedGoal(goal);

    const findedGoalIndex = goals.findIndex(g => g.$clientId === goal.$clientId);

    setSelectedGoalIndex(findedGoalIndex)
  }

  const goalsLabel = `${selectedGoalIndex + 1}/${goals.length} Objetivos`;

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        {goalsSt.state === 'LOADING' && <Text>Carregando Objetivos</Text>}
        {goalsSt.state === 'SUCCESS' && (
          <View style={{ height: 96 + 128, gap: 16 }}>
            {selectedGoal && (
              <View style={{ paddingHorizontal: 24 }}>
                <Text
                  style={{ color: selectedGoal.color, fontSize: 32, textAlign: 'center' }}
                >
                  {selectedGoal.title}
                </Text>
              </View>
            )}

            <ViewPager
              ref={pageViewRef}
              data={goals}
              style={{ maxHeight: 96 }}
              renderItem={item => (
                <View style={[styles.itemContainer, { backgroundColor: item.color }]}>
                  <Text style={styles.itemTitle}>{item.id} - {item.description}</Text>
                </View>
              )}
              onChange={handleOnChange}
              onReachTail={() => console.log(`tail`)}
              onReachHead={() => console.log(`head`)}
              renderHead={() => <Text style={{ color: 'white', fontSize: 24 }}>head</Text>}
              renderTail={() => <Text style={{ color: 'white', fontSize: 24 }}>tail</Text>}
            />

            <View
              style={{
                paddingHorizontal: 24,
                gap: 24,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Btn label="<" onPress={() => pageViewRef.current?.previousPage()} />
              <Text style={{ color: 'white', fontSize: 16 }}>{goalsLabel}</Text>
              <Btn label=">" onPress={() => pageViewRef.current?.nextPage()} />
            </View>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Slot />
        </View>

        <BottomTab goals={goals} pageViewRef={pageViewRef} />
      </View>
    </GestureHandlerRootView >
  );
}


type BtnProps = { label: string; onPress?(): void };
function Btn({ label, onPress }: BtnProps) {
  return (
    <TouchableOpacity
      style={{
        height: 48,
        flex: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={onPress}
    >
      <Text style={{ fontSize: 24, fontWeight: 'semibold', color: 'white' }}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 24,
    paddingTop: 64,
    justifyContent: 'space-between',
  },
  listContainer: {
    flex: 1,
    maxHeight: 128,
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginHorizontal: 24,
  },
  itemTitle: {
    fontSize: 24,
    fontWeight: 'semibold',
    color: 'white'
  },
  btnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
  },
  btnContainer: {
    backgroundColor: '#00ADEE',
    height: 64,
    width: 64,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLabel: {
    fontSize: 32,
    fontWeight: 'semibold',
    color: 'white'
  },
});
