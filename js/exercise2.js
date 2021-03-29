const messages = {
    "wrongAns" : "réponse fausse .. corrige",
    "rightAns" : "bonne réponse",
    "frappe" : "desole il y a une faute de frappe"
};

const message = document.getElementById("message");
let calcul = document.getElementById("calcul");

console.log(message);
console.log(calcul);

function getResult() {
    let str = calcul.value;
    str = str.replace(/\s*/g, "");

    if (!isInputGood(str)) {
        message.innerText = messages["frappe"];
        return;
    }

    let res = parseInput(str);
    message.innerText = res;
}

function eval() {
    let str = calcul.value;
    str = str.replace(/\s*/g, "");

    if (!isInputGood(str)) {
        message.innerText = messages["frappe"];
        return;
    }

    let controlRes = parseInput(str);
    let answer = parseFloat(document.getElementById("reponse").value);
    if (controlRes != answer) {
        message.innerText = messages["wrongAns"];
    } else {
        message.innerText = messages["rightAns"];
    }
}

function getDefault() {
    message.innerText = '';
}




/* 
regexp pour evaluation d'input: 
- 1re grouppe : pas des operateurs doublé, 
- 2me grouppe : pas des operateurs *,/,% apres parantese ouvert
- 3me : pas dèoperateurs avant parantese fermé)
*/
const regexOps = /([\*\/%\+\-]{2,})|(\([%\*\/])|([\*\/%\+\-]\))/;

//regexp pour verifier s'il y a juste des paranteses, chiffres et operateurs
const allowedSym = /^[\(\d][,\.%\(\)\*\d\/\+\-]+[\)\d]$/;

//regexp pour parser int et float ("," et "." toutes les deux sont point decimal)
const regeexNum = /[,\.\d]{1}/;

//regexp d'operateurs a faire premierement
const regexMDM = /[\*\/%]/;

//regexp d'operateurs a faire deuxiemment 
const regexPM = /[\+\-]/;

const openPar = '(';
const closePar = ')';

//des fonctions d'operateurs
const actions = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
    "%": (a, b) => a % b,
}

function parseInput(string) {
    //enlever des espaces
    string = string.replace(/\s*/g, "");

    let len = string.length;
    let numStack = [];
    let operStack = [];
    let num, currOper, nextOper;

    
    for (let i = 0; i < len; i++) {
        num = '';
        //lire et enregistrer le chiffre  
        while (isNumber(string[i])) {
            num += string[i++];
        }
        if (num != '') {
            numStack.push(parseFloat(num));
        }


        currOper = peek(operStack);
        nextOper = string[i];

        /*
        checker pour unary operateur et : c'est applique seulement pour 
        des chiffres negatifs dans les parantheses (ex.(-2))
        dans le cas positif "-1" est passe dans le numStack et 
        "*" est passe dans le nextOper a la place de "-"
        */
        if (nextOper == "-" && string[i - 1] == openPar) {
            numStack.push(-1);
            nextOper = "*";
        }

        //vider les stacks 
        while (isTrigger(nextOper, currOper)) {
            numStack.push(doCalc(numStack, operStack));
            currOper = peek(operStack);

            //enlever de paranteses apres calculs dedans
            if (currOper == openPar && nextOper == closePar) {
                operStack.pop();
                currOper = peek(operStack);
                nextOper = string[++i];
            }
        }

        if (nextOper != closePar) {
            operStack.push(nextOper);
        }
    }

    return numStack[0];
}

function peek(stack) {
    return stack.length > 0 ? stack[stack.length - 1] : null;
}

/*
la fonction pour checker l'ordre des actions arithmetiques 
pour vider les stacks
*/
function isTrigger(next, curr) {

    if (curr == null) {
        return false
    }

    if (next == null || (next == closePar)
        || (next != openPar && regexMDM.test(curr))
        || (regexPM.test(curr) && regexPM.test(next))) {
        return true;
    } else {
        return false;
    }

}

function doCalc(numStack, actStack) {

    let operator = actStack.pop();
    if (operator == openPar) {
        operator = actStack.pop();
    }
    let secondOperand = numStack.pop();
    let firstOperand = numStack.pop();

    return actions[operator](firstOperand, secondOperand);

}

function isNumber(str) {
    return regeexNum.test(str);
}

function isInputGood(str) {
    str = str.replace(/\s*/g, "");

    return !regexOps.test(str)
            && allowedSym.test(str) 
            && !/\(\)/.test(str)
            && str.split("(").length == str.split(")").length;
}


// tests

// console.log(parseInput("2+(-2)"));                                   // 3
// console.log(parseInput("89 + 10 - 5"));                             // 94
// console.log(parseInput("8-9-1+5"));                                 // 3
// console.log(parseInput("2*1 -3+1"));                                // 0
// console.log(parseInput("8/9 + 7.2 - 5*2"));                         // - 1.91
// console.log(parseInput("8/9*2%5*2+3-2*2 + 8/9*2%5*2+3-2*2"));       // 5.11

// console.log(parseInput("1 + (-2) * 3 + 3*(5 -12/(7%3)*2 + 24)"));   // 10
// console.log(parseInput("5 - 12/(7%3)*2 + 24"));                     // 5
// console.log(parseInput("3*(5 - (-12)/((7%3)*((-2) / 4) + 24))"));          // 69
// console.log(parseInput("3*(4 - 2*3)"));                             // -6
// console.log(parseInput("1 + (-2) * 3"));                            // -5
// console.log(parseInput("2 * (2 + 3)"));                             // 10