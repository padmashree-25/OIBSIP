const display = document.getElementById("display");

const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");

const clearButton = document.getElementById("clear");
const backspaceButton = document.getElementById("backspace");
const decimalButton = document.getElementById("decimal");
const equalsButton = document.getElementById("equals");

let currentInput = "0";
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;


// Update the calculator display
function updateDisplay() {
    display.textContent = currentInput;
}


// Handle number buttons
numberButtons.forEach(function(button) {
    button.addEventListener("click", function() {

        const number = button.textContent;

        if (currentInput === "Error") {
            currentInput = number;
        }
        else if (waitingForSecondNumber) {
            currentInput = number;
            waitingForSecondNumber = false;
        }
        else if (currentInput === "0") {
            currentInput = number;
        }
        else {
            currentInput += number;
        }

        updateDisplay();
    });
});


// Handle decimal point
decimalButton.addEventListener("click", function() {

    if (currentInput === "Error") {
        currentInput = "0.";
    }
    else if (waitingForSecondNumber) {
        currentInput = "0.";
        waitingForSecondNumber = false;
    }
    else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
});


// Perform calculation
function calculate(first, second, selectedOperator) {

    switch (selectedOperator) {

        case "+":
            return first + second;

        case "-":
            return first - second;

        case "*":
            return first * second;

        case "/":
            if (second === 0) {
                return "Error";
            }
            return first / second;

        default:
            return second;
    }
}


// Handle operator buttons
operatorButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const selectedOperator = button.dataset.operator;
        const inputNumber = parseFloat(currentInput);

        if (currentInput === "Error") {
            return;
        }

        // If an operator is already selected,
        // calculate the previous operation first.
        if (operator !== null && waitingForSecondNumber === false) {

            const result = calculate(
                firstNumber,
                inputNumber,
                operator
            );

            if (result === "Error") {
                currentInput = "Error";
                firstNumber = null;
                operator = null;
                updateDisplay();
                return;
            }

            currentInput = String(result);
            firstNumber = result;
        }
        else {
            firstNumber = inputNumber;
        }

        operator = selectedOperator;
        waitingForSecondNumber = true;

        updateDisplay();
    });
});


// Handle equals button
equalsButton.addEventListener("click", function() {

    if (
        operator === null ||
        firstNumber === null ||
        waitingForSecondNumber
    ) {
        return;
    }

    const secondNumber = parseFloat(currentInput);

    const result = calculate(
        firstNumber,
        secondNumber,
        operator
    );

    if (result === "Error") {
        currentInput = "Error";
    }
    else {
        currentInput = String(result);
    }

    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;

    updateDisplay();
});


// Handle clear button
clearButton.addEventListener("click", function() {

    currentInput = "0";
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;

    updateDisplay();
});


// Handle backspace button
backspaceButton.addEventListener("click", function() {

    if (currentInput === "Error") {
        currentInput = "0";
    }
    else if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    }
    else {
        currentInput = "0";
    }

    updateDisplay();
});