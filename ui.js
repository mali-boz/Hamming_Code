// ui.js — Tüm DOM manipülasyonu ve olay yönetimi / All DOM manipulation & event handling
// Bu dosya hamming.js ve memory.js fonksiyonlarını çağırır, sonuçları DOM'a yansıtır.

// =============================================================
// TODO: DOM REFERANSLARI
// =============================================================

// TODO: Sayfa yüklendiğinde tüm gerekli DOM elemanlarını seç ve değişkenlere ata:
//   - bitLengthSelector (radio group veya select)
//   - dataInput (text input)
//   - btnEncode, btnWrite, btnRead, btnDetect, btnReset
//   - bitGridContainer
//   - memoryView
//   - resultPanel

// =============================================================
// TODO: DURUM YÖNETİMİ (STATE)
// =============================================================

// TODO: Uygulama durumunu tutan bir state nesnesi oluştur:
//   - currentBitLength: 8 | 16 | 32
//   - currentDataBits: string | null
//   - currentEncodedBits: array | null
//   - currentAddress: integer | null
//   - flippedBitPosition: integer | null
//   - step: "idle" | "encoded" | "written" | "read" | "flipped" | "corrected"

// =============================================================
// TODO: BIT GRID RENDER
// =============================================================

// TODO: renderBitGrid(encodedBits, parityPositions)
//   - bit-grid-container içini temizle
//   - Her bit için bir hücre elemanı (div) oluştur
//   - Parity pozisyonlarındaki hücrelere .parity class'ı ekle
//   - Data pozisyonlarındaki hücrelere .data class'ı ekle
//   - Her hücrenin içinde: pozisyon numarası (üstte) + bit değeri (ortada)
//   - Her hücreye tıklama olayı ekle → handleBitClick(position)

// TODO: highlightBit(position, className)
//   - Belirtilen pozisyondaki hücreye geçici bir CSS class'ı ekle
//   - className: "error", "corrected", "highlight" vb.

// TODO: clearHighlights()
//   - Tüm hücrelerden vurgu class'larını kaldır

// =============================================================
// TODO: BELLEK GÖRÜNTÜLEME RENDER
// =============================================================

// TODO: renderMemoryView()
//   - Memory.readAll() ile tüm bellek içeriğini al
//   - memory-view alanını güncelle (tablo satırları veya grid)
//   - Her satır: adres (hex veya decimal) + binary değer
//   - Boş satırlar soluk gösterilsin

// =============================================================
// TODO: SONUÇ PANELİ (LOG)
// =============================================================

// TODO: log(message, type)
//   - result-panel'e yeni bir log satırı ekle
//   - type: "info" | "success" | "warning" | "error"
//   - Otomatik scroll en alta
//   - Zaman damgası ekle (opsiyonel)

// TODO: clearLog()
//   - result-panel'i temizle

// =============================================================
// TODO: OLAY DİNLEYİCİLER (EVENT LISTENERS)
// =============================================================

// TODO: initEventListeners()
//   - Tüm butonlara ve seçicilere olay dinleyicileri bağla
//   - DOMContentLoaded'da çağrılacak

// TODO: handleBitLengthChange(event)
//   - Seçilen bit uzunluğunu state'e kaydet
//   - Input alanını ve grid'i sıfırla
//   - Input alanının maxlength ve placeholder'ını güncelle

// TODO: handleEncode()
//   - Input değerini al ve doğrula (Hamming.validateInput)
//   - Geçerliyse Hamming.encode() çağır
//   - Sonucu state'e kaydet
//   - renderBitGrid() ile grid'i güncelle
//   - Log mesajı yaz
//   - state.step = "encoded"

// TODO: handleWrite()
//   - state.currentEncodedBits'i Memory.write() ile belleğe yaz
//   - renderMemoryView() ile bellek görünümünü güncelle
//   - Log mesajı yaz
//   - state.step = "written"

// TODO: handleRead()
//   - Memory.read(state.currentAddress) ile veriyi oku
//   - renderBitGrid() ile okunan veriyi grid'de göster
//   - Log mesajı yaz
//   - state.step = "read"

// TODO: handleBitClick(position)
//   - Eğer state.step === "read" ise:
//     - Memory.flipBit(state.currentAddress, position) çağır
//     - Grid'de ilgili hücreyi .error class'ı ile vurgula
//     - state.flippedBitPosition = position
//     - Log mesajı yaz: "Bit X flipped!"
//     - state.step = "flipped"
//   - Aksi halde: kullanıcıya uyarı göster (henüz flip yapılamaz)

// TODO: handleDetectCorrect()
//   - Memory.read(state.currentAddress) ile veriyi oku
//   - Hamming.calculateSyndrome() ile syndrome hesapla
//   - Hata pozisyonunu log'a yaz
//   - Hamming.correctError() ile düzelt
//   - Düzeltilen veriyi Memory'ye geri yaz
//   - Grid'i güncelle, düzeltilen biti .corrected ile vurgula
//   - Orijinal data ile karşılaştır ve doğrulama sonucunu logla
//   - state.step = "corrected"

// TODO: handleReset()
//   - State'i başlangıç değerlerine döndür
//   - Memory.reset() çağır
//   - Grid'i, bellek görünümünü ve log'u temizle
//   - Input alanını temizle
//   - state.step = "idle"

// =============================================================
// TODO: BUTON DURUMU YÖNETİMİ
// =============================================================

// TODO: updateButtonStates()
//   - state.step'e göre hangi butonların aktif/pasif olacağını belirle:
//     idle     → sadece Encode aktif
//     encoded  → Write aktif
//     written  → Read aktif
//     read     → "Bir bit tıklayın" mesajı, Detect pasif
//     flipped  → Detect aktif
//     corrected → Reset aktif, diğerleri pasif
//   - Her adımdan sonra çağrılacak

// =============================================================
// TODO: GİRİŞ DOĞRULAMA UI
// =============================================================

// TODO: validateInputUI()
//   - Kullanıcı yazarken (input event) girişi anlık doğrula
//   - Geçersiz karakterler varsa input border'ını kırmızıya çevir
//   - Uzunluk yanlışsa uyarı göster
//   - Geçerliyse yeşil border

// =============================================================
// TODO: BAŞLATMA (INITIALIZATION)
// =============================================================

// TODO: document.addEventListener("DOMContentLoaded", init)
//   - init() fonksiyonu: initEventListeners() + ilk render + log("Ready")
