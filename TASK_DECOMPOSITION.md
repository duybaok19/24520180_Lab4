# TASK_DECOMPOSITION.md — Lab 4: Multi-Route SPA, Context Form Engine & Full-Stack React 19

**Môn:** Web Application Development — Lab 4
**Phạm vi:** Exercise 1 (Sprint 1), Exercise 2 (Sprint 2), Exercise 3 (Sprint 3) + setup + chuẩn bị Live Defense
**Sinh viên:** _(họ tên + MSSV)_ | **Ngày:** _(điền ngày)_

> **RULE (Anti-Monolithic):** 1 prompt = 1 sub-task. Không dán nguyên đề vào AI. Vòng lặp bắt buộc cho MỌI task có code (slide 8): **[1] Contract → [2] Fail Test → [3] Implement → [4] Refactor**. Mọi prompt đính kèm `project-rules.md`. Mỗi commit dùng conventional commits.

---

## 0. Bản đồ tổng quan

| Block | Phút | Việc | Task |
|---|---|---|---|
| 1 | 0–40 | Setup + WBS | S-1, S-2, S-3 |
| 2 | 40–75 | **Exercise 1** Master-Detail Router | 1.1 – 1.5 |
| 3 | 75–120 | **Exercise 2** Context Form Engine | 2.1 – 2.5 |
| 4 | 120–155 | **Exercise 3** Hook + Express API + Channel Switcher | 3.1 – 3.5 |
| 5 | 155–180 | Live Defense + AI Audit | D-1, D-2 |

**Danh sách commit (15 commit):**

| # | Commit message | Task | Ghi chú |
|---|---|---|---|
| C0 | `init: scaffold lab 4 multi-route SPA` | S-1 | theo log mẫu slide 8 |
| C1 | `docs: define contract spec in project-rules.md` | S-2 | gồm project-rules, TASK_DECOMPOSITION, .env.example, AI_FAILURE_AUDIT khung |
| C2 | `test: add fail test for people router` | 1.1–1.2 | test **đỏ** |
| C3 | `feat: router layout` | 1.3 | **slide yêu cầu** (Sprint 1) |
| C4 | `feat: detail route handling` | 1.4 | **slide yêu cầu** (Sprint 1) |
| C5 | `test: add fail test for form validation` | 2.1 | test **đỏ** (tên theo log mẫu slide 8) |
| C6 | `feat: form context` | 2.2 | **slide yêu cầu** (Sprint 2) |
| C7 | `feat: input field validation` | 2.3 | **slide yêu cầu** (Sprint 2) |
| C8 | `feat: inspector output` | 2.4 | **slide yêu cầu** (Sprint 2) |
| C9 | `test: add fail tests for forum api and hook` | 3.1 | test **đỏ** |
| C10 | `feat: express forum rest api` | 3.2 | slide không nêu số commit Sprint 3 |
| C11 | `feat: useForumMessages hook with abort` | 3.3 | |
| C12 | `feat: live channel switcher` | 3.4 | |
| C13 | `docs: add full-stack error log verification` | 3.5 | |
| C14 | `docs: add ai failure audit` | D-2 | |

> Các commit `test:` là commit riêng (như git log mẫu ở slide 8) nên tổng nhiều hơn số commit slide nêu (2 + 3). Nếu thầy chỉ chấp nhận đúng 2/3 commit cho Sprint 1/2 thì gộp commit `test:` vào commit `feat:` đầu tiên của sprint đó.

**Cấu trúc repo đích:**
```
project-rules.md  TASK_DECOMPOSITION.md  AI_FAILURE_AUDIT.md  .env.example
src/
  main.jsx  App.jsx
  data/people.js
  people/PeopleLayout.jsx  PersonDetail.jsx  NotFound.jsx  people.css
  form/validate.js  FormContext.js  SimpleForm.jsx  InputField.jsx  ShowData.jsx
  forum/useForumMessages.js  ForumChannels.jsx
  test/setup.js
server/
  package.json  app.js  server.js  db.js  app.test.js
docs/verification/ex3-error-log.md
```

---

# BLOCK 1 — SETUP (0–40')

