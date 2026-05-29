// ui.js — Tüm DOM manipülasyonu ve olay yönetimi / All DOM manipulation & event handling
// Bu dosya hamming.js ve memory.js fonksiyonlarını çağırır, sonuçları DOM'a yansıtır.

// =============================================================
// DOM REFERANSLARI
// =============================================================

var dom = {
    bitLengthInputs: null,  // radio group
    dataInput: null,
    inputValidity: null,
    btnEncode: null,
    btnWrite: null,
    btnRead: null,
    btnDetect: null,
    btnReset: null,
    bitGridContainer: null,
    memoryTableBody: null,
    resultPanel: null
};

function cacheDomReferences() {
    dom.bitLengthInputs = document.querySelectorAll('input[name="bit-length"]');
    dom.dataInput = document.getElementById('data-input');
    dom.inputValidity = document.getElementById('input-validity');
    dom.btnEncode = document.getElementById('btn-encode');
    dom.btnWrite = document.getElementById('btn-write');
    dom.btnRead = document.getElementById('btn-read');
    dom.btnDetect = document.getElementById('btn-detect');
    dom.btnReset = document.getElementById('btn-reset');
    dom.bitGridContainer = document.getElementById('bit-grid-container');
    dom.memoryTableBody = document.getElementById('memory-table-body');
    dom.resultPanel = document.getElementById('result-panel');
}

// =============================================================
// DURUM YÖNETİMİ (STATE)
// =============================================================

var state = {
    currentBitLength: 8,
    currentDataBits: null,
    currentEncodedBits: null,
    currentAddress: null,
    flippedBitPosition: null,
    step: "idle"   // "idle" | "encoded" | "written" | "read" | "flipped" | "corrected"
};

// =============================================================
// BIT GRID RENDER
// =============================================================

function renderBitGrid(encodedBits) {
    dom.bitGridContainer.innerHTML = '';
    if (!encodedBits) return;

    var totalLength = encodedBits.length - 1; // index 0 kullanılmaz
    var parityPositions = Hamming.getParityPositions(totalLength);

    for (var i = 1; i <= totalLength; i++) {
        var cell = document.createElement('div');
        cell.className = 'bit-cell';
        cell.dataset.position = i;

        // Parity mi data mı?
        if (Hamming.isPowerOfTwo(i)) {
            cell.classList.add('parity');
        } else {
            cell.classList.add('data');
        }

        // Pozisyon etiketi
        var posLabel = document.createElement('span');
        posLabel.className = 'position-label';
        posLabel.textContent = 'P' + i;
        cell.appendChild(posLabel);

        // Bit değeri
        var bitVal = document.createElement('span');
        bitVal.className = 'bit-value';
        bitVal.textContent = encodedBits[i];
        cell.appendChild(bitVal);

        // Tıklama olayı
        (function(pos) {
            cell.addEventListener('click', function() {
                handleBitClick(pos);
            });
        })(i);

        dom.bitGridContainer.appendChild(cell);
    }
}

function highlightBit(position, className) {
    var cell = dom.bitGridContainer.querySelector('[data-position="' + position + '"]');
    if (cell) {
        // Önceki durum class'larını temizle
        cell.classList.remove('error', 'corrected', 'highlight-animation');
        // Force reflow for animation restart
        void cell.offsetWidth;
        cell.classList.add(className);
    }
}

function clearHighlights() {
    var cells = dom.bitGridContainer.querySelectorAll('.bit-cell');
    for (var i = 0; i < cells.length; i++) {
        cells[i].classList.remove('error', 'corrected', 'highlight-animation');
    }
}

// =============================================================
// BELLEK GÖRÜNTÜLEME RENDER
// =============================================================

function renderMemoryView() {
    dom.memoryTableBody.innerHTML = '';
    var capacity = Memory.getCapacity();

    for (var i = 0; i < capacity; i++) {
        var tr = document.createElement('tr');
        var tdAddr = document.createElement('td');
        var tdVal = document.createElement('td');

        // Adres — hex formatı
        tdAddr.textContent = '0x' + i.toString(16).toUpperCase().padStart(2, '0');

        var data = Memory.read(i);
        if (data) {
            // İlk elemanı atla (index 0), geri kalanı birleştir
            var bits = '';
            for (var j = 1; j < data.length; j++) {
                bits += data[j];
            }
            tdVal.textContent = bits;
        } else {
            tdVal.textContent = '—';
            tr.classList.add('empty');
        }

        tr.appendChild(tdAddr);
        tr.appendChild(tdVal);
        dom.memoryTableBody.appendChild(tr);
    }
}

