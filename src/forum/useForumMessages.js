import { useEffect, useState } from 'react';

export function useForumMessages(forum) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchTick, setRefetchTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchMessages() {
      setLoading(true);
      setError(null);

      try {
        const url = `${import.meta.env.VITE_API_URL}/api/messages/${forum}`;

        const res = await fetch(url, { signal });

        if (!res.ok) {
          let errorMessage = `HTTP ${res.status}`;

          try {
            const body = await res.json();

            if (
              typeof body.error === 'string' &&
              body.error.trim()
            ) {
              errorMessage = body.error;
            }
          } catch {
            // Giữ thông báo HTTP nếu response không phải JSON hợp lệ.
          }

          throw new Error(errorMessage);
        }

        const json = await res.json();

        if (!signal.aborted) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }

        if (!signal.aborted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchMessages();

    return () => {
      controller.abort();
    };
  }, [forum, refetchTick]);

  async function postMessage(payload) {
    const url = `${import.meta.env.VITE_API_URL}/api/messages/${forum}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let errorMessage = `HTTP ${res.status}`;

      try {
        const body = await res.json();

        if (
          typeof body.error === 'string' &&
          body.error.trim()
        ) {
          errorMessage = body.error;
        }
      } catch {
        // Giữ thông báo HTTP nếu response không phải JSON hợp lệ.
      }

      throw new Error(errorMessage);
    }

    setRefetchTick((tick) => tick + 1);
  }

  function retry() {
    setRefetchTick((tick) => tick + 1);
  }

  return {
    data,
    loading,
    error,
    postMessage,
    retry,
  };
}