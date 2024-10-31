import { useEffect, useState } from "react";

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
): AsyncState<Data> {
  const [state, setState] = useState<AsyncState<Data>>({ state: 'LOADING' });

  useEffect(() => {
    call()
      .then(data => setState({ state: 'SUCCESS', data }))
      .catch(() => setState({ state: 'ERROR' }))
  }, []);

  return state;
}