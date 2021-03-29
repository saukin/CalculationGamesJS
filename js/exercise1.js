const output_ids = {
    "sum_value": (a, b) => (a + b),
    "difference_value": (a, b) => (a - b),
    "product_value": (a, b) => (a * b),
    "quotien_value": (a, b) => (a / b),
    "remainder_value": (a, b) => (a % b)
}

function calculer() {
    let num_1 = parseFloat(document.getElementById("num_1").value);
    let num_2 = parseFloat(document.getElementById("num_2").value);
    
    if(isGood(num_1) && isGood(num_2)) {
        for (let id in output_ids) {
            document.getElementById(id).innerText = output_ids[id](num_1, num_2);
        }
    } else {
        console.log("HAHAH");
        for (let id in output_ids) {
            document.getElementById(id).innerText = "ERROR";
        }
    }
}

function isGood(val) {
    return /[0-9]+/.test(val);
}

function effacer() {
    for (let id in output_ids) {
        document.getElementById(id).innerText = "";
    }
}