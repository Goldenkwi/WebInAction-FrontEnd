"use client";

import { ToastContainer } from "react-toastify";
import { useTheme } from "@/components/providers/AppProviders";
import "react-toastify/dist/ReactToastify.css";

export default function Toaster() {
	const { theme } = useTheme();

	return (
		<ToastContainer
			position="top-right"
			autoClose={4000}
			newestOnTop
			closeOnClick
			pauseOnFocusLoss
			draggable
			pauseOnHover
			theme={theme}
			style={{ fontSize: "13px" }}
		/>
	);
}
