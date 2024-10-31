import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { NativeSyntheticEvent, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useEvent,
  useHandler,
  useSharedValue
} from 'react-native-reanimated';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

import { ViewPagerProps, ViewPagerRef } from "./react-augment";

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

type PageSelectedEvt = NativeSyntheticEvent<Readonly<{
  position: Double;
}>>;

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

type DataItemHead = {
  _id: number;
  _type: 'HEAD';
}

type DataItemTail = {
  _id: number;
  _type: 'TAIL';
}

type DataItemMain<DataItem> = {
  _id: number;
  _type: 'MAIN';
  payload: DataItem;
}

type DataItemVariants<DataItem> = DataItemHead | DataItemTail | DataItemMain<DataItem>;

const HEAD_ITEM: DataItemHead = { _id: -1, _type: 'HEAD' };
const TAIL_ITEM: DataItemTail = { _id: 1000, _type: 'TAIL' };

const concatArr = (...arr: any[][]) => arr.flat();
function conditional<T>(policy: boolean, obj: T, elseV: T): T {
  return policy ? obj : elseV;
};

export function ViewPagerImpl<DataItem>(
  {
    data: clientData,
    renderItem,
    style,
    onChange,
    onReachHead,
    onReachTail,
    renderHead,
    renderTail,
  }: ViewPagerProps<DataItem>,
  ref: React.Ref<ViewPagerRef<DataItem>>,
) {
  const isClientDataEmpty = clientData.length === 0;

  const [data] = useState<DataItemVariants<DataItem>[]>(() =>
    conditional(
      isClientDataEmpty,
      [],
      concatArr(
        conditional(Boolean(renderHead), [HEAD_ITEM], []),
        clientData.map((item, idx): DataItemMain<DataItem> => ({
          _id: idx,
          _type: 'MAIN',
          payload: item,
        })),
        conditional(Boolean(renderTail), [TAIL_ITEM], []),
      ),
    ),
  );

  const shouldRenderHead = Boolean(!isClientDataEmpty && renderHead);

  // pula a head para iniciar no primeiro item
  const initialPage = shouldRenderHead ? 1 : 0;

  const listRef = useRef<PagerView>(null);

  const listOffset = useSharedValue(0);
  const listPosition = useSharedValue(initialPage);

  const animatedListHandler = usePagerScrollHandler({
    onPageScroll: (e: any) => {
      'worklet';
      listOffset.value = e.offset;
      listPosition.value = e.position;
    },
  });

  useImperativeHandle(ref, () => ({
    nextPage() {
      listRef.current?.setPage(listPosition.value + 1);
    },
    previousPage() {
      listRef.current?.setPage(listPosition.value - 1);
    },
    gotoPageWhere(fn: (item: DataItem) => boolean) {
      const findedItem = data.findIndex(i => {
        if (i._type === 'MAIN') return fn(i.payload)

        return false;
      });

      if (findedItem >= 0) listRef.current?.setPage(findedItem);
    }
  }));

  function handlePageSelected(evt: PageSelectedEvt) {
    const currentItem = data[evt.nativeEvent.position];

    if (currentItem?._type === 'HEAD' && onReachHead) {
      onReachHead();
    } else if (currentItem?._type === 'TAIL' && onReachTail) {
      onReachTail();
    } else if (currentItem?._type === 'MAIN' && onChange) {
      onChange(currentItem.payload);
    }
  }

  return (
    <AnimatedPagerView
      ref={listRef}
      onPageSelected={handlePageSelected}
      initialPage={listPosition.value}
      onPageScroll={animatedListHandler}
      style={[{ flex: 1 }, style]}
    >
      {data.map(item => {
        if (item._type === 'HEAD') return <View key={item._id}>{renderHead!.call([])}</View>
        if (item._type === 'TAIL') return <View key={item._id}>{renderTail!.call([])}</View>

        return <Animated.View
          key={item._id}
          style={[
            useAnimatedStyle(() => {
              // da para melhorar, deixado como débito técnico
              /*
                0  1  2  3  4
                      |- item em transição

                1 ativa isBeforePositioned
                2 ativa isCurrentPositioned
                listOffset valor atual em transição (de 0 a 1 onde 0 começa e 1 termina)
              */
              // const position = listPosition.value - (renderHead ? 1 : 0);
              const position = shouldRenderHead
                ? listPosition.value - 1 // exclui head
                : listPosition.value
              const isCurrentPositioned = position !== item._id;
              const isBeforePositioned = position !== item._id - 1;

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
          {renderItem(item.payload)}
        </Animated.View>
      })}
    </AnimatedPagerView>
  )
}

export const ViewPager = forwardRef(ViewPagerImpl);