import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, getAPIKey, getBearerToken, hashPassword, makeJWT, validateJWT } from "./auth.js";
import express from "express";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe("JWT Generation and Validation", () => {
  const userID = "user123";
  const secret = "supersecretkey";
  const expiresIn = 60; // 1 minute
  let token: string;

  beforeAll(() => {
    token = makeJWT(userID, expiresIn, secret);
  });

  it("should generate a valid JWT", () => {
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
  });

  it("should validate the JWT and return the correct userID", () => {
    const validatedUserID = validateJWT(token, secret);
    expect(validatedUserID).toBe(userID);
  });

  it("should return null for an invalid JWT", () => {
    const invalidToken = token + "invalid";
    const validatedUserID = validateJWT(invalidToken, secret);
    expect(validatedUserID).toBeNull();
  });
});

describe("Get JWT From Request", () => {
  it("should return the token from the Authorization header", () => {
    const req = {
      headers: {
        authorization: "Bearer mytoken123",
      },
    } as express.Request;

    const token = getBearerToken(req);
    expect(token).toBe("mytoken123");
  });

  it("should return null if the Authorization header is missing", () => {
    const req = {
      headers: {},
    } as express.Request; 
    
    const token = getBearerToken(req);
    expect(token).toBeNull();
  });

  it("should return null if the Authorization header is malformed", () => {
    const req = {
      headers: {
        authorization: "InvalidHeader mytoken123",
      },
    } as express.Request;

    const token = getBearerToken(req);
    expect(token).toBeNull();
  });
});

describe("Get API Key From Request", () => {
  it("should return the API key from the Authorization header", () => {
    const req = {
      headers: {
        authorization: "ApiKey myapikey123",
      },
    } as express.Request;

    const apiKey = getAPIKey(req);
    expect(apiKey).toBe("myapikey123");
  });

  it("should return null if the Authorization header is missing", () => {
    const req = {
      headers: {},
    } as express.Request;

    const apiKey = getAPIKey(req);
    expect(apiKey).toBeNull();
  });
});