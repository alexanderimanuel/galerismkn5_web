"use client";

import { useState } from "react";

export default function Test() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("siswa");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: password,
          role,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setToken(data.access_token);
        setUser(data.user);
        setMessage("Registration successful!");
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      setMessage("Error: " + (error as Error).message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setToken(data.access_token);
        setUser(data.user);
        setMessage("Login successful!");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("Error: " + (error as Error).message);
    }
  };

  const handleGetProfile = async () => {
    if (!token) {
      setMessage("Please login first");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage("Profile fetched successfully!");
        console.log("Profile data:", data);
      } else {
        setMessage(data.message || "Failed to fetch profile");
      }
    } catch (error) {
      setMessage("Error: " + (error as Error).message);
    }
  };

  const handleLogout = async () => {
    if (!token) {
      setMessage("No active session");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (response.ok) {
        setToken("");
        setUser(null);
        setMessage("Logged out successfully!");
      } else {
        setMessage("Logout failed");
      }
    } catch (error) {
      setMessage("Error: " + (error as Error).message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex w-full max-w-md flex-col p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Laravel Auth Test</h1>

        <div className="flex mb-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md ${
              isLogin ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md ${
              !isLogin ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-black"
              required
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-black"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-black"
            required
          />

          {!isLogin && (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-black"
            >
              <option value="siswa">Siswa</option>
              <option value="guru">Guru</option>
            </select>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {token && (
          <div className="mt-6 space-y-3">
            <button
              onClick={handleGetProfile}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Get Profile
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded-md text-sm ${
            message.includes("successful") || message.includes("fetched")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {user && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="font-medium text-black">User Info:</h3>
            <p className="text-sm text-gray-600">Name: {(user as any).name}</p>
            <p className="text-sm text-gray-600">Email: {(user as any).email}</p>
            <p className="text-sm text-gray-600">Role: {(user as any).role}</p>
          </div>
        )}

        {token && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-600 break-all">Token: {token.substring(0, 50)}...</p>
          </div>
        )}
      </main>
    </div>
  );
}
