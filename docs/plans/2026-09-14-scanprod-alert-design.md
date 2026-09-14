# Desain Alert Scan Produksi

## Tujuan

Memberikan feedback scan yang cepat tanpa menutupi form ketika berhasil, tetapi
memaksa operator membaca error sebelum melanjutkan.

## Perilaku

- Success tampil sebagai toast DaisyUI `alert-success alert-soft` di kanan atas.
- Success dapat ditutup manual dan otomatis hilang setelah tiga detik.
- Error tampil sebagai dialog modal di tengah dengan backdrop.
- Error tidak otomatis hilang dan hanya ditutup melalui tombol `OK`.
- Setelah alert ditutup, fokus kembali ke input scanner utama.
- State dan timer dimiliki halaman `scanprod`; komponen alert hanya merender UI.

## Aksesibilitas

- Success memakai live region `polite`.
- Error memakai native `dialog` dengan label dan deskripsi yang terhubung.
- Tombol mendapat fokus saat dialog dibuka dan focus trap ditangani browser.
- Ikon dekoratif disembunyikan dari screen reader.

## Verifikasi

- Build produksi harus berhasil dengan DaisyUI 5.
- Success harus hilang setelah tiga detik.
- Error harus tetap terbuka sampai tombol `OK` ditekan.
- Setelah dismiss, input scanner utama harus kembali fokus.