### S-1 — Scaffold dự án (commit C0)
Chạy lệnh (không cần AI):
```bash
npm create vite@latest lab4 -- --template react
cd lab4 && npm install
npm install react-router
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm ls react            # phải là react@19.x
git init
```
Sửa `vite.config.js`:
```js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    exclude: ['**/node_modules/**', 'server/**'],
  },
})
```
Tạo `src/test/setup.js`: `import '@testing-library/jest-dom/vitest'`. Thêm vào `package.json`: `"test": "vitest run"`, `"dev:server": "npm --prefix server run dev"`, `"test:server": "npm --prefix server test"`.
Dọn template: xoá `App.css`, logo, code mẫu.
**Verify:** `npm run dev` mở được, `npm test` chạy (báo "no test files" là bình thường), Console 0 warning.
`git add . && git commit -m "init: scaffold lab 4 multi-route SPA"`

### S-2 — Tài liệu & hợp đồng (commit C1)
1. Đặt `project-rules.md`, `AI_FAILURE_AUDIT.md`, `.env.example`, `TASK_DECOMPOSITION.md` (file này) vào gốc repo.
2. `cp .env.example .env` rồi thêm `.env` vào `.gitignore` (kiểm tra `git status` không thấy `.env`).
3. Các phần **Contract** của từng Exercise bên dưới chính là "contract spec" — tự đọc và hiểu trước khi gọi AI.
`git add . && git commit -m "docs: define contract spec in project-rules.md"`

### S-3 — Kiểm tra môi trường
Node ≥ 20.6 (`node -v`), `npm ls react-router` có v7. Mở DevTools, bật React DevTools (Profiler). **Chưa có gì để commit.**

---

# BLOCK 2 — EXERCISE 1: Responsive Master-Detail Directory & Case Dossier Router (35')

**Yêu cầu slide:** `PeopleLayout.jsx` (`<Outlet />`, `NavLink`) + `PersonDetail.jsx` (`useParams`, `people.find()`, 404, `<dl>`), CSS Grid `minmax(280px, 1fr) 2fr`, 2 commit, DevTools sạch (0 warning, URL param parse đúng).

### Contract (đọc trước khi code)
```
Person = { id: string, name: string, role: string, bio: string }
Bảng route (BrowserRouter ở main.jsx):
  /            -> <Navigate to="/people" replace />
  /people      -> PeopleLayout ({ people = [] }) : <nav> (NavLink mỗi người) + <main><Outlet/></main>
    index      -> <p>Chọn một người ở danh sách bên trái.</p>
    :id        -> PersonDetail ({ people = [] }) : tìm thấy -> <dl> (Name, Role, Bio)
                                                  : không thấy -> role="alert" "404: Person Not Found"
  *            -> NotFound (role="alert")
Link đang chọn: NavLink className={({ isActive }) => isActive ? 'active-link' : 'link'}
Layout: grid-template-columns: minmax(280px, 1fr) 2fr; dưới 600px -> 1 cột (tránh tràn ngang ở 375px)
```

### 1.1 — Dữ liệu mẫu (tự viết, không cần AI)
Tạo `src/data/people.js` với 5 người **hư cấu**, id ổn định (`p-1`…`p-5`), mỗi người có `name`, `role`, `bio` 1 câu. Ghi chú đầu file "dữ liệu mẫu".

### 1.2 — Test đỏ (commit C2)
```
[đính kèm project-rules.md + people.js]
Dùng Vitest + React Testing Library + MemoryRouter (import từ 'react-router').
Viết src/people/people.test.jsx với các test SẼ THẤT BẠI vì chưa có
component (KHÔNG viết PeopleLayout/PersonDetail):
1. Render <Routes> với route /people (element PeopleLayout) và route con
   ':id' (PersonDetail); tại '/people' hiện đủ 5 link tên người và dòng
   "Chọn một người".
2. Tại '/people/p-2': link của p-2 có class 'active-link', các link khác
   không có; <main> hiện thông tin người đó trong <dl> (dt "Name"/"Role").
3. Tại '/people/khong-co': hiện phần tử role="alert" chứa "404".
4. Tại '/duong-dan-la': hiện NotFound (role="alert").
Chỉ trả về file test. Import đúng đường dẫn component dự kiến.
```
**Verify:** `npm test` → test **fail** (lỗi import hoặc assertion) — chụp/ghi log.
`git commit -m "test: add fail test for people router"`

