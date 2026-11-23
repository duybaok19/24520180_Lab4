# AI_FAILURE_AUDIT.md — Lab 4 (15% of lab grade)

**Sinh viên:** _(họ tên + MSSV)_

> Chỉ ghi lỗi AI **thực sự gặp** khi làm bài, có bằng chứng (git diff, DevTools, log test). Không điền trước, không bịa. Slide yêu cầu 3 nhóm nội dung: **AI Code Failures**, **Hallucinated APIs & Loops**, **Engineering Verification**. Cần tối thiểu 3 lỗi.

---

## Failure #01 — _(tên lỗi ngắn)_

- **Task / Commit liên quan:** _(ví dụ Task 2.2, commit abc1234)_
- **Prompt đã dùng:** _(dán nguyên văn)_
- **Nhóm lỗi:** ☐ AI Code Failure  ☐ Hallucinated API / Loop  ☐ Khác: ___
- **AI sinh ra:**
  ```js
  // dán đoạn code sai
  ```
- **Lỗi là gì / hậu quả:** _(ví dụ: dùng `<Switch>` của Router v5 nên build lỗi)_
- **Cách phát hiện (Engineering Verification):** _(lệnh/thao tác cụ thể: test đỏ, Profiler, Network tab, grep, git diff...)_
- **Bằng chứng:** _(ảnh chụp / log / dòng test thất bại)_
- **Cách sửa (code sau khi sửa) + commit:**
  ```js
  // dán đoạn đã sửa
  ```

## Failure #02 — _(tên lỗi ngắn)_
_(sao chép mẫu Failure #01)_

## Failure #03 — _(tên lỗi ngắn)_
_(sao chép mẫu Failure #01)_

---

## Danh sách "bẫy" hay gặp để canh chừng (KHÔNG phải lỗi đã xảy ra — chỉ ghi lên trên nếu em gặp thật)

| Task | AI hay sai ở đâu |
|---|---|
| 1.x Router | Dùng `<Switch>`, `component={...}`, `exact`, `activeClassName` của v5; import từ `react-router-dom` cũ; quên route `*`; `find()` không xử lý trường hợp không thấy |
| 2.x Form | Dùng `useEffect` để validate / đồng bộ lỗi (vòng lặp render); `InputField` không gắn `{...props}` vào `<input>` nên input không điều khiển được; `aria-describedby` trỏ tới id không tồn tại; dùng `index` làm key |
| 3.x Hook / API | Quên `AbortController` hoặc để `[]` thiếu dependency; setState sau khi đã abort; coi `AbortError` là lỗi và hiện banner lỗi giả; không kiểm tra `res.ok`; URL client và server không khớp nhau; callback kiểu Mongoose 5; chuỗi kết nối hardcode |
| Chung | `<div>` thừa; `alert()`; nút icon không có `aria-label`; tự thêm thư viện ngoài |
