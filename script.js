/* ================================================================
   JAVASCRIPT - CARTA DE AMOR
   Logica y funcionalidad de la pagina romantica

   NOTA: Todos los textos editables estan en config.js
   ================================================================ */

// ================================================================
// VARIABLES GLOBALES
// ================================================================
let clicks = 0;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let totalPrizes = parseInt(localStorage.getItem('totalPrizes') || '0');
let totalPoints = parseInt(localStorage.getItem('totalPoints') || '0');
let currentGamePoints = 0;
let claimedPrizes = JSON.parse(localStorage.getItem('claimedPrizes') || '[]');
let canFlip = true;
let isSpinning = false;
let currentRotation = 0;
let currentPhotoIndex = 0;
let surpriseRevealed = false;

// Variables para la ruleta con temporizador
let lastSpinTime = parseInt(localStorage.getItem('lastSpinTime') || '0');
let countdownInterval = null;
const SPIN_COOLDOWN = 5 * 24 * 60 * 60 * 1000; // 5 días en milisegundos

// Variables para Easter Eggs
let konamiIndex = 0;
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let titleClickCount = 0;
let titleClickTimer = null;
let heartHoldTimer = null;
let secretsUnlocked = {
    konami: false,
    tripleClick: false,
    heartHold: false,
    corner: false,
    clicks500: false
};

// ================================================================
// COMPATIBILIDAD - Variables antiguas para retrocompatibilidad
// ================================================================
const FECHA_ANIVERSARIO = CONFIG.fechaAniversario;
const MENSAJE_ANIVERSARIO = CONFIG.mensajeAniversario;
const PREMIOS_RULETA = CONFIG.ruleta.premios.map(p => ({ text: p.emoji, prize: p.premio }));
const EMOJIS_MEMORAMA = CONFIG.memorama.emojis;
const MENSAJES_CLICKS = CONFIG.mensajesClicks;

// Convertir fotos a formato con URL local
const FOTOS_GALERIA = CONFIG.galeria.fotos.map(foto => ({
    url: 'fotos/' + foto.archivo,
    caption: foto.caption
}));

// Variables del reproductor de musica
let audioPlayer = null;
let currentSongIndex = 0;
let isPlaying = false;
let musicPanelOpen = false;

// Variables del reproductor de videos
let currentVideoIndex = 0;

// Variables de la galería de fotos
let currentGalleryPage = 0;
const FOTOS_POR_PAGINA = 6;

// ================================================================
// FONDO DE CORAZONES ROMANTICOS
// ================================================================
function createHeartsBackground() {
    const container = document.getElementById('heartsBackground');
    if (!container) return;

    for (let i = 0; i < 25; i++) {
        const heart = document.createElement('div');
        heart.className = 'bg-heart';
        heart.innerHTML = ['&#10084;', '&#128149;', '&#128150;'][Math.floor(Math.random() * 3)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
        heart.style.animationDuration = (Math.random() * 15 + 10) + 's';
        heart.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(heart);
    }

    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'static-heart';
        heart.innerHTML = '&#10084;';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 60 + 30) + 'px';
        heart.style.animationDelay = (Math.random() * 4) + 's';
        container.appendChild(heart);
    }

    for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = (Math.random() * 8) + 's';
        container.appendChild(sparkle);
    }
}

// ================================================================
// CONTADOR DE TIEMPO JUNTOS
// ================================================================
const anniversaryDate = new Date(FECHA_ANIVERSARIO + 'T00:00:00');

function updateTimeTogether() {
    const now = new Date();
    const startDate = anniversaryDate;

    // Calcular diferencia total en milisegundos
    const totalMs = now - startDate;

    // Calcular años y meses de forma precisa
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();

    // Calcular horas, minutos y segundos transcurridos en el día actual
    let hours = now.getHours() - startDate.getHours();
    let minutes = now.getMinutes() - startDate.getMinutes();
    let seconds = now.getSeconds() - startDate.getSeconds();

    // Ajustar segundos negativos
    if (seconds < 0) {
        seconds += 60;
        minutes--;
    }

    // Ajustar minutos negativos
    if (minutes < 0) {
        minutes += 60;
        hours--;
    }

    // Ajustar horas negativas
    if (hours < 0) {
        hours += 24;
        days--;
    }

    // Ajustar días negativos
    if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
    }

    // Ajustar meses negativos
    if (months < 0) {
        years--;
        months += 12;
    }

    const yearsEl = document.getElementById('years');
    const monthsEl = document.getElementById('months');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (yearsEl) yearsEl.textContent = years.toString().padStart(2, '0');
    if (monthsEl) monthsEl.textContent = months.toString().padStart(2, '0');
    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');

    const isAnniversaryDay = now.getMonth() === startDate.getMonth() && now.getDate() === startDate.getDate();
    const anniversaryMessage = document.getElementById('anniversaryMessage');
    const subtitle = document.getElementById('countdownSubtitle');

    if (isAnniversaryDay) {
        if (anniversaryMessage) anniversaryMessage.style.display = 'block';
        if (subtitle) subtitle.innerHTML = 'Feliz Aniversario! ' + years + ' anio' + (years !== 1 ? 's' : '') + ' juntos!';

        if (!window.anniversaryCelebration) {
            window.anniversaryCelebration = true;
            celebrateAnniversary();
        }
    } else {
        if (anniversaryMessage) anniversaryMessage.style.display = 'none';
        if (subtitle) {
            const fechaFormateada = startDate.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            subtitle.textContent = 'Desde el ' + fechaFormateada + '...';
        }
    }
}

function celebrateAnniversary() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-explosion';
            heart.innerHTML = ['&#10084;', '&#128149;', '&#128150;', '&#128151;', '&#128157;', '&#128152;', '&#128159;'][Math.floor(Math.random() * 7)];
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = Math.random() * window.innerHeight + 'px';
            heart.style.setProperty('--tx', (Math.random() - 0.5) * 300 + 'px');
            heart.style.setProperty('--ty', (Math.random() - 0.5) * 300 + 'px');
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 1000);
        }, i * 100);
    }
}