### 1.3 — PeopleLayout + routes + CSS Grid (commit C3)
```
[đính kèm project-rules.md + people.js + test file]
Viết src/people/PeopleLayout.jsx: function component nhận { people = [] }
(default parameter, KHÔNG defaultProps), render <nav aria-label="People">
chứa <ul><li> với <NavLink to={`/people/${p.id}`} className={({ isActive })
=> isActive ? 'active-link' : 'link'}>, và <main><Outlet /></main>.
Viết src/people/people.css: .people-frame dùng CSS Grid
grid-template-columns: minmax(280px, 1fr) 2fr; gap bằng rem; @media
(max-width: 600px) chuyển 1 cột; màu qua CSS variables. KHÔNG <div>.
Viết src/App.jsx dùng <Routes>: '/' -> <Navigate to="/people" replace />,
'/people' element={<PeopleLayout people={PEOPLE} />} với route index là
<p>Chọn một người ở danh sách bên trái.</p>. CHƯA làm route ':id' và
PersonDetail. Sửa main.jsx bọc <BrowserRouter>. Import từ 'react-router'.
Tạo luôn NotFound.jsx (role="alert") và route path="*".
```
**Verify:** test 1 và 4 xanh, test 2–3 còn đỏ. Console 0 warning.
`git commit -m "feat: router layout"`

### 1.4 — PersonDetail + 404 (commit C4)
```
[đính kèm PeopleLayout.jsx, App.jsx, people.js, test file]
Viết src/people/PersonDetail.jsx: nhận { people = [] }; const { id } =
useParams(); person = people.find((p) => p.id === id); nếu không có ->
<p role="alert">404: Person Not Found</p>; nếu có -> <article> với <h2>
tên và <dl> gồm <dt>Name</dt><dd>, <dt>Role</dt><dd>, <dt>Bio</dt><dd>.
Thêm vào App.jsx route con path=":id" element={<PersonDetail people={PEOPLE}
/>}. Không <div>, không useEffect. Chỉ sửa 2 file này.
```
**Verify:** `npm test` **toàn bộ xanh**.
`git commit -m "feat: detail route handling"`

### 1.5 — Verification Gate (Checkpoint 1)
- DevTools Console: **0 warning/error**. Đi `/people/p-3` rồi **tải lại trang (F5)** → vẫn đúng người (deep link).
- Nhập `/people/abc` → hiện 404 trong `role="alert"`, không crash.
- Device Toolbar 375px: **không scroll ngang**, layout 1 cột.
- Accessibility tree: `navigation "People"` + `main` + `definition list`.
- `grep -n '<div' src/people` → 0 kết quả.
- Tùy chọn (Ex 1.1 trong slide): `React.lazy(() => import('./PersonDetail'))` + `<Suspense fallback={<p aria-busy="true" aria-live="polite">…</p>}>` với skeleton cao bằng nội dung thật (CLS = 0). Nếu làm, commit riêng `perf: lazy load person detail`.

---

# BLOCK 3 — EXERCISE 2: Context-Driven Multi-Field Form Engine & Live <ShowData /> Inspector (45')

**Yêu cầu slide:** `SimpleForm.jsx` + `InputField.jsx` + context, **validation đồng bộ, KHÔNG `useEffect`**, `<ShowData />` hiện JSON khi submit hợp lệ, 3 commit.

