"use client";

import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeClosedPassword, EyeOpenPassword } from "../../../public/svgs/svgs";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated, loading, error } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email: email, password: password });
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center text-indigo-500">
          Sign in to MedVault
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              maxLength={40}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div >
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative justify-center items-center">

            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              maxLength={25}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="mt-1 block w-full px-3 py-2  text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            <button
              type="button"
              className="absolute z-50 right-0 pr-1 top-[50%] transform -translate-y-1/2 text-gray-500 foucs-outline focus:outline-none focus-within:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              >
              {showPassword ? <EyeOpenPassword /> : <EyeClosedPassword />}
            </button>
              </div>
          </div>
          <div>
            <Button
              type="submit"
              disabled={loading}
              isLoading={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>

        {/* Forgot Password Button */}
        {/* <div className="flex flex-row justify-end">
          <button
            onClick={() => router.push("/forgotPassword")}
            type="button"
            className="text-xs cursor-pointer font-medium text-[#7C7C7C] border-b border-[#7C7C7C] hover:text-indigo-600 hover:border-indigo-600 transition-colors"
          >
            Forgot Password?
          </button>
        </div> */}
      </div>
    </div>
  );
}