// ================================================================
// CARTA ANIMADA A PANTALLA COMPLETA
// ================================================================
function openLetter() {
    const letterModal = document.getElementById('letterModal');
    if (letterModal) {
        letterModal.classList.add('show');
        document.body.style.overflow = 'hidden';

        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart-explosion';
                heart.innerHTML = '&#128149;';
                heart.style.left = '50%';
                heart.style.top = '50%';
                heart.style.setProperty('--tx', (Math.random() - 0.5) * 400 + 'px');
                heart.style.setProperty('--ty', (Math.random() - 0.5) * 400 + 'px');
                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 1000);
            }, i * 50);
        }
    }
}

function closeLetter() {
    const letterModal = document.getElementById('letterModal');
    if (letterModal) {
        letterModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// ================================================================
// JUEGO MEMORAMA
// ================================================================
function initMemorama() {
    const totalPrizesEl = document.getElementById('totalPrizes');
    const totalPointsEl = document.getElementById('totalPoints');
    if (totalPrizesEl) totalPrizesEl.textContent = totalPrizes;
    if (totalPointsEl) totalPointsEl.textContent = totalPoints;
    createMemorama();
    createPrizesTable();
}

function createMemorama() {
    const grid = document.getElementById('memoramaGrid');
    if (!grid) return;

    grid.innerHTML = '';

    // Usar las primeras 8 fotos de la galería para el memorama
    const fotosParaMemorama = FOTOS_GALERIA.slice(0, 8).map(foto => foto.url);

    // Si no hay suficientes fotos, usar emojis como respaldo
    let items;
    if (fotosParaMemorama.length >= 8) {
        items = fotosParaMemorama;
    } else {
        items = EMOJIS_MEMORAMA;
    }

    // Duplicar y mezclar las cartas
    cards = [...items, ...items].sort(() => Math.random() - 0.5);

    cards.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'memo-card';

        // Verificar si es una foto (URL) o un emoji
        const isPhoto = item.startsWith('fotos/');

        if (isPhoto) {
            card.innerHTML = `
                <div class="memo-front">?</div>
                <div class="memo-back memo-back-photo">
                    <img src="${item}" alt="Foto" onerror="this.parentElement.innerHTML='&#128149;'">
                </div>
            `;
        } else {
            card.innerHTML = '<div class="memo-front">?</div><div class="memo-back">' + item + '</div>';
        }

        card.dataset.index = index;
        card.dataset.emoji = item;
        card.addEventListener('click', () => flipCard(card));
        grid.appendChild(card);
    });

    matchedPairs = 0;
    attempts = 0;
    flippedCards = [];
    canFlip = true;
    currentGamePoints = 0;
    updateStats();
}

function flipCard(card) {
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        attempts++;
        updateStats();
        canFlip = false;
        setTimeout(() => checkMatch(), 800);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;

        // Calcular puntos por pareja encontrada
        const pointsPerPair = Math.floor(CONFIG.memorama.puntosBase / 8);
        currentGamePoints += pointsPerPair;

        updateStats();

        if (matchedPairs === 8) {
            setTimeout(() => calculateAndShowPrize(), 500);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }

    flippedCards = [];
    canFlip = true;
}

function updateStats() {
    const attemptsEl = document.getElementById('attempts');
    const pairsEl = document.getElementById('pairs');
    const currentGamePointsEl = document.getElementById('currentGamePoints');
    if (attemptsEl) attemptsEl.textContent = attempts;
    if (pairsEl) pairsEl.textContent = matchedPairs;
    if (currentGamePointsEl) currentGamePointsEl.textContent = currentGamePoints;
}

function resetMemorama() {
    createMemorama();
}

function calculateAndShowPrize() {
    // Calcular bono por pocos intentos
    const maxBonus = CONFIG.memorama.bonusPorIntento * CONFIG.memorama.maxIntentosBono;
    let bonus = 0;

    if (attempts <= CONFIG.memorama.maxIntentosBono) {
        bonus = (CONFIG.memorama.maxIntentosBono - attempts) * CONFIG.memorama.bonusPorIntento;
    }

    currentGamePoints += bonus;
    totalPoints += currentGamePoints;

    // Guardar puntos
    localStorage.setItem('totalPoints', totalPoints);

    // Actualizar UI
    const totalPointsEl = document.getElementById('totalPoints');
    if (totalPointsEl) totalPointsEl.textContent = totalPoints;

    // Actualizar tabla de premios
    updatePrizesTable();

    showPrizeWithBonus(bonus);
}

function showPrizeWithBonus(bonus) {
    const prizeCodeEl = document.getElementById('prizeCode');
    const prizeModal = document.getElementById('prizeModal');
    const prizeText = document.querySelector('.prize-text');

    // Determinar qué premios se desbloquearon
    const unlockedPrizes = CONFIG.memorama.premiosPorPuntos.filter(p =>
        totalPoints >= p.puntos && !claimedPrizes.includes(p.puntos)
    );

    let message = `Ganaste ${currentGamePoints} puntos!`;
    if (bonus > 0) {
        message += ` (Bono: +${bonus} por ${attempts} intentos)`;
    }
    message += `\n\nPuntos totales: ${totalPoints}`;

    if (unlockedPrizes.length > 0) {
        message += `\n\n¡Tienes ${unlockedPrizes.length} premio(s) disponible(s)!`;
    }

    if (prizeText) prizeText.textContent = message;
    if (prizeCodeEl) prizeCodeEl.textContent = 'PUNTOS-' + currentGamePoints;
    if (prizeModal) prizeModal.style.display = 'flex';
}

function closePrizeModal() {
    const prizeModal = document.getElementById('prizeModal');
    if (prizeModal) prizeModal.style.display = 'none';
}

// ================================================================
// FUNCIONES DE PREMIOS POR PUNTOS
// ================================================================
function togglePrizesTable() {
    const table = document.getElementById('prizesTable');
    if (table) {
        table.style.display = table.style.display === 'none' ? 'block' : 'none';
    }
}

