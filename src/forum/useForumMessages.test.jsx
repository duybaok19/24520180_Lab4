import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';

import { useForumMessages } from './useForumMessages';

const API_URL = 'http://localhost:3001';

function createResponse(data, options = {}) {
  return {
    ok: options.ok ?? true,
    status: options.status ?? 200,
    json: vi.fn().mockResolvedValue(data),
  };
}

function createAbortableFetch() {
  return vi.fn((url, { signal } = {}) => {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }

      signal?.addEventListener(
        'abort',
        () => {
          reject(new DOMException('Aborted', 'AbortError'));
        },
        { once: true }
      );

      // Cho phép test chủ động resolve response.
      createAbortableFetch.pending.set(url, resolve);
    });
  });
}

createAbortableFetch.pending = new Map();

describe('useForumMessages', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    createAbortableFetch.pending.clear();
  });

  it('không để response của forum cũ ghi đè forum mới', async () => {
    vi.stubEnv('VITE_API_URL', API_URL);

    const fetchMock = createAbortableFetch();
    vi.stubGlobal('fetch', fetchMock);

    const { result, rerender } = renderHook(
      ({ forum }) => useForumMessages(forum),
      {
        initialProps: { forum: 'nasa' },
      }
    );

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/api/messages/nasa`,
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      })
    );

    // Chuyển forum khi request nasa chưa hoàn thành.
    rerender({ forum: 'notNasa' });

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/api/messages/notNasa`,
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      })
    );

    const newMessages = [
      {
        id: 'new-message',
        author: 'New User',
        text: 'Message from notNasa',
        timestamp: new Date().toISOString(),
      },
    ];

    await act(async () => {
      createAbortableFetch.pending.get(
        `${API_URL}/api/messages/notNasa`
      )(createResponse(newMessages));
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(newMessages);
    });

    expect(result.current.error).toBeNull();
  });

  it('abort request khi component unmount', () => {
    vi.stubEnv('VITE_API_URL', API_URL);

    const fetchMock = createAbortableFetch();
    vi.stubGlobal('fetch', fetchMock);

    const { unmount } = renderHook(() => useForumMessages('nasa'));

    const requestOptions = fetchMock.mock.calls[0][1];
    const signal = requestOptions.signal;

    expect(signal.aborted).toBe(false);

    unmount();

    expect(signal.aborted).toBe(true);
  });

  it('AbortError không được đưa vào error state', async () => {
    vi.stubEnv('VITE_API_URL', API_URL);

    const fetchMock = createAbortableFetch();
    vi.stubGlobal('fetch', fetchMock);

    const { result, rerender } = renderHook(
      ({ forum }) => useForumMessages(forum),
      {
        initialProps: { forum: 'nasa' },
      }
    );

    // Đổi forum để abort request nasa, rồi chờ mọi tác vụ bất đồng bộ chạy xong.
    await act(async () => {
      rerender({ forum: 'notNasa' });
    });

    expect(result.current.error).toBeNull();
  });

  it('res.ok = false thì error phải có nội dung', async () => {
    vi.stubEnv('VITE_API_URL', API_URL);

    const fetchMock = vi.fn().mockResolvedValue(
      createResponse(
        { error: 'Unable to load messages' },
        { ok: false, status: 500 }
      )
    );

    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useForumMessages('nasa'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(typeof result.current.error).toBe('string');
    expect(result.current.error.length).toBeGreaterThan(0);
  });
});