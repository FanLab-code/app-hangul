/*
  app.js
  Ce fichier contient toute la "cervelle" de l'application.
  Il gère les données (les lettres), les clics et la parole.
*/

// --- 1. Les Données (Voyelles et Consonnes) ---

// Liste des voyelles de base
const vowels = [
    { char: 'ㅏ', rom: 'a' },
    { char: 'ㅑ', rom: 'ya' },
    { char: 'ㅓ', rom: 'eo' },
    { char: 'ㅕ', rom: 'yeo' },
    { char: 'ㅗ', rom: 'o' },
    { char: 'ㅛ', rom: 'yo' },
    { char: 'ㅜ', rom: 'u' },
    { char: 'ㅠ', rom: 'yu' },
    { char: 'ㅡ', rom: 'eu' },
    { char: 'ㅣ', rom: 'i' },
    { char: 'ㅐ', rom: 'ae' },
    { char: 'ㅒ', rom: 'yae' },
    { char: 'ㅔ', rom: 'e' },
    { char: 'ㅖ', rom: 'ye' },
    { char: 'ㅘ', rom: 'wa' },
    { char: 'ㅙ', rom: 'wae' },
    { char: 'ㅚ', rom: 'oe' },
    { char: 'ㅝ', rom: 'wo' },
    { char: 'ㅞ', rom: 'we' },
    { char: 'ㅟ', rom: 'wi' },
    { char: 'ㅢ', rom: 'ui' }
];

// Liste des consonnes de base
const consonants = [
    { char: 'ㄱ', rom: 'g/k' },
    { char: 'ㄴ', rom: 'n' },
    { char: 'ㄷ', rom: 'd/t' },
    { char: 'ㄹ', rom: 'r/l' },
    { char: 'ㅁ', rom: 'm' },
    { char: 'ㅂ', rom: 'b/p' },
    { char: 'ㅅ', rom: 's' },
    { char: 'ㅇ', rom: 'ng' }, // Silencieux au début, 'ng' à la fin
    { char: 'ㅈ', rom: 'j' },
    { char: 'ㅊ', rom: 'ch' },
    { char: 'ㅋ', rom: 'k' },
    { char: 'ㅌ', rom: 't' },
    { char: 'ㅍ', rom: 'p' },
    { char: 'ㅎ', rom: 'h' },
    { char: 'ㄲ', rom: 'kk' },
    { char: 'ㄸ', rom: 'tt' },
    { char: 'ㅃ', rom: 'pp' },
    { char: 'ㅆ', rom: 'ss' },
    { char: 'ㅉ', rom: 'jj' }
];

// --- 2. Sélection des éléments du HTML ---
const container = document.getElementById('app-container');
const tabButtons = document.querySelectorAll('.tab-btn');

// --- 3. Fonctions ---

// Fonction utilitaire pour afficher les logs sur l'écran (pour le debug)
function logDebug(message) {
    const debugDiv = document.getElementById('debug-log');
    if (debugDiv) {
        const p = document.createElement('p');
        p.textContent = `> ${message}`;
        debugDiv.appendChild(p);

        // Fonction pour créer une carte HTML pour une lettre
        function createCard(item) {
            const card = document.createElement('div');
            card.className = 'card';

            // Contenu HTML de la carte
            card.innerHTML = `
        <div class="hangul-char">${item.char}</div>
        <div class="romanization">${item.rom}</div>
    `;

            // Ajout de l'événement "clic"
            card.addEventListener('click', () => {
                // 1. Jouer le son
                speak(item.char);

                // 2. Animation visuelle (classe 'playing')
                card.classList.add('playing');

                // On enlève la classe après 200ms pour pouvoir rejouer l'animation
                setTimeout(() => {
                    card.classList.remove('playing');
                }, 200);
            });

            return card;
        }

        // Fonction pour afficher une liste (voyelles ou consonnes)
        function render(category) {
            // On vide le conteneur
            container.innerHTML = '';

            let data = [];
            if (category === 'voyelles') {
                data = vowels;
            } else {
                data = consonants;
            }

            // Pour chaque lettre dans les données, on crée une carte et on l'ajoute
            data.forEach(item => {
                const card = createCard(item);
                container.appendChild(card);
            });
        }

        // --- 4. Gestion des Onglets ---
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Retirer la classe 'active' de tous les boutons
                tabButtons.forEach(b => b.classList.remove('active'));
                // Ajouter la classe 'active' au bouton cliqué
                btn.classList.add('active');

                // Afficher le contenu correspondant
                const target = btn.dataset.target; // 'voyelles' ou 'consonnes'
                render(target);
            });
        });

        // --- 5. Initialisation ---
        // Au démarrage, on affiche les voyelles par défaut
        render('voyelles');