function createPrizesTable() {
    const prizesList = document.getElementById('prizesList');
    if (!prizesList) return;

    prizesList.innerHTML = CONFIG.memorama.premiosPorPuntos.map(prize => {
        const isClaimed = claimedPrizes.includes(prize.puntos);
        const isUnlocked = totalPoints >= prize.puntos && !isClaimed;
        const status = isClaimed ? 'claimed' : (isUnlocked ? 'unlocked' : '');

        return `
            <div class="prize-item ${status}" data-points="${prize.puntos}">
                <div class="prize-emoji">${prize.emoji}</div>
                <div class="prize-points">${prize.puntos} puntos</div>
                <div class="prize-description">${prize.premio}</div>
                <div class="prize-status ${isClaimed ? 'claimed' : (isUnlocked ? 'available' : '')}">
                    ${isClaimed ? '💝 Canjeado' : (isUnlocked ? '✨ ¡Disponible!' : `Te faltan ${prize.puntos - totalPoints} pts`)}
                </div>
                ${isUnlocked && !isClaimed ? `<button class="memo-btn" style="margin-top: 10px; padding: 8px 15px; font-size: 0.85em;" onclick="claimPrize(${prize.puntos})">Canjear</button>` : ''}
            </div>
        `;
    }).join('');
}

function updatePrizesTable() {
    createPrizesTable();
}

function claimPrize(points) {
    if (totalPoints < points) return;
    if (claimedPrizes.includes(points)) return;

    claimedPrizes.push(points);
    localStorage.setItem('claimedPrizes', JSON.stringify(claimedPrizes));

    const prize = CONFIG.memorama.premiosPorPuntos.find(p => p.puntos === points);

    // Mostrar modal de premio canjeado
    const prizeCodeEl = document.getElementById('prizeCode');
    const prizeModal = document.getElementById('prizeModal');
    const prizeText = document.querySelector('.prize-text');

    if (prizeText) prizeText.textContent = `¡Premio canjeado!\n\n${prize.emoji} ${prize.premio}\n\nMuestra este código para reclamar tu premio:`;
    if (prizeCodeEl) prizeCodeEl.textContent = 'PREMIO-' + Date.now().toString().slice(-6);
    if (prizeModal) prizeModal.style.display = 'flex';

    updatePrizesTable();

    // Celebración
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-explosion';
            heart.innerHTML = prize.emoji;
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = Math.random() * window.innerHeight + 'px';
            heart.style.setProperty('--tx', (Math.random() - 0.5) * 300 + 'px');
            heart.style.setProperty('--ty', (Math.random() - 0.5) * 300 + 'px');
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 1000);
        }, i * 50);
    }
}

// ================================================================
// RULETA DEL AMOR
// ================================================================
const colors = [
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3',
    '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA'
];

function createRoulette() {
    const wheel = document.getElementById('rouletteWheel');
    if (!wheel) return;

    wheel.innerHTML = '';

    // Crear los emojis posicionados en cada sección de 45 grados
    PREMIOS_RULETA.forEach((option, i) => {
        const section = document.createElement('div');
        section.className = 'wheel-section';

        const span = document.createElement('span');
        span.innerHTML = option.text;

        // Calcular la posición del emoji en el centro de cada sección
        // Cada sección es de 45 grados, empezando desde arriba
        const angle = (i * 45 + 22.5) * (Math.PI / 180); // Convertir a radianes
        const radius = 35; // Porcentaje desde el centro

        // Calcular posición X e Y
        const x = 50 + radius * Math.sin(angle);
        const y = 50 - radius * Math.cos(angle);

        span.style.left = x + '%';
        span.style.top = y + '%';
        span.style.transform = 'translate(-50%, -50%) rotate(' + (i * 45 + 22.5) + 'deg)';

        section.appendChild(span);
        wheel.appendChild(section);
    });
}

function spinRoulette() {
    // Verificar si puede girar
    const now = Date.now();
    const timeSinceLastSpin = now - lastSpinTime;

    if (timeSinceLastSpin < SPIN_COOLDOWN) {
        // No puede girar aún, mostrar mensaje con animación
        const rouletteResult = document.getElementById('rouletteResult');
        const spinBtn = document.getElementById('spinBtn');

        if (rouletteResult) {
            rouletteResult.innerHTML = '<div style="color: rgba(255,255,255,0.95); animation: fadeIn 0.3s;">⏰ Debes esperar 5 días entre giros.<br><span style="font-size: 0.9em; opacity: 0.8;">Revisa la cuenta regresiva arriba ⬆️</span></div>';
        }

        // Efecto de sacudida en el botón
        if (spinBtn) {
            spinBtn.style.animation = 'shake 0.5s';
            setTimeout(() => { spinBtn.style.animation = ''; }, 500);
        }

        return;
    }

    if (isSpinning) return;

    isSpinning = true;
    const spinBtn = document.getElementById('spinBtn');
    const rouletteResult = document.getElementById('rouletteResult');

    if (spinBtn) spinBtn.disabled = true;
    if (rouletteResult) rouletteResult.textContent = 'Girando...';

    const spins = 5 + Math.random() * 3;
    const extraDegrees = Math.random() * 360;
    const totalRotation = spins * 360 + extraDegrees;

    currentRotation += totalRotation;

    const wheel = document.getElementById('rouletteWheel');
    if (wheel) wheel.style.transform = 'rotate(' + currentRotation + 'deg)';

    setTimeout(() => {
        const normalizedRotation = currentRotation % 360;
        const sectionAngle = 360 / PREMIOS_RULETA.length;
        const index = Math.floor((360 - normalizedRotation + sectionAngle/2) / sectionAngle) % PREMIOS_RULETA.length;

        const result = PREMIOS_RULETA[index];
        if (rouletteResult) {
            rouletteResult.innerHTML = '<div><div style="font-size: 2em; margin-bottom: 10px;">' + result.text + '</div><div>' + result.prize + '</div></div>';
        }

        isSpinning = false;
        if (spinBtn) spinBtn.disabled = false;

        // Guardar el tiempo del giro
        lastSpinTime = Date.now();
        localStorage.setItem('lastSpinTime', lastSpinTime);

        // Iniciar cuenta regresiva para el próximo giro
        updateRouletteCountdown();

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart-explosion';
                heart.innerHTML = ['&#10084;', '&#128149;', '&#128150;', '&#128151;', '&#128157;'][Math.floor(Math.random() * 5)];
                heart.style.left = Math.random() * window.innerWidth + 'px';
                heart.style.top = '50%';
                heart.style.setProperty('--tx', (Math.random() - 0.5) * 300 + 'px');
                heart.style.setProperty('--ty', (Math.random() - 0.5) * 300 + 'px');
                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 1000);
            }, i * 50);
        }
    }, 4000);
}

