/* Se puede modificar la cuadricula según necesidad, simplemente
le haría falta corregir unos detalles en el CSS para que quede
bien implementado
-----------------------------------*/

const puzzleImage = 'src/images/MascaraCaucaMedio.png';
const rows = 3;
const cols = 3;
const totalPieces = rows * cols;

const puzzleBoard = document.getElementById('puzzle-board');
const puzzlePiecesContainer = document.getElementById('puzzle-pieces-container');

let placedPieces = 0;
let draggedPiece = null;

const BOARD_SIZE = 300;
const GAP = 8;
const SLOT_SIZE = (BOARD_SIZE - (GAP * (cols - 1))) / cols; // Tamaño calculado de cada slot
const PIECE_SIZE = 100;

/* Iniciar
-----------------------------------*/
function initPuzzle() {
    // Limpia contenedores
    if (puzzleBoard) puzzleBoard.innerHTML = '';
    if (puzzlePiecesContainer) puzzlePiecesContainer.innerHTML = '';
    placedPieces = 0;

    // Configura el tablero
    if (puzzleBoard) {
        puzzleBoard.style.display = 'grid';
        puzzleBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        puzzleBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        puzzleBoard.style.gap = `${GAP}px`;
        puzzleBoard.style.width = `${BOARD_SIZE}px`;
        puzzleBoard.style.height = `${BOARD_SIZE}px`;
        puzzleBoard.style.margin = '0 auto';
        puzzleBoard.style.padding = '10px';
        puzzleBoard.style.boxSizing = 'content-box';
    }

    // Crea slots
    for (let i = 0; i < totalPieces; i++) {
        const slot = document.createElement('div');
        slot.classList.add('puzzle-slot');
        slot.dataset.position = i;
        
        slot.addEventListener('dragover', handleDragOver);
        slot.addEventListener('drop', handleDrop);
        slot.addEventListener('dragleave', handleDragLeave);
        
        if (puzzleBoard) puzzleBoard.appendChild(slot);
    }

    // Crea las piezas
    createPuzzlePieces();
}

/* Crear piezas
-----------------------------------*/
function createPuzzlePieces() {
    const positions = Array.from({ length: totalPieces }, (_, i) => i);
    const shuffledPositions = positions.sort(() => Math.random() - 0.5);

    shuffledPositions.forEach(position => {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.draggable = true;
        piece.dataset.correctPosition = position;
        
        const row = Math.floor(position / cols);
        const col = position % cols;
        
        // Estilos de la pieza suelta
        piece.style.width = `${PIECE_SIZE}px`;
        piece.style.height = `${PIECE_SIZE}px`;
        piece.style.backgroundImage = `url(${puzzleImage})`;
        piece.style.backgroundSize = `${cols * PIECE_SIZE}px ${rows * PIECE_SIZE}px`;
        piece.style.backgroundPosition = `-${col * PIECE_SIZE}px -${row * PIECE_SIZE}px`;
        piece.style.cursor = 'grab';
        piece.style.border = '2px solid var(--secondary-color)';
        piece.style.borderRadius = '8px';
        piece.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        piece.style.transition = 'transform 0.2s';
        piece.style.backgroundRepeat = 'no-repeat';
        
        piece.addEventListener('dragstart', handleDragStart);
        piece.addEventListener('dragend', handleDragEnd);
        
        piece.addEventListener('mouseenter', function() {
            if (this.draggable) {
                this.style.transform = 'scale(1.05)';
            }
        });
        
        piece.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        if (puzzlePiecesContainer) puzzlePiecesContainer.appendChild(piece);
    });
}

