"use client";
import Image from "next/image";
import DataTable from "./componenet/table";
import { useEffect, useRef, useState } from "react";
import { Button } from "@nextui-org/react";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import { IoSettingsSharp } from "react-icons/io5";

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<any>("name");
  const [searchText, setSearchText] = useState<any>("");
  const [debouncedSearch, setDebouncedSearch] = useState<any>("");
  const [loading, setIsloading] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState("");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const savedrole = localStorage.getItem("role");
    if (savedrole) {
      setRole(savedrole);
    }
  }, []);
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
                onClick={() => {
                  router.push("/");
                }}
              />
            </div>

            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              type="text"
              placeholder={`Search by patient ${
                selectedOption === "dob"
                  ? "date of birth"
                  : selectedOption === "recordId"
                  ? "id"
                  : selectedOption
              }`}
              className="flex-1 px-4 py-2 border bg-white focus:ring-2 focus:ring-blue-400 border-gray-300 rounded-xl shadow-sm focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative inline-block min-w-[150px]">
              <select
                className="appearance-none w-full px-2 py-2 pr-8 rounded-xl border border-gray-300 bg-white shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value={"name"}>Patient Name</option>
                <option value={"dob"}>Date of Birth</option>
                <option value={"address"}>Patient Address</option>
                <option value={"filename"}>Filename</option>
                <option value={"recordId"}>Patient ID</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (Logout Button) */}
        <div className="flex items-end h-[40px] gap-4 relative">
          {(role == "admin" || role == "Admin" || role == "ADMIN") && (
            <>
              <IoSettingsSharp
                width={40}
                height={40}
                className="h-[40px] w-[30px] mr-3 cursor-pointer"
                // onClick={() => {
                //   router.push("/users");
                // }}
                onClick={() => setOpen((prev) => !prev)}
              />
              {open && (
                <div className="absolute right-[120px] top-[25px] mt-2 w-40 rounded-lg bg-white shadow-lg z-50">
                  <ul className="py-2 text-sm text-gray-700">
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setOpen(false);
                        router.push("/users");
                      }}
                    >
                      Users
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setOpen(false);
                        router.push("/logs");
                      }}
                    >
                      Logs
                    </li>
                  </ul>
                </div>
              )}
            </>
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

      <h1
        className="text-[30px] text-black font-semibold ml-3"
        style={{ fontFamily: "Proto, sans-serif" }}
      >
        Patient Medical Charts
      </h1>
      {loading && (
        <div className="fixed inset-0 z-50 bg-blur bg-opacity-10 cursor-wait pointer-events-auto" />
      )}
      <DataTable
        searchField={selectedOption}
        searchText={debouncedSearch}
        loading={loading}
        setIsloading={setIsloading}
      />
    </div>
  );
}
