// Gestion de la fenêtre modale pour la version
const versionLink = document.getElementById('version-link');
const versionModal = document.getElementById('version-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalCloseIcon = document.getElementById('modal-close');
const modalOverlay = document.querySelector('.modal-overlay');

// Fonction pour ouvrir la modale
function openModal() {
  versionModal.classList.add('modal-open');
  document.body.style.overflow = 'hidden'; // Empêcher le scroll en arrière-plan
}

// Fonction pour fermer la modale
function closeModal() {
  versionModal.classList.remove('modal-open');
  document.body.style.overflow = ''; // Réactiver le scroll
}

// Écouteurs d'événements
versionLink.addEventListener('click', (e) => {
  e.preventDefault();
  openModal();
});

modalCloseBtn.addEventListener('click', closeModal);
modalCloseIcon.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Fermer la modale en appuyant sur la touche Échap
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && versionModal.classList.contains('modal-open')) {
    closeModal();
  }
});

// Animation pour la modale
window.addEventListener('load', () => {
  versionModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
});
