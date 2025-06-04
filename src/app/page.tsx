"use client";
import Image from "next/image";
import DataTable from "./componenet/table";
import { useEffect, useState } from "react";
export default function Home() {
  const [selectedOption, setSelectedOption] = useState<any>("name");
  const [searchText, setSearchText] = useState<any>("");
  const [debouncedSearch, setDebouncedSearch] = useState<any>("");
  const [loading, setIsloading] = useState(false);
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
  return (
    <div className="min-h-screen bg-[#f0f0f0] pl-6 pr-6 pt-3 font-sans text-sm text-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4 w-full sm:w-1/2 ml-3">
          <div className="flex">
            <Image
              src="/images/logoLight.png"
              alt="PDF Viewer Logo"
              width={70}
              height={70}
              className="object-contain"
            />
          </div>

          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            placeholder={`Search by patient ${
              selectedOption === "dob" ? "date of birth" : selectedOption
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
