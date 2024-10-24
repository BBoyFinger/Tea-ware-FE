import { Dialog, DialogBackdrop, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { FaTimes } from "react-icons/fa";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  submitText?: string;
  cancelText?: string;
  className?: string;
}

export const Modal = ({
  isOpen,
  closeModal,
  title,
  children,
  onSubmit,
  className,
  submitText = "Submit",
  cancelText = "Cancel",
}: ModalProps) => {
  return (
    <>
      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className={`${
                  className === undefined
                    ? `inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl`
                    : `${className}`
                } `}
              >
                <div className="flex justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>

                  <button
                    onClick={closeModal}
                    className="text-gray-500 font-normal hover:text-gray-700 transition-colors"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault(); // Ngăn chặn reload trang
                    onSubmit(); // Gọi hàm xử lý submit
                  }}
                  className="mt-4"
                >
                  {children}

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={closeModal}
                    >
                      {cancelText}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {submitText}
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