### Contract
```
Values = { fullName: string, email: string, age: string }   // age lưu string trong input
validateForm(values) -> { fullName?: string, email?: string, age?: string }   // hàm THUẦN; {} = hợp lệ
  fullName: trim().length >= 2        "Họ tên tối thiểu 2 ký tự"
  email   : /^[^\s@]+@[^\s@]+\.[^\s@]+$/   "Email không hợp lệ"
  age     : số nguyên 13..120         "Tuổi từ 13 đến 120"
FormContext value = { values, errors, isValid, touched, submitted, handleChange(name, value),
                      handleBlur(name), handleSubmit(e) }
useFormContext() ném lỗi nếu dùng ngoài <FormContext.Provider>
InputField({ label, name, type = 'text', value, error, onChange, onBlur })
  -> <label htmlFor={id}> + <input id={id} aria-invalid={!!error} aria-describedby={error ? errorId : undefined}>
  -> lỗi: <span id={errorId} role="alert">  (id = useId())
Chỉ HIỂN THỊ lỗi khi field đã touched hoặc đã submit; errors vẫn được TÍNH mỗi lần render.
ShowData({ data }) -> <dl> với Object.entries(data) (key là Fragment key={k})
Submit hợp lệ -> hiện <ShowData data={values đã gửi} />; không hợp lệ -> đánh dấu tất cả touched.
```
> Lưu ý slide: code mẫu `InputField` **không gắn `{...props}` vào `<input>`** nên input sẽ không điều khiển được — phải tự sửa khi nhận code từ AI.

### 2.1 — Test đỏ (commit C5)
```
[đính kèm project-rules.md + contract Ex2]
Viết 2 file test Vitest + RTL (+ user-event), chưa có implement:
A) src/form/validate.test.js (unit, hàm thuần validateForm): họ tên rỗng
   /1 ký tự -> lỗi; email sai -> lỗi; tuổi 12, 121, 'abc', 25.5 -> lỗi;
   dữ liệu hợp lệ -> {}.
B) src/form/SimpleForm.test.jsx: (1) gõ email sai rồi blur -> có phần tử
   role="alert", input có aria-invalid="true" và aria-describedby trùng id
   của phần tử lỗi; (2) label bấm vào thì focus input tương ứng
   (getByLabelText); (3) submit khi còn lỗi -> KHÔNG thấy <dl> ShowData;
   (4) điền hợp lệ rồi submit -> thấy <dl> chứa đúng 3 cặp dt/dd.
KHÔNG viết implementation. Chỉ trả về 2 file test.
```
**Verify:** `npm test` → các test mới **đỏ**.
`git commit -m "test: add fail test for form validation"`

### 2.2 — validate + FormContext + SimpleForm (commit C6)
```
[đính kèm project-rules.md + contract Ex2 + validate.test.js]
Viết 3 phần, KHÔNG useEffect:
- src/form/validate.js: export function validateForm(values) đúng contract.
- src/form/FormContext.js: createContext(null), export useFormContext()
  (useContext, ném Error nếu null).
- src/form/SimpleForm.jsx: useState cho values, touched, submitted;
  const errors = validateForm(values) TÍNH NGAY TRONG RENDER;
  isValid = Object.keys(errors).length === 0; handleChange/handleBlur/
  handleSubmit (preventDefault; nếu !isValid -> setTouched tất cả; nếu
  hợp lệ -> setSubmitted giữ bản sao values); bọc con trong
  <FormContext.Provider value={{...}}>. Render tạm một <form noValidate>
  rỗng bên trong (chưa có field).
Cập nhật immutable ([...], {...prev, [name]: value}).
```
**Verify:** `validate.test.js` xanh.
`git commit -m "feat: form context"`

### 2.3 — InputField + nối field (commit C7)
```
[đính kèm SimpleForm.jsx, FormContext.js, contract Ex2, SimpleForm.test.jsx]
Viết src/form/InputField.jsx theo contract (useId, label htmlFor,
aria-invalid, aria-describedby, span role="alert"); NHỚ truyền value,
onChange, onBlur, type, name xuống <input> (không bỏ sót). Sửa
SimpleForm.jsx: render 3 InputField (Họ tên, Email, Tuổi) lấy dữ liệu
từ useFormContext(); lỗi chỉ hiện khi touched[name] || submitted; nút
<button type="submit"> "Gửi". Không <div>; dùng <fieldset>/<legend> để
nhóm. Không useEffect.
```
**Verify:** test (1)(2) của SimpleForm xanh; Tab qua từng field theo đúng thứ tự.
`git commit -m "feat: input field validation"`