// ================================================================
// FUNCIONES DE CUENTA REGRESIVA DE LA RULETA
// ================================================================
function updateRouletteCountdown() {
    const now = Date.now();
    const timeSinceLastSpin = now - lastSpinTime;
    const timeRemaining = SPIN_COOLDOWN - timeSinceLastSpin;

    const countdownDiv = document.getElementById('rouletteCountdown');
    const spinBtn = document.getElementById('spinBtn');
    const rouletteResult = document.getElementById('rouletteResult');

    if (timeRemaining <= 0) {
        // Ya puede girar de nuevo
        if (countdownDiv) countdownDiv.style.display = 'none';
        if (spinBtn) {
            spinBtn.disabled = false;
            spinBtn.style.opacity = '1';
        }
        if (rouletteResult) rouletteResult.textContent = 'Presiona el botón para girar!';
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        return;
    }

    // Mostrar cuenta regresiva
    if (countdownDiv) countdownDiv.style.display = 'block';
    if (spinBtn) {
        spinBtn.disabled = true;
        spinBtn.style.opacity = '0.6';
    }

    // Calcular tiempo restante
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Actualizar elementos del DOM
    const daysEl = document.getElementById('daysLeft');
    const hoursEl = document.getElementById('hoursLeft');
    const minutesEl = document.getElementById('minutesLeft');
    const secondsEl = document.getElementById('secondsLeft');

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');

    if (rouletteResult) {
        rouletteResult.innerHTML = '<div style="opacity: 0.8;">💕 La ruleta estará disponible pronto...</div>';
    }
}

function initRouletteCountdown() {
    // Verificar estado inicial
    updateRouletteCountdown();

    // Actualizar cada segundo
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(updateRouletteCountdown, 1000);
}

// ================================================================
// CORAZONES FLOTANTES
// ================================================================
function createFloatingHearts() {
    const container = document.getElementById('hearts-container');
    if (!container) return;

    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-bg';
            heart.innerHTML = ['&#10084;', '&#128149;', '&#128150;'][Math.floor(Math.random() * 3)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (Math.random() * 5 + 8) + 's';
            heart.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(heart);
            setTimeout(() => heart.remove(), 15000);
        }, i * 1500);
    }
}

// ================================================================
// CONTADOR DE CLICKS EN EL CORAZON (MEJORADO)
// ================================================================
function clickHeart() {
    clicks++;

    // Actualizar el contador visual mejorado
    const clickNumber = document.getElementById('clickNumber');
    const clickCount = document.getElementById('clickCount');
    if (clickNumber) clickNumber.textContent = clicks;
    if (clickCount) clickCount.textContent = clicks;

    // Actualizar barra de progreso
    updateClickProgress();

    const heart = document.getElementById('mainHeart');
    if (!heart) return;

    // Efecto de click
    heart.classList.add('clicked');
    setTimeout(() => heart.classList.remove('clicked'), 200);

    const rect = heart.getBoundingClientRect();

    // Crear explosion de corazones
    for (let i = 0; i < 8; i++) {
        const explosion = document.createElement('div');
        explosion.className = 'heart-explosion';
        explosion.innerHTML = '&#128149;';
        explosion.style.left = rect.left + rect.width/2 + 'px';
        explosion.style.top = rect.top + rect.height/2 + 'px';

        const angle = (i / 8) * Math.PI * 2;
        const distance = 100 + Math.random() * 50;
        explosion.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        explosion.style.setProperty('--ty', Math.sin(angle) * distance + 'px');

        document.body.appendChild(explosion);
        setTimeout(() => explosion.remove(), 1000);
    }

    // Crear particulas magicas ocasionalmente
    if (Math.random() > 0.7) {
        createMagicParticles(rect.left + rect.width/2, rect.top + rect.height/2);
    }

    // Mostrar mensajes especiales con popup mejorado
    if (MENSAJES_CLICKS[clicks]) {
        showAchievementPopup(MENSAJES_CLICKS[clicks], getEmojiForClicks(clicks));
    }

    // Easter egg de 500 clicks
    if (clicks === 500 && !secretsUnlocked.clicks500) {
        secretsUnlocked.clicks500 = true;
        triggerSecretUnlock('500 clicks', '500 CLICKS! Encontraste el easter egg secreto! Te amo infinito!');
    }
}

function updateClickProgress() {
    const progressBar = document.getElementById('clickProgressBar');
    const milestone = document.getElementById('nextMilestone');

    if (!progressBar) return;

    // Encontrar el siguiente milestone
    const milestones = Object.keys(MENSAJES_CLICKS).map(Number).sort((a, b) => a - b);
    let nextMilestone = milestones.find(m => m > clicks) || milestones[milestones.length - 1];
    let prevMilestone = milestones.filter(m => m <= clicks).pop() || 0;

    // Calcular progreso
    const progress = ((clicks - prevMilestone) / (nextMilestone - prevMilestone)) * 100;
    progressBar.style.width = Math.min(progress, 100) + '%';

    if (milestone) {
        if (clicks >= milestones[milestones.length - 1]) {
            milestone.textContent = 'Todos los logros desbloqueados!';
        } else {
            milestone.textContent = 'Siguiente: ' + nextMilestone + ' clicks';
        }
    }
}

function getEmojiForClicks(count) {
    if (count >= 500) return '&#128140;';
    if (count >= 100) return '&#128142;';
    if (count >= 50) return '&#128159;';
    return '&#128149;';
}

