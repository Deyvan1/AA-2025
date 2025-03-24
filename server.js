// Serveur Express simple pour le portfolio
const express = require('express');
const path = require('path');
const fs = require('fs');

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration pour recevoir les données de formulaire
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (CSS, JS, images)
app.use(express.static(__dirname)); // Servir les fichiers depuis le dossier racine

// Route principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API pour le formulaire de contact (sans nodemailer)
app.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Tous les champs sont requis' });
  }

  // Option 1: Sauvegarder dans un fichier (simple mais pas recommandé pour la production)
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
      console.error('Erreur lors de l\'enregistrement du message:', err);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
    
    res.status(200).json({ success: true, message: 'Message reçu!' });
  });

  // Option 2: Afficher dans la console (pour les tests)
  console.log('Nouveau message de contact:');
  console.log('Nom:', name);
  console.log('Email:', email);
  console.log('Sujet:', subject);
  console.log('Message:', message);
});

// Gestion des routes non trouvées (404)
app.use((req, res) => {
  res.status(404).send('Page non trouvée');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

/* 
Instructions d'utilisation:

1. Installation minimale requise:
   - Installer Node.js si ce n'est pas déjà fait
   - Ouvrir un terminal et exécuter: npm install express

2. Structure de fichiers:
   /portfolio-project/
     server.js
     index.html
     css/
       style.css
     js/
       main.js
     assets/
       (toutes vos images)

3. Démarrer le serveur:
   - Dans le terminal: node server.js
   - Accéder au site: http://localhost:3000

4. Pour tester en production, vous pourriez utiliser:
   - Heroku, Netlify, Vercel, etc.
   - Configurer un service comme PM2 pour maintenir le serveur actif

Note: Cette configuration est minimale. Pour un environnement de production,
envisagez d'ajouter des fonctionnalités comme l'envoi d'emails (Nodemailer),
la sécurité renforcée (Helmet), et la gestion appropriée des erreurs.
*/