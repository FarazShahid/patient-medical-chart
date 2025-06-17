import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import toast from "react-hot-toast";

const DeleteModal = ({
  isOpen,
  onClose,
  triggerAnnouncement,
  setSelectedId,
  itemId,
  setIsLoading,
}: any) => {
  const handleDelete = async (itemId: any) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/users/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      let res = await response.json();
      if (!response.ok) {
        toast.error(res?.message || "Failed to delete user");
      } else {
        toast.success(res.message || "Action successful");
        setSelectedId(null);
        setIsLoading(false);
        triggerAnnouncement();
      }
    } catch (error: any) {
      console.log(error, "error");
      toast.error(error?.messsage || "Action Failed");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            <ModalBody>
              <p className="text-black">
                Are you sure you want to delete this?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  if (itemId !== null) {
                    handleDelete(itemId);
                    onClose();
                  }
                }}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
