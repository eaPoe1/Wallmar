/* 
*TODO: CHECK THIS:  https://github.com/zmts/supra-api-nodejs/blob/master/test/auth.test.js
*/
const mongoose = require('mongoose');

const User = require('../models/User');
const { testUsername, testEmail, testPassword, testRoleAdmin, request } = require('./helpers/index');
const server = require('../index');

describe('AUTH CONTROLLER', () => {

	let accessToken;
	let confirmToken;
	beforeAll(async() => {
		await User.deleteMany({});
	});

	describe('[POST, /signup] auth signup', () => {
		test('it should create a user', async() => {
			const response = await request.post('/api/auth/signup')
				.set('content-type', 'application/json')
				.send({
					username: testUsername,
					email: testEmail, 
					password: testPassword, 
					role: testRoleAdmin});
			expect(response.statusCode).toBe(201);
			expect(response.body).toBeDefined();
			expect(response.body).toHaveProperty('role');
			confirmToken = response.body.token;
		});

		test('it should not insert into the database a repeat user', async() => {
			const response = await request.post('/api/auth/signup')
				.set('content-type', 'application/json')
				.send({username: testUsername, email: testEmail, password: testPassword});
			expect(response.statusCode).toBe(400);
		});
	});

	describe('[GET, confirm]', () => {
		test('it should respond with a success message', async() => {
			const response = await request.get(`/api/auth/confirm/${confirmToken}`)
				.set('content-type', 'application/json');
			expect(response.statusCode).toBe(200);
			expect(response.body.msg).toEqual('confirmed');   
		});

		test('it should handle every errors', async() => {
			const response = await request.get(`/api/auth/confirm/${confirmToken}1` /*!<-- see the number 1 */)
				.set('content-type', 'application/json');
			expect(response.statusCode).toBe(400);
			expect(response.body.msg).toEqual('invalid token');   
		});
	});

	describe('[POST, login]', () => {
		test('login must be success and return a jwt', async() => {
			const response = await request.post('/api/auth/login')
				.set('content-type', 'application/json')
				.send({username: testUsername, password: testPassword});
			expect(response.statusCode).toBe(200);
			expect(response.body).toBeDefined();
			expect(response.body).toHaveProperty('token');
			accessToken = response.body.token;
			
		});
	});    

	describe('[GET, profile(test route)]', () => {
		test('it should return username, email and _id', async() => {
			const response = await request.get('/api/auth/profile')
				.set('content-type', 'application/json')
				.set('authorization', `Bearer ${accessToken}`);
			expect(response.statusCode).toBe(200);
			expect(response.body).toBeDefined(); 
		});

		test('it should not let controller run', async() => {
			const response = await request.get('/api/auth/profile')
				.set('content-type', 'application/json');
			expect(response.statusCode).toBe(401);
			expect(response.body.msg).toEqual('invalid token');
		});
	});
});

afterAll(() => {
	mongoose.connection.close();
	server.close();
});

