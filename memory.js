// memory.js — Simüle edilmiş bellek modülü / Simulated memory module
// ⚠️ Bu dosyada DOM çağrısı OLMAYACAK — sadece veri saklama mantığı.
// ⚠️ No DOM calls in this file — pure data storage logic only.

// =============================================================
// BELLEK YAPISI (MEMORY STRUCTURE)
// =============================================================

// Sabit kapasiteli bellek dizisi (8 adres, başlangıçta null)
var CAPACITY = 8;
var memory = new Array(CAPACITY).fill(null);

// Bir sonraki yazılacak adres (write() her çağrıldığında artar)
var nextAddress = 0;

// =============================================================
// WRITE (YAZMA)
// =============================================================

// Encoded bit dizisini belleğin bir sonraki adresine yazar
function write(encodedBits) {
    if (nextAddress >= CAPACITY) {
        return { address: -1, data: null, error: "Bellek dolu! Kapasite: " + CAPACITY };
    }
    var address = nextAddress;
    memory[address] = encodedBits.slice(); // kopyasını sakla
    nextAddress++;
    return { address: address, data: memory[address], error: null };
}

// =============================================================
// READ (OKUMA)
// =============================================================

// Belirtilen adresten veriyi okur, geçersiz adres için null döndürür
function read(address) {
    if (address < 0 || address >= CAPACITY) {
        return null;
    }
    if (memory[address] === null) {
        return null;
    }
    return memory[address].slice(); // kopyasını döndür (orijinali koru)
}

// Bellekteki tüm dolu adresleri ve değerlerini döndürür
function readAll() {
    var entries = [];
    for (var i = 0; i < CAPACITY; i++) {
        if (memory[i] !== null) {
            entries.push({ address: i, data: memory[i].slice() });
        }
    }
    return entries;
}

// =============================================================
// HATA ENJEKSİYONU (BIT FLIP)
// =============================================================

// Belirtilen adresteki belirtilen pozisyondaki biti flip eder (0→1, 1→0)
function flipBit(address, bitPosition) {
    if (memory[address] === null) {
        return { error: "Bu adreste veri yok!" };
    }
    if (bitPosition < 0 || bitPosition >= memory[address].length) {
        return { error: "Geçersiz bit pozisyonu!" };
    }
    var original = memory[address][bitPosition];
    memory[address][bitPosition] = original === 0 ? 1 : 0;
    var flipped = memory[address][bitPosition];
    return {
        original: original,
        flipped: flipped,
        address: address,
        bitPosition: bitPosition,
        error: null
    };
}

// =============================================================
// RESET
// =============================================================

// Belleği tamamen sıfırlar (tüm adresler null, yazma adresi 0)
function reset() {
    for (var i = 0; i < CAPACITY; i++) {
        memory[i] = null;
    }
    nextAddress = 0;
}

// =============================================================
// DURUM SORGULAMA
// =============================================================

// Bellekte kaç dolu adres olduğunu döndürür
function getSize() {
    var count = 0;
    for (var i = 0; i < CAPACITY; i++) {
        if (memory[i] !== null) {
            count++;
        }
    }
    return count;
}

// Belleğin toplam kapasitesini döndürür
function getCapacity() {
    return CAPACITY;
}

// =============================================================
// EXPORT — Tüm public fonksiyonları Memory namespace altında dışa aç
// =============================================================
window.Memory = {
    write: write,
    read: read,
    readAll: readAll,
    flipBit: flipBit,
    reset: reset,
    getSize: getSize,
    getCapacity: getCapacity
};