// =============================================================
// SONUÇ PANELİ (LOG)
// =============================================================

function log(message, type) {
    type = type || 'info';

    var entry = document.createElement('div');
    entry.className = 'log-entry log-' + type;

    // Zaman damgası
    var timeSpan = document.createElement('span');
    timeSpan.className = 'log-time';
    var now = new Date();
    timeSpan.textContent = padZero(now.getHours()) + ':' +
                           padZero(now.getMinutes()) + ':' +
                           padZero(now.getSeconds());

    // Mesaj
    var msgSpan = document.createElement('span');
    msgSpan.className = 'log-message';
    msgSpan.textContent = message;

    entry.appendChild(timeSpan);
    entry.appendChild(msgSpan);
    dom.resultPanel.appendChild(entry);

    // Otomatik scroll en alta
    dom.resultPanel.scrollTop = dom.resultPanel.scrollHeight;
}

function clearLog() {
    dom.resultPanel.innerHTML = '';
}

function padZero(n) {
    return n < 10 ? '0' + n : '' + n;
}

// =============================================================
// OLAY DİNLEYİCİLER (EVENT LISTENERS)
// =============================================================

function initEventListeners() {
    // Bit uzunluğu değişimi
    for (var i = 0; i < dom.bitLengthInputs.length; i++) {
        dom.bitLengthInputs[i].addEventListener('change', handleBitLengthChange);
    }

    // Veri girişi — anlık doğrulama
    dom.dataInput.addEventListener('input', validateInputUI);

    // Butonlar
    dom.btnEncode.addEventListener('click', handleEncode);
    dom.btnWrite.addEventListener('click', handleWrite);
    dom.btnRead.addEventListener('click', handleRead);
    dom.btnDetect.addEventListener('click', handleDetectCorrect);
    dom.btnReset.addEventListener('click', handleReset);
}

// =============================================================
// OLAY İŞLEYİCİLER (EVENT HANDLERS)
// =============================================================

function handleBitLengthChange(event) {
    state.currentBitLength = parseInt(event.target.value);
    dom.dataInput.value = '';
    dom.dataInput.maxLength = state.currentBitLength;

    var placeholders = {
        8:  'Ör: 10110010',
        16: 'Ör: 1011001011010110',
        32: '32-bit binary girin'
    };
    dom.dataInput.placeholder = placeholders[state.currentBitLength] || '';

    // Girişi ve doğrulamayı sıfırla
    dom.dataInput.classList.remove('valid', 'invalid');
    dom.inputValidity.textContent = '';
    dom.inputValidity.className = 'validity-indicator';

    log('Bit uzunluğu ' + state.currentBitLength + '-bit olarak değiştirildi.', 'info');
}

function handleEncode() {
    var input = dom.dataInput.value.trim();

    // Doğrulama
    var validation = Hamming.validateInput(input, state.currentBitLength);
    if (!validation.valid) {
        log('Encoding hatası: ' + validation.error, 'error');
        dom.dataInput.classList.add('invalid');
        dom.dataInput.classList.remove('valid');
        return;
    }

    // Encode
    state.currentDataBits = input;
    state.currentEncodedBits = Hamming.encode(input);
    state.step = 'encoded';

    // Bit grid'i güncelle
    renderBitGrid(state.currentEncodedBits);

    // Encoded bit string'i oluştur (log için)
    var totalLength = state.currentEncodedBits.length - 1;
    var encodedStr = '';
    for (var i = 1; i <= totalLength; i++) {
        encodedStr += state.currentEncodedBits[i];
    }

    var parityCount = Hamming.calculateParityBitCount(input.length);
    log('Encoding başarılı! Data: ' + input + ' → Hamming(' + totalLength + ',' + input.length + '): ' + encodedStr, 'success');
    log(parityCount + ' parity biti eklendi (mor hücreler). Toplam: ' + totalLength + ' bit.', 'info');

    updateButtonStates();
}

