import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import PagerView from 'react-native-pager-view';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle, useEvent, useHandler, useSharedValue } from 'react-native-reanimated';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function generateLoremIpsum(wordCount: number): string {
  const loremWords = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod",
    "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut", "enim", "ad", "minim",
    "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
    "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate",
    "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur"
  ];

  let result = [];
  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * loremWords.length);
    result.push(loremWords[randomIndex]);
  }

  return result.join(" ");
}

const DATA = Array(8).fill('').map((_, i) => ({
  id: `id-${i + 1}`,
  idAlt: i,
  title: generateLoremIpsum(randomNumber(2, 5)),
}))

const LIST_PADDING = 24;
const ITEM_WIDTH = Dimensions.get('window').width - (LIST_PADDING * 2);

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

function usePagerScrollHandler(handlers: any, dependencies?: any) {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies);
  const subscribeForEvents = ['onPageScroll'];

  return useEvent<any>(
    (event) => {
      'worklet';
      const { onPageScroll } = handlers;
      if (onPageScroll && event.eventName.endsWith('onPageScroll')) {
        onPageScroll(event, context);
      }
    },
    subscribeForEvents,
    doDependenciesDiffer
  );
}

export default function HomeScreen() {
  const listOffset = useSharedValue(0);
  const listPosition = useSharedValue(0);

  const animatedListHandler = usePagerScrollHandler({
    onPageScroll: (e: any) => {
      'worklet';
      listOffset.value = e.offset;
      listPosition.value = e.position;
    },
  });
  const listRef = useRef<PagerView>(null);

  const [currentPage, setCurrentPage] = useState(0);

  function handleNextPage() {
    listRef.current?.setPage(currentPage + 1);
  }

  function handlePreviousPage() {
    listRef.current?.setPage(currentPage - 1);
  }

  const navigation = useRouter();

  function handlePageSelected(evt: NativeSyntheticEvent<Readonly<{
    position: Double;
  }>>) {
    setCurrentPage(evt.nativeEvent.position)

    if (evt.nativeEvent.position === DATA.length) {
      new Promise(res => setTimeout(res, 1000)).then(() => {
        console.log('final')
        navigation.push('home');
      });
    }
  }

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <AnimatedPagerView
          ref={listRef}
          onPageSelected={handlePageSelected}
          style={styles.listContainer}
          initialPage={currentPage}
          onPageScroll={animatedListHandler}
        >
          {DATA.map(item => (
            <Animated.View
              key={item.id}
              style={[
                styles.itemContainer,
                useAnimatedStyle(() => {
                  // só faz animação caso seja 
                  const isCurrentPositioned = listPosition.value !== item.idAlt;
                  const isBeforePositioned = listPosition.value !== item.idAlt - 1;

                  return {
                    opacity: isCurrentPositioned
                      ? interpolate(listOffset.value, [0, 1], [0, 1], Extrapolation.CLAMP)
                      : isBeforePositioned
                        ? interpolate(listOffset.value, [0, 1], [1, 0], Extrapolation.CLAMP)
                        : 1,
                    transform: [
                      {
                        scale: isCurrentPositioned
                          ? interpolate(listOffset.value, [0, 1], [0.6, 1], Extrapolation.CLAMP)
                          : isBeforePositioned
                            ? interpolate(listOffset.value, [0, 1], [1, 0.6], Extrapolation.CLAMP)
                            : 1,
                      }
                    ]
                  }
                })
              ]}
            >
              <Text style={styles.itemTitle}>{item.idAlt} - {item.title}</Text>
            </Animated.View>
          ))}

          <Animated.View
            key="9"
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ fontSize: 24 }}>Carregando...</Text>
          </Animated.View>
        </AnimatedPagerView>

        <View style={styles.btnsContainer}>
          <Btn label='<' onPress={handlePreviousPage} />
          <Btn label='>' onPress={handleNextPage} />
        </View>
      </View>
    </GestureHandlerRootView >
  );
}

type ItemProps = {
  listPosition: SharedValue<number>;
  listOffset: SharedValue<number>;
  id: string;
  idAlt: number;
  title: string;
};
function Item({ listOffset, listPosition, id, idAlt, title }: ItemProps) {

  const animatedStyle = useAnimatedStyle(() => {
    // só faz animação caso seja 
    const isPositioned = listPosition.value !== idAlt;

    return {
      opacity: isPositioned
        ? interpolate(listOffset.value, [0, 1], [0, 1], Extrapolation.CLAMP)
        : 1,
      transform: [
        {
          scale: isPositioned
            ? interpolate(listOffset.value, [0, 1], [0.8, 1], Extrapolation.CLAMP)
            : 1
        }
      ]
    }
  })

  return (
    <Animated.View key={String(id)} style={[styles.itemContainer, animatedStyle]}>
      <Text style={styles.itemTitle}>{idAlt} - {title}</Text>
    </Animated.View>
  )
}

type BtnProps = { label: string; onPress?(): void };
function Btn({ label, onPress }: BtnProps) {
  return (
    <TouchableOpacity style={styles.btnContainer} onPress={onPress}>
      <Text style={styles.btnLabel}>{label}</Text>
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
    backgroundColor: '#00ADEE',
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
