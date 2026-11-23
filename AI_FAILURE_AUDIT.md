# AI_FAILURE_AUDIT.md — Lab 4

Phan Lê Duy Bảo — 24520180
Web Application Development, Lab 4 (phần Exercise)

Trong lúc làm Lab 4, em có dùng AI để sinh test và code. Dưới đây là 3 lỗi của AI mà em gặp thật, em ghi lại prompt, đoạn code sai, cách em phát hiện và cách em sửa.

---

## Lỗi 1: Test của form viết sai (Task 2.1)

**Commit:** `test: add fail test for form validation`

**Prompt em dùng:**
```
Viết 2 file test Vitest + RTL (+ user-event), chưa có implement:
A) src/form/validate.test.js (unit, hàm thuần validateForm) ...
B) src/form/SimpleForm.test.jsx: (1) gõ email sai rồi blur -> có phần tử role="alert", input có
aria-invalid="true" và aria-describedby trùng id của phần tử lỗi; (2) label bấm vào thì focus
input tương ứng; (3) submit khi còn lỗi -> KHÔNG thấy <dl>; (4) điền hợp lệ rồi submit -> thấy
<dl> chứa đúng 3 cặp dt/dd. KHÔNG viết implementation. Chỉ trả về 2 file test.
```

**AI viết ra:**
```jsx
await user.click(screen.getByRole('button', { name: /submit/i }));
expect(screen.queryByRole('definition')).not.toBeInTheDocument();
expect(screen.getByRole('alert')).toBeInTheDocument();
const definitionList = screen.getByRole('definition');
expect(within(definitionList).getByText('Họ tên')).toBeInTheDocument();
```

**Sai ở đâu:**
- Nút trong form của em tên là "Gửi", không phải "submit", nên test không tìm thấy nút.
- Role `definition` là của thẻ `<dd>`, không phải `<dl>`. Có 3 thẻ `<dd>` nên `getByRole` sẽ báo lỗi tìm thấy nhiều phần tử.
- Khi submit mà để trống thì có 3 lỗi cùng lúc, dùng `getByRole('alert')` sẽ lỗi, phải dùng `getAllByRole`.
- Component `ShowData` render `Object.entries(data)` nên thẻ `<dt>` là `fullName`, `email`, `age`, không phải "Họ tên", "Email", "Tuổi".

**Em phát hiện bằng cách:** đọc lại từng dòng test và so với yêu cầu của task 2.3 trước khi commit. Lúc này test đang đỏ vì chưa có code, nên chạy `npm test` không cho biết test sai hay code thiếu. Sau khi sửa em dùng `grep -n "gửi\|querySelector('dl')\|getAllByRole('alert')\|fullName" src/form/SimpleForm.test.jsx` để kiểm tra lại, và sau commit C8 thì `npm test` xanh hết.

**Em sửa thành:**
```jsx
await user.click(screen.getByRole('button', { name: /gửi/i }));
expect(container.querySelector('dl')).toBeNull();
expect(screen.getAllByRole('alert')).toHaveLength(3);
const dl = container.querySelector('dl');
expect(within(dl).getByText('fullName')).toBeInTheDocument();
```

**Rút ra:** test đỏ chưa chắc là test đúng. Phải đọc test và so với yêu cầu, không tin kết quả đỏ.

---

## Lỗi 2: Test của hook dễ xanh nhầm (Task 3.1)

**Commit:** `test: add fail tests for forum api and hook`

**Prompt em dùng:**
```
src/forum/useForumMessages.test.jsx (Vitest, renderHook): mock global fetch bằng vi.stubGlobal sao cho
promise REJECT với DOMException('Aborted','AbortError') khi signal bị abort. Test: (1) đổi forum
'nasa' -> 'notNasa' khi request đầu chưa xong -> kết quả cuối là của 'notNasa'; (2) unmount khi đang
tải -> signal.aborted === true; (3) AbortError KHÔNG làm error khác null; (4) res.ok=false -> error
có nội dung. Chỉ trả về file test.
```

**AI viết ra:**
```jsx
// test (3)
rerender({ forum: 'notNasa' });
await waitFor(() => {
  expect(result.current.error).toBeNull();
});

// test (4)
expect(result.current.error).toEqual(
  expect.stringContaining('Unable to load messages')
);

// test (1)
expect(result.current.data).not.toEqual([
  expect.objectContaining({ text: 'Message from nasa' }),
]);
```

