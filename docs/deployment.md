# Deploy — Frontend AC (fresh server)

Panduan setup baru frontend: Next.js 15 (App Router), hasil build dijalankan `next start` lewat pm2, API dari
`backend-ac` di origin terpisah. Langkah 3 (CORS) **wajib** dan berada di repo backend.

## Prasyarat

- Node.js 20+ (dicek dengan v24.18.0)
- `backend-ac` sudah jalan dan **bisa dijangkau browser pengguna**, bukan hanya dari server frontend
- Origin frontend final sudah ditentukan, mis. `https://scan.example.com` (dipakai di langkah 3)

## 1. Deploy aplikasi

```bash
cd /srv/fe-scanning-ac
npm ci
cp .env.example .env      # WAJIB: .env tidak ikut repo
nano .env                 # isi URL API (langkah 2)
npm run build             # nilai NEXT_PUBLIC_* ditanam ke bundel di langkah ini
```

Catatan:

- `.env` ada di `.gitignore`; tiap server menyiapkan sendiri, isinya didokumentasikan di `.env.example`.
- Build **berhenti dengan error** kalau variabel yang akan ditanam kosong:
  `NEXT_PUBLIC_API_BASE_URL_PRODUCTION belum diisi. Salin .env.example menjadi .env lalu isi nilainya...`
- Jalankan build **tanpa** `NODE_ENV=development`. Next hanya menerima build dengan `NODE_ENV=production`
  (diset otomatis); kalau environment sudah menyetel `development`, build gagal saat prerender `/404` dengan
  `<Html> should not be imported outside of pages/_document`.
- `next build` dan `next dev` memakai cache `.next` yang sama. Jangan menjalankan `next build` di checkout yang
  sedang dipakai `next dev` tanpa membersihkannya lebih dulu — halaman bisa tampak membeku/blank.
  Bersihkan dengan `npm run clean`.

## 2. Environment variables

Isi `.env`:

```
NEXT_PUBLIC_API_BASE_URL_DEV=http://localhost:3001
NEXT_PUBLIC_API_BASE_URL_PRODUCTION=https://api.scan.example.com
```

- Yang dipakai dipilih otomatis **saat build** dari `NODE_ENV` (lihat `src/lib/urlEndPoint.js`):
  `next build` → `_PRODUCTION`, `next dev` → `_DEV`.
- Hanya `_PRODUCTION` yang dipakai build produksi. `_DEV` dipakai dev server (dan tetap dicek saat dev).
- Nilainya **ditanam ke bundel saat build**, bukan dibaca saat runtime. Setelah build, mengubah `.env` tidak
  berpengaruh: harus `npm run build` ulang lalu `pm2 reload`.
- Isi URL yang dijangkau **browser pengguna**, bukan `localhost`. Kalau diisi `http://localhost:3001`, setiap
  pengguna akan memanggil mesin mereka sendiri dan semua halaman tampil "Gagal memuat ...".
- Tanpa trailing slash.
- Kalau API disajikan di belakang proxy dengan prefiks path di origin yang sama (pola
  `http://HOST/services/api`), isi URL itu sebagai satu kesatuan — dan langkah 3 tidak berlaku, karena browser
  hanya melihat satu origin.

## 3. Wajib: CORS dan cookie di backend

Frontend memanggil API secara cross-origin, jadi backend harus mengizinkan origin frontend.

```bash
cd /srv/backend-ac
nano .env                 # CORS_ORIGINS=https://scan.example.com
pm2 reload backend-ac
```

- Isinya origin **persis** (skema + host + port), dipisah koma untuk beberapa origin. `https://scan.example.com`
  dan `http://scan.example.com` berbeda, dan `https://scan.example.com/` (pakai slash) tidak cocok.
- Beda port = beda origin: `http://192.168.0.45:3000` ≠ `http://192.168.0.45:8080`. Daftarkan yang benar-benar dipakai.
- Kosong = semua request browser cross-origin ditolak.
- Cookie session backend diberi flag `Secure` saat `NODE_ENV=production`. Kalau frontend diakses lewat HTTP biasa,
  browser membuang cookie **tanpa error**: `/auth/login` balas 200 tapi semua request berikutnya 401 dan halaman
  langsung kembali ke `/auth/login`. Terminasi TLS di depan API dan frontend, lalu akses lewat HTTPS.

## 4. Jalankan dengan pm2

```bash
sudo npm i -g pm2
pm2 start npm --name fe-scanning-ac -- start     # port default 3000
pm2 save
pm2 startup                                      # jalankan perintah yang dicetak
```

- `npm start` = `next start`, membaca hasil build di `.next` (bukan source). Build dulu.
- Port lain: `PORT=8080 pm2 start npm --name fe-scanning-ac -- start`. Menjalankan manual dengan port lain:
  `npm start -- -p 8080` (keduanya sudah dicek).
- `NEXT_PUBLIC_*` tidak lagi dibaca saat start — nilainya sudah ada di bundel, jadi jangan mengandalkan
  mengubah `.env` lalu reload untuk memindahkan API.
- pm2 harus dijalankan dari root project (Next mencari `.next` relatif ke cwd).

## 5. Verifikasi

```bash
curl -sI localhost:3000/ | head -3                                   # 307 Temporary Redirect, location: /dashboard
curl -s -o /dev/null -w '%{http_code}\n' localhost:3000/auth/login   # 200

# pastikan bundel tidak menunjuk ke localhost:
grep -rl "localhost:3001" .next/static/chunks && echo "MASIH ADA URL DEV DI BUNDEL" || echo "bersih"
```

Lalu di browser: login dan buka `/dashboard`. Kalau tabelnya terisi, build + CORS + cookie sudah benar.

## 6. Kalau ada yang gagal

| Gejala | Penyebab |
|---|---|
| Halaman "Gagal memuat ...", console penuh error CORS | Origin frontend belum ada / tidak persis di `CORS_ORIGINS` |
| Login balas 200 tapi selalu kembali ke `/auth/login` | Cookie `Secure` dibuang karena FE diakses lewat HTTP |
| Request menuju `undefined/...` | Build dijalankan tanpa `.env` (sekarang dicegah guard di `next.config.mjs`) |
| Request menuju `localhost:3001` dari komputer pengguna | Build memakai URL dev: `_PRODUCTION` salah, atau hasil build mesin dev dipakai di server |
| Halaman blank/membeku setelah build di checkout dev | Cache `.next` tercampur — `npm run clean`, jalankan ulang |
| `/` membalas 404 | Build lama; redirect `/` ada di `next.config.mjs`, build ulang |

## 7. Catatan operasional

- Mengubah URL API = `npm run build` ulang + `pm2 reload fe-scanning-ac`. Tidak ada nilai `NEXT_PUBLIC_*` yang
  dibaca saat runtime.
- Urutan deploy: siapkan `.env` frontend → update `CORS_ORIGINS` backend → build frontend → reload.
- `.env` tidak di-commit di kedua repo. Jangan menyalin `.env` antar server; build di mesin dev bisa membuat
  bundel menunjuk ke localhost.
