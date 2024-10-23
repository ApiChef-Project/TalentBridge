import request from "supertest";
import app from "../app";
import { config } from "dotenv";
import connectMongoDB from "../config/connect.db.js";
import mongoose from "mongoose";

config();
const DB_URI = process.env.DB_URI || "mongodb://127.0.0.1:27017/TalentBridge";
// connecting to mongoDB
await connectMongoDB(DB_URI, false);

const user1payload = {
	firstName: "anas",
	lastName: "asimi",
	email: "anas2020cr7@gmail.com",
	phone: "0123456789",
	password: "anas123",
};
let user1ID;
let newEmail = "new-email@gmail.com";
const user2payload = {
	firstName: "anas2",
	lastName: "asimi2",
	email: "anas3030@gmail.com",
	phone: "00000000",
	password: "anas456",
};

// droping the database
beforeAll(async () => {
	await mongoose.connection.dropDatabase();
});

describe("GET /", () => {
	it("responds with 200 status code", async () => {
		const response = await request(app).get("/");
		expect(response.statusCode).toBe(200);
	});
});

describe("POST /auth/signup", () => {
	it("create a new user", async () => {
		const response = await request(app)
			.post("/auth/signup")
			.send(user1payload);
		const payloadWithoutPassword = { ...user1payload };
		delete payloadWithoutPassword["password"];
		expect(response.statusCode).toBe(201);
		expect(response.body).toMatchObject(payloadWithoutPassword);
		user1ID = response.body._id;
	});
});

describe("POST /auth/signup", () => {
	it('return { error: "All fields are required" }', async () => {
		const response = await request(app).post("/auth/signup");
		expect(response.statusCode).toBe(400);
		expect(response.body).toStrictEqual({
			error: "All fields are required",
		});
	});
});

describe("POST /auth/signup", () => {
	it('return {error: "User with email anas2020cr7@gmail.com already exists"}', async () => {
		const response = await request(app)
			.post("/auth/signup")
			.send(user1payload)
			.set("Content-Type", "application/json");
		expect(response.statusCode).toBe(400);
		expect(response.body).toStrictEqual({
			error: "User with email anas2020cr7@gmail.com already exists",
		});
	});
});

describe("GET /users", () => {
	it("return all users", async () => {
		let response = await request(app).get("/users");
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveLength(1);
		let usersCount = response.body.length;
		// adding another user
		await request(app)
			.post("/auth/signup")
			.send(user2payload)
			.set("Content-Type", "application/json");
		response = await request(app).get("/users");
		expect(response.body).toHaveLength(usersCount + 1);
	});
});

describe("GET /users/:id", () => {
	it("return an user by id", async () => {
		let response = await request(app).get(`/users/${user1ID}`);
		const payloadWithoutPassword = { ...user1payload };
		delete payloadWithoutPassword["password"];
		expect(response.statusCode).toBe(200);
		expect(response.body).toMatchObject(payloadWithoutPassword);
	});
});

describe("GET /users/:id", () => {
	it('return { error: "User not found" }', async () => {
		let response = await request(app).get(
			"/users/671956a76d4214c084a6d36b"
		);
		expect(response.statusCode).toBe(404);
		expect(response.body).toStrictEqual({ error: "User not found" });
	});
});

describe("GET /users/:id", () => {
	it('return { error: "Invalid User ID" }', async () => {
		let response = await request(app).get("/users/123");
		expect(response.statusCode).toBe(400);
		expect(response.body).toStrictEqual({ error: "Invalid User ID" });
	});
});

describe("PUT /users/:id", () => {
	it("update an user by id", async () => {
		let response = await request(app)
			.put(`/users/${user1ID}`)
			.send({ ...user1payload, email: newEmail });
		expect(response.statusCode).toBe(200);
		expect(response.body.email).toBe(newEmail);
	});
});

describe("DELETE /users/:id", () => {
	it("delete an user by id", async () => {
		let response = await request(app).get("/users");
		let usersCount = response.body.length;
		response = await request(app).delete(`/users/${user1ID}`);
		expect(response.statusCode).toBe(204);
		response = await request(app).get("/users");
		expect(response.body).toHaveLength(usersCount - 1);
	});
});

// closing the database
afterAll(async () => {
	await mongoose.connection.close();
});
