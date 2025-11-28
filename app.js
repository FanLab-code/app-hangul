/*
  app.js
  Ce fichier contient toute la "cervelle" de l'application.
  Il gère les données (les lettres), les clics et la parole.
*/

console.log("🚀 VERSION 2.0 CHARGÉE");

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
const voiceSelect = document.getElementById('voice-select');

// --- 3. Fonctions ---

// Fonction utilitaire pour afficher les logs sur l'écran (pour le debug)
function logDebug(message) {
    const debugDiv = document.getElementById('debug-log');
    if (debugDiv) {
        const p = document.createElement('p');
        p.textContent = `> ${message}`;
        debugDiv.appendChild(p);
        console.log(message);
    }
}

// Variable pour stocker la voix coréenne sélectionnée
let koreanVoice = null;

// Variable globale pour empêcher le Garbage Collection sur iOS
window.currentUtterance = null;

// Fonction pour charger les voix disponibles
function loadVoices() {
    const voices = window.speechSynthesis.getVoices();
    logDebug(`Voix chargées : ${voices.length}`);

    // Filtrer les voix coréennes
    const koreanVoices = voices.filter(voice => voice.lang === 'ko-KR' || voice.lang === 'ko_KR');

    // Remplir le menu déroulant
    if (voiceSelect) {
        voiceSelect.innerHTML = '';

        if (koreanVoices.length === 0) {
            const option = document.createElement('option');
            option.textContent = "Aucune voix coréenne trouvée";
            voiceSelect.appendChild(option);
        } else {
            koreanVoices.forEach((voice, index) => {
                const option = document.createElement('option');
                option.textContent = `${voice.name} (${voice.lang})`;
                option.value = index;
                voiceSelect.appendChild(option);
            });

            // Restaurer la préférence sauvegardée
            const savedVoiceName = localStorage.getItem('selectedVoice');
            let selectedIndex = 0;
            if (savedVoiceName) {
                const foundIndex = koreanVoices.findIndex(v => v.name === savedVoiceName);
                if (foundIndex !== -1) selectedIndex = foundIndex;
            }

            koreanVoice = koreanVoices[selectedIndex];
            voiceSelect.selectedIndex = selectedIndex;
            logDebug(`✅ Voix active : ${koreanVoice.name}`);
        }
    }
}

// Écouter le changement de sélection de voix
if (voiceSelect) {
    voiceSelect.addEventListener('change', () => {
        const voices = window.speechSynthesis.getVoices();
        const koreanVoices = voices.filter(voice => voice.lang === 'ko-KR' || voice.lang === 'ko_KR');
        const selectedIndex = voiceSelect.value;
        koreanVoice = koreanVoices[selectedIndex];

        if (koreanVoice) {
            localStorage.setItem('selectedVoice', koreanVoice.name);
            logDebug(`Nouvelle voix choisie : ${koreanVoice.name}`);
            speak("안녕하세요"); // Test
        }
    });
}

// On charge les voix au démarrage
loadVoices();

// Chrome/Safari chargent les voix de manière asynchrone
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
        logDebug("Événement 'voiceschanged' détecté.");
        loadVoices();
    };
}

// Fonction pour "parler" (Text-to-Speech)
function speak(text) {
    logDebug(`Tentative de lecture : ${text}`);

    // On annule toute parole en cours
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Fix pour iOS : on stocke l'objet dans une variable globale
    window.currentUtterance = utterance;

    // Si on a trouvé une voix spécifique, on l'utilise
    if (koreanVoice) {
        utterance.voice = koreanVoice;
    }

    // On définit la langue
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;

    utterance.onstart = function () {
        logDebug("🔊 Lecture commencée...");
    };

    utterance.onend = function () {
        logDebug("Lecture terminée.");
        window.currentUtterance = null; // Nettoyage
    };

    utterance.onerror = function (event) {
        logDebug(`❌ Erreur audio : ${event.error}`);
        console.error('Erreur de synthèse vocale', event);
    };

    window.speechSynthesis.speak(utterance);
}

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
