import { useEffect, useState } from 'react';
import { errorMessage } from '../utils/errors';

// The caller memoizes load with useCallback. key identifies the requested record/user.
export default function useResource(load, key) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ key, data: null, loading: true, error: '' });

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setState({ key, data: null, loading: true, error: '' });
    load(controller.signal).then(
      data => active && setState({ key, data, loading: false, error: '' }),
      error => active && setState({ key, data: null, loading: false, error: errorMessage(error) }),
    );
    return () => {
      active = false;
      controller.abort();
    };
  }, [load, key, attempt]);

  const current = state.key === key ? state : { data: null, loading: true, error: '' };
  return { ...current, reload: () => setAttempt(value => value + 1) };
}
