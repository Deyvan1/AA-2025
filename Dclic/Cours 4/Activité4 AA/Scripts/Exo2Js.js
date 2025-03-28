function afficherNombres() {
    let result = "";
    for (let i = 1; i <= 10; i++) {
        result += i + "<br>";
    }
    document.getElementById("result").innerHTML = result;
}

function calculerSomme() {
    let sum = 0;
    let i = 1;
    while (i <= 100) {
        sum += i;
        i++;
    }
    document.getElementById("result").innerHTML = "La somme des entiers de 1 à 100 est : " + sum;
}

function devinerNombre() {
    const nombreSecret = Math.floor(Math.random() * 100) + 1;
    let guess;
    let result = "";
    
    do {
        guess = parseInt(prompt("Devinez un nombre entre 1 et 100 :"));
        
        if (guess < nombreSecret) {
            result = "Le nombre secret est plus grand. Essayez encore.";
        } else if (guess > nombreSecret) {
            result = "Le nombre secret est plus petit. Essayez encore.";
        } else {
            result = "Félicitations, vous avez deviné le nombre secret !";
        }
    } while (guess !== nombreSecret);
    
    document.getElementById("result").innerHTML = result;
}

function genererFibonacci() {
    let N = parseInt(prompt("Entrez le nombre de termes de la séquence de Fibonacci que vous souhaitez générer :"));
    let fibonacci = [0, 1];
    
    for (let i = 2; i < N; i++) {
        fibonacci.push(fibonacci[i - 1] + fibonacci[i - 2]);
    }
    
    let result = "Les " + N + " premiers termes de la séquence de Fibonacci sont :<br>" + fibonacci.join(", ");
    document.getElementById("result").innerHTML = result;
}