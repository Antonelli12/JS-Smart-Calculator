// Variable tracking the open parentheses
let openParenthesesCount = 0;

// Variable tracking whether the calculation is completed or not
let calculated = false;

// Imports buttons and the display from the calculator interface
const display = document.querySelector(".display");
const buttons = document.querySelectorAll(".button-grid button");

// Checks if the last character of the current input is an operator
function isLastCharOperator() {
    const operators = ["+", "-", "*", "/"];
    const lastChar = display.value[display.value.length - 1];
    return operators.includes(lastChar);
}

// The function detects implicit multiplication between a number and parentheses, and adds "*" for the eval() unction to understand the expression 
function handleImplicitMultiplication(expression) {
    return expression
        .replace(/(\d)(\()/g, "$1*(") 
        .replace(/(\))(\d)/g, ")*$2") 
        .replace(/(\))(\()/g, ")*("); 
}

// Loop through all calculator buttons and attach a event listener to handle user input when they are clicked
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const buttonText = button.textContent.trim();
        
        // Handle the 'AC' button clears the display entirely
        if (buttonText === "AC") {
            display.value = "";

        // Handle the 'DEL' button deletes the last character on the display
        } else if (buttonText === "DEL") {
            display.value = display.value.slice(0, -1);

        // Handle the '=' button to evaluate the current expression
        } else if (buttonText === "=") {
            if (display.value.trim() === "") {
                // Do nothing if the display is empty
                return;
            }

            try {
                let expression = display.value;

                // Insert multiplication where needed for the eval() to properly understand the expression
                expression = handleImplicitMultiplication(expression);

                // This makes sure the eval() understands % as a percentage and not as a div operation
                expression = expression.replace(/(\d+)%(\d+)/g, "($1*$2/100)");

                // Use eval to compute the final result of the expression
                display.value = eval(expression);
                calculated = true;
            } catch (error) {
                // If an error is detected during evaluation, display "Error"
                display.value = "Error";
                calculated = true;
            }
        
        // Handles "()" button
        // Parentheses '()' button has its logic set to alternate between adding opening and closing parentheses
        } else if (buttonText === "( )") {
            const openParentheses = (display.value.match(/\(/g) || []).length;
            const closeParentheses = (display.value.match(/\)/g) || []).length;
            
            // If a calucation is just finished, reset the display before adding parentheses
            if (calculated) {
                display.value = "";
                calculated = false;
            }

            // If there are more open parentheses add a closing parentheses, otherwise add an opening one
            if (openParentheses > closeParentheses) {
                display.value += ")";
            } else {
                display.value += "(";
            }

        // Handles the "." button
        // This ensures there is only one decimal point per number
        } else if (buttonText === ".") {
            const lastNumber = display.value.split(/[\+\-\*\/]/).pop();

            // Clear the display if a calculation  was just finished and a decimal is pressed
            if (calculated) {
                display.value = "";
                calculated = false;
            }

            // Only append a decimal if the last number doesn't already have one
            if (!lastNumber.includes(".")) {
                display.value += ".";
            }

        // Handle the '%' button
        // Appends the '%' sign to the display
        } else if (buttonText === "%") {
            if (!isLastCharOperator() && display.value !== "") {
                display.value += "%";
            }

        // Handle the operator buttons (+, -, *, /)
        } else if (["+", "-", "*", "/"].includes(buttonText)) {
            // Replace the last operator with the new one if an operator was the last input
            if (isLastCharOperator()) {
                display.value = display.value.slice(0, -1) + buttonText;
            // If a calculation was just finished, add the operator to the end of the string
            } else if (display.value !== "") {
                if (calculated) {
                    calculated = false;
                }
                // Append the operator to the display
                display.value += buttonText;
            }

        // Handle numbers and append them to the display
        } else {
            // If a result was calculated, clear the display when a number, parentheses, or decimal is pressed
            if (calculated) {
                display.value = "";
                calculated = false;
            }
            // Append the number to the current expression
            display.value += buttonText;
        }
    });
});
