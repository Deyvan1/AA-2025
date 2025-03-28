function verifierAge() {
    var age = prompt("Veuillez entrer votre âge : ");
    age = parseInt(age);

    if (age < 18) {
        alert("Vous êtes mineur.");
    } else {
        alert("Vous êtes majeur.");
    }
	
	function verifierPairImpair() {
    var nombre = prompt("Entrez un nombre : ");
    nombre = parseInt(nombre);

    if (nombre % 2 === 0) {
        alert("Le nombre est pair.");
    } else {
        alert("Le nombre est impair.");
    }
}

function afficherMois() {
    var mois = prompt("Entrez le numéro du mois (1 pour janvier, 2 pour février, etc.) : ");
    mois = parseInt(mois);

    var moisNom = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    if (mois >= 1 && mois <= 12) {
        alert("Le mois " + mois + " est " + moisNom[mois - 1]);
    } else {
        alert("Mois invalide. Veuillez entrer un nombre entre 1 et 12.");
    }
}