"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      Cookies.set("userId", data.userId); // Save userId in cookie after login
      toast.success("Login successful!");
      router.push("/movie"); // Redirect to movie page after successful login
    } else {
      setError("Invalid credentials");
      toast.error("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold p-3 rounded transition duration-200"
        >
          Login
        </button>
        <p className="text-center mt-4 text-gray-400">
          Don not have an account?{" "}
          <a href="/register" className="text-blue-400 underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
