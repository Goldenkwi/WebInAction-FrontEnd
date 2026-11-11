# Aduan Publik — Frontend

Frontend Next.js untuk [WebInAction-Backend-Laravel](https://github.com/Goldenkwi/WebInAction-Backend-Laravel). Antarmuka berbahasa Indonesia untuk warga, admin verifikator, admin instansi, dan super admin.

## Menjalankan secara lokal

1. Jalankan Laravel API pada `http://127.0.0.1:8000` dan siapkan database sesuai README backend.
2. Salin `.env.local.example` menjadi `.env.local`. Ubah `LARAVEL_API_URL` bila backend berjalan di alamat lain.
3. Jalankan:

   ```bash
   pnpm install
   pnpm dev
   ```

4. Buka `http://localhost:3000`.

`LARAVEL_API_URL` adalah konfigurasi server Next.js. Jangan menggantinya dengan variabel `NEXT_PUBLIC_*` karena browser tidak perlu dan tidak boleh mengetahui alamat internal backend.

## Autentikasi dan API

Browser hanya memanggil route same-origin `/api/backend/*`. Route Handler Next.js meneruskan request ke `/api/*` Laravel, menyimpan token Sanctum pada cookie `HttpOnly`, dan tidak mengirim token kembali ke JavaScript. Cookie menggunakan `Secure` saat production. Untuk deployment production, `LARAVEL_API_URL` wajib berupa URL HTTPS.

Format API Laravel `{ success, message, data }`, error validasi `errors`, dan metadata pagination `meta` ditangani oleh `lib/backend.ts`. Sesi dipulihkan dengan `GET /api/auth/me`; keluar memanggil `POST /api/auth/logout`.

## Halaman yang tersedia

| Halaman | Akses | Fungsi |
|---|---|---|
| `/` | Publik | Beranda layanan dan laporan publik terbaru |
| `/login` | Publik | Login untuk warga/petugas |
| `/register` | Publik | Registrasi akun warga |
| `/reports` | Publik | Laporan terverifikasi yang dibagikan publik, dengan filter |
| `/reports/[id]` | Login | Detail laporan yang dapat diakses dan timeline |
| `/reports/new` | Warga | Kirim pengaduan/aspirasi, foto, privasi, dan anonimitas |
| `/my-reports` | Warga | Daftar dan status laporan milik sendiri |
| `/admin` | Admin | Statistik backend, distribusi status/kategori/prioritas |
| `/admin/reports` | Verifier, Admin Instansi, Super Admin | Antrean, filter laporan, confidence AI, dan koreksi |
| `/admin/reports/[id]` | Verifier, Admin Instansi, Super Admin | Verifikasi, penolakan, tindak lanjut, audit trail (tombol menyesuaikan peran) |
| `/admin/agencies` | Super Admin | Tambah, ubah, dan hapus instansi |
| `/admin/contacts` | Super Admin | Direktori kontak admin tiap instansi |
| `/admin/categories` | Super Admin | Tambah, ubah, dan hapus kategori |

Registrasi publik selalu membuat role `citizen`; role petugas diberikan oleh backend. Pembagian wewenang mengikuti policy backend: super admin berwenang penuh (via `Gate::before`), admin verifikator hanya memverifikasi dan menolak laporan, sedangkan admin instansi hanya menindaklanjuti laporan instansinya. Otorisasi di UI membantu navigasi, sedangkan policy Laravel tetap menjadi sumber otoritas.
Daftar dan detail laporan publik dapat dibuka tanpa login. Laporan privat atau yang masih menunggu verifikasi hanya dapat dilihat pemilik atau petugas setelah masuk.

## Akun demo backend

Data akun tersedia setelah seeder backend dijalankan (`php artisan migrate:fresh --seed`):

| Peran | Email | Password |
|---|---|---|
| Warga | `warga@example.com` | `password123` |
| Super Admin | `superadmin@example.com` | `password123` |
| Verifier | `verifier@example.com` | `password123` |
| Admin Instansi | `agency@example.com` | `password123` |

Super Admin berwenang penuh atas seluruh sistem. Verifier hanya memverifikasi dan menolak laporan. Admin Instansi hanya menindaklanjuti laporan yang ditugaskan ke instansinya. Keempat akun disiapkan oleh `UserSeeder` di backend (`php artisan db:seed --class=UserSeeder`).

## Batasan mengikuti kontrak API

- Pengelompokan topik sentimen, SLA menit, latensi AI live, toggle auto-routing, dan batch approval tidak ditampilkan sebagai fitur aktif karena backend saat ini tidak menyediakan endpoint untuk hal tersebut.
- Pengiriman laporan menjalankan analisis melalui Laravel; jika AI tidak tersedia, backend tetap menerima laporan untuk verifikasi manual.
- API belum menyediakan reset password, pembaruan profil, atau pemilihan instansi tujuan secara terpisah.
