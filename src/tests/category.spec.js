const mongoose = require('mongoose');
const Category = require('../models/Category');
const { testUsername, testPassword, request } = require('./helpers/index');
const server = require('../index');

describe('CATEGORY', () => {
	let token;
	let someId;

	beforeAll(async() => {
		await Category.deleteMany();
		const response = await request.post('/api/auth/login')
			.set('Content-Type', 'application/json')
			.send({username: testUsername, password: testPassword});
		expect(response.body).toBeDefined();
		token = response.body.token;
	});

	describe('[POST], create category', () => {
		test('it should create a category', async() => {
			const response = await request.post('/api/categories')
				.set('Content-Type', 'application/json')
				.set('Authorization', `Bearer ${token}`)
				.send({name: 'Food'});
			expect(response.statusCode).toBe(201);
			expect(response.body).toHaveProperty('name');
			someId = response.body._id;
		});
	});    

	describe('[PUT], update category', () => {
		test('it should update', async() => {
			const response = await request.put(`/api/categories/${someId}`)
				.set('Content-Type', 'application/json')
				.set('Authorization', `Bearer ${token}`)
				.send({name: 'UPDATE NAME'});
			expect(response.statusCode).toBe(200);
			expect(response.body.name).toEqual('UPDATE NAME');
		});
	});


	describe('[DELETE], delete category', () => {
		test('it should delete', async() => {
			const response = await request.delete(`/api/categories/${someId}`)
				.set('Content-Type', 'application/json')
				.set('Authorization', `Bearer ${token}`);
			expect(response.statusCode).toBe(200);
			expect(response.body.msg).toEqual('removed');
		});
	});
});

afterAll(() => {
	mongoose.connection.close();
	server.close();
});