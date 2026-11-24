import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { MongoMemoryServer } from "mongodb-memory-server";
import Admin from "../models/adminModel.js";

process.env.JWT_SECRET = "isolated-test-secret";
process.env.GOOGLE_DRIVE_CLIENT_ID = "isolated-test-client-id";
process.env.GOOGLE_DRIVE_CLIENT_SECRET = "isolated-test-client-secret";
process.env.GOOGLE_DRIVE_REDIRECT_URI = "http://127.0.0.1/isolated-test-callback";
const { default: authRoutes } = await import("../routers/authRoutes.js");

let mongo;
let httpServer;
let baseUrl;

before(async () => {
  mongo = await MongoMemoryServer.create({ instance: { dbName: "admin_password_feature_test" } });
  await mongoose.connect(mongo.getUri(), { dbName: "admin_password_feature_test" });
  const app = express();
  // Simulate Render's single trusted reverse proxy for req.ip rate-limit tests.
  app.set("trust proxy", 1);
  app.use(express.json());
  app.use("/api/auth", authRoutes);
  httpServer = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  baseUrl = `http://127.0.0.1:${httpServer.address().port}/api/auth`;
});

after(async () => {
  if (httpServer) await new Promise((resolve, reject) => httpServer.close((error) => error ? reject(error) : resolve()));
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

async function createAdmin(userName, password) {
  await Admin.create({ userName, password: await bcrypt.hash(password, 10) });
}

async function post(path, body, ip) {
  const response = await fetch(`${baseUrl}/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json(), retryAfter: response.headers.get("retry-after") };
}

function changeBody(userName, currentPassword, newPassword, confirmPassword = newPassword) {
  return { userName, currentPassword, newPassword, confirmPassword };
}

test("admin Change Password endpoint integration", async (t) => {
  await t.test("rejects incorrect current password and unknown username", async () => {
    await createAdmin("current-check", "old-password");
    assert.equal((await post("change-password", changeBody("current-check", "wrong-password", "new"), "198.51.100.1")).status, 401);
    assert.equal((await post("change-password", changeBody("missing-user", "wrong-password", "new"), "198.51.100.2")).status, 401);
    assert.equal(await (await Admin.findOne({ userName: "current-check" })).matchPassword("old-password"), true);
  });

  await t.test("rejects mismatched confirmation without changing the password", async () => {
    await createAdmin("confirm-check", "old-password");
    const result = await post("change-password", changeBody("confirm-check", "old-password", "new-one", "new-two"), "198.51.100.3");
    assert.equal(result.status, 400);
    assert.equal(await (await Admin.findOne({ userName: "confirm-check" })).matchPassword("old-password"), true);
  });

  await t.test("accepts exactly 72 UTF-8 bytes and rejects 73", async () => {
    await createAdmin("boundary-check", "old-password");
    const accepted = await post("change-password", changeBody("boundary-check", "old-password", "a".repeat(72)), "198.51.100.4");
    assert.equal(accepted.status, 200);
    assert.equal(await (await Admin.findOne({ userName: "boundary-check" })).matchPassword("a".repeat(72)), true);
    assert.equal((await post("change-password", changeBody("boundary-check", "a".repeat(72), "b".repeat(73)), "198.51.100.5")).status, 400);
  });

  await t.test("counts UTF-8 bytes rather than JavaScript characters", async () => {
    await createAdmin("utf8-check", "old-password");
    const seventyTwoBytes = "😀".repeat(18);
    const seventySixBytes = "😀".repeat(19);
    assert.equal((await post("change-password", changeBody("utf8-check", "old-password", seventyTwoBytes), "198.51.100.6")).status, 200);
    assert.equal((await post("change-password", changeBody("utf8-check", seventyTwoBytes, seventySixBytes), "198.51.100.7")).status, 400);
  });

  await t.test("rate limits the sixth request from one forwarded client IP", async () => {
    await createAdmin("rate-check", "correct-password");
    const ip = "198.51.100.8";
    const attempts = await Promise.all(Array.from({ length: 6 }, () => post("change-password", changeBody("rate-check", "wrong-password", "new"), ip)));
    assert.deepEqual(attempts.map((item) => item.status), [401, 401, 401, 401, 401, 429]);
    assert.ok(Number(attempts[5].retryAfter) > 0);
  });

  await t.test("allows only one concurrent update and authenticates with its new password", async () => {
    await createAdmin("concurrent-check", "old-password");
    const payload = changeBody("concurrent-check", "old-password", "new-password");
    const results = await Promise.all([
      post("change-password", payload, "198.51.100.9"),
      post("change-password", payload, "198.51.100.10"),
    ]);
    assert.deepEqual(results.map((item) => item.status).sort(), [200, 409]);

    const success = results.find((item) => item.status === 200);
    assert.equal(success.body.success, true);
    assert.equal("password" in success.body, false);
    const login = await post("login", { userName: "concurrent-check", password: "new-password" }, "198.51.100.11");
    assert.equal(login.status, 200);
    assert.equal(login.body.success, true);
    assert.equal("password" in login.body, false);
    assert.equal("password" in (login.body.user || {}), false);
  });
});