function showAchievementPopup(message, emoji) {
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = '<span class="achievement-emoji">' + emoji + '</span>' + message;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('hide');
        setTimeout(() => popup.remove(), 300);
    }, 4500); // Duración extendida: 4.5 segundos
}

function createMagicParticles(x, y) {
    const colors = ['#f5576c', '#f093fb', '#667eea', '#FFD700', '#FF69B4'];
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'magic-particle';
        particle.style.left = x + (Math.random() - 0.5) * 50 + 'px';
        particle.style.top = y + (Math.random() - 0.5) * 50 + 'px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

// ================================================================
// BOTON SORPRESA
// ================================================================
function revealSurprise() {
    if (!surpriseRevealed) {
        const hiddenMessage = document.getElementById('hiddenMessage');
        if (hiddenMessage) hiddenMessage.style.display = 'block';
        surpriseRevealed = true;

        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart-explosion';
                heart.innerHTML = ['&#10084;', '&#128149;', '&#128150;', '&#128151;', '&#128157;'][Math.floor(Math.random() * 5)];
                heart.style.left = Math.random() * window.innerWidth + 'px';
                heart.style.top = '0px';
                heart.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
                heart.style.setProperty('--ty', Math.random() * 300 + 200 + 'px');
                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 1000);
            }, i * 50);
        }
    }
}

// ================================================================
// GALERIA DE FOTOS CON PAGINACION
// ================================================================
function createGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (FOTOS_GALERIA.length === 0) {
        for (let i = 0; i < 6; i++) {
            const placeholder = document.createElement('div');
            placeholder.className = 'gallery-item';
            placeholder.innerHTML = '<div class="gallery-placeholder">&#128444;<span>Agrega tu foto</span></div>';
            grid.appendChild(placeholder);
        }
        updateGalleryNavigation();
        return;
    }

    // Calcular fotos a mostrar en la página actual
    const startIndex = currentGalleryPage * FOTOS_POR_PAGINA;
    const endIndex = Math.min(startIndex + FOTOS_POR_PAGINA, FOTOS_GALERIA.length);
    const fotosActuales = FOTOS_GALERIA.slice(startIndex, endIndex);

    fotosActuales.forEach((foto, i) => {
        const realIndex = startIndex + i;
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.onclick = () => openPhotoModal(realIndex);

        // Crear la imagen con manejo de error mejorado
        const img = document.createElement('img');
        img.src = foto.url;
        img.alt = foto.caption;
        img.loading = 'lazy';
        img.onerror = function() {
            this.parentElement.innerHTML = `
                <div class="gallery-placeholder">
                    &#128444;
                    <span style="font-size: 0.5em; margin-top: 5px;">${foto.caption}</span>
                    <span style="font-size: 0.3em; opacity: 0.6;">Pon la foto en /fotos/</span>
                </div>
            `;
        };

        const caption = document.createElement('div');
        caption.className = 'gallery-caption';
        caption.textContent = foto.caption;

        item.appendChild(img);
        item.appendChild(caption);
        grid.appendChild(item);
    });

    updateGalleryNavigation();
}

// Cambiar página de la galería
function changeGalleryPage(direction) {
    const totalPages = Math.ceil(FOTOS_GALERIA.length / FOTOS_POR_PAGINA);
    currentGalleryPage += direction;

    // Navegación circular
    if (currentGalleryPage < 0) {
        currentGalleryPage = totalPages - 1;
    } else if (currentGalleryPage >= totalPages) {
        currentGalleryPage = 0;
    }

    createGallery();
}

// Ir a una página específica
function goToGalleryPage(page) {
    currentGalleryPage = page;
    createGallery();
}

// Actualizar indicadores de navegación
function updateGalleryNavigation() {
    const totalPages = Math.ceil(FOTOS_GALERIA.length / FOTOS_POR_PAGINA) || 1;

    // Actualizar texto de página
    const currentPageEl = document.getElementById('currentGalleryPage');
    const totalPagesEl = document.getElementById('totalGalleryPages');
    if (currentPageEl) currentPageEl.textContent = currentGalleryPage + 1;
    if (totalPagesEl) totalPagesEl.textContent = totalPages;

    // Mostrar/ocultar flechas si solo hay una página
    const prevBtn = document.getElementById('prevGalleryBtn');
    const nextBtn = document.getElementById('nextGalleryBtn');
    const navContainer = document.querySelector('.gallery-navigation');

    if (navContainer) {
        navContainer.style.display = totalPages > 1 ? 'flex' : 'none';
    }

    // Crear puntos indicadores
    const dotsContainer = document.getElementById('galleryDots');
    if (dotsContainer) {
        if (totalPages > 1) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('span');
                dot.className = 'gallery-dot' + (i === currentGalleryPage ? ' active' : '');
                dot.onclick = () => goToGalleryPage(i);
                dotsContainer.appendChild(dot);
            }
            dotsContainer.style.display = 'flex';
        } else {
            dotsContainer.style.display = 'none';
        }
    }
}

function openPhotoModal(index) {
    currentPhotoIndex = index;
    const modal = document.getElementById('photoModal');
    const img = document.getElementById('modalPhoto');
    const caption = document.getElementById('modalCaption');

    if (modal && img && caption && FOTOS_GALERIA[index]) {
        img.src = FOTOS_GALERIA[index].url;
        caption.textContent = FOTOS_GALERIA[index].caption;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

function nextPhoto() {
    if (FOTOS_GALERIA.length === 0) return;
    currentPhotoIndex = (currentPhotoIndex + 1) % FOTOS_GALERIA.length;
    updateModalPhoto();
}

function prevPhoto() {
    if (FOTOS_GALERIA.length === 0) return;
    currentPhotoIndex = (currentPhotoIndex - 1 + FOTOS_GALERIA.length) % FOTOS_GALERIA.length;
    updateModalPhoto();
}

function updateModalPhoto() {
    const img = document.getElementById('modalPhoto');
    const caption = document.getElementById('modalCaption');

    if (img && caption && FOTOS_GALERIA[currentPhotoIndex]) {
        img.style.opacity = '0';
        setTimeout(() => {
            img.src = FOTOS_GALERIA[currentPhotoIndex].url;
            caption.textContent = FOTOS_GALERIA[currentPhotoIndex].caption;
            img.style.opacity = '1';
        }, 150);
    }
}

// ================================================================
// EASTER EGGS Y SECRETOS
// ================================================================

// Easter Egg 1: Codigo Konami
function initKonamiCode() {
    if (!CONFIG.secretos.konamiActivo) return;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                konamiIndex = 0;
                if (!secretsUnlocked.konami) {
                    secretsUnlocked.konami = true;
                    triggerKonamiCode();
                }
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function triggerKonamiCode() {
    const title = document.querySelector('h1');
    if (title) title.classList.add('rainbow-title');

    triggerSecretUnlock('Konami', CONFIG.secretos.mensajeKonami);

    // Lluvia de corazones
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-rain';
            heart.innerHTML = ['&#10084;', '&#128149;', '&#128150;', '&#128151;', '&#128159;'][Math.floor(Math.random() * 5)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 5000);
        }, i * 100);
    }
}

