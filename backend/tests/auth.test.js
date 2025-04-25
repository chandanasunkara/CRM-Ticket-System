jest.setTimeout(30000);
require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../src/models/Users');
const app = require('../src/server');

let token; // will store token for protected route test

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
  await mongoose.connect(mongoUri);
  await User.deleteMany({});

  // Test user for login
  const testUser = new User({
    name: 'Test User',
    email: 'test@example.com',
    password: 'test1234',
    role: 'customer'
  });

  await testUser.save();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Auth Route Tests', () => {
  test('should return 400 if email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'test1234' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Please provide an email and password');
  });

  test('should return 401 if email is incorrect', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@example.com', password: 'test1234' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  test('should return 200 and token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'test1234' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
    expect(res.body.user).toHaveProperty('role', 'customer');

    token = res.body.token; // save token for later test
  });

  test('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'newpass123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', 'newuser@example.com');
  });

  test('should return current user data with token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('email', 'test@example.com');
    expect(res.body.data).toHaveProperty('name', 'Test User');
  });

  test('should logout and clear token cookie', async () => {
    const res = await request(app)
      .get('/api/auth/logout');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({});
  });
});