/* Eventos Drag & Drop
-----------------------------------*/
function handleDragStart(e) {
    draggedPiece = this;
    this.style.opacity = '0.5';
    this.style.cursor = 'grabbing';
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    this.style.cursor = 'grab';
    
    // Limpia todos los efectos de dragover
    document.querySelectorAll('.puzzle-slot').forEach(slot => {
        slot.style.backgroundColor = '';
        slot.style.borderColor = '';
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (this.children.length === 0) {
        this.style.backgroundColor = 'rgba(160, 126, 210, 0.3)';
        this.style.borderColor = 'var(--primary-color)';
    }
}

function handleDragLeave(e) {
    this.style.backgroundColor = '';
    this.style.borderColor = '';
}

function handleDrop(e) {
    e.preventDefault();
    
    this.style.backgroundColor = '';
    this.style.borderColor = '';
    
    if (!draggedPiece) return;
    
    const slot = this;
    const slotPosition = parseInt(slot.dataset.position);
    const pieceCorrectPosition = parseInt(draggedPiece.dataset.correctPosition);
    
    // Verifica si el slot está ocupado
    if (slot.children.length > 0) {
        showFeedback(slot, false);
        return;
    }
    
    // Verifica si la posición es correcta
    if (slotPosition === pieceCorrectPosition) {
        // ¡CORRECTO!
        const row = Math.floor(pieceCorrectPosition / cols);
        const col = pieceCorrectPosition % cols;
        
        // Calcula el tamaño real del slot
        const slotWidth = slot.offsetWidth;
        const slotHeight = slot.offsetHeight;
        
        // Ajusta la pieza para que encaje perfectamente en el slot
        draggedPiece.style.width = '100%';
        draggedPiece.style.height = '100%';
        // El tamaño total de la imagen debe cubrir todo el grid
        draggedPiece.style.backgroundSize = `${cols * slotWidth}px ${rows * slotHeight}px`;
        // Posiciona la sección correcta de la imagen
        draggedPiece.style.backgroundPosition = `-${col * slotWidth}px -${row * slotHeight}px`;
        draggedPiece.style.border = 'none';
        draggedPiece.style.borderRadius = '8px';
        draggedPiece.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        draggedPiece.style.opacity = '1';
        
        slot.appendChild(draggedPiece);
        slot.style.border = 'none';
        slot.style.backgroundColor = 'transparent';
        
        draggedPiece.draggable = false;
        draggedPiece.classList.add('placed');
        draggedPiece.style.cursor = 'default';
        placedPieces++;
        
        showFeedback(slot, true);
        
        // Verificar
        if (placedPieces === totalPieces) {
            setTimeout(() => {
                puzzleBoard.classList.add('completed');
                setTimeout(() => {
                    showModal(
                        'success',
                        '¡PERFECTO!',
                        '¡Completaste el rompecabezas! Has reconstruido la cerámica ancestral del Cauca Medio.',
                        () => showScreen('menu-screen')
                    );
                }, 500);
            }, 300);
        }
    } else {
        showFeedback(slot, false);
    }
    
    draggedPiece = null;
}

/* Feedback
-----------------------------------*/
function showFeedback(slot, isCorrect) {
    if (isCorrect) {
        slot.style.border = '2px solid #4CAF50';
        slot.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        
        setTimeout(() => {
            slot.style.border = '';
            slot.style.backgroundColor = '';
        }, 800);
    } else {
        slot.style.border = '2px solid #f44336';
        slot.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
        slot.style.animation = 'shake 0.5s';
        
        setTimeout(() => {
            slot.style.animation = '';
            slot.style.border = '';
            slot.style.backgroundColor = '';
        }, 800);
    }
}

/* Verificar
-----------------------------------*/
function checkPuzzle() {
    if (placedPieces === totalPieces) {
        showModal(
            'success',
            '¡EXCELENTE!',
            '¡Completaste el rompecabezas correctamente!',
            () => showScreen('menu-screen')
        );
    } else {
        const remaining = totalPieces - placedPieces;
        showModal(
            'error',
            'Rompecabezas incompleto',
            `Aún te faltan ${remaining} pieza${remaining > 1 ? 's' : ''} por colocar correctamente. ¡Sigue intentando!`,
            null
        );
    }
}

if (puzzleBoard && puzzlePiecesContainer) {
    initPuzzle();
}
