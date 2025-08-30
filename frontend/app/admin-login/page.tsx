"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

export default function AdminLoginPage() {
  const { login } = useUser();
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Simple hardcoded admin check for demo
      if (name === "admin" && password === "admin123") {
        login({ name: "Admin", email: "admin@swadeshi.com" });
        router.push("/admin");
      } else {
        setError("Invalid admin credentials. Use admin/admin123");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Admin Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border p-2 rounded"
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border p-2 rounded"
            required
            disabled={isLoading}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button 
            type="submit" 
            className="bg-primary text-white py-2 rounded font-semibold disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Demo credentials: admin / admin123
          </p>
        </form>
      </div>
      <Footer />
    </div>
  );
}