function handleWrite() {
    if (!state.currentEncodedBits) {
        log('Yazılacak veri yok! Önce Encode yapın.', 'warning');
        return;
    }

    var result = Memory.write(state.currentEncodedBits);
    if (result.error) {
        log('Bellek yazma hatası: ' + result.error, 'error');
        return;
    }

    state.currentAddress = result.address;
    state.step = 'written';

    renderMemoryView();
    log('Veri belleğe yazıldı → Adres: 0x' +
        result.address.toString(16).toUpperCase().padStart(2, '0'), 'success');

    updateButtonStates();
}

function handleRead() {
    if (state.currentAddress === null) {
        log('Okunacak adres yok! Önce Write yapın.', 'warning');
        return;
    }

    var data = Memory.read(state.currentAddress);
    if (!data) {
        log('Adres 0x' + state.currentAddress.toString(16).toUpperCase().padStart(2, '0') +
            ' boş!', 'error');
        return;
    }

    state.currentEncodedBits = data;
    state.step = 'read';

    renderBitGrid(state.currentEncodedBits);
    renderMemoryView();

    log('Veri bellekten okundu ← Adres: 0x' +
        state.currentAddress.toString(16).toUpperCase().padStart(2, '0'), 'success');
    log('Hata enjekte etmek için bir bit hücresine tıklayın.', 'warning');

    updateButtonStates();
}

function handleBitClick(position) {
    if (state.step !== 'read') {
        if (state.step === 'flipped') {
            log('Zaten bir bit flip edildi. "Detect & Correct" butonuna basın.', 'warning');
        } else if (state.step === 'idle' || state.step === 'encoded' || state.step === 'written') {
            log('Bit flip için önce veriyi belleğe yazıp okuyun.', 'warning');
        }
        return;
    }

    var result = Memory.flipBit(state.currentAddress, position);
    if (result.error) {
        log(result.error, 'error');
        return;
    }

    state.flippedBitPosition = position;
    state.step = 'flipped';

    // Bellekteki güncel veriyi oku ve grid'i güncelle
    state.currentEncodedBits = Memory.read(state.currentAddress);
    renderBitGrid(state.currentEncodedBits);
    highlightBit(position, 'error');
    renderMemoryView();

    var bitType = Hamming.isPowerOfTwo(position) ? 'Parity' : 'Data';
    log('⚡ Bit ' + position + ' flip edildi! (' + bitType + ' bit: ' +
        result.original + ' → ' + result.flipped + ')', 'error');
    log('"Detect & Correct" butonuna basarak hatayı tespit edin.', 'info');

    updateButtonStates();
}

function handleDetectCorrect() {
    if (!state.currentEncodedBits) {
        log('Tespit edilecek veri yok!', 'warning');
        return;
    }

    // Bellekten oku (flip edilmiş hali)
    var receivedBits = Memory.read(state.currentAddress);
    if (!receivedBits) {
        log('Bellekten okuma başarısız!', 'error');
        return;
    }

    // Syndrome hesapla
    var syndromeResult = Hamming.calculateSyndrome(receivedBits);

    if (syndromeResult.syndrome === 0) {
        log('Syndrome = 0 → Hata tespit edilmedi. Veri doğru!', 'success');
        state.step = 'corrected';
        updateButtonStates();
        return;
    }

    log('Syndrome = ' + syndromeResult.syndrome +
        ' → Hata pozisyon ' + syndromeResult.errorPosition + ' de tespit edildi!', 'warning');

    // Hatayı düzelt
    var correctedBits = Hamming.correctError(receivedBits, syndromeResult.errorPosition);

    // Düzeltilen veriyi belleğe geri yaz
    // Memory modülünde doğrudan güncelleme yok, flipBit ile geri çevir
    Memory.flipBit(state.currentAddress, syndromeResult.errorPosition);

    state.currentEncodedBits = Memory.read(state.currentAddress);
    state.step = 'corrected';

    // Grid'i güncelle
    renderBitGrid(state.currentEncodedBits);
    highlightBit(syndromeResult.errorPosition, 'corrected');
    renderMemoryView();

    log('✓ Pozisyon ' + syndromeResult.errorPosition + ' düzeltildi!', 'success');

    // Orijinal data ile karşılaştır
    var decodedData = Hamming.decode(state.currentEncodedBits);
    if (decodedData === state.currentDataBits) {
        log('✓ Doğrulama başarılı! Decoded data: ' + decodedData +
            ' = Orijinal data: ' + state.currentDataBits, 'success');
    } else {
        log('✗ Doğrulama başarısız. Decoded: ' + decodedData +
            ', Orijinal: ' + state.currentDataBits, 'error');
    }

    updateButtonStates();
}

