"use client";

import { Modal, ModalContent, ModalHeader } from "@nextui-org/react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import {
  toolbarPlugin,
  ToolbarProps,
  ToolbarSlot,
  TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

interface ViewPdfModalProps {
  isOpen: boolean;
  filePath: string;
  closeAddModal: () => void;
}

const ViewPdfModal: React.FC<ViewPdfModalProps> = ({
  isOpen,
  filePath,
  closeAddModal,
}) => {
  //   const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const toolbarPluginInstance = toolbarPlugin();
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar: (Toolbar) => {
        const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
            ...slot,
            Download: () => <></>,
            EnterFullScreen: () => <></>,
            Open: () => <></>,
            Print: () => <></>,
            SwitchTheme: () => <></>,
        });
        return <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>;
    },
});

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={closeAddModal}
      size="5xl"
      hideCloseButton
    >
      <ModalContent className="max-w-[90vw] h-[90vh]">
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-between items-center">
              PDF Viewer
              <button
                onClick={onClose}
                className="text-2xl text-gray-600 hover:text-gray-800"
              >
                &times;
              </button>
            </ModalHeader>
            <div className="h-full overflow-hidden">
              <div style={{ height: "100vh" }}>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <div className="rpv-toolbar">
                    {/* <Toolbar>{renderDefaultToolbar(transform)}</Toolbar> */}
                  </div>
                  <Viewer
                    fileUrl={filePath}
                    plugins={[defaultLayoutPluginInstance]}
                  />
                </Worker>
              </div>
            </div>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewPdfModal;
