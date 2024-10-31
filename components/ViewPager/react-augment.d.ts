import React from "react"

export type ViewPagerRef = {
  nextPage(): void;
  previousPage(): void;
}

export type ViewPagerProps<DataItem> = {
  data: DataItem[];
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  renderItem(item: DataItem): React.ReactElement;
  onReachTail?(): void;
  onReachHead?(): void;
  // elemento que vem antes do primeiro
  renderHead?(): React.ReactElement;
  // elemento que vem depois do último
  renderTail?(): React.ReactElement;
}

/*
  sobrescreve forwaredRef fazendo a tipagem de DataItem ser implicidamente
  inferida por renderItem

  https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
*/
declare module "react" {
  function forwardRef<DataItem>(
    render: (props: ViewPagerProps<DataItem>, ref: ForwardedRef<ViewPagerRef>) => ReactElement | null
  ): (props: ViewPagerProps<DataItem> & RefAttributes<ViewPagerRef>) => ReactElement | null
}