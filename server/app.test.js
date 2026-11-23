import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

process.env.CLIENT_ORIGIN = 'http://localhost:5173';
process.env.SIMULATED_LATENCY_MS = '0';

let app;

before(async () => {
  const module = await import('./app.js');
  app = module.default;
});

test('GET forum hợp lệ trả về 200 và một mảng', async () => {
  const response = await request(app).get('/api/messages/nasa');

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body));
});

test('GET forum không hợp lệ trả về 404', async () => {
  const response = await request(app).get('/api/messages/unknown');

  assert.equal(response.status, 404);
  assert.ok(response.body.error);
});

test('POST thiếu author trả về 400', async () => {
  const response = await request(app)
    .post('/api/messages/nasa')
    .send({ text: 'Hello NASA' });

  assert.equal(response.status, 400);
  assert.ok(response.body.error);
});

test('POST hợp lệ trả về 201, UUID và timestamp ISO', async () => {
  const response = await request(app)
    .post('/api/messages/nasa')
    .send({
      author: 'Tester',
      text: 'Hello NASA',
    });

  assert.equal(response.status, 201);

  assert.match(
    response.body.id,
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  );

  assert.equal(
    new Date(response.body.timestamp).toISOString(),
    response.body.timestamp
  );

  assert.equal(response.body.author, 'Tester');
  assert.equal(response.body.text, 'Hello NASA');
});

test('POST rồi GET phải thấy tin nhắn vừa tạo', async () => {
  const payload = {
    author: 'Integration Tester',
    text: 'Message should appear in GET',
  };

  const postResponse = await request(app)
    .post('/api/messages/esports-tribunal')
    .send(payload);

  assert.equal(postResponse.status, 201);

  const getResponse = await request(app)
    .get('/api/messages/esports-tribunal');

  assert.equal(getResponse.status, 200);
  assert.ok(Array.isArray(getResponse.body));

  assert.ok(
    getResponse.body.some(
      (message) => message.id === postResponse.body.id
    )
  );
});

test('Response có header CORS đúng CLIENT_ORIGIN', async () => {
  const response = await request(app).get('/api/messages/nasa');

  assert.equal(
    response.headers['access-control-allow-origin'],
    process.env.CLIENT_ORIGIN
  );
});

test('POST text dài hơn 500 ký tự trả về 400', async () => {
  const response = await request(app)
    .post('/api/messages/nasa')
    .send({
      author: 'Tester',
      text: 'a'.repeat(501),
    });

  assert.equal(response.status, 400);
  assert.ok(response.body.error);
});