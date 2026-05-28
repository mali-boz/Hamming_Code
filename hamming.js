// hamming.js — Saf Hamming ECC mantığı / Pure Hamming ECC logic
// ⚠️ Bu dosyada DOM çağrısı OLMAYACAK — sadece veri işleme fonksiyonları.
// ⚠️ No DOM calls in this file — pure data processing functions only.

// =============================================================
// TODO: YARDIMCI FONKSİYONLAR (HELPER FUNCTIONS)
// =============================================================

// Verilen data bit sayısı için gerekli parity bit sayısını hesaplar (2^r >= m + r + 1)
function calculateParityBitCount(dataBitCount) {
    let r = 1;
    while (Math.pow(2, r) < dataBitCount + r + 1) {
        r++;
    }
    return r;
}

// Verilen sayının 2'nin kuvveti olup olmadığını kontrol eder (parity pozisyonları için)
function isPowerOfTwo(n) {
    return n > 0 && (n & (n - 1)) === 0;
}

// Girişin geçerli bir binary string olduğunu ve beklenen uzunlukta olduğunu doğrular
function validateInput(binaryString, expectedLength) {
    if (!/^[01]+$/.test(binaryString)) {
        return { valid: false, error: "Giriş sadece '0' ve '1' karakterlerinden oluşmalıdır." };
    }
    if (binaryString.length !== expectedLength) {
        return { valid: false, error: "Giriş uzunluğu " + expectedLength + " bit olmalıdır, şu an: " + binaryString.length + " bit." };
    }
    return { valid: true, error: null };
}

// =============================================================
// TODO: ENCODING (KODLAMA)
// =============================================================

// Data bitlerini Hamming kodu ile kodlar (parity bitleri hesaplanıp eklenir)
function encode(dataBits) {
    var m = dataBits.length;
    var r = calculateParityBitCount(m);
    var totalLength = m + r;

    // 1-indexed dizi: index 0 kullanılmaz, pozisyonlar 1'den başlar
    var encodedBits = new Array(totalLength + 1).fill(0);

    // Adım 1: Data bitlerini parity-olmayan pozisyonlara yerleştir
    var dataPositions = getDataPositions(totalLength);
    for (var i = 0; i < dataPositions.length; i++) {
        encodedBits[dataPositions[i]] = parseInt(dataBits[i]);
    }

    // Adım 2: Her parity bitini hesapla ve yerleştir
    var parityPositions = getParityPositions(totalLength);
    for (var j = 0; j < parityPositions.length; j++) {
        encodedBits[parityPositions[j]] = calculateParityBit(encodedBits, parityPositions[j], totalLength);
    }

    return encodedBits;
}

// Verilen toplam uzunluk için parity bit pozisyonlarını döndürür (1, 2, 4, 8, ...)
function getParityPositions(totalLength) {
    var positions = [];
    var p = 1;
    while (p <= totalLength) {
        positions.push(p);
        p *= 2;
    }
    return positions;
}

// Verilen toplam uzunluk için data bit pozisyonlarını döndürür (parity hariç)
function getDataPositions(totalLength) {
    var positions = [];
    for (var i = 1; i <= totalLength; i++) {
        if (!isPowerOfTwo(i)) {
            positions.push(i);
        }
    }
    return positions;
}

// Belirli bir parity pozisyonu için parity değerini XOR ile hesaplar
function calculateParityBit(encodedBits, parityPosition, totalLength) {
    var parity = 0;
    for (var i = 1; i <= totalLength; i++) {
        // i pozisyonunun bu parity biti tarafından kapsanıp kapsanmadığını kontrol et
        // Kural: i'nin binary gösteriminde parityPosition'ın biti set ise kapsanır
        if ((i & parityPosition) !== 0) {
            parity ^= encodedBits[i];
        }
    }
    return parity;
}

// =============================================================
// SYNDROME HESAPLAMA (HATA TESPİTİ)
// =============================================================

// Alınan bitlerde hata olup olmadığını tespit eder ve hatalı pozisyonu döndürür
function calculateSyndrome(receivedBits) {
    var totalLength = receivedBits.length - 1; // index 0 kullanılmıyor
    var parityPositions = getParityPositions(totalLength);
    var syndrome = 0;

    // Her parity pozisyonu için kontrol et, hatalıysa syndrome'a ekle
    for (var i = 0; i < parityPositions.length; i++) {
        var parity = 0;
        for (var j = 1; j <= totalLength; j++) {
            if ((j & parityPositions[i]) !== 0) {
                parity ^= receivedBits[j];
            }
        }
        // Parity 1 ise bu pozisyonda hata var, syndrome'a ekle
        if (parity !== 0) {
            syndrome += parityPositions[i];
        }
    }

    return {
        syndrome: syndrome,
        errorPosition: syndrome // syndrome değeri doğrudan hatalı bit pozisyonunu verir
    };
}

// =============================================================
// HATA DÜZELTME (ERROR CORRECTION)
// =============================================================

// Hatalı pozisyondaki biti flip ederek hatayı düzeltir (orijinali değiştirmez)
function correctError(receivedBits, errorPosition) {
    var correctedBits = receivedBits.slice(); // orijinalin kopyasını al
    correctedBits[errorPosition] = correctedBits[errorPosition] === 0 ? 1 : 0;
    return correctedBits;
}

// =============================================================
// DECODE (ÇÖZME)
// =============================================================

// Encoded diziden parity bitlerini çıkararak sadece data bitlerini döndürür
function decode(encodedBits) {
    var totalLength = encodedBits.length - 1; // index 0 kullanılmıyor
    var dataPositions = getDataPositions(totalLength);
    var dataBits = "";

    for (var i = 0; i < dataPositions.length; i++) {
        dataBits += encodedBits[dataPositions[i]].toString();
    }

    return dataBits;
}

// =============================================================
// EXPORT — Tüm public fonksiyonları Hamming namespace altında dışa aç
// =============================================================
window.Hamming = {
    calculateParityBitCount: calculateParityBitCount,
    isPowerOfTwo: isPowerOfTwo,
    validateInput: validateInput,
    encode: encode,
    getParityPositions: getParityPositions,
    getDataPositions: getDataPositions,
    calculateParityBit: calculateParityBit,
    calculateSyndrome: calculateSyndrome,
    correctError: correctError,
    decode: decode
};
