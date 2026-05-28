// hamming.js — Saf Hamming ECC mantığı / Pure Hamming ECC logic
// ⚠️ Bu dosyada DOM çağrısı OLMAYACAK — sadece veri işleme fonksiyonları.
// ⚠️ No DOM calls in this file — pure data processing functions only.

// =============================================================
// TODO: YARDIMCI FONKSİYONLAR (HELPER FUNCTIONS)
// =============================================================

// TODO: calculateParityBitCount(dataBitCount)
//   - Verilen data bit sayısı için gerekli parity bit sayısını hesapla
//   - Formül: 2^r >= m + r + 1 (m = data bits, r = parity bits)
//   - Return: parity bit sayısı (integer)

// TODO: isPowerOfTwo(n)
//   - Verilen sayının 2'nin kuvveti olup olmadığını kontrol et
//   - Parity bit pozisyonlarını belirlemek için kullanılacak
//   - Return: boolean

// TODO: validateInput(binaryString, expectedLength)
//   - Girişin sadece '0' ve '1' karakterlerinden oluştuğunu doğrula
//   - Uzunluğun beklenen değere (8, 16, 32) eşit olduğunu kontrol et
//   - Return: { valid: boolean, error: string | null }

// =============================================================
// TODO: ENCODING (KODLAMA)
// =============================================================

// TODO: encode(dataBits)
//   - dataBits: string (örn. "10110011")
//   - Adım 1: Toplam bit uzunluğunu hesapla (data + parity)
//   - Adım 2: Parity pozisyonlarını (1, 2, 4, 8, ...) boş bırakarak data bitlerini yerleştir
//   - Adım 3: Her parity bitini ilgili pozisyonlardaki bitlere göre hesapla (XOR)
//   - Return: encodedBits dizisi (array of 0/1 integers), 1-indexed pozisyonlar

// TODO: getParityPositions(totalLength)
//   - Verilen toplam uzunluk için parity bit pozisyonlarını döndür
//   - Return: array of integers (örn. [1, 2, 4, 8])

// TODO: getDataPositions(totalLength)
//   - Verilen toplam uzunluk için data bit pozisyonlarını döndür
//   - Return: array of integers (parity pozisyonları hariç tüm pozisyonlar)

// TODO: calculateParityBit(encodedBits, parityPosition, totalLength)
//   - Belirli bir parity pozisyonu için parity değerini hesapla
//   - parityPosition'ın kapsadığı bitleri XOR'la
//   - Kapsam kuralı: parityPosition kadar al, parityPosition kadar atla (tekrarla)
//   - Return: 0 veya 1

// =============================================================
// TODO: SYNDROME HESAPLAMA (HATA TESPİTİ)
// =============================================================

// TODO: calculateSyndrome(receivedBits)
//   - receivedBits: array of 0/1 integers
//   - Her parity pozisyonu için parity kontrolü yap
//   - Syndrome değerini oluştur (parity hatalarının pozisyonlarının toplamı)
//   - Return: { syndrome: integer, errorPosition: integer }
//     syndrome = 0 → hata yok
//     syndrome > 0 → hatalı bit pozisyonu

// =============================================================
// TODO: HATA DÜZELTME (ERROR CORRECTION)
// =============================================================

// TODO: correctError(receivedBits, errorPosition)
//   - errorPosition'daki biti flip et (0→1, 1→0)
//   - Return: correctedBits dizisi (yeni bir kopi, orijinali değiştirme)

// =============================================================
// TODO: DECODE (ÇÖZME)
// =============================================================

// TODO: decode(encodedBits)
//   - Encoded diziden sadece data bitlerini çıkar (parity pozisyonlarını atla)
//   - Return: dataBits string (örn. "10110011")

// =============================================================
// TODO: EXPORT
// =============================================================
// TODO: Tüm public fonksiyonları window.Hamming gibi bir namespace altında dışa aç
//       veya basitçe global fonksiyonlar olarak bırak (öğrenci projesi seviyesi)
