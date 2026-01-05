import { test, expect, vi, beforeEach, afterEach } from "vitest";
import { createSession } from "../auth";

vi.mock("server-only", () => ({}));

const mockCookieStore = {
  set: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}));

const mockSign = vi.fn(() => Promise.resolve("mock.jwt.token"));

vi.mock("jose", () => ({
  SignJWT: vi.fn().mockImplementation(() => ({
    setProtectedHeader: vi.fn().mockReturnThis(),
    setExpirationTime: vi.fn().mockReturnThis(),
    setIssuedAt: vi.fn().mockReturnThis(),
    sign: mockSign,
  })),
  jwtVerify: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

test("createSession sets cookie with correct token and options", async () => {
  const userId = "user-123";
  const email = "test@example.com";

  await createSession(userId, email);

  expect(mockCookieStore.set).toHaveBeenCalledTimes(1);

  const [cookieName, token, options] = mockCookieStore.set.mock.calls[0];

  expect(cookieName).toBe("auth-token");
  expect(token).toBe("mock.jwt.token");

  expect(options).toMatchObject({
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
});

test("createSession sets cookie with 7-day expiration", async () => {
  const userId = "user-123";
  const email = "test@example.com";

  await createSession(userId, email);

  const [, , options] = mockCookieStore.set.mock.calls[0];

  const expectedExpiry = new Date("2024-01-08T00:00:00Z");
  expect(options.expires).toEqual(expectedExpiry);
});

test("createSession sets secure flag in production", async () => {
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";

  await createSession("user-123", "test@example.com");

  const [, , options] = mockCookieStore.set.mock.calls[0];
  expect(options.secure).toBe(true);

  process.env.NODE_ENV = originalEnv;
});

test("createSession does not set secure flag in development", async () => {
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "development";

  await createSession("user-123", "test@example.com");

  const [, , options] = mockCookieStore.set.mock.calls[0];
  expect(options.secure).toBe(false);

  process.env.NODE_ENV = originalEnv;
});

test("createSession calls SignJWT with correct methods", async () => {
  const userId = "user-123";
  const email = "test@example.com";

  await createSession(userId, email);

  expect(mockSign).toHaveBeenCalledTimes(1);
});

test("createSession handles different user IDs", async () => {
  await createSession("user-456", "another@example.com");

  expect(mockCookieStore.set).toHaveBeenCalledTimes(1);

  const [cookieName] = mockCookieStore.set.mock.calls[0];
  expect(cookieName).toBe("auth-token");
});

test("createSession handles special characters in email", async () => {
  const specialEmail = "user+test@example.co.uk";

  await createSession("user-123", specialEmail);

  expect(mockCookieStore.set).toHaveBeenCalledTimes(1);

  const [, token] = mockCookieStore.set.mock.calls[0];
  expect(token).toBe("mock.jwt.token");
});
