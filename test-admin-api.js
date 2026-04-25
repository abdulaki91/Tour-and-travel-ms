// Simple test script to check admin API endpoints
import fetch from "node-fetch";

const API_BASE = "http://localhost:5002/api";

// Test login first to get a token
async function testLogin() {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@easthararghetours.com",
        password: "password123",
      }),
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (data.success) {
      return data.data.tokens.accessToken;
    }
    return null;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

// Test admin users endpoint
async function testAdminUsers(token) {
  try {
    const response = await fetch(`${API_BASE}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Admin users response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Admin users error:", error);
  }
}

// Test admin companies endpoint
async function testAdminCompanies(token) {
  try {
    const response = await fetch(`${API_BASE}/admin/companies`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Admin companies response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Admin companies error:", error);
  }
}

// Run tests
async function runTests() {
  console.log("Testing admin API endpoints...");

  const token = await testLogin();
  if (!token) {
    console.error("Failed to get auth token");
    return;
  }

  console.log("\n--- Testing Users Endpoint ---");
  await testAdminUsers(token);

  console.log("\n--- Testing Companies Endpoint ---");
  await testAdminCompanies(token);
}

runTests();