function handleReset() {
    // State sıfırla
    state.currentDataBits = null;
    state.currentEncodedBits = null;
    state.currentAddress = null;
    state.flippedBitPosition = null;
    state.step = 'idle';

    // Memory sıfırla
    Memory.reset();

    // UI sıfırla
    dom.dataInput.value = '';
    dom.dataInput.classList.remove('valid', 'invalid');
    dom.inputValidity.textContent = '';
    dom.inputValidity.className = 'validity-indicator';

    dom.bitGridContainer.innerHTML =
        '<p class="placeholder-text">Henüz kodlanmış veri yok. Yukarıdan veri girin ve <strong>Encode</strong> butonuna basın.</p>';

    renderMemoryView();
    clearLog();
    log('Simülatör sıfırlandı. Hazır.', 'info');

    updateButtonStates();
}

// =============================================================
// BUTON DURUMU YÖNETİMİ
// =============================================================

function updateButtonStates() {
    // Tüm butonları başlangıçta disabled yap
    dom.btnEncode.disabled = true;
    dom.btnWrite.disabled = true;
    dom.btnRead.disabled = true;
    dom.btnDetect.disabled = true;
    // Reset her zaman aktif
    dom.btnReset.disabled = false;

    switch (state.step) {
        case 'idle':
            dom.btnEncode.disabled = false;
            break;
        case 'encoded':
            dom.btnEncode.disabled = false;
            dom.btnWrite.disabled = false;
            break;
        case 'written':
            dom.btnEncode.disabled = false;
            dom.btnRead.disabled = false;
            break;
        case 'read':
            dom.btnEncode.disabled = false;
            // Detect pasif — kullanıcı bit tıklamalı
            break;
        case 'flipped':
            dom.btnDetect.disabled = false;
            break;
        case 'corrected':
            // Sadece Reset aktif (yukarıda zaten ayarlandı)
            dom.btnEncode.disabled = false;
            break;
    }
}

// =============================================================
// GİRİŞ DOĞRULAMA UI
// =============================================================

function validateInputUI() {
    var input = dom.dataInput.value;

    // Boşsa nötr
    if (input.length === 0) {
        dom.dataInput.classList.remove('valid', 'invalid');
        dom.inputValidity.textContent = '';
        dom.inputValidity.className = 'validity-indicator';
        return;
    }

    var validation = Hamming.validateInput(input, state.currentBitLength);

    if (validation.valid) {
        dom.dataInput.classList.add('valid');
        dom.dataInput.classList.remove('invalid');
        dom.inputValidity.textContent = '✓';
        dom.inputValidity.className = 'validity-indicator valid';
    } else {
        dom.dataInput.classList.add('invalid');
        dom.dataInput.classList.remove('valid');

        // Geçersiz karakter mi yoksa uzunluk mu?
        if (!/^[01]*$/.test(input)) {
            dom.inputValidity.textContent = '✗ Geçersiz karakter';
        } else {
            dom.inputValidity.textContent = input.length + '/' + state.currentBitLength;
        }
        dom.inputValidity.className = 'validity-indicator invalid';
    }
}

// =============================================================
// BAŞLATMA (INITIALIZATION)
// =============================================================

function init() {
    cacheDomReferences();
    initEventListeners();
    renderMemoryView();
    updateButtonStates();
    log('Hamming ECC Simulator hazır. Bit uzunluğu seçin ve binary veri girin.', 'info');
}

document.addEventListener('DOMContentLoaded', init);
