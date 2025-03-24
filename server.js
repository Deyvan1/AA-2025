// Serveur Express simple pour le portfolio avec logs améliorés
const express = require('express');
const path = require('path');
const fs = require('fs');

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration pour recevoir les données de formulaire
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging pour toutes les requêtes
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  
  // Créer un dossier logs s'il n'existe pas
  if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
    console.log('[INIT] Dossier logs créé');
  }
  
  // Logger les informations de base dans un fichier
  const logMessage = `[${timestamp}] ${req.method} ${req.url} - IP: ${req.ip}\n`;
  fs.appendFile('./logs/access.log', logMessage, (err) => {
    if (err) {
      console.error('[ERREUR] Impossible d\'écrire dans le fichier de log:', err);
    }
  });
  
  next();
});

// Servir les fichiers statiques (CSS, JS, images)
app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    // Log pour déboguer les problèmes de cache
    if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
      console.log(`[STATIC] Fichier servi: ${path.relative(__dirname, filePath)}`);
    }
  }
}));

// Log de démarrage
console.log('[INIT] Configuration du serveur terminée');
console.log('[INIT] Routes en cours d\'initialisation...');

// Route principale
app.get('/', (req, res) => {
  console.log('[ROUTE] Page d\'accueil demandée');
  const indexPath = path.join(__dirname, 'index.html');
  
  // Vérifier si le fichier existe
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
    console.log('[ROUTE] index.html envoyé avec succès');
  } else {
    console.error('[ERREUR] index.html introuvable à:', indexPath);
    res.status(500).send('Erreur serveur: fichier index.html introuvable');
  }
});

// API pour le formulaire de contact
app.post('/contact', (req, res) => {
  console.log('[API] Nouvelle soumission de formulaire de contact reçue');
  
  // Log du corps de la requête
  console.log('[API] Données reçues:', JSON.stringify(req.body, null, 2));
  
  const { name, email, subject, message } = req.body;
  
  // Validation des données
  if (!name || !email || !subject || !message) {
    console.error('[ERREUR] Données de formulaire incomplètes');
    return res.status(400).json({ 
      success: false, 
      message: 'Tous les champs sont requis',
      missing: Object.entries({ name, email, subject, message })
                    .filter(([_, val]) => !val)
                    .map(([key]) => key)
    });
  }

  // Sauvegarder dans un fichier
  const contactData = `
Date: ${new Date().toISOString()}
Nom: ${name}
Email: ${email}
Sujet: ${subject}
Message: ${message}
-------------------------------------
`;

  fs.appendFile('contacts.txt', contactData, (err) => {
    if (err) {
      console.error('[ERREUR] Échec de l\'enregistrement du message:', err);
      return res.status(500).json({ success: false, message: 'Erreur serveur lors de l\'enregistrement' });
    }
    
    console.log('[SUCCÈS] Message de contact enregistré pour:', email);
    res.status(200).json({ success: true, message: 'Message reçu!' });
  });
});

// Middleware pour les erreurs 404
app.use((req, res) => {
  console.warn(`[404] Route non trouvée: ${req.originalUrl}`);
  res.status(404).send('Page non trouvée');
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error('[ERREUR SERVEUR]', err.stack);
  
  // Enregistrer l'erreur dans un fichier
  const errorLog = `
[${new Date().toISOString()}] 
URL: ${req.originalUrl}
Méthode: ${req.method}
IP: ${req.ip}
Erreur: ${err.message}
Stack: ${err.stack}
-------------------------------------
`;

  fs.appendFile('./logs/errors.log', errorLog, (writeErr) => {
    if (writeErr) {
      console.error('[ERREUR] Impossible d\'écrire dans le fichier d\'erreurs:', writeErr);
    }
  });

  res.status(500).send('Erreur serveur interne');
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (err) => {
  console.error('[ERREUR CRITIQUE] Exception non capturée:', err);
  fs.appendFileSync('./logs/crash.log', `[${new Date().toISOString()}] ${err.stack}\n`);
  // En production, vous pourriez vouloir redémarrer le serveur ici
  // process.exit(1);
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`[DÉMARRAGE] Serveur démarré le ${new Date().toISOString()}`);
  console.log(`[DÉMARRAGE] Serveur accessible sur http://localhost:${PORT}`);
  console.log('[DÉMARRAGE] Appuyez sur Ctrl+C pour arrêter');
  
  // Vérifier la structure de fichiers
  console.log('\n[VÉRIFICATION] Structure de fichiers:');
  
  const checkFile = (filePath, description) => {
    if (fs.existsSync(filePath)) {
      console.log(`✓ ${description} trouvé: ${filePath}`);
    } else {
      console.warn(`✗ ATTENTION: ${description} introuvable: ${filePath}`);
    }
  };
  
  checkFile(path.join(__dirname, 'index.html'), 'Fichier principal');
  checkFile(path.join(__dirname, 'css/style.css'), 'Feuille de style');
  checkFile(path.join(__dirname, 'js/main.js'), 'JavaScript');
  checkFile(path.join(__dirname, 'assets'), 'Dossier des ressources');
  
  console.log('\n[PRÊT] Serveur prêt à recevoir des connexions');
});