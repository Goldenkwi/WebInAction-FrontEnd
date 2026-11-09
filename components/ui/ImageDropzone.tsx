"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import Image from "next/image";
import { useTheme } from "@/components/providers/AppProviders";
import { toast } from "react-toastify";
import {
	AGENCY_PHOTO_ACCEPTED_TYPES,
	AGENCY_PHOTO_MAX_SIZE_MB,
} from "@/lib/backend";

const REJECTION_MESSAGES: Record<string, (maxMb: number) => string> = {
	"file-too-large": (maxMb) => `Ukuran foto melebihi batas ${maxMb} MB.`,
	"file-invalid-type": () => "Format foto harus JPG, PNG, atau WEBP.",
	"too-many-files": () => "Hanya satu foto yang diizinkan.",
	default: () => "Foto tidak dapat digunakan.",
};

export default function ImageDropzone({
	value,
	onChange,
	existingImageUrl,
	maxSizeMb = AGENCY_PHOTO_MAX_SIZE_MB,
	label = "Foto",
	resetLabel,
	onReset,
	className = "",
}: {
	value: File | null;
	onChange: (file: File | null) => void;
	existingImageUrl?: string | null;
	maxSizeMb?: number;
	label?: string;
	resetLabel?: string;
	onReset?: () => void;
	className?: string;
}) {
	const { isLightTheme } = useTheme();
	const [previewUrl, setPreviewUrl] = useState("");

	const onDrop = useCallback(
		(accepted: File[], rejections: FileRejection[]) => {
			if (rejections.length > 0) {
				const rejection = rejections[0];
				const buildMessage =
					REJECTION_MESSAGES[rejection.errors[0]?.code ?? ""] ??
					REJECTION_MESSAGES.default;
				toast.error(buildMessage(maxSizeMb));
				onChange(null);
				return;
			}
			const file = accepted[0] ?? null;
			onChange(file);
			if (file) toast.info(`${label} siap diunggah.`);
		},
		[onChange, maxSizeMb, label],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		multiple: false,
		maxSize: maxSizeMb * 1024 * 1024,
		accept: {
			"image/jpeg": [".jpg", ".jpeg"],
			"image/png": [".png"],
			"image/webp": [".webp"],
		},
		onDrop,
	});

	useEffect(() => {
		if (!value) {
			setPreviewUrl("");
			return;
		}
		const url = URL.createObjectURL(value);
		setPreviewUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [value]);

	const hasNewPhoto = previewUrl !== "";
	const hasStoredPhoto = !hasNewPhoto && Boolean(existingImageUrl);

	const fileValidation = value
		? `${label} · ${value.type.replace("image/", "").toUpperCase()} · ${(
				value.size / (1024 * 1024)
			).toFixed(2)} MB`
		: "";

	return (
		<div className={className}>
			<div
				{...getRootProps()}
				className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed px-3 py-6 text-center transition ${
					isDragActive ? "border-indigo-400 bg-indigo-500/10" : ""
				} ${
					isLightTheme
						? "border-slate-300 bg-slate-50"
						: "border-white/10 bg-slate-950/40"
				}`}
			>
				<input {...getInputProps()} />
				<svg
					className="h-6 w-6 text-indigo-500"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 16V4m0 0 4 4m-4-4-4 4M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"
					/>
				</svg>
				<p className="text-[11px] font-medium">
					{isDragActive
						? "Letakkan foto di sini..."
						: "Klik atau tarik foto ke area ini"}
				</p>
				<p className="text-[10px] text-slate-500">
					JPG, PNG, atau WEBP · maksimal {maxSizeMb} MB
				</p>
			</div>

			{hasNewPhoto && (
				<div className="mt-2 rounded-lg border border-white/10 p-2">
					{/* Pratinjau lokal (object URL), bukan foto dari server. */}
					<Image
						src={previewUrl}
						width={720}
						height={480}
						unoptimized
						alt={`Pratinjau ${label.toLowerCase()}`}
						className="max-h-48 rounded-md object-contain"
					/>
					<div className="mt-1 flex items-center justify-between gap-2">
						<p className="text-[10px] text-slate-500">{fileValidation}</p>
						<button
							type="button"
							onClick={() => onChange(null)}
							className="shrink-0 text-[10px] font-semibold text-rose-500 hover:underline"
						>
							Batalkan foto ini
						</button>
					</div>
				</div>
			)}

			{hasStoredPhoto && (
				<div className="mt-2">
					<p className="mb-1 text-[10px] text-slate-500">
						Foto saat ini (akan dipertahankan bila tidak diganti):
					</p>
					<div className="flex items-center gap-3">
						<Image
							src={existingImageUrl as string}
							width={120}
							height={96}
							unoptimized
							alt={`${label.toLowerCase()} saat ini`}
							className="h-16 w-20 rounded-md border border-white/10 object-cover"
						/>
						{onReset && (
							<button
								type="button"
								onClick={onReset}
								className="rounded-md border border-rose-500/20 px-2.5 py-1.5 text-[10px] font-semibold text-rose-500 hover:bg-rose-500/10"
							>
								{resetLabel ?? `Hapus ${label.toLowerCase()}`}
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
