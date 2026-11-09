"use client";

import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useTheme } from "@/components/providers/AppProviders";
import ImageDropzone from "@/components/ui/ImageDropzone";
import { toast } from "react-toastify";
import {
	apiRequest,
	agencyFormData,
	AGENCY_PHOTO_MAX_SIZE_MB,
	type Agency,
	type AgencyPayload,
} from "@/lib/backend";

export interface AgencyFormValues {
	name: string;
	code: string;
	city: string;
	address: string;
	phone: string;
	email: string;
	photo: File | null;
}

const EMPTY_VALUES: AgencyFormValues = {
	name: "",
	code: "",
	city: "",
	address: "",
	phone: "",
	email: "",
	photo: null,
};

const errorClass = "mt-1 block text-[10px] font-medium text-rose-500";

export default function AgencyForm({
	agency,
	onSaved,
	onCancel,
}: {
	/** Instansi yang sedang diedit; null berarti mode tambah. */
	agency: Agency | null;
	onSaved: () => Promise<void> | void;
	onCancel: () => void;
}) {
	const { isLightTheme } = useTheme();
	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<AgencyFormValues>({
		defaultValues: agency
			? {
					name: agency.name,
					code: agency.code ?? "",
					city: agency.city ?? "",
					address: agency.address ?? "",
					phone: agency.phone ?? "",
					email: agency.email ?? "",
					photo: null,
				}
			: EMPTY_VALUES,
		mode: "onTouched",
	});

	const isEditing = agency !== null;

	const onSubmit: SubmitHandler<AgencyFormValues> = async (values) => {
		if (values.photo && values.photo.size > AGENCY_PHOTO_MAX_SIZE_MB * 1024 * 1024) {
			toast.error(`Ukuran foto instansi maksimal ${AGENCY_PHOTO_MAX_SIZE_MB} MB.`);
			return;
		}
		const payload: AgencyPayload = {
			name: values.name,
			code: values.code || null,
			city: values.city || null,
			address: values.address || null,
			phone: values.phone || null,
			email: values.email || null,
			photo: values.photo,
		};
		try {
			const response = isEditing
				? await apiRequest<Agency>(`agencies/${agency.id}`, {
						method: "PUT",
						body: agencyFormData(payload),
					})
				: await apiRequest<Agency>("agencies", {
						method: "POST",
						body: agencyFormData(payload),
					});
			toast.success(response.message || "Instansi berhasil disimpan.");
			reset(EMPTY_VALUES);
			await onSaved();
		} catch (cause) {
			toast.error(
				cause instanceof Error
					? cause.message
					: "Instansi gagal disimpan. Silakan coba lagi.",
			);
		}
	};

	const fieldClass = `w-full rounded-lg border px-3 py-2.5 text-xs outline-none transition focus:border-indigo-400 ${
		isLightTheme ? "border-slate-200 bg-white" : "border-white/10 bg-slate-950/40"
	}`;

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3" noValidate>
			<label className="block">
				<span className="mb-1.5 block text-[11px] font-medium">Nama instansi</span>
				<input
					required
					maxLength={100}
					{...register("name", {
						required: "Nama instansi wajib diisi.",
						minLength: { value: 3, message: "Nama instansi minimal 3 karakter." },
						maxLength: { value: 100, message: "Nama instansi maksimal 100 karakter." },
					})}
					className={fieldClass}
					placeholder="Contoh: Dinas Lingkungan Hidup"
				/>
				{errors.name && <span className={errorClass}>{errors.name.message}</span>}
			</label>

			<div className="grid gap-3 sm:grid-cols-2">
				<label className="block">
					<span className="mb-1.5 block text-[11px] font-medium">Kode instansi</span>
					<input
						maxLength={30}
						{...register("code", {
							pattern: {
								value: /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/,
								message: "Kode hanya boleh huruf, angka, dan tanda hubung.",
							},
						})}
						className={fieldClass}
						placeholder="Contoh: DLH-01"
					/>
					{errors.code && <span className={errorClass}>{errors.code.message}</span>}
				</label>
				<label className="block">
					<span className="mb-1.5 block text-[11px] font-medium">Kota / kabupaten</span>
					<input
						maxLength={60}
						{...register("city", {
							maxLength: { value: 60, message: "Kota maksimal 60 karakter." },
						})}
						className={fieldClass}
						placeholder="Contoh: Bandung"
					/>
					{errors.city && <span className={errorClass}>{errors.city.message}</span>}
				</label>
			</div>

			<label className="block">
				<span className="mb-1.5 block text-[11px] font-medium">Alamat</span>
				<input
					maxLength={255}
					{...register("address", {
						maxLength: { value: 255, message: "Alamat maksimal 255 karakter." },
					})}
					className={fieldClass}
					placeholder="Alamat lengkap kantor instansi"
				/>
				{errors.address && <span className={errorClass}>{errors.address.message}</span>}
			</label>

			<div className="grid gap-3 sm:grid-cols-2">
				<label className="block">
					<span className="mb-1.5 block text-[11px] font-medium">Telepon</span>
					<input
						maxLength={20}
						{...register("phone", {
							pattern: {
								value: /^[0-9()+\s-]+$/,
								message: "Telepon hanya boleh angka dan simbol telp.",
							},
						})}
						className={fieldClass}
						placeholder="Contoh: (022) 1234567"
					/>
					{errors.phone && <span className={errorClass}>{errors.phone.message}</span>}
				</label>
				<label className="block">
					<span className="mb-1.5 block text-[11px] font-medium">Email</span>
					<input
						maxLength={100}
						{...register("email", {
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: "Format email tidak valid.",
							},
						})}
						className={fieldClass}
						placeholder="Contoh: humas@instansi.go.id"
					/>
					{errors.email && <span className={errorClass}>{errors.email.message}</span>}
				</label>
			</div>

			<div>
				<span className="mb-1.5 block text-[11px] font-medium">
					Foto instansi (opsional)
				</span>
				<Controller
					control={control}
					name="photo"
					render={({ field }) => (
						<ImageDropzone
							value={field.value}
							onChange={field.onChange}
							existingImageUrl={agency?.photo_url ?? null}
							label="Foto instansi"
						/>
					)}
				/>
			</div>

			<div className="flex gap-2 pt-1">
				<button
					type="submit"
					disabled={isSubmitting || (isEditing && !isDirty)}
					className="flex-1 rounded-lg bg-indigo-500 px-3 py-2.5 text-xs font-semibold text-white hover:bg-indigo-600 disabled:opacity-50"
				>
					{isSubmitting
						? "Menyimpan..."
						: isEditing
							? "Simpan perubahan"
							: "Tambah instansi"}
				</button>
				<button
					type="button"
					onClick={onCancel}
					className={`rounded-lg border px-3 py-2.5 text-xs ${
						isLightTheme ? "border-slate-200" : "border-white/10"
					}`}
				>
					Batal
				</button>
			</div>
		</form>
	);
}
