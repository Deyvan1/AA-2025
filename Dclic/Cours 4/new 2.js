function afficherNombres() {
    let result = "";
    for (let i = 1; i <= 10; i++) {
        result += i + "<br>";
    }
    document.getElementById("result").innerHTML = result;
}
