"use client";

import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeClosedPassword, EyeOpenPassword } from "../../../public/svgs/svgs";
import Image from "next/image";

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
      <div className="w-full max-w-md px-8 py-4 space-y-3 bg-white rounded-lg shadow">
        <div className="flex justify-center">

        <Image
          src="/images/MedVault.svg"
          alt="PDF Viewer Logo"
          width={100}
          height={70}
          className="object-contain cursor-pointer"
          />
          </div>
        <h2 className="text-2xl font-bold text-center text-[#DA9C2D]">
          Sign in to MedVault
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* <div className="relative w-full mt-8">
  <input
    id="email"
    name="email"
    type="email"
    required
    value={email}
    maxLength={40}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="you@example.com"
    className="peer w-full rounded-2xl border border-gray-300  bg-white/70 px-5 pt-5 pb-2 text-base text-gray-900 placeholder-transparent shadow-[0_8px_30px_rgba(99,102,241,0.15)] backdrop-blur-xl transition-all duration-300 ease-in-out focus:border-indigo-500 focus:ring-4 focus:ring-indigo-400/40 focus:outline-none focus:shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
  />
  <label
    htmlFor="email"
    className="absolute left-5 top-2 text-[0.85rem] text-gray-500 transition-all duration-300 ease-in-out peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-[0.85rem] peer-focus:text-indigo-600"
  >
    Email Address
  </label>
</div> */}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-xl text-gray-700 pb-1"
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
              // className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-md backdrop-blur-sm transition-all duration-300 ease-in-out focus:border-indigo-500 focus:ring-4 focus:ring-indigo-300/40 focus:outline-none focus:shadow-[0_0_12px_rgba(99,102,241,0.4)] hover:shadow-lg"
              />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-xl pb-1 text-gray-700"
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
                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-md backdrop-blur-sm transition-all duration-300 ease-in-out focus:border-indigo-500 focus:ring-4 focus:ring-indigo-300/40 focus:outline-none focus:shadow-[0_0_12px_rgba(99,102,241,0.4)] hover:shadow-lg"
                />
              <button
                type="button"
                className=" absolute z-50 right-0 pr-1 top-[50%] transform -translate-y-1/2 text-gray-500 foucs-outline focus:outline-none focus-within:outline-none"
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
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-[#0C432E] hover:bg-[#DA9C2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
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
