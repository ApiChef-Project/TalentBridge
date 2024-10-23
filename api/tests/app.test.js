import request from "supertest";
import app from "../app";

describe("GET /", () => {
	it("responds with 200 status code", async () => {
		const response = await request(app).get("/");
		expect(response.statusCode).toBe(200);
	});
});

describe("POST /auth/signup", () => {
	it("create a new user", async () => {});
});

describe("POST /auth/signup", () => {
	it('return { error: "All fields are required" }', async () => {});
});

describe("POST /auth/signup", () => {
	it("return User with email already exists", async () => {});
});

describe("GET /users", () => {
	it("return all users", async () => {});
});

describe("GET /users/:id", () => {
	it("return an user by id", async () => {});
});

describe("PUT /users/:id", () => {
	it("update an user by id", async () => {});
});

describe("DELETE /users/:id", () => {
	it("delete an user by id", async () => {});
});
