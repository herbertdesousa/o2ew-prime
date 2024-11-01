import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { GoalBottomTab } from '@/components/GoalBottomTab';
import { ViewPager } from '@/components/ViewPager/ViewPager';
import { useGoal } from '@/contexts/goal-context';
import { delay } from '@/utils/delay';
import { asyncArrayToState } from '@/utils/use-async';
import { useRouter } from 'expo-router';
import { Steps } from './steps';

export default function Layout() {
  const { goalVPRef, goals, selectedGoal, onChangeSelection } = useGoal();

  const goalsState = asyncArrayToState(goals);

  const goalsLabel = `${selectedGoal.index + 1}/${goalsState.length} Objetivos`;

  const router = useRouter();

  function handleReachTail() {
    delay(200).then(() => router.replace('/ending'));
  }

  function handleReachHead() {
    delay(200).then(() => router.replace('/'));
  }

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        {goals.state === 'LOADING' && <Text>Carregando Objetivos</Text>}
        {goals.state === 'SUCCESS' && (
          <View style={{ height: 96 + 128, gap: 16 }}>
            {selectedGoal.state && (
              <View style={{ paddingHorizontal: 24 }}>
                <Text
                  style={{ color: selectedGoal.state.color, fontSize: 32, textAlign: 'center' }}
                >
                  {selectedGoal.state.title}
                </Text>
              </View>
            )}

            <ViewPager
              ref={goalVPRef}
              data={goalsState}
              style={{ maxHeight: 96 }}
              renderItem={item => (
                <View style={[styles.itemContainer, { backgroundColor: item.color }]}>
                  <Text style={styles.itemTitle}>{item.id} - {item.description}</Text>
                </View>
              )}
              onChange={onChangeSelection}
              onReachTail={handleReachTail}
              onReachHead={handleReachHead}
              renderHead={() => <Text style={{ color: 'white', fontSize: 24 }}>Introdução</Text>}
              renderTail={() => <Text style={{ color: 'white', fontSize: 24 }}>Finalização</Text>}
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
              <Btn label="<" onPress={() => goalVPRef.current?.previousPage()} />
              <Text style={{ color: 'white', fontSize: 16 }}>{goalsLabel}</Text>
              <Btn label=">" onPress={() => goalVPRef.current?.nextPage()} />
            </View>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Steps />
        </View>

        <GoalBottomTab />
      </View>
    </GestureHandlerRootView>
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
