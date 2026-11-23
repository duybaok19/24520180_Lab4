# Exercise 3: Full-stack error log verification

- Môi trường: Vite http://localhost:5173, Express http://localhost:3001, SIMULATED_LATENCY_MS=800
- Công cụ: Chrome DevTools (Network: Slow 3G)

## Kịch bản 1: Đổi kênh nhanh trong Slow 3G
- Thao tác: bấm nasa -> esports-tribunal -> notNasa thật nhanh.
- Kết quả quan sát: <điền: request cũ có (canceled) không? UI cuối là kênh nào? Console có AbortError không?>
- Bằng chứng: `scenario1-network.png`, `scenario1-console.png`
- Kết luận: <Đạt / Không đạt>

## Kịch bản 2: Server tắt (lỗi GET)
- Thao tác: tắt server, đổi kênh, sau đó bật lại server và bấm "Thử lại".
- Kết quả quan sát: <điền: UI hiện gì? Console/Network báo gì? Retry có hồi phục không?>
- Bằng chứng: `scenario2-error-ui.png`, `scenario2-network.png`
- Kết luận: <Đạt / Không đạt>

## Kịch bản 3: POST thiếu author (lỗi 400)
- Thao tác: để trống Tên, gửi tin.
- Phản hồi server: <dán JSON response, ví dụ {"error":"..."}>
- UI hiển thị: <điền>
- Bằng chứng: `scenario3-400.png`
- Kết luận: <Đạt / Không đạt>
