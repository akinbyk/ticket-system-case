# HelpTicket — React + RTK Query + JSON Server

Bu proje, **mock JSON API** ile çalışan, giriş/çıkış, çok dillilik (TR/EN), talepler listesi, detay ve sohbet (yorumlar) akışı içeren bir **Help Desk / Ticketing** uygulamasıdır. **Herhangi bir gerçek backend kurulumuna gerek yoktur.** JSON Server ile birlikte kullanılabilir.

---

## 🎯 Özellikler

* **Talepler**:

  * Listeleme, arama, **durum/öncelik filtreleri**, hızlı sekmeler.
  * **Bootstrap Pagination** (sayfa başına 4 kayıt, yeni → eski sıralama).
  * Kart tıklayınca detaya gitme, **durum noktası**  ve **öncelik rozeti** renkleri.
* **Yeni Talep**:

  *  **Modal** ile Talep oluşturma.

* **Talep Detayı**:

  * Yalnızca **admin** için **durum** değiştirme menüsü.
  * **Mesajlaşma** balonları:


---

## 👤 Giriş Bilgileri

**Yetkili (Admin)**

* `username: admin`
* `password: 1`

**Kullanıcı (User)**

* `username: ali`
* `password: 1234`

---
---

## 📄 Figma

Uygulama tasarımı için Figma bağlantısı:

**Figma:** *https://www.figma.com/proto/xNCVKjuxZhSc4MRc6gElU1/ticket-system-case?node-id=1-542&t=5rDPCFKQLz753gLj-1*


---

---

## 🧱 Teknolojiler

* **React 18**, **React Router**
* **Redux Toolkit & RTK Query**
* **i18next** (TR/EN)
* **Bootstrap 5**, **Bootstrap Icons**, **react-bootstrap**
* **JSON Server** (mock API)
* Vite/CRA (geliştirme sunucusu) — *Vite kullanıyorsanız komutlar aşağıda örneklidir.*

---

## 🚀 Başlangıç

### 1) Bağımlılıkları yükle

```bash
npm install
```

### 2) Mock API’yi çalıştır

Varsayılan port: **3001** (önerilen)

```bash
npx json-server --watch mock/db.json --port 3001
```

> API taban adresi kodda `VITE_API_URL` (veya `src/api/requestApi.js`) ile okunur. Farklı bir port/host kullanırsanız `.env` oluşturup güncelleyin.

### 3) Uygulamayı çalıştır

```bash
npm run dev
```

### 4) Tarayıcı

```
http://localhost:5173
```

---

## ⚙️ Yapılandırma

`.env` (yerel geliştirme için):

```bash
# API tabanı
VITE_API_URL=http://localhost:3001

# Varsayılan dil (tr | en)
VITE_LOCALE_DEFAULT=tr

# (Opsiyonel) Auth token anahtarı
VITE_AUTH_STORAGE_KEY=helpticket.auth
```

> **Not:** RTK Query `baseUrl` değeri `VITE_API_URL` üzerinden gelir (proje içinde `requestApi` servisiniz bu değeri kullanacak şekilde kurgulanmıştır).



---


## 📦 Komutlar

```bash
# Bağımlılık
npm install

# Mock API (3001)
npx json-server --watch mock/db.json --port 3001

# Uygulama (Vite dev)
npm run dev

# Build
npm run build

# Önizleme (Vite)
npm run preview
```

---

İyi çalışmalar 👋