**Sai ở đâu:**
- Test (3): `waitFor` kiểm tra ngay lần đầu, lúc đó lỗi `AbortError` chưa kịp chạy vào `catch`, nên nếu hook ghi nhầm `AbortError` vào `error` thì test vẫn xanh.
- Test (4): bắt `error` phải đúng chữ trong body JSON của server, trong khi yêu cầu chỉ nói "nếu `!res.ok` thì ném Error". Hook viết đúng yêu cầu vẫn có thể đỏ.
- Test (1): dòng `not.toEqual` lúc nào cũng đúng, không chứng minh được gì.

**Em phát hiện bằng cách:** đọc từng test và tự hỏi "nếu hook sai thì test này có đỏ không?", rồi so với contract của task 3.3. Log lúc đó là `4 failed` với lỗi `useForumMessages is not a function`, vẫn là đỏ vì chưa có hook nên không thấy được lỗi trong test.

**Em sửa thành:**
```jsx
await act(async () => {
  rerender({ forum: 'notNasa' });
});
expect(result.current.error).toBeNull();

await waitFor(() => {
  expect(result.current.loading).toBe(false);
});
expect(typeof result.current.error).toBe('string');
expect(result.current.error.length).toBeGreaterThan(0);
```
Em cũng xóa dòng `not.toEqual` ở test (1). Sau khi có hook ở commit C11 thì cả 4 test xanh, tổng `20 passed (20)`.

---

## Lỗi 3: Code server bị ESLint báo 10 lỗi (Task 3.2)

**Commit lỗi:** `feat: express forum rest api`
**Commit sửa:** `chore: configure eslint for server and remove unused catch bindings`

**Prompt em dùng:** prompt task 3.2 trong `TASK_DECOMPOSITION.md` (viết `db.js`, `app.js`, `server.js` trong thư mục `server/`, không hardcode origin và port).

**AI viết ra:**
```js
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
// ...
} catch (error) {          // 3 chỗ, biến error không dùng tới
  return res.status(500).json({ error: 'Failed to retrieve messages' });
}
app.use((err, req, res, next) => { ... });   // next không dùng tới
```

**Sai ở đâu:** test và server đều chạy được (`20 passed`), nhưng khi em chạy `npm run lint` thì báo **10 lỗi**:
- 6 lỗi `'process' is not defined`, vì ESLint đang coi thư mục `server/` là code chạy trên trình duyệt.
- 3 lỗi `'error' is defined but never used`.
- 1 lỗi `'next' is defined but never used`.

**Em phát hiện bằng cách:** chạy `npm run lint` sau khi dán code. Chạy test thôi thì không thấy lỗi này. Ảnh terminal kết thúc bằng `10 problems (10 errors, 0 warnings)`.

**Em sửa thành:**
```js
// eslint.config.js: thêm cấu hình riêng cho server
{
  files: ['server/**/*.js'],
  languageOptions: { globals: globals.node },
},

// app.js
} catch {
  ...
}
// Express nhận biết error handler qua đúng 4 tham số nên phải giữ `next`.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => { ... });
```
Sau khi sửa `npm run lint` không còn lỗi.

**Ghi chú thêm:** AI còn hướng dẫn chạy server bằng `node server.js`. Cách này không đọc file `.env`, nên `CLIENT_ORIGIN` bị `undefined` và `cors` cho phép mọi nguồn (`*`), làm test CORS mất ý nghĩa. Em đổi sang `npm run dev:server` (dùng `node --env-file=../.env`).

---

## Tóm tắt theo 3 nhóm của slide

**AI Code Failures:** lỗi 1 (test sai tên nút và sai assertion), lỗi 2 (test xanh nhầm), lỗi 3 (server vi phạm lint).

**Hallucinated APIs & Loops:** ở lỗi 1, AI đoán `getByRole('definition')` là role của `<dl>`, nhưng thực tế là role của `<dd>`. Em không gặp lỗi vòng lặp render do `useEffect`, vì phần form em không dùng `useEffect`.

**Engineering Verification:** những thứ em đã chạy để kiểm tra:
- `npm test` và `npm run test:server`
- `npm run lint`
- `grep -rn "useEffect\|<div" src/form src/people` (kết quả 0)
- `curl -i` để thử 200, 404, 400 và header CORS
- React DevTools Profiler: gõ 1 phím chỉ có 1 commit (commit thứ hai là do ô input mất focus khi bấm Stop)
- Network của Chrome: request bị `(canceled)` khi đổi kênh nhanh, `(failed)` khi tắt server, 400 khi gửi thiếu tên
