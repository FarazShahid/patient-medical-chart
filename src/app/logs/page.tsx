"use client";

import Image from "next/image";
import DataTable from "../componenet/logsTable";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Logs() {
  const [searchText, setSearchText] = useState<any>("");
  const [debouncedSearch, setDebouncedSearch] = useState<any>("");
  const [loading, setIsloading] = useState(false);
  const { logout } = useAuth();
  const [role, setRole] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedrole = localStorage.getItem("role");
      if (savedrole) {
        setRole(savedrole);
      }
    }
  }, []);
  const router = useRouter();
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchText.length >= 3) {
        setIsloading(true);
        setDebouncedSearch(searchText);
      } else {
        setDebouncedSearch("");
      }
    }, 1500); // wait 2000ms after user stops typing

    return () => {
      setIsloading(false);
      clearTimeout(handler);
    };
  }, [searchText]);
  const handleLogout = async () => {
    logout();
  };
  return (
    <div className="min-h-screen bg-[#f0f0f0] pl-6 pr-6 pt-3 font-sans text-sm text-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
          <div className="flex items-center gap-4 w-full sm:w-1/2 ml-3">
            <div className="flex">
              <Image
                src="/images/MedVault.svg"
                alt="PDF Viewer Logo"
                width={70}
                height={70}
                className="object-contain cursor-pointer"
                onClick={()=>{router.push('/')}}
              />
            </div>

            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              type="text"
              placeholder={`Search users`}
              className="flex-1 px-4 py-2 border bg-white focus:ring-2 focus:ring-blue-400 border-gray-300 rounded-xl shadow-sm focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-end h-[40px] gap-4">
          {(role == "admin" || role == "Admin" || role == "ADMIN") && (
            <Button
              className="bg-[#1d76a1] text-white cursor-pointer"
              onPress={() => {
                router.push("/");
              }}
            >
              Back
            </Button>
          )}
          <Button
            className="bg-[#1d76a1] text-white cursor-pointer"
            onPress={() => {
              handleLogout();
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 bg-blur bg-opacity-10 cursor-wait pointer-events-auto" />
      )}
      <DataTable
        searchText={debouncedSearch}
        loading={loading}
        setIsloading={setIsloading}
      />
    </div>
  );
}
