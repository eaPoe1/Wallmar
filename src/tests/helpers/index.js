const supertest = require('supertest');
const app = require('../../app');

const testUsername = 'soma';
const testEmail = 'soma@example.com';
const testPassword = 'password';
const testRoleAdmin = 'admin';

const request = supertest(app);

module.exports = {
	testUsername,
	testEmail,
	testPassword,
	testRoleAdmin,
	request
};