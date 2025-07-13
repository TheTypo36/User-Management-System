// utils/toastUtil.ts
import { toast } from "react-toastify";
import type { ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  closeOnClick: true,
};

export const showSuccess = (message: string, options?: ToastOptions) =>
  toast.success(message, { ...baseOptions, ...options });

export const showError = (message: string, options?: ToastOptions) =>
  toast.error(message, { ...baseOptions, ...options });

export const showInfo = (message: string, options?: ToastOptions) =>
  toast.info(message, { ...baseOptions, ...options });

export const showWarning = (message: string, options?: ToastOptions) =>
  toast.warn(message, { ...baseOptions, ...options });
