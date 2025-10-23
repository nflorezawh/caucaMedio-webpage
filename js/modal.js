const modalOverlay = document.getElementById('feedback-modal');
const modalIcon = document.getElementById('modal-icon');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');
const modalButton = document.getElementById('modal-button');

/* Tipos
-----------------------------------*/
const modalTypes = {
    success: {
        icon: 'https://api.iconify.design/mdi/check-circle.svg?color=%234CAF50&width=60',
        buttonText: 'Continuar',
        titleColor: '#4CAF50'
    },
    error: {
        icon: 'https://api.iconify.design/mdi/alert-circle.svg?color=%23f44336&width=60',
        buttonText: 'Intentar de nuevo',
        titleColor: '#f44336'
    },
    info: {
        icon: 'https://api.iconify.design/mdi/information.svg?color=%232196F3&width=60',
        buttonText: 'Entendido',
        titleColor: '#2196F3'
    },
    warning: {
        icon: 'https://api.iconify.design/mdi/alert.svg?color=%23FF9800&width=60',
        buttonText: 'Aceptar',
        titleColor: '#FF9800'
    }
};

let currentCallback = null; // VARIABLE PARA GUARDAR EL CALLBACK ACTUAL

/* Mostrar Modal
-----------------------------------*/
function showModal(type = 'info', title = '', message = '', callback = null) {
    if (!modalTypes[type]) type = 'info';
    const config = modalTypes[type];

    modalIcon.src = config.icon;
    modalIcon.alt = `Ícono de ${type}`;
    modalTitle.textContent = title;
    modalTitle.style.color = config.titleColor;
    modalText.textContent = message;
    modalButton.textContent = config.buttonText;

    currentCallback = callback;

    modalOverlay.classList.add('active');
}


modalButton.addEventListener('click', () => {
    hideModal();
    if (currentCallback) currentCallback();
});

/* Cierre del Modal
-----------------------------------*/
function hideModal() {
    modalOverlay.classList.remove('active');
    currentCallback = null;
}

// Cerrar dando click hacia afuera
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) hideModal();
});

// Cerrar con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        hideModal();
    }
});

/* Atajos
-------------------------------------------------------------*/
function showSuccessModal(title, message, callback = null) {
    showModal('success', title, message, callback);
}

function showErrorModal(title, message, callback = null) {
    showModal('error', title, message, callback);
}

function showInfoModal(title, message, callback = null) {
    showModal('info', title, message, callback);
}

function showWarningModal(title, message, callback = null) {
    showModal('warning', title, message, callback);
}