### 2.4 — ShowData + luồng submit (commit C8)
```
[đính kèm SimpleForm.jsx, test file]
Viết src/form/ShowData.jsx: nhận { data }, render <dl> với
Object.entries(data).map(([k, v]) => <Fragment key={k}><dt>{k}</dt>
<dd>{String(v)}</dd></Fragment>) — thay cho JSON.stringify. Sửa
SimpleForm.jsx: khi submitted có giá trị thì render <section
aria-label="Submitted data"><h2>Dữ liệu đã gửi</h2><ShowData
data={submitted} /></section>. Không đổi logic validate.
```
**Verify:** `npm test` **toàn bộ xanh**.
`git commit -m "feat: inspector output"`

### 2.5 — Verification Gate (Checkpoint 2)
- `grep -rn useEffect src/form` → **0 kết quả**.
- React DevTools **Profiler**: gõ **1 ký tự** vào ô Họ tên = **1 commit render** (anti-pattern slide 13 cho 5 render/phím).
- Mỗi input có label (click label → focus). Màn hình đọc: lỗi được đọc nhờ `role="alert"`; Tab order đúng.
- `aria-describedby` của input trùng `id` của lỗi (Elements panel).
- Submit hợp lệ hiện `<dl>`; submit sai không hiện.

---

# BLOCK 4 — EXERCISE 3: Full-Stack Hook `useForumMessages` & Live Channel Switcher (35')

**Yêu cầu slide:** fetch theo 3 kênh `nasa` / `esports-tribunal` / `notNasa`; khi đổi kênh nhanh trong **Slow 3G**, request đang bay bị **huỷ bằng AbortController**; lưu log xác minh lỗi full-stack.

### Contract
> **Quyết định đường dẫn API (slide mâu thuẫn):** dùng `/api/messages/:forum` ở CẢ client và server (theo code server ở slide 27). Không dùng `/api/forums/...` hay `/api/channels/...`.
```
Forum hợp lệ: nasa | esports-tribunal | notNasa
Message = { id: uuid, author: string, text: string, timestamp: ISO string }
GET  /api/messages/:forum            -> 200 [Message] (cũ -> mới) | 404 { error } nếu forum lạ
POST /api/messages/:forum {author,text} -> 201 Message | 400 { error } (thiếu/sai/ quá dài >500) | 404
CORS: Access-Control-Allow-Origin = process.env.CLIENT_ORIGIN
Env: PORT, CLIENT_ORIGIN, SIMULATED_LATENCY_MS (delay trước khi trả lời), VITE_API_URL (client)
Hook: useForumMessages(forum) -> { data: Message[], loading: boolean, error: string | null,
                                    postMessage(payload): Promise<void>, retry(): void }
  - retry() chỉ tăng refetchTick để tải lại
  - effect deps [forum, refetchTick]; AbortController tạo TRONG effect; bỏ qua AbortError
  - mỗi lần đổi forum: loading=true, xoá error; chỉ setState khi !signal.aborted
  - postMessage: POST rồi tăng refetchTick để tải lại; ném lỗi nếu res không ok
```

### 3.1 — Test đỏ (commit C9)
```
[đính kèm project-rules.md + contract Ex3]
Viết 2 nhóm test, CHƯA có implementation:
A) server/app.test.js dùng node:test + supertest (import app từ './app.js'):
   GET forum hợp lệ -> 200 mảng; forum lạ -> 404; POST thiếu author ->
   400; POST hợp lệ -> 201 có id dạng UUID và timestamp; POST rồi GET thấy
   tin mới; header CORS khớp CLIENT_ORIGIN; text > 500 ký tự -> 400.
B) src/forum/useForumMessages.test.jsx (Vitest, renderHook): mock
   global fetch bằng vi.stubGlobal sao cho promise REJECT với
   DOMException('Aborted','AbortError') khi signal bị abort. Test: (1) đổi
   forum 'nasa' -> 'notNasa' khi request đầu chưa xong -> kết quả cuối
   là của 'notNasa', không bao giờ ghi đè bằng 'nasa'; (2) unmount khi
   đang tải -> signal.aborted === true; (3) AbortError KHÔNG làm error
   khác null; (4) res.ok=false -> error có nội dung.
Chỉ trả về file test.
```
**Verify:** test **đỏ** ở cả server và client.
`git commit -m "test: add fail tests for forum api and hook"`

