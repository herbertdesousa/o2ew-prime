import { ViewPagerRef } from "@/components/ViewPager/react-augment";
import { ViewPager } from "@/components/ViewPager/ViewPager";
import { delay } from "@/utils/delay";
import { useRef } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  onNext?(): void;
  onPrevious?(): void;
  renderItem(): React.ReactElement;
}

export function SingleViewPager({ onNext, onPrevious, renderItem }: Props) {
  const viewPagerRef = useRef<ViewPagerRef<unknown>>(null);

  function handleNext() {
    delay(200).then(() => {
      if (onNext) onNext();

      delay(200).then(() => viewPagerRef.current?.previousPage());
    });
  }

  function handlePrevious() {
    delay(200).then(() => {
      if (onPrevious) onPrevious();

      delay(200).then(() => viewPagerRef.current?.previousPage());
    });
  }

  const shouldRenderTail = !!onNext;
  const shouldRenderPrevious = !!onPrevious;

  return (
    <GestureHandlerRootView>
      <ViewPager
        ref={viewPagerRef}
        data={[{ id: '1' }]}
        onReachHead={handlePrevious}
        onReachTail={handleNext}
        // optiona render tail
        {...(shouldRenderTail ? { renderTail: () => <View></View> } : {})}
        {...(shouldRenderPrevious ? { renderHead: () => <View></View> } : {})}
        renderItem={renderItem}
      />
    </GestureHandlerRootView>
  )
}