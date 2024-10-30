import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Dimensions, NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import PagerView from 'react-native-pager-view';
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

const DATA = Array(20).fill('').map((_, i) => ({
  id: `id-${i + 1}`,
  idAlt: i,
  title: generateLoremIpsum(randomNumber(2, 5)),
}))

const LIST_PADDING = 24;

export default function HomeScreen() {
  const listRef = useRef<PagerView>(null);

  const [currentPage, setCurrentPage] = useState(0);

  function handleNextPage() {
    listRef.current?.setPage(currentPage + 1);
  }

  function handlePreviousPage() {
    listRef.current?.setPage(currentPage - 1);
  }

  function handlePageSelected(evt: NativeSyntheticEvent<Readonly<{
    position: Double;
  }>>) {
    setCurrentPage(evt.nativeEvent.position)
  }

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <StatusBar style="dark" />

        {/* <FlatList
          data={DATA}
          keyExtractor={i => i.id}
          horizontal
          contentContainerStyle={{ paddingHorizontal: LIST_PADDING, gap: LIST_PADDING }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.itemContainer, { width: ITEM_WIDTH }]}>
              <Text style={styles.itemTitle}>{item.title}</Text>
            </View>
          )}
        /> */}
        <PagerView
          ref={listRef}
          onPageSelected={handlePageSelected}
          style={styles.listContainer}
          initialPage={currentPage}
        >
          {DATA.map(item => (
            <View key={item.id} style={[styles.itemContainer]}>
              <Text style={styles.itemTitle}>{item.idAlt} - {item.title}</Text>
            </View>
          ))}
        </PagerView>

        <View style={styles.btnsContainer}>
          <Btn label='<' onPress={handlePreviousPage} />
          <Btn label='>' onPress={handleNextPage} />
        </View>
      </View>
    </GestureHandlerRootView>
  );
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
