# Data Acquisition Engine

Tugas backend service sederhana untuk mengekstrak informasi dari sebuah website, cek info domain (lewat API RDAP), dan nyari lokasi perusahaan (lewat Nominatim OpenStreetMap).

## Cara Install & Jalanin
1. Pastikan udah install Node.js.
2. Buka terminal di folder project ini.
3. Ketik `npm install` buat nginstall module yang dipakai (express, axios, cheerio, cors).
4. Jalankan aplikasinya dengan perintah `node app.js`.
5. Server bakal nyala di `http://localhost:3000`.

## List Endpoint (Bisa di-test di Postman)

- **POST /extract/website**
  Nge-scrape data dasar website kayak title, description, kontak, sama sosmed.
  Body JSON: `{"url": "https://paper.id"}`

- **POST /extract/domain**
  Ngecek info detail domain ke API RDAP (kapan daftar, kapan expired, dll).
  Body JSON: `{"domain": "paper.id"}`

- **POST /extract/location**
  Nyari lokasi koordinat & alamat pakai Nominatim.
  Body JSON: `{"query": "PT Telkom Indonesia"}`

- **GET /company-information?domain=paper.id**
  Ini endpoint integrasi. Tinggal masukin nama domain di URL, nanti kodenya bakal otomatis manggil ketiga fungsi di atas sekaligus.

## Catatan & Kendala Pas Ngerjain
Waktu ngerjain tugas ini, ada beberapa hal yang saya akalin:
1. **Nyari Lokasi di Endpoint Terakhir**: Karena input yang dikasih cuma nama domain (contoh: `paper.id`), agak susah buat nyari nama PT-nya di Nominatim. Jadi akal-akalannya, kodenya saya suruh ngecek `title` dari website tersebut. Kalau dapet nama perusahaannya, itu yang dipakai buat nyari lokasi. Kalau gagal, ya terpaksa pakai nama depan domainnya aja (contoh: `paper`).
2. **Kena Blokir Nominatim**: Awalnya pas nembak API Nominatim sering diblokir (error 403). Setelah saya riset, ternyata mereka wajib dikasih header `User-Agent` biar ketahuan siapa yang request. Setelah saya tambahin headernya, baru deh lancar.
3. **Error Handling Endpoint Gabungan**: Pas nyobain endpoint yang `/company-information`, kadang pencarian lokasinya suka error atau datanya gak ketemu. Nah biar aplikasinya gak ikutan crash (error 500), saya pisahin `try-catch`-nya buat masing-masing fungsi. Jadi misal nyari lokasinya gagal, minimal balasan data website sama domainnya masih tetep keluar dengan aman.
