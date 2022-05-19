const mongoose = require('mongoose');
const Product = require('../models/Product');
const { testUsername, testPassword, request } = require('./helpers/index');
const server = require('../index');

describe('Product CONTROLLER', () => {
	let token;
	let someId;

	beforeAll(async() => {
		await Product.deleteMany();
		const response = await request.post('/api/auth/login')
			.set('Content-Type', 'application/json')
			.send({username: testUsername, password: testPassword});
		expect(response.body).toBeDefined();
		token = response.body.token;
            
	});

	describe('[POST], create a product', () => {
		test('it should respond with a success message', async() => {
			const response = await request.post('/api/products')
				.set('Content-Type', 'application/json')
				.set('Authorization', `Bearer ${token}`)
				.send({name: 'name', price: '12'});
			expect(response.statusCode).toBe(201);
			expect(response.body).toBeDefined();
			someId = response.body._id;
		});
	});

	describe('[PUT], update product', () => {
		test('it must update all content', async() => {
			const response = await request.put(`/api/products/${someId}`)
				.set('Content-Type', 'application/json')
				.set('Authorization', `Bearer ${token}`)
				.send({name: 'name updated', price: '12555', description: 'updated'});
			expect(response.statusCode).toBe(200);
			expect(response.body.name).not.toBeNull();
		});
	});

	describe('[GET], get all products', () => {
		test('it should return all products', async() => {
			const response = await request.get('/api/products')
				.set('Content-Type', 'application/json');
			expect(response.statusCode).toBe(200);
			expect(response.body).toBeDefined();
		});

		test('it should return the product with the follow id: ' + someId, async() => {
			const response = await request.get(`/api/products/${someId}`)
				.set('Content-Type', 'application/json');
			expect(response.statusCode).toBe(200);
			expect(response.body.user._id).toBeDefined();
		});
	});

	describe('[DELETE]', () => {
		test('it must delete one product', async() => {
			const response = await request.delete(`/api/products/${someId}`)
				.set('Content-Type', 'application/json')
				.set('Authorization', `Bearer ${token}`);
			expect(response.statusCode).toBe(200);

		});
	});
});

afterAll(() => {
	mongoose.connection.close();
	server.close();
});