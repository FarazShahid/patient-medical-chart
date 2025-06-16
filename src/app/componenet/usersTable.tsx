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
  useDisclosure,
  Button,
} from "@heroui/react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ViewpdfModal from "./view-pdf";
import EditIcon from "../../../public/editIcon.svg";
import DeleteIcon from "../../../public/deleteIcon.svg";
import DeleteUserModal from "../componenet/model/deleteUserModal";
import UserEditModal from "./model/addEditUser";
type DataTableProps = {
  searchText: string;
  loading: boolean;
  setIsloading: any;
};
export default function DataTable({
  searchText,
  loading,
  setIsloading,
}: DataTableProps) {
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(1);
  const [data, setData] = useState<any>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [prevSearchText, setPrevSearchText] = useState("");
  const [totalRecord, setTotalRecord] = useState(0);
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [getUserTrigger, setUserTrigger] = useState<number>(0);
  const triggerGetUser = () => setUserTrigger((prev) => prev + 1);
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
  const getAllUsers = async (
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
      let url = `${process.env.NEXT_PUBLIC_URL}/api/users?page=${page}&limit=${rowsPerPage}`;
      // Add search only if searchText is present
      if (searchText.trim()) {
        url = `${
          process.env.NEXT_PUBLIC_URL
        }/api/users?search=${encodeURIComponent(
          searchText.trim()
        )}&page=${page}&limit=${rowsPerPage}`;
        setPage(1);
      }
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch(url, {
          headers: {
            "ngrok-skip-browser-warning": "true",
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
        const updatedData = data?.users?.map((file: any, index: number) => ({
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
    getAllUsers(page, rowsPerPage, searchText || "");
  }, [page, searchText, rowsPerPage, getUserTrigger]);
  const handleChange = (e: any) => {
    setRowsPerPage(Number(e.target.value));
  };
  useEffect(() => {
    setPage(1);
  }, [rowsPerPage]);
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onOpenChange: onAddOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();
  const closeModal = () => {
    onAddOpenChange();
    // setFilePath("");
  };
  const handleDeleteOpen = (item: any) => {
    setSelectedId(item._id);
    onDeleteOpen();
  };
  const handleUpdateModal = (isEdit: boolean, item?: any) => {
    if (item) {
      setSelectedId(item._id);
    }
    setIsEdit(isEdit);
    onAddOpen();
  };
  const handleToggleActive = async (item: any) => {
    try {
      setIsloading(true);
      const token = localStorage.getItem("token");
      const updatedStatus = !item.isActive;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/users/${item._id}/change-status`,
        {
          method: "PUT",
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: updatedStatus }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update status");
      }

      toast.success(result.message || "Status updated");
      triggerGetUser(); // reload table
    } catch (error: any) {
      toast.error(error.message || "Error toggling status");
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-145px)] gap-3 relative">
      <div className="flex justify-between items-center">
        <h1
          className="text-[30px] text-black font-semibold ml-3"
          style={{ fontFamily: "Proto, sans-serif" }}
        >
          Users
        </h1>
        {(role == "admin" || role == "Admin" || role == "ADMIN") && (
          <Button
            className="bg-[#1d76a1] text-white cursor-pointer"
            onPress={() => {
              handleUpdateModal(false);
            }}
          >
            Add new user
          </Button>
        )}
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
          <TableColumn className="" key="username">
            Name
          </TableColumn>
          <TableColumn className="" key="email">
            Email
          </TableColumn>
          <TableColumn className="" key="role">
            Role
          </TableColumn>
          <TableColumn className="" key="isActive">
            Status
          </TableColumn>
          {role == "admin" || role == "Admin" || role == "ADMIN" ? (
            <TableColumn key="Action" className=" text-right w-[80px] ">
              Actions
            </TableColumn>
          ) : (
            <></>
          )}
        </TableHeader>
        <TableBody
          isLoading={loading}
          loadingContent={<Spinner></Spinner>}
          items={data}
          emptyContent={"No data found"}
        >
          {(item: any) => (
            <TableRow key={item?._id} className="">
              {(columnKey) => (
                <TableCell>
                  {columnKey === "isActive" ? (
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={item.isActive}
                        onChange={() => handleToggleActive(item)}
                      />
                      <span
                        className={`w-10 h-5 block rounded-full relative transition-colors duration-300 ${
                          item.isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                            item.isActive ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </span>
                    </label>
                  ) : columnKey === "role" ? (
                    <span className="capitalize">{item?.role?.name ?? ""}</span>
                  ) : columnKey !== "Action" ? (
                    getKeyValue(item, columnKey)
                  ) : (
                    <div className="flex justify-center items-center gap-4 ">
                      {(role == "admin" ||
                        role == "Admin" ||
                        role == "ADMIN") && (
                        <>
                          <button
                            type="button"
                            className="cursor-pointer hover:text-green-800"
                          >
                            <Image
                              src={EditIcon}
                              alt="Image not found"
                              width={14}
                              height={14}
                              onClick={() => handleUpdateModal(true, item)}
                            />
                          </button>
                          <button
                            type="button"
                            className="cursor-pointer hover:text-red-500"
                            onClick={() => handleDeleteOpen(item)}
                          >
                            <Image
                              src={DeleteIcon}
                              alt="Image not found"
                              width={14}
                              height={14}
                            />
                          </button>
                        </>
                      )}
                    </div>
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
      {isDeleteOpen && (
        <DeleteUserModal
          isOpen={isDeleteOpen}
          onClose={onDeleteOpenChange}
          triggerAnnouncement={triggerGetUser}
          itemId={selectedId}
          setSelectedId={setSelectedId}
          setIsLoading={setIsloading}
        />
      )}
      {isAddOpen && (
        <UserEditModal
          isOpen={isAddOpen}
          onClose={onAddOpenChange}
          triggerAnnouncement={triggerGetUser}
          itemId={selectedId}
          setSelectedId={setSelectedId}
          setIsLoading={setIsloading}
          isEdit={isEdit}
        />
      )}
    </div>
  );
}