### 3.2 — Express REST API (commit C10)
```
[đính kèm project-rules.md + contract Ex3 + server/app.test.js]
Trong thư mục server/ (CommonJS, Node >= 20): viết db.js (lưu tin nhắn
IN-MEMORY theo forum, dữ liệu mẫu 2 tin mỗi kênh, hàm
getMessagesByForum / addMessage / reset), app.js (tạo và export app:
cors({ origin: process.env.CLIENT_ORIGIN }), express.json(), middleware
trễ giả theo SIMULATED_LATENCY_MS, GET và POST /api/messages/:forum đúng
contract, validate POST: author/text là string, trim, không rỗng, text
tối đa 500, id = randomUUID() từ 'node:crypto', timestamp = new
Date().toISOString(); mọi handler async có try/catch trả 500 {error}),
server.js (đọc PORT, app.listen), package.json (scripts dev:
'node --env-file=../.env --watch server.js', start, test: 'node --test';
deps express, cors; devDep supertest). KHÔNG hardcode origin/port.
```
**Verify:** `npm --prefix server install` rồi `npm run test:server` **xanh**. Chạy thật: `curl -i localhost:3001/api/messages/nasa`.
`git commit -m "feat: express forum rest api"`

### 3.3 — Hook `useForumMessages` (commit C11)
```
[đính kèm project-rules.md + contract Ex3 + useForumMessages.test.jsx]
Viết src/forum/useForumMessages.js: useState data/loading/error và
refetchTick; useEffect([forum, refetchTick]) tạo AbortController BÊN
TRONG effect; async fetchMessages: setLoading(true), setError(null);
fetch(`${import.meta.env.VITE_API_URL}/api/messages/${forum}`, { signal });
nếu !res.ok ném Error; chỉ setData/setLoading khi !signal.aborted; catch
bỏ qua AbortError, còn lại setError (khi !signal.aborted); cleanup return
() => controller.abort(). postMessage(payload): POST JSON, nếu !res.ok
ném Error(message từ server), thành công thì setRefetchTick(t => t + 1).
Thêm retry = () => setRefetchTick(t => t + 1). Hook trả về { data,
loading, error, postMessage, retry }. Không didCancel flag, không thiếu
dependency.
```
**Verify:** test hook **xanh**; `npm test` xanh.
`git commit -m "feat: useForumMessages hook with abort"`

### 3.4 — Channel Switcher + form gửi tin (commit C12)
```
[đính kèm useForumMessages.js, InputField.jsx, App.jsx]
Viết src/forum/ForumChannels.jsx: state forum (mặc định 'nasa'); thanh
chọn kênh gồm 3 <button type="button" aria-pressed> (nasa,
esports-tribunal, notNasa); khi loading render skeleton cao cố định
(aria-busy="true" aria-live="polite"); khi error render <section
role="alert"> + nút "Thử lại" gọi retry() của hook; khi có data render <dl> với <Fragment key={msg.id}>
<dt>{author} <time dateTime={timestamp}>…</time></dt><dd>{text}</dd>
</Fragment>. Form gửi tin dùng InputField (author, text), disable nút
khi đang gửi, hiện lỗi 400 trong role="alert". Thêm route '/forum' vào
App.jsx và link ở nav. KHÔNG window.alert, không useEffect trong
component này.
```
**Verify:** `npm run dev:server` và `npm run dev` chạy cùng lúc; gửi tin mới thấy xuất hiện.
`git commit -m "feat: live channel switcher"`

### 3.5 — Verification Gate + log lỗi (commit C13)
1. Trong `.env` đặt `SIMULATED_LATENCY_MS=800`, restart server.
2. Chrome DevTools → Network → **Slow 3G**. Bấm **nasa → esports-tribunal → notNasa** thật nhanh: các request cũ phải hiện **(canceled)**, UI chỉ hiện dữ liệu kênh **cuối**, **không** có banner lỗi giả, Console không có `AbortError`.
3. Ép lỗi để lấy log: (a) tắt server → UI hiện `role="alert"` + Retry (chụp Console + Network); (b) POST thiếu `author` → server trả 400 (chụp response). Bật lại server, bấm Retry → hồi phục.
4. Tạo `docs/verification/ex3-error-log.md` ghi: ngày giờ, 3 kịch bản ở trên, mỗi kịch bản kèm ảnh/log và kết luận đạt/không đạt. (Slide ghi "Save full-stack error log verification" — mình hiểu là lưu bằng chứng này; nên xác nhận lại với thầy.)
`git add docs && git commit -m "docs: add full-stack error log verification"`

