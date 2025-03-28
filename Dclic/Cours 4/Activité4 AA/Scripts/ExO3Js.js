function afficherNombresPremiers() {
    let result = "";
    
    for (let num = 2; num <= 100; num++) {
        let isPrime = true;
        
        // Vérifier si le nombre est premier
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) {
                isPrime = false;
                break;
            }
        }
        
        if (isPrime) {
            result += num + "<br>";
        }
    }
    
    document.getElementById("result").innerHTML = "Les nombres premiers entre 1 et 100 sont :<br>" + result;

function trouverFacteurs() {
    let nombre = parseInt(prompt("Entrez un nombre pour trouver ses facteurs :"));
    let facteurs = [];
    
    for (let i = 1; i <= nombre; i++) {
        if (nombre % i === 0) {
            facteurs.push(i);
        }
    }
    
	
	function calculerMoyenne() {
    let total = 0;
    let count = 0;
    let nombre;
    
    do {
        nombre = parseFloat(prompt("Entrez un nombre positif (ou un nombre négatif pour arrêter) :"));
        
        if (nombre >= 0) {
            total += nombre;
            count++;
        }
    } while (nombre >= 0);
    
    if (count > 0) {
        let moyenne = total / count;
        document.getElementById("result").innerHTML = "La moyenne des nombres positifs est : " + moyenne;
    } else {
        document.getElementById("result").innerHTML = "Aucun nombre positif n'a été saisi.";
    }
}

function genererMotif() {
    let hauteur = parseInt(prompt("Entrez la hauteur du triangle (un nombre entier positif) :"));
    let motif = "";
    
    for (let i = 1; i <= hauteur; i++) {
        motif += "*".repeat(2 * i - 1) + "<br>";
    }
    
    document.getElementById("result").innerHTML = motif;
}