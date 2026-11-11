"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import RequireUser from "@/components/RequireUser";
import PortalLayout from "@/components/PortalLayout";
import { useAuth, useTheme } from "@/components/providers/AppProviders";
import Alert from "@/components/ui/Alert";
import ImageDropzone from "@/components/ui/ImageDropzone";
import PageHeading from "@/components/ui/PageHeading";
import Panel from "@/components/ui/Panel";
import { apiRequest, type Category, type ReportCreationResult } from "@/lib/backend";

export default function NewReportPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [reportType, setReportType] = useState<"pengaduan" | "aspirasi">("pengaduan");
	const [title, setTitle] = useState("");
	const [categoryId, setCategoryId] = useState("");
	const [incidentDate, setIncidentDate] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [isAnonymous, setIsAnonymous] = useState(false);
	const [isPrivate, setIsPrivate] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [guestSuccess, setGuestSuccess] = useState<ReportCreationResult | null>(null);
	const router = useRouter();
	const { isLightTheme } = useTheme();
	const { user } = useAuth();
	const isGuest = !user;

	useEffect(() => {
		let isMounted = true;
		apiRequest<Category[]>("categories")
			.then((response) => {
				if (isMounted) setCategories(response.data);
			})
			.catch((cause: unknown) => {
				if (isMounted)
					setError(
						cause instanceof Error
							? cause.message
							: "Kategori laporan gagal dimuat.",
					);
			});
		return () => {
			isMounted = false;
		};
	}, []);

	function handleImageChange(file: File | null) {
		setImage(file);
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		if (title.trim().length < 10) {
			setError("Judul laporan minimal 10 karakter.");
			return;
		}
		if (description.trim().length < 20) {
			setError("Deskripsi laporan minimal 20 karakter.");
			return;
		}
		if (location.trim().length < 5) {
			setError("Lokasi kejadian minimal 5 karakter.");
			return;
		}
		if (reportType === "pengaduan" && !incidentDate) {
			setError("Tanggal kejadian wajib diisi untuk pengaduan.");
			return;
		}
		if (image && image.size > 2 * 1024 * 1024) {
			setError("Ukuran foto maksimal 2 MB.");
			return;
		}
		if (
			image &&
			!["image/jpeg", "image/png", "image/webp"].includes(image.type)
		) {
			setError("Foto harus berformat JPG, PNG, atau WEBP.");
			return;
		}

		const body = new FormData();
		body.set("title", title.trim());
		body.set("report_type", reportType);
		body.set("description", description.trim());
		body.set("location_text", location.trim());
		// Laravel rule "boolean" menerima 1/0 (bukan string "true"/"false").
		body.set("is_anonymous", isAnonymous ? "1" : "0");
		body.set("is_private", isPrivate ? "1" : "0");
		if (categoryId) body.set("category_id", categoryId);
		if (incidentDate) body.set("incident_date", incidentDate);
		if (image) body.set("image", image);

		setIsSubmitting(true);
		try {
			const response = await apiRequest<ReportCreationResult>("reports", {
				method: "POST",
				body,
			});
			if (isGuest) {
				// Tamu tidak dapat mengakses halaman detail/history, cukup nomor tiketnya.
				setGuestSuccess(response.data);
			} else {
				router.push(`/reports/${response.data.id}`);
			}
		} catch (cause) {
			setError(
				cause instanceof Error
					? cause.message
					: "Laporan gagal dikirim. Silakan coba lagi.",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	const fieldClass = `w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 ${
		isLightTheme
			? "border-slate-200 bg-white"
			: "border-white/10 bg-slate-950/40"
	}`;
	const labelClass = "mb-1.5 block text-xs font-medium";

	return (
		<RequireUser roles={["citizen"]} allowGuest>
			<PortalLayout title="Buat laporan">
				{guestSuccess ? (
					<Panel className="mx-auto max-w-xl text-center">
						<span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-2xl">
							✅
						</span>
						<h2 className="mt-4 text-base font-semibold">
							Laporan berhasil dikirim
						</h2>
						<p className="mt-2 text-xs leading-relaxed text-slate-500">
							Simpan nomor tiket berikut untuk referensi Anda.
						</p>
						<p className="mt-3 inline-block rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-bold tracking-wide text-indigo-500">
							{guestSuccess.ticket_number}
						</p>
						<p className="mt-4 text-xs leading-relaxed text-slate-500">
							Anda mengirim laporan ini tanpa akun. Laporan publik tetap dapat
							dilihat tanpa masuk, tetapi untuk melacak riwayat dan status
							laporan ini Anda perlu masuk atau mendaftar sebagai warga.
						</p>
						<div className="mt-6 flex flex-wrap justify-center gap-2">
							<button
								type="button"
								onClick={() => {
									setGuestSuccess(null);
									setError("");
								}}
								className={`rounded-lg border px-4 py-2.5 text-xs font-medium ${
									isLightTheme ? "border-slate-200" : "border-white/10"
								}`}
							>
								Kirim laporan lain
							</button>
							<Link
								href="/login"
								className="rounded-lg bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-600"
							>
								Masuk untuk melacak laporan
							</Link>
							<Link
								href="/register"
								className="rounded-lg border border-indigo-500/30 px-4 py-2.5 text-xs font-semibold text-indigo-500 hover:bg-indigo-500/10"
							>
								Buat akun warga
							</Link>
						</div>
					</Panel>
				) : (
					<>
						<PageHeading
							eyebrow="Layanan masyarakat"
							title="Sampaikan laporan"
							description="Berikan informasi yang jelas agar petugas dapat menindaklanjuti dengan tepat."
							actions={
								isGuest ? undefined : (
									<Link
										href="/my-reports"
										className={`rounded-lg border px-3 py-2 text-xs font-medium ${
											isLightTheme ? "border-slate-200" : "border-white/10"
										}`}
									>
										Kembali ke laporan saya
									</Link>
								)
							}
						/>

						{isGuest && (
							<Alert
								type="info"
								message="Anda mengirim laporan sebagai tamu tanpa akun. Laporan tetap diproses oleh petugas. Laporan publik dapat dilihat tanpa masuk; masuk atau daftar diperlukan untuk melacak riwayat dan status laporan Anda."
							/>
						)}

				<div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
					<Panel>
						<form onSubmit={handleSubmit} className="space-y-5">
							<div>
								<p className={labelClass}>Jenis laporan</p>
								<div className="grid gap-3 sm:grid-cols-2">
									{[
										["pengaduan", "Pengaduan", "Laporkan masalah yang perlu ditangani."],
										["aspirasi", "Aspirasi", "Sampaikan saran atau masukan layanan."],
									].map(([value, label, description]) => (
										<label
											key={value}
											className={`flex cursor-pointer gap-3 rounded-lg border p-3 transition ${
												reportType === value
													? "border-indigo-500/50 bg-indigo-500/[0.06]"
													: isLightTheme
														? "border-slate-200"
														: "border-white/[0.06]"
											}`}
										>
											<input
												type="radio"
												name="report_type"
												value={value}
												checked={reportType === value}
												onChange={() => setReportType(value as "pengaduan" | "aspirasi")}
												className="mt-0.5 accent-indigo-500"
											/>
											<span>
												<span className="block text-xs font-semibold">{label}</span>
												<span className="mt-1 block text-[10px] text-slate-500">
													{description}
												</span>
											</span>
										</label>
									))}
								</div>
							</div>

							<label className="block">
								<span className={labelClass}>Judul laporan</span>
								<input
									required
									minLength={10}
									maxLength={150}
									value={title}
									onChange={(event) => setTitle(event.target.value)}
									placeholder="Contoh: Lampu jalan padam di Jalan Merdeka"
									className={fieldClass}
								/>
								<span className="mt-1 block text-[10px] text-slate-500">
									{title.length}/150 karakter · minimal 10 karakter
								</span>
							</label>

							<div className="grid gap-4 sm:grid-cols-2">
								<label className="block">
									<span className={labelClass}>Kategori (opsional)</span>
									<select
										value={categoryId}
										onChange={(event) => setCategoryId(event.target.value)}
										className={fieldClass}
									>
										<option value="">Biar AI membantu menentukan</option>
										{categories.map((category) => (
											<option key={category.id} value={category.id}>
												{category.name}
											</option>
										))}
									</select>
								</label>
								{reportType === "pengaduan" && (
									<label className="block">
										<span className={labelClass}>Tanggal kejadian</span>
										<input
											required
											type="date"
											value={incidentDate}
											onChange={(event) => setIncidentDate(event.target.value)}
											className={fieldClass}
										/>
									</label>
								)}
							</div>

							<label className="block">
								<span className={labelClass}>Lokasi kejadian</span>
								<input
									required
									minLength={5}
									maxLength={255}
									value={location}
									onChange={(event) => setLocation(event.target.value)}
									placeholder="Alamat, kelurahan, kecamatan, atau patokan lokasi"
									className={fieldClass}
								/>
							</label>

							<label className="block">
								<span className={labelClass}>Ceritakan detail laporan</span>
								<textarea
									required
									minLength={20}
									maxLength={5000}
									rows={6}
									value={description}
									onChange={(event) => setDescription(event.target.value)}
									placeholder="Jelaskan apa yang terjadi, dampak yang dirasakan, dan informasi lain yang membantu petugas."
									className={`${fieldClass} resize-y`}
								/>
								<span className="mt-1 block text-[10px] text-slate-500">
									{description.length}/5000 karakter · minimal 20 karakter
								</span>
							</label>

							<label className="block">
								<span className={labelClass}>Foto pendukung (opsional)</span>
								<ImageDropzone
									className="mt-1"
									value={image}
									onChange={handleImageChange}
									label="Foto laporan"
								/>
							</label>

							<div className={`space-y-3 rounded-lg border p-3 ${
								isLightTheme ? "border-slate-200 bg-slate-50" : "border-white/[0.06] bg-white/[0.02]"
							}`}>
								<label className="flex items-start gap-2.5 text-xs">
									<input
										type="checkbox"
										checked={isAnonymous}
										onChange={(event) => setIsAnonymous(event.target.checked)}
										className="mt-0.5 accent-indigo-500"
									/>
									<span>
										<span className="block font-medium">Kirim sebagai anonim</span>
										<span className="mt-0.5 block text-[10px] text-slate-500">
											Nama Anda disamarkan pada laporan yang ditampilkan ke publik.
										</span>
									</span>
								</label>
								<label className="flex items-start gap-2.5 text-xs">
									<input
										type="checkbox"
										checked={isPrivate}
										onChange={(event) => setIsPrivate(event.target.checked)}
										className="mt-0.5 accent-indigo-500"
									/>
									<span>
										<span className="block font-medium">Jadikan laporan privat</span>
										<span className="mt-0.5 block text-[10px] text-slate-500">
											Hanya Anda dan petugas berwenang yang dapat melihat laporan ini.
										</span>
									</span>
								</label>
							</div>

							{error && <Alert message={error} />}
							<div className="flex flex-wrap justify-end gap-2">
								<Link
									href={isGuest ? "/" : "/my-reports"}
									className={`rounded-lg border px-4 py-2.5 text-xs font-medium ${
										isLightTheme ? "border-slate-200" : "border-white/10"
									}`}
								>
									Batal
								</Link>
								<button
									type="submit"
									disabled={isSubmitting}
									className="rounded-lg bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-600 disabled:opacity-60"
								>
									{isSubmitting ? "Mengirim laporan..." : "Kirim laporan"}
								</button>
							</div>
						</form>
					</Panel>

					<aside className={`rounded-xl border p-4 ${
						isLightTheme ? "border-indigo-100 bg-indigo-50/70" : "border-indigo-400/10 bg-indigo-500/[0.06]"
					}`}>
						<h2 className="text-xs font-semibold">Sebelum mengirim</h2>
						<ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-slate-500">
							<li>• Hindari mencantumkan NIK, nomor telepon, atau data sensitif di deskripsi.</li>
							<li>• Jelaskan waktu dan lokasi dengan jelas.</li>
							<li>• Foto pendukung tidak boleh melebihi 2 MB.</li>
							<li>• AI memberi rekomendasi; petugas tetap memverifikasi setiap laporan.</li>
						</ul>
					</aside>
				</div>
					</>
				)}
			</PortalLayout>
		</RequireUser>
	);
}
