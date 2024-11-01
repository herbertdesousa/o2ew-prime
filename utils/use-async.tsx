import { DependencyList, useEffect, useState } from "react";

type AsyncState<Data> = {
  state: 'LOADING';
} | {
  state: 'ERROR';
} | {
  state: 'SUCCESS';
  data: Data;
}

export function asyncArrayToState<T>(asyncGoals: AsyncState<T[]>): T[] {
  return asyncGoals.state === 'SUCCESS' ? asyncGoals.data : [];
}

export function useAsync<Data>(
  call: () => Promise<Data>,
  deps: DependencyList = [],
): AsyncState<Data> {
  const [state, setState] = useState<AsyncState<Data>>({ state: 'LOADING' });

  useEffect(() => {
    call()
      .then(data => setState({ state: 'SUCCESS', data }))
      .catch(() => setState({ state: 'ERROR' }))
  }, deps);

  return state;
}