---

# BLOCK 5 — LIVE DEFENSE & AI AUDIT (155–180')

### D-1 — Luyện bảo vệ 3 phút (AI đóng hết)
Thầy sẽ: (1) bắt giải thích kiến trúc, (2) hỏi vì sao chọn local / global / persistent state, (3) chèn một lỗi để em sửa.

**Bảng "chọn state" để trả lời nhanh:**

| Dữ liệu | Nằm ở đâu | Vì sao |
|---|---|---|
| Người đang xem (Ex1) | URL (`useParams`) | link chia sẻ được, F5 vẫn giữ |
| values / touched / submitted của form (Ex2) | `useState` trong `SimpleForm`, chia sẻ qua **Context** | nhiều field cần dùng chung, tránh prop drilling |
| errors / isValid | **dẫn xuất khi render** (không lưu state) | tránh `useEffect` đồng bộ → vòng lặp render |
| messages, loading, error (Ex3) | state trong hook `useForumMessages` | dữ liệu theo từng kênh, hook tự huỷ request |
| Dữ liệu bền vững | server (in-memory ở Ex3, MongoDB ở homework) | mất khi tải lại nếu để ở client |

**4 đề đột biến trong slide — tập sửa trong 3 phút, chỉ nhìn tài liệu:**

| Đề | Sửa ở đâu | Gợi ý |
|---|---|---|
| useSearchParams | `PeopleLayout.jsx` | thêm ô lọc `?q=`; `const [sp, setSp] = useSearchParams(); const q = sp.get('q') ?? ''`; lọc `people` ngay trong render; `setSp({ q }, { replace: true })` |
| Cross-field validation | `validate.js` | thêm field `confirmEmail`; trong `validateForm(values)` so khớp `values.email`; lỗi gắn vào `confirmEmail`; vẫn **không** `useEffect` |
| Auto-retry backoff | `useForumMessages.js` | vòng lặp tối đa 3 lần, chờ `500 * 2**n` ms bằng `sleep(ms, signal)` có thể huỷ; chỉ retry lỗi mạng / 5xx, không retry 4xx; thoát ngay khi `signal.aborted` |
| Protected route | `App.jsx` + `RequireAuth.jsx` | wrapper dùng `useLocation`; chưa đăng nhập -> `<Navigate to="/login" state={{ from: location }} replace />`; sau login `navigate(state.from)`; dùng làm route layout trả `<Outlet />` |

Tự bấm giờ cho từng đề.

### D-2 — AI_FAILURE_AUDIT.md (commit C14)
Điền **≥ 3 lỗi thật** vào file khung (đã có mẫu và danh sách bẫy). Ghi NGAY khi gặp, kèm commit hash của bản sửa.
`git add AI_FAILURE_AUDIT.md && git commit -m "docs: add ai failure audit"`

---

# CHECKLIST NỘP BÀI

- [ ] Gốc repo có `project-rules.md`, `TASK_DECOMPOSITION.md`, `AI_FAILURE_AUDIT.md`, `.env.example` (không có `.env`)
- [ ] `npm test` xanh, `npm run test:server` xanh
- [ ] Ex1: 0 warning, 404 đúng, 375px không scroll ngang, 0 `<div>` trong `src/people`
- [ ] Ex2: 0 `useEffect` trong `src/form`, 1 render/phím gõ, mọi input có label + `aria-invalid`/`aria-describedby`
- [ ] Ex3: request cũ `(canceled)` khi đổi kênh nhanh (Slow 3G), có `docs/verification/ex3-error-log.md`
- [ ] `AI_FAILURE_AUDIT.md` ≥ 3 lỗi thật có bằng chứng
- [ ] `git log --oneline` có đủ commit ở bảng mục 0

```
git log --oneline
```
_(dán kết quả vào đây trước khi nộp)_
