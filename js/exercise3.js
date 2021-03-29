let nbInconnu;
const maxEssai = 7;
let esCounter;
const boom = document.getElementById("boom");
const plus = "c'est plus";
const moin = "c'est moins";
const trouve = "Vous avez trouvé en .. essai";
const pasTrouve = "Le nombre à touver était : ";
const error = "wrong input";

const ids = ["proposition", "message", "reponse"];

(function setUp() {
    esCounter = 1;
    document.getElementById("essay").innerText = esCounter;
    nbInconnu = Math.floor(Math.random() * Math.floor(100));
})();

function showMessage(message) {
    document.getElementById("message").innerText = message;
}

function showResponse(resp) {
    document.getElementById("reponse").innerText = resp;
}

function muteValideButton() {
    document.getElementsByClassName("valider")[0].disabled = true;
}

function getDefault() {
    location.reload();
}

function getAnswer() {
    showResponse(nbInconnu);
    muteValideButton()
}

function getRidOfIt() {
    boom.play();
    let container = document.getElementById("test_container");
    container.style.border = "none";
    container.style.backgroundColor = "white";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.innerHTML = "<img src='images/giphy.gif'></img>";
    setTimeout(function () {
        container.innerHTML = "";
    }, 500);
}

function eval() {
    let p = document.getElementById("proposition").value;

    if (isGood(p)) {
        checkValue(p);
    } else {
        showMessage(error);
        return;
    }
}


function isGood(val) {
    return /[0-9]+/.test(val) && val > 0 && val <= 100;
}


function checkValue(val) {
    let message;
    if (val > nbInconnu) {
        message = plus;
        checkCounter();
    } else if (val < nbInconnu) {
        message = moin;
        checkCounter();
    } else {
        message = '';
        showResponse(trouve.replace("..", esCounter));
        muteValideButton();
    }
    showMessage(message);
}

function checkCounter() {
    if (esCounter == maxEssai) {
        muteValideButton()
        showResponse(pasTrouve + nbInconnu);
    } else {
        document.getElementById("essay").innerText = ++esCounter;
    }
}
