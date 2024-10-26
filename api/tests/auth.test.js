import request from "supertest";
import app from "../app.js";
import { config } from "dotenv";
import connectMongoDB from "../config/connect.db.js";
import mongoose from "mongoose";
import { user1payload, user2payload } from "./mockData.js";
import { objectToCookieString, cookieStringToObject } from "../lib/utils.js";

config();
const DB_URI = process.env.DB_URI || "mongodb://127.0.0.1:27017/TalentBridge";
let cookies;

beforeAll(async () => {
	// connecting to mongoDB
	await connectMongoDB(DB_URI, false);
	// droping the database
	await mongoose.connection.dropDatabase();
});

afterAll(async () => {
	// closing the database
	await mongoose.connection.close();
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
	it('return {error: "User with email already exists"}', async () => {
		const response = await request(app)
			.post("/auth/signup")
			.send(user1payload);
		expect(response.statusCode).toBe(400);
		expect(response.body).toStrictEqual({
			error: "User with email anas2020cr7@gmail.com already exists",
		});
	});
});

describe("POST /auth/login", () => {
	it("logging in to an user", async () => {
		const { email } = user1payload;
		const { password } = user1payload;
		const response = await request(app)
			.post("/auth/login")
			.send({ email, password });
		cookies = cookieStringToObject(response.headers["set-cookie"][0]);
		expect(response.statusCode).toBe(200);
		expect(response.body).toStrictEqual({ success: "Logged In!" });
		expect(cookies["Max-Age"]).toBe("2160");
		expect(cookies["Path"]).toBe("/");
	});
});

describe("GET /auth/me", () => {
	it("return login information", async () => {
		const response = await request(app)
			.get("/auth/me")
			.set("Cookie", [objectToCookieString(cookies)]);
		const payloadWithoutPassword = { ...user1payload };
		delete payloadWithoutPassword["password"];
		expect(response.statusCode).toBe(200);
		expect(response.body).toMatchObject(payloadWithoutPassword);
	});
});

describe("POST /auth/logout", () => {
	it("logging out from an user", async () => {
		const response = await request(app).post("/auth/logout");
		cookies = cookieStringToObject(response.headers["set-cookie"][0]);
		expect(response.statusCode).toBe(200);
		expect(response.body).toStrictEqual({ success: "Logged Out!" });
		expect(cookies["Max-Age"]).toBe("0");
		expect(cookies["Path"]).toBe("/");
		expect(cookies["jwt"]).toBe("");
	});
});
