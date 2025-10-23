const memoryGrid = document.querySelector('.memory-grid');

const cardImages = [
    'src/images/E1.png',
    'src/images/E2.png',
    'src/images/E3.png',
    'src/images/E4.png',
    'src/images/E5.png',
    'src/images/E6.png'
];

let hasFlippedCard = false; 
let lockBoard = false;        
let firstCard = null;         
let secondCard = null;        
let matchedPairs = 0;         

/* Crear tablero
-----------------------------------*/
function createMemoryBoard() {
    // Limpia el contenido anterior
    memoryGrid.innerHTML = '';
    
    // Reinicia el contador
    matchedPairs = 0;

    const gameImages = [...cardImages, ...cardImages];
    
    gameImages.sort(() => 0.5 - Math.random());

    gameImages.forEach(imageUrl => {

        const card = document.createElement('div');
        card.classList.add('memory-card');
        
        card.dataset.imageUrl = imageUrl;
        
        card.innerHTML = `
            <div class="card-face card-front">
                <img src="${imageUrl}" alt="Carta del juego">
            </div>
            <div class="card-face card-back"></div>
        `;
        
        card.addEventListener('click', flipCard);
        
        memoryGrid.appendChild(card);
    });
}

/* Voltear la carta
-----------------------------------*/
function flipCard() {
    if (lockBoard || this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

/* Verificar si coinciden
-----------------------------------*/
function checkForMatch() {
    // Compara las URLs
    const isMatch = firstCard.dataset.imageUrl === secondCard.dataset.imageUrl;
    
    isMatch ? disableCards() : unflipCards();
}

/* Deshabilitar cartas
-----------------------------------*/
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    

    matchedPairs++;
    
    resetBoard();
}

/* Volver a voltear las cartas cuando no coinciden
-----------------------------------*/
function unflipCards() {
    // Bloquea el tablero para evitar clics durante la animación
    lockBoard = true;
    
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1200); // 1.2 segundos
}

/* TODO: Por arreglar a futuro para que sea 100% aleatorio cada vez
-----------------------------------*/
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}


function startMemoryGame() {
    createMemoryBoard();
}

/* Mostrar Modal
-----------------------------------*/
function checkMemoryGame() {
    // Verifica si se encontraron todos los pares
    if (matchedPairs === cardImages.length) {
        // ¡Juego completado!
        showModal(
            'success',
            '¡EXCELENTE!',
            '¡Completaste el juego de memoria! Has demostrado tener una gran memoria.',
            () => showScreen('menu-screen')
        );
    } else {
        // Aún faltan pares
        const remaining = cardImages.length - matchedPairs;
        showModal(
            'error',
            '¡CASI LO LOGRAS!',
            `Aún te faltan ${remaining} par${remaining > 1 ? 'es' : ''} por encontrar. ¡Sigue intentando!`,
            null // No cambia de pantalla
        );
    }
}

startMemoryGame();