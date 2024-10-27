import request from "supertest";
import app from "../app.js";
import { config } from "dotenv";
import connectMongoDB from "../config/connect.db.js";
import mongoose from "mongoose";
import { user1payload, company1payload, company2payload } from "./mockData.js";
import { objectToCookieString, cookieStringToObject } from "../lib/utils.js";

config();
const DB_URI = process.env.DB_URI || "mongodb://127.0.0.1:27017/TalentBridge";
let cookies;
let companyID;

beforeAll(async () => {
	// connecting to mongoDB
	await connectMongoDB(DB_URI, false);
	// droping the database
	await mongoose.connection.dropDatabase();
	// creating new user
	let response = await request(app).post("/auth/signup").send(user1payload);
	// logging in to the user
	const { email } = user1payload;
	const { password } = user1payload;
	response = await request(app).post("/auth/login").send({ email, password });
	cookies = cookieStringToObject(response.headers["set-cookie"][0]);
});

afterAll(async () => {
	// closing the database
	await mongoose.connection.close();
});

describe("GET /", () => {
	it("responds with 200 status code", async () => {
		let response = await request(app).get("/");
		expect(response.statusCode).toBe(200);
	});
});

describe("POST /companies", () => {
	it(`creating a new company with no token`, async () => {
		let response = await request(app)
			.post("/companies")
			.send(company1payload);
		expect(response.statusCode).toBe(401);
		expect(response.body).toStrictEqual({
			error: "Unauthorized: No Token Provided",
		});
	});
});

describe("POST /companies", () => {
	it(`creating a new company with invalid token`, async () => {
		let wrongCookies = {
			...cookies,
			jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NzFlNWM2OTc3YzJlNDQ0NDEwNTdhYTMiLCJpYXQiOjE3MzAwNDI5ODUsImV4cCI6MTczMTMzODk4NX0.yN6Qn7xvWMLGZf3LdejdykKJMZU2seVrKgXgCR_485A",
		};
		let response = await request(app)
			.post("/companies")
			.send(company1payload)
			.set("Cookie", [objectToCookieString(wrongCookies)]);
		expect(response.statusCode).toBe(401);
		expect(response.body).toStrictEqual({
			error: "Unauthorized: Invalid Token",
		});
	});
});

describe("POST /companies", () => {
	it("creating a new company with token and invalid fields", async () => {
		let response = await request(app)
			.post("/companies")
			.set("Cookie", [objectToCookieString(cookies)]);
		expect(response.statusCode).toBe(400);
		expect(response.body).toStrictEqual({
			error: "All fields are required",
		});
	});
});

describe("POST /companies", () => {
	it("creating a new company with token and valid data", async () => {
		let response = await request(app)
			.post("/companies")
			.send(company1payload)
			.set("Cookie", [objectToCookieString(cookies)]);
		let payloadWithoutPassword = { ...company1payload };
		delete payloadWithoutPassword["password"];
		expect(response.statusCode).toBe(201);
		expect(response.body).toMatchObject(payloadWithoutPassword);
		companyID = response.body._id;
	});
});

describe("POST /companies", () => {
	it("creating a new company with an email that already exists", async () => {
		let response = await request(app)
			.post("/companies")
			.send(company1payload)
			.set("Cookie", [objectToCookieString(cookies)]);
		expect(response.statusCode).toBe(400);
		expect(response.body).toStrictEqual({
			error: `Company with email ${company1payload.email} already exists`,
		});
	});
});

describe("GET /companies", () => {
	it("return all companies", async () => {
		let response = await request(app).get("/companies");
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveLength(1);
		let companiesCount = response.body.length;
		// adding another company
		await request(app)
			.post("/companies")
			.send(company2payload)
			.set("Cookie", [objectToCookieString(cookies)]);
		response = await request(app).get("/companies");
		expect(response.body).toHaveLength(companiesCount + 1);
	});
});

describe("GET /companies/:id", () => {
	it("return a company by id", async () => {
		let response = await request(app).get(`/companies/${companyID}`);
		let payloadWithoutPassword = { ...company1payload };
		delete payloadWithoutPassword["password"];
		expect(response.statusCode).toBe(200);
		expect(response.body).toMatchObject(payloadWithoutPassword);
	});
});

describe("GET /companies/:id", () => {
	it("return a company by id", async () => {
		let wrongID = "671e6e4556d514605bb5501a";
		let response = await request(app).get(`/companies/${wrongID}`);
		expect(response.statusCode).toBe(404);
		expect(response.body).toStrictEqual({ error: "Company not found" });
	});
});

describe("PUT /companies/:id", () => {
	it("update a company by id", async () => {
		const newEmail = "new-email@gmail.com";
		let response = await request(app)
			.put(`/companies/${companyID}`)
			.send({ ...company1payload, email: newEmail })
			.set("Cookie", [objectToCookieString(cookies)]);
		expect(response.statusCode).toBe(200);
		expect(response.body.email).toBe(newEmail);
	});
});

describe("DELETE /companies/:id", () => {
	it("delete a company by id and wrong token", async () => {
		let wrongCookies = {
			...cookies,
			jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NzFlNWM2OTc3YzJlNDQ0NDEwNTdhYTMiLCJpYXQiOjE3MzAwNDI5ODUsImV4cCI6MTczMTMzODk4NX0.yN6Qn7xvWMLGZf3LdejdykKJMZU2seVrKgXgCR_485A",
		};
		let response = await request(app).get("/companies");
		let companiesCount = response.body.length;
		response = await request(app)
			.delete(`/companies/${companyID}`)
			.send({ password: company1payload.password })
			.set("Cookie", [objectToCookieString(wrongCookies)]);
		expect(response.statusCode).toBe(401);
		expect(response.body).toStrictEqual({
			error: "Unauthorized: Invalid Token",
		});
		response = await request(app).get("/companies");
		expect(response.body).toHaveLength(companiesCount);
	});
});

describe("DELETE /companies/:id", () => {
	it("delete a company by id and wrong password", async () => {
		let response = await request(app).get("/companies");
		let companiesCount = response.body.length;
		response = await request(app)
			.delete(`/companies/${companyID}`)
			.send({ password: "wrongPassword" })
			.set("Cookie", [objectToCookieString(cookies)]);
		expect(response.statusCode).toBe(403);
		expect(response.body).toStrictEqual({ error: "Invalid Password!" });
		response = await request(app).get("/companies");
		expect(response.body).toHaveLength(companiesCount);
	});
});

describe("DELETE /companies/:id", () => {
	it("delete a company by id", async () => {
		let response = await request(app).get("/companies");
		let companiesCount = response.body.length;
		response = await request(app)
			.delete(`/companies/${companyID}`)
			.send({ password: company1payload.password })
			.set("Cookie", [objectToCookieString(cookies)]);
		expect(response.statusCode).toBe(204);
		response = await request(app).get("/companies");
		expect(response.body).toHaveLength(companiesCount - 1);
	});
});