// Easter Egg 2: Triple click en el titulo
function initTitleSecret() {
    if (!CONFIG.secretos.tripleClickTitulo) return;

    const title = document.querySelector('h1');
    if (!title) return;

    title.addEventListener('click', () => {
        titleClickCount++;

        if (titleClickTimer) clearTimeout(titleClickTimer);

        titleClickTimer = setTimeout(() => {
            titleClickCount = 0;
        }, 500);

        if (titleClickCount >= 3 && !secretsUnlocked.tripleClick) {
            secretsUnlocked.tripleClick = true;
            triggerSecretUnlock('Triple Click', CONFIG.secretos.mensajeTripleClick);

            // Efecto especial en el titulo
            title.style.transform = 'scale(1.2)';
            setTimeout(() => title.style.transform = '', 500);
        }
    });
}

// Easter Egg 3: Mantener presionado el corazon
function initHeartHoldSecret() {
    if (!CONFIG.secretos.corazonSecreto) return;

    const heart = document.getElementById('mainHeart');
    if (!heart) return;

    heart.addEventListener('mousedown', () => {
        heartHoldTimer = setTimeout(() => {
            if (!secretsUnlocked.heartHold) {
                secretsUnlocked.heartHold = true;
                heart.classList.add('super-heartbeat');
                triggerSecretUnlock('Corazon Secreto', CONFIG.secretos.mensajeCorazonSecreto);

                // Corazones orbitando
                for (let i = 0; i < 5; i++) {
                    const orbitHeart = document.createElement('span');
                    orbitHeart.className = 'orbiting-heart';
                    orbitHeart.innerHTML = '&#128149;';
                    orbitHeart.style.animationDelay = (i * 0.6) + 's';
                    heart.parentElement.style.position = 'relative';
                    heart.parentElement.appendChild(orbitHeart);
                }
            }
        }, 3000);
    });

    heart.addEventListener('mouseup', () => {
        if (heartHoldTimer) clearTimeout(heartHoldTimer);
    });

    heart.addEventListener('mouseleave', () => {
        if (heartHoldTimer) clearTimeout(heartHoldTimer);
    });
}

// Easter Egg 4: Esquina secreta
function initSecretCorner() {
    if (!CONFIG.secretos.esquinaSecreta) return;

    const corner = document.createElement('div');
    corner.className = 'secret-corner';
    document.body.appendChild(corner);

    corner.addEventListener('click', () => {
        if (!secretsUnlocked.corner) {
            secretsUnlocked.corner = true;
            triggerSecretUnlock('Esquina Secreta', CONFIG.secretos.mensajeEsquina);
        }
    });
}

// Funcion para mostrar que se desbloqueo un secreto
function triggerSecretUnlock(secretName, message) {
    // Efecto visual de desbloqueo
    const unlockEffect = document.createElement('div');
    unlockEffect.className = 'unlock-effect';
    document.body.appendChild(unlockEffect);
    setTimeout(() => unlockEffect.remove(), 1000);

    // Popup con mensaje
    showAchievementPopup(message, '&#128150;');

    // Guardar en localStorage
    localStorage.setItem('secrets_' + secretName, 'true');

    console.log('Secreto desbloqueado: ' + secretName);
}

// ================================================================
// REPRODUCTOR DE MUSICA
// ================================================================
function initMusicPlayer() {
    audioPlayer = document.getElementById('audioPlayer');
    if (!audioPlayer) return;

    const canciones = CONFIG.musica.canciones;
    if (canciones.length === 0) return;

    // Crear playlist visual
    const playlistContainer = document.getElementById('musicPlaylist');
    if (playlistContainer) {
        playlistContainer.innerHTML = canciones.map((cancion, index) => `
            <div class="music-playlist-item ${index === 0 ? 'active' : ''}" onclick="playSong(${index})">
                <span class="item-number">${index + 1}</span>
                <span>${cancion.titulo}</span>
            </div>
        `).join('');
    }

    // Configurar eventos del audio
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', handleSongEnd);
    audioPlayer.addEventListener('loadedmetadata', updateTotalTime);

    // Cargar primera cancion
    loadSong(0);
}

function toggleMusicPanel() {
    const panel = document.getElementById('musicPanel');
    const toggle = document.getElementById('musicToggle');

    if (panel) {
        musicPanelOpen = !musicPanelOpen;
        panel.classList.toggle('show', musicPanelOpen);
    }
}

function loadSong(index) {
    const canciones = CONFIG.musica.canciones;
    if (index < 0 || index >= canciones.length) return;

    currentSongIndex = index;
    const cancion = canciones[index];

    // Actualizar audio source
    if (audioPlayer) {
        audioPlayer.src = 'musica/' + cancion.archivo;
        audioPlayer.load();
    }

    // Actualizar UI
    const titleEl = document.getElementById('songTitle');
    const artistEl = document.getElementById('songArtist');

    if (titleEl) titleEl.textContent = cancion.titulo;
    if (artistEl) artistEl.textContent = cancion.artista;

    // Actualizar playlist activa
    const playlistItems = document.querySelectorAll('.music-playlist-item');
    playlistItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    // Resetear progreso
    const progressFill = document.getElementById('progressFill');
    if (progressFill) progressFill.style.width = '0%';

    const currentTimeEl = document.getElementById('currentTime');
    if (currentTimeEl) currentTimeEl.textContent = '0:00';
}

