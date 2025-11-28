const fs = require('fs');
const path = require('path');

// Le nom du dossier de destination
const distDir = path.join(__dirname, 'dist');

// Les fichiers à copier
const filesToCopy = [
    'index.html',
    'style.css',
    'app.js',
    'manifest.json',
    'sw.js'
];

console.log('🏗️  Début de la construction (Build)...');

// 1. Créer le dossier 'dist' s'il n'existe pas
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
    console.log('📁 Dossier "dist" créé.');
} else {
    console.log('📁 Le dossier "dist" existe déjà.');
}

// 2. Copier les fichiers
filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(distDir, file);

    try {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✅ Copié : ${file}`);
    } catch (err) {
        console.error(`❌ Erreur lors de la copie de ${file}:`, err);
    }
});

console.log('🎉 Build terminé ! Le dossier "dist" est prêt à être déployé.');
