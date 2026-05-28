// memory.js — Simüle edilmiş bellek modülü / Simulated memory module
// ⚠️ Bu dosyada DOM çağrısı OLMAYACAK — sadece veri saklama mantığı.
// ⚠️ No DOM calls in this file — pure data storage logic only.

// =============================================================
// TODO: BELLEK YAPISI (MEMORY STRUCTURE)
// =============================================================

// TODO: Bellek veri yapısını tanımla
//   - memory: JS array (her eleman bir encoded bit dizisi tutar)
//   - Her "adres" dizinin bir index'i (0, 1, 2, ...)
//   - Başlangıçta boş array veya sabit boyutlu null-dolu array
//   - Kapasite: en az 8 satır (adres) yeterli

// TODO: nextAddress değişkeni
//   - Bir sonraki yazılacak adres (auto-increment)
//   - write() çağrıldığında artır

// =============================================================
// TODO: WRITE (YAZMA)
// =============================================================

// TODO: write(encodedBits)
//   - encodedBits dizisini belleğe yaz (mevcut nextAddress'e)
//   - Adresi bir artır
//   - Return: { address: integer, data: array } — yazılan adres ve veri

// =============================================================
// TODO: READ (OKUMA)
// =============================================================

// TODO: read(address)
//   - Belirtilen adresten veriyi oku
//   - Adres geçersizse veya boşsa hata mesajı döndür
//   - Return: encodedBits dizisi (array of 0/1) veya null

// TODO: readAll()
//   - Bellekteki tüm dolu adresleri ve değerlerini döndür
//   - Return: array of { address, data } nesneleri

// =============================================================
// TODO: HATA ENJEKSİYONU (BIT FLIP)
// =============================================================

// TODO: flipBit(address, bitPosition)
//   - Belirtilen adresteki belirtilen pozisyondaki biti flip et (0→1, 1→0)
//   - Orijinal ve yeni değeri logla
//   - Return: { original: 0|1, flipped: 0|1, address, bitPosition }

// =============================================================
// TODO: RESET
// =============================================================

// TODO: reset()
//   - Belleği tamamen sıfırla (boşalt)
//   - nextAddress'i 0'a döndür
//   - Return: void

// =============================================================
// TODO: DURUM SORGULAMA
// =============================================================

// TODO: getSize()
//   - Bellekte kaç dolu adres olduğunu döndür
//   - Return: integer

// TODO: getCapacity()
//   - Belleğin toplam kapasitesini döndür
//   - Return: integer

// =============================================================
// TODO: EXPORT
// =============================================================
// TODO: Tüm public fonksiyonları window.Memory namespace altında dışa aç
//       veya global fonksiyonlar olarak bırak