function playSong(index) {
    loadSong(index);
    if (audioPlayer) {
        audioPlayer.play().then(() => {
            isPlaying = true;
            updatePlayButton();
        }).catch(e => console.log('Error al reproducir:', e));
    }
}

function togglePlay() {
    if (!audioPlayer) return;

    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
    } else {
        audioPlayer.play().then(() => {
            isPlaying = true;
        }).catch(e => console.log('Error al reproducir:', e));
    }
    updatePlayButton();
}

function updatePlayButton() {
    const playBtn = document.getElementById('playBtn');
    const disc = document.getElementById('musicDisc');
    const toggleBtn = document.getElementById('musicToggle');

    if (playBtn) {
        // Cambiar símbolo: ⏸ (pausa) o ▶ (play)
        playBtn.innerHTML = isPlaying ? '&#9208;' : '&#9654;';
        // Agregar/quitar clase playing para el efecto visual
        playBtn.classList.toggle('playing', isPlaying);
    }
    if (disc) {
        disc.classList.toggle('spinning', isPlaying);
    }
    if (toggleBtn) {
        toggleBtn.classList.toggle('playing', isPlaying);
    }
}

function prevSong() {
    const canciones = CONFIG.musica.canciones;
    let newIndex = currentSongIndex - 1;
    if (newIndex < 0) newIndex = canciones.length - 1;
    playSong(newIndex);
}

function nextSong() {
    const canciones = CONFIG.musica.canciones;
    let newIndex = currentSongIndex + 1;
    if (newIndex >= canciones.length) newIndex = 0;
    playSong(newIndex);
}

function updateProgress() {
    if (!audioPlayer || !audioPlayer.duration) return;

    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    const progressFill = document.getElementById('progressFill');
    if (progressFill) progressFill.style.width = percent + '%';

    const currentTimeEl = document.getElementById('currentTime');
    if (currentTimeEl) currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
}

function updateTotalTime() {
    if (!audioPlayer) return;
    const totalTimeEl = document.getElementById('totalTime');
    if (totalTimeEl) totalTimeEl.textContent = formatTime(audioPlayer.duration);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + secs.toString().padStart(2, '0');
}

function seekMusic(event) {
    if (!audioPlayer || !audioPlayer.duration) return;

    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
}

function handleSongEnd() {
    if (CONFIG.musica.loop) {
        nextSong();
    } else {
        isPlaying = false;
        updatePlayButton();
    }
}

// ================================================================
// VIDEO DE RECUERDOS
// ================================================================
function initVideo() {
    const video = document.getElementById('mainVideo');
    const container = document.getElementById('videoContainer');

    if (!video || !container) return;

    const videoConfig = CONFIG.video;
    const videos = videoConfig.videos || [];

    if (videos.length === 0) {
        container.innerHTML = `
            <div class="video-placeholder">
                <div class="video-placeholder-icon">&#127910;</div>
                <p>${videoConfig.mensajeSinVideo}</p>
                <p style="font-size: 0.8em; margin-top: 10px; opacity: 0.7;">
                    Pon tus videos en la carpeta /videos/
                </p>
            </div>
        `;
        return;
    }

    // Actualizar título de la sección
    const titleEl = document.getElementById('videoTitle');
    if (titleEl) titleEl.textContent = videoConfig.tituloSeccion;

    // Actualizar total de videos
    const totalVideosEl = document.getElementById('totalVideos');
    if (totalVideosEl) totalVideosEl.textContent = videos.length;

    // Crear miniaturas
    createVideoThumbnails();

    // Cargar primer video
    loadVideo(0);

    // Configurar controles
    video.controls = videoConfig.mostrarControles;
    video.loop = videoConfig.loop;
    video.muted = videoConfig.autoplay;

    if (videoConfig.autoplay) {
        video.autoplay = true;
    }
}

function createVideoThumbnails() {
    const thumbnailsContainer = document.getElementById('videoThumbnails');
    if (!thumbnailsContainer) return;

    const videos = CONFIG.video.videos || [];

    thumbnailsContainer.innerHTML = videos.map((vid, index) => `
        <div class="video-thumbnail ${index === 0 ? 'active' : ''}" onclick="loadVideo(${index})" data-index="${index}">
            <span class="video-thumbnail-number">${index + 1}</span>
            &#127909;
        </div>
    `).join('');
}

function loadVideo(index) {
    const videos = CONFIG.video.videos || [];
    if (index < 0 || index >= videos.length) return;

    currentVideoIndex = index;
    const videoData = videos[index];
    const video = document.getElementById('mainVideo');
    const container = document.getElementById('videoContainer');

    if (!video) return;

    // Actualizar source del video
    const source = video.querySelector('source');
    if (source) {
        source.src = 'videos/' + videoData.archivo;
        video.load();
    }

    // Actualizar título y subtítulo
    const subtitleEl = document.getElementById('videoSubtitle');
    if (subtitleEl) subtitleEl.textContent = `${videoData.titulo} - ${videoData.subtitulo}`;

    // Actualizar indicador
    const currentVideoNum = document.getElementById('currentVideoNum');
    if (currentVideoNum) currentVideoNum.textContent = index + 1;

    // Actualizar miniaturas
    const thumbnails = document.querySelectorAll('.video-thumbnail');
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });

    // Actualizar botones de navegación
    updateVideoNavButtons();

    // Manejar error de carga
    video.addEventListener('error', function() {
        container.innerHTML = `
            <div class="video-placeholder">
                <div class="video-placeholder-icon">&#127910;</div>
                <p>Video no encontrado: ${videoData.archivo}</p>
                <p style="font-size: 0.8em; margin-top: 10px; opacity: 0.7;">
                    Pon el video en la carpeta /videos/
                </p>
            </div>
        `;
    });
}

