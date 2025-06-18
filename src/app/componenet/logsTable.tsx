"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
  Spinner,
} from "@heroui/react";

import { useRouter } from "next/navigation";
type LogsTableProps = {
  searchText: string;
  loading: boolean;
  setIsloading: any;
};
export default function LogsTable({
  searchText,
  loading,
  setIsloading,
}: LogsTableProps) {
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(1);
  const [data, setData] = useState<any>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [prevSearchText, setPrevSearchText] = useState("");
  const [totalRecord, setTotalRecord] = useState(0);
  const router = useRouter();
  const [role, setRole] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedrole = localStorage.getItem("role");
      if (savedrole) {
        setRole(savedrole);
      }
    }
  }, []);
  // Detect new search and reset page to 1
  useEffect(() => {
    const trimmedSearch = searchText?.trim();
    if (trimmedSearch !== prevSearchText || rowsPerPage) {
      setPrevSearchText(trimmedSearch || "");
      setPage(1);
    }
  }, [searchText, rowsPerPage]);
  const getAllLogs = async (
    page: number,
    rowsPerPage: number,
    searchText: string
  ) => {
    setIsloading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 120000);

    try {
      // Base URL
      let url = `${process.env.NEXT_PUBLIC_URL}/api/logs?page=${page}&limit=${rowsPerPage}`;
      // Add search only if searchText is present
      if (searchText.trim()) {
        url = `${
          process.env.NEXT_PUBLIC_URL
        }/api/logs?search=${encodeURIComponent(
          searchText.trim()
        )}&page=${page}&limit=${rowsPerPage}`;
        setPage(1);
      }
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error("Failed to fetch files");
        }

        const data = await response.json();
        setTotalRecord(data?.total);
        setPages(Math.ceil(data?.total / rowsPerPage));
        const updatedData = data?.data?.map((file: any, index: number) => ({
          ...file,
          sr: (page - 1) * rowsPerPage + index + 1, // Calculate SR based on current page and rowsPerPage
        }));

        if (updatedData) {
          setData(updatedData);
        }
      } else {
        router.push("/login");
      }
      // setData(data?.results);
    } catch (error) {
      console.error("Error fetching files:", error);
      alert("An error occurred while fetching data. Please try again.");
    } finally {
      setIsloading(false);
      clearTimeout(timeoutId);
    }
  };

  useEffect(() => {
    getAllLogs(page, rowsPerPage, searchText || "");
  }, [page, searchText, rowsPerPage]);
  const handleChange = (e: any) => {
    setRowsPerPage(Number(e.target.value));
  };
  useEffect(() => {
    setPage(1);
  }, [rowsPerPage]);
 
 

  return (
    <div className="flex flex-col h-[calc(100vh-145px)] gap-3 relative">
      <div className="flex justify-between items-center">
        <h1
          className="text-[30px] text-black font-semibold ml-3"
          style={{ fontFamily: "Proto, sans-serif" }}
        >
          Logs
        </h1>
      </div>
      <Table
        isHeaderSticky={true}
        isStriped
        className={`mt-1 mx-2 h-[calc(100%-80px)]`}
        aria-label="Example table with client side pagination"
        classNames={{
          wrapper: "overflow-y-auto h-full pt-2 mt-2 custom-scrollbar",
          th: "text-sm text-white font-semibold bg-[#1d76a1]",
        }}
      >
        <TableHeader>
          <TableColumn className="" key="sr">
            Sr.
          </TableColumn>
          <TableColumn className="" key="userName">
            Name
          </TableColumn>
          <TableColumn className="" key="email">
            Email
          </TableColumn>
          <TableColumn className="" key="action">
          Activity
          </TableColumn>
        
        </TableHeader>
        <TableBody
          isLoading={loading}
          loadingContent={<Spinner></Spinner>}
          items={data}
          emptyContent={"No data found"}
        >
          {(item: any) => (
            <TableRow key={item?.sr} className="">
              {(columnKey) => (
                <TableCell>
                  { columnKey === "role" ? (
                    <span className="capitalize">{item?.role?.name ?? ""}</span>
                  ) : columnKey !== "Action" && (
                    getKeyValue(item, columnKey)
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex w-full justify-between py-2 px-1.5 mx-2 bg-white rounded-lg">
        <div className="flex justifyc-center items-center">
          <span className="text-sm text-gray-500 mr-1.5 font-medium">
            Total:
          </span>
          <div className="flex justifyc-center items-center mx-2 px-2 h-[36px] rounded-md text-white bg-[#1d76a1]">
            {totalRecord}
          </div>
        </div>
        <div className="flex w-[calc(100%-250px)] justify-center pl-[250px]">
          <div className="flex items-center gap-2">
            <Pagination
              isCompact={false}
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
              classNames={{
                item: "min-w-[50px] w-auto px-[2px] ",
                cursor: "min-w-[50px] w-auto h-full rounded-md bg-[#1d76a1]",
              }}
            />
          </div>
        </div>
        <div className="flex justify-end w-[250px] items-center">
          <label
            htmlFor="rows-per-page"
            className="text-sm text-gray-500 mr-1.5 font-medium"
          >
            Rows per page:
          </label>
          <select
            id="rows-per-page"
            className="px-2 py-2 h-[36px] rounded border border-gray-300 bg-white shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[90px]"
            value={rowsPerPage}
            onChange={handleChange}
          >
            <option value={"25"}>25</option>
            <option value={"50"}>50</option>
            <option value={"75"}>75</option>
            <option value={"100"}>100</option>
          </select>
        </div>
      </div>
  
    </div>
  );
}
