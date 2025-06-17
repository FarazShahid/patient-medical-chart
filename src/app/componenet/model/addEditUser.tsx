import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import {
  EyeClosedPassword,
  EyeOpenPassword,
} from "../../../../public/svgs/svgs";

const UserEditModal = ({
  isOpen,
  onClose,
  triggerAnnouncement,
  setSelectedId,
  itemId,
  setIsLoading,
  isEdit,
}: any) => {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [role, setRole] = useState("2");
  // Fetch user when editing
  useEffect(() => {
    const fetchUser = async () => {
      if (!itemId || !isEdit) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/users/${itemId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        // console.log("data", data);
        // setUser(data.user);
        setUsername(data?.username);
        setEmail(data?.email);
        setRole(data?.role?.name);
        setOldPassword(data?.password)
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    if (isOpen) {
      setUsername("");
      setEmail("");
      setNewPassword("");
      setOldPassword('')
      fetchUser();
    }
  }, [isOpen, itemId, isEdit]);

  const handleSave = async () => {
    if (!username || !email || !newPassword) {
      toast.error("All fields are required.");
      return;
    }
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/auth/registerUser`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password: newPassword,
            role: role,
          }),
        }
      );

      const res = await response.json();
      if (!response.ok) {
       toast.error(res.error || "Failed to add user");
      }
      else{

          toast.success("User created successfully");
          setSelectedId(null);
          triggerAnnouncement();
          onClose();
        }
    } catch (error: any) {
      console.error(error);
      toast.error(error.error || "User creation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      toast.error("Password cannot be empty");
      return;
    }
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/users/${itemId}/password`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            newPassword,
          }),
        }
      );

      const res = await response.json();
      if (!response.ok) {
        toast.error(res?.message || "Failed to update password");
      } else {
        toast.success("Password updated successfully");
        setSelectedId(null);
        triggerAnnouncement();
        onClose();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.error || "Password update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      isDismissable={false}
      size="lg"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <span className="text-black">{isEdit ? "Edit" : "Add"} User</span>
            </ModalHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                isEdit ? handleUpdatePassword() : handleSave();
              }}
            >
              <ModalBody>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    disabled={isEdit}
                    maxLength={40}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

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
                    disabled={isEdit}
                    maxLength={40}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={role}
                    disabled={isEdit} // prevent editing role in edit mode if desired
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="2" defaultChecked>
                      User
                    </option>
                    <option value="1">Admin</option>
                  </select>
                </div>
                {isEdit&&
                <div>
                  <label
                    htmlFor="oldPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {isEdit ? "Old Password" : "Password"}
                  </label>
                  <div className="relative">
                    <input
                      id="oldPassword"
                      name="oldPassword"
                      type={showOldPassword ? "text" : "password"}
                      readOnly
                      value={oldPassword}
                      maxLength={25}
                      minLength={5}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="old password"
                      className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      className="absolute z-50 right-0 pr-1 top-[50%] transform -translate-y-1/2 text-gray-500 focus:outline-none"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showPassword ? (
                        <EyeOpenPassword />
                      ) : (
                        <EyeClosedPassword />
                      )}
                    </button>
                  </div>
                </div>}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {isEdit ? "New Password" : "Password"}
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      maxLength={25}
                      minLength={5}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="password"
                      className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      className="absolute z-50 right-0 pr-1 top-[50%] transform -translate-y-1/2 text-gray-500 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOpenPassword />
                      ) : (
                        <EyeClosedPassword />
                      )}
                    </button>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isDisabled={
                    isEdit ? !newPassword : !(username && email && newPassword)
                  }
                >
                  {isEdit ? "Update" : "Save"}
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UserEditModal;
