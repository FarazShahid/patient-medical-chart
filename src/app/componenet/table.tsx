'use client'
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
import Image from "next/image";
type DataTableProps = {
  searchField: string;
  searchText: string;
  loading: boolean;
  setIsloading: any;
}
export default function DataTable({
  searchField,
  searchText,
  loading,
  setIsloading,
}: DataTableProps) {
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(1);
  const [data, setData] = useState<any>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [prevSearchText, setPrevSearchText] = useState("");
  const [prevSearchField, setPrevSearchField] = useState("");

  // Detect new search and reset page to 1
  useEffect(() => {
    const trimmedSearch = searchText?.trim();
    if (trimmedSearch !== prevSearchText || searchField !== prevSearchField||rowsPerPage) {
      setPrevSearchText(trimmedSearch||"");
      setPrevSearchField(searchField||"");
      setPage(1);
    }
  }, [searchText, searchField,rowsPerPage]);
  const getAllFiles = async (
    page: number,
    rowsPerPage: number,
    searchField: string,
    searchText: string
  ) => {
    setIsloading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 120000);
  
    try {
      // Base URL
      let url = `${process.env.NEXT_PUBLIC_URL}/api/files?page=${page}&limit=${rowsPerPage}`;
      // Add search only if searchText is present
      if (searchText.trim()) {
        url = `${
          process.env.NEXT_PUBLIC_URL
        }/api/search?${searchField}=${encodeURIComponent(
          searchText.trim()
        )}&page=${page}&limit=${rowsPerPage}`;
        setPage(1)
      }

      const response = await fetch(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }

      const data = await response.json();
      setPages(Math.ceil(data?.total / rowsPerPage));
      const updatedData = data?.results.map((file:any, index:number) => ({
        ...file,
        sr: (page - 1) * rowsPerPage + index + 1, // Calculate SR based on current page and rowsPerPage
      }));
  
      setData(updatedData); 
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
    getAllFiles(page, rowsPerPage, searchField||"", searchText||"");
  }, [page, searchText, rowsPerPage,searchField]);
  const handleChange = (e: any) => {
    setRowsPerPage(Number(e.target.value));
  };
  useEffect(() => {
    setPage(1); 
  }, [rowsPerPage]);
  return (
    <div className="flex flex-col h-[calc(100vh-145px)] gap-3 relative">
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
          <TableColumn className="" key="recordId">
            Patient ID
          </TableColumn>
          <TableColumn className="" key="name">
            NAME
          </TableColumn>
          <TableColumn className="" key="dob">
            DOB
          </TableColumn>
          <TableColumn className="" key="address">
            Address
          </TableColumn>
          <TableColumn className="" key="filename">
            Document
          </TableColumn>
        </TableHeader>
        <TableBody
          isLoading={loading}
          loadingContent={<Spinner></Spinner>}
          // isLoading={loading}
          items={data}
          emptyContent={"No data found"}
        >
          {(item: any) => (
            <TableRow
              key={item?._id}
              onClick={() => {
                if (item.path) {
                  window.open(
                    `${process.env.NEXT_PUBLIC_URL}/${item.path}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }
              }}
              className="cursor-pointer"
            >
              {(columnKey) => (
                <TableCell>
                  
                  {
                     columnKey === "recordId" && item?.recordId ? (
                    <span> {item?.recordId}</span>
                    )
                  :
                  columnKey === "filename" && item.path ? (
                    <a
                      href={`${process.env.NEXT_PUBLIC_URL}/${item.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      <Image src={'/images/pdf-logo.svg'} width={23} height={23} alt="pdf" className="ml-0.5 h-auto"/>
                    </a>
                  ) : (
                    getKeyValue(item, columnKey)
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex w-full justify-between py-2 px-1.5 mx-2 bg-white rounded-lg">
        <div className="flex w-[calc(100%-250px)] justify-center pl-[250px]">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
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
            className="px-2 py-2 rounded border border-gray-300 bg-white shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[90px]"
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