function changeVideo(direction) {
    const videos = CONFIG.video.videos || [];
    let newIndex = currentVideoIndex + direction;

    if (newIndex < 0) newIndex = videos.length - 1;
    if (newIndex >= videos.length) newIndex = 0;

    loadVideo(newIndex);
}

function updateVideoNavButtons() {
    const videos = CONFIG.video.videos || [];
    const prevBtn = document.getElementById('prevVideoBtn');
    const nextBtn = document.getElementById('nextVideoBtn');

    if (prevBtn) prevBtn.disabled = videos.length <= 1;
    if (nextBtn) nextBtn.disabled = videos.length <= 1;
}

// ================================================================
// CARGAR CONTENIDO DESDE CONFIG
// ================================================================
function loadConfigContent() {
    // Titulo de la pagina
    document.title = CONFIG.tituloNavegador;

    const mainTitle = document.querySelector('h1');
    if (mainTitle) mainTitle.textContent = CONFIG.tituloPagina;

    // Contador de tiempo
    const countdownTitle = document.querySelector('.countdown-title');
    if (countdownTitle) countdownTitle.textContent = CONFIG.tituloContador;

    // Carta
    const letterSectionTitle = document.querySelector('.letter-section h2');
    if (letterSectionTitle) letterSectionTitle.textContent = CONFIG.carta.tituloSeccion;

    const letterInstruction = document.querySelector('.letter-section p');
    if (letterInstruction) letterInstruction.textContent = CONFIG.carta.instruccion;

    const letterHeader = document.querySelector('.letter-header h2');
    if (letterHeader) letterHeader.textContent = CONFIG.carta.encabezado;

    const letterDate = document.querySelector('.letter-date');
    if (letterDate) letterDate.textContent = CONFIG.carta.subtitulo;

    const letterBody = document.querySelector('.letter-body');
    if (letterBody) letterBody.innerHTML = CONFIG.carta.contenido.replace(/\n\n/g, '<br><br>');

    const letterFooter = document.querySelector('.letter-footer');
    if (letterFooter) letterFooter.innerHTML = CONFIG.carta.firma + ' &#10084;';

    // Tarjeta principal
    const cardTexts = document.querySelectorAll('.card > p');
    if (cardTexts[0]) cardTexts[0].textContent = CONFIG.tarjetaPrincipal.textoSuperior;
    if (cardTexts[1]) cardTexts[1].textContent = CONFIG.tarjetaPrincipal.textoInferior;

    const surpriseBtn = document.querySelector('.surprise-btn');
    if (surpriseBtn) surpriseBtn.textContent = CONFIG.tarjetaPrincipal.botonSorpresa;

    // Razones
    const reasonsTitle = document.querySelector('.hidden-message h2');
    if (reasonsTitle) reasonsTitle.textContent = CONFIG.razones.titulo;

    const reasonsContainer = document.querySelector('.reasons');
    if (reasonsContainer) {
        reasonsContainer.innerHTML = CONFIG.razones.lista.map(razon =>
            '<div class="reason-item">' + razon + '</div>'
        ).join('');
    }

    // Galeria
    const galleryTitle = document.querySelector('.gallery-title');
    if (galleryTitle) galleryTitle.textContent = CONFIG.galeria.titulo;

    const gallerySubtitle = document.querySelector('.gallery-subtitle');
    if (gallerySubtitle) gallerySubtitle.textContent = CONFIG.galeria.subtitulo;

    // Memorama
    const memoramaTitle = document.querySelector('.memorama-title');
    if (memoramaTitle) memoramaTitle.textContent = CONFIG.memorama.titulo;

    // Ruleta
    const rouletteTitle = document.querySelector('.roulette-title');
    if (rouletteTitle) rouletteTitle.textContent = CONFIG.ruleta.titulo;

    const rouletteInstruction = document.getElementById('rouletteInstruction');
    if (rouletteInstruction) rouletteInstruction.textContent = CONFIG.ruleta.instruccion;

    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) spinBtn.textContent = CONFIG.ruleta.botonGirar;

    // Mensaje final
    const finalMessage = document.querySelector('.final-message');
    if (finalMessage) {
        finalMessage.innerHTML = CONFIG.mensajeFinal.texto +
            '<br><br>' + CONFIG.mensajeFinal.despedida +
            '<br><br><span style="font-size: 3em;">&#10084;</span>';
    }

    // Titulo del reproductor de musica
    const musicToggleText = document.getElementById('musicToggleText');
    if (musicToggleText) musicToggleText.textContent = CONFIG.musica.titulo;
}

// ================================================================
// INICIALIZACION
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    // Cargar contenido desde config
    loadConfigContent();

    // Inicializar fondo de corazones
    createHeartsBackground();

    // Inicializar contador
    updateTimeTogether();
    setInterval(updateTimeTogether, 1000);

    // Inicializar galeria de fotos
    createGallery();

    // Inicializar video
    initVideo();

    // Inicializar reproductor de musica
    initMusicPlayer();

    // Inicializar memorama
    initMemorama();

    // Inicializar ruleta
    createRoulette();

    // Inicializar cuenta regresiva de la ruleta
    initRouletteCountdown();

    // Inicializar corazones flotantes
    createFloatingHearts();
    setInterval(createFloatingHearts, 15000);

    // Inicializar Easter Eggs
    initKonamiCode();
    initTitleSecret();
    initHeartHoldSecret();
    initSecretCorner();

    // Cerrar modal de carta al hacer click fuera
    const letterModal = document.getElementById('letterModal');
    if (letterModal) {
        letterModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLetter();
            }
        });
    }

    // Cerrar modal de foto al hacer click fuera
    const photoModal = document.getElementById('photoModal');
    if (photoModal) {
        photoModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closePhotoModal();
            }
        });
    }

    // Navegacion con teclado para la galeria
    document.addEventListener('keydown', function(e) {
        const photoModal = document.getElementById('photoModal');
        if (photoModal && photoModal.classList.contains('show')) {
            if (e.key === 'ArrowRight') nextPhoto();
            if (e.key === 'ArrowLeft') prevPhoto();
            if (e.key === 'Escape') closePhotoModal();
        }
    });

    // Inicializar barra de progreso de clicks
    updateClickProgress();
});
