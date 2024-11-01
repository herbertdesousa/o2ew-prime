import { DependencyList, useEffect, useState } from "react";

type AsyncState<Data> = {
  state: 'LOADING';
} | {
  state: 'ERROR';
} | {
  state: 'SUCCESS';
  data: Data;
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
