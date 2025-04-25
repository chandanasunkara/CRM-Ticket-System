jest.setTimeout(30000);
require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/Users');

let adminToken;
let customerToken;
let userId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'test-crm' });
  await User.deleteMany();

  // Create admin user
  await request(app).post('/api/auth/register').send({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    department: 'support'
  });

  const adminLogin = await request(app).post('/api/auth/login').send({
    email: 'admin@example.com',
    password: 'admin123'
  });

  adminToken = adminLogin.body.token;

  // Create customer user
  await request(app).post('/api/auth/register').send({
    name: 'Customer User',
    email: 'customer@example.com',
    password: 'customer123',
    role: 'customer',
    department: 'sales'
  });

  const customerLogin = await request(app).post('/api/auth/login').send({
    email: 'customer@example.com',
    password: 'customer123'
  });

  customerToken = customerLogin.body.token;

  const user = await User.findOne({ email: 'customer@example.com' });
  userId = user._id;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('User Routes', () => {
  test('should not allow customer to access all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/not authorized/i);
  });

  test('should allow admin to fetch all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('should allow admin to fetch a user by ID', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('email', 'customer@example.com');
  });

  test('should allow admin to delete a user by ID', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
