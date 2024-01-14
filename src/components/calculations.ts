/**
 * All calculatior functions are in this file
 * I have pulled them out of mail.ts for easier maintenance
 *
 * ToDos
 * - add more functions
 */

export let calcState: calcState = {
  prev: 0,
  current: "",
  action: "",
  memory: 0,
};

export let calcVariables: { [key: string]: boolean | string } = {
  units: "deg",
};

const nthroot = (n: number, x: number) => Math.pow(x, 1 / n);

// limiting decimal places of PI to reduce errors regarding how computer handles floating point
const pi = Math.round(Math.PI * 10000000) / 10000000;

// ===========================================================
// Update display section of the calculator
// ===========================================================
// This functions is to limit the number of decimals to fit the screen
// and remove trailing zeros. In case of really large numbers, to convert
// to exponential notation
const roundNumberToFitDisplay = () => {
  // restrict number of decimals to fit the screen
  if (11 - Math.round(Number(calcState.current)) < 0) return Number(calcState.current);
  calcState.current = Number(calcState.current).toFixed(11 - Math.round(Number(calcState.current)));
  // remove trailing zeros at the end
  calcState.current = Number(calcState.current).toString();
};

// Updating display to the latest state of calculation
export const updateDisplay: Function = () => {
  if (calcState.current.length > 14) roundNumberToFitDisplay();
  const displayElement: HTMLSpanElement = document.querySelector(".calc-display") as HTMLSpanElement;
  calcState.current !== "" ? (displayElement.textContent = calcState.current) : (displayElement.textContent = "0");
};
// ===========================================================

// ===========================================================
// Custom functions
// ===========================================================
const customFunctions = (functionName: string) => {
  switch (functionName) {
    case "sin":
    case "cos":
    case "tan":
    case "log":
    case "abs":
    case "floor":
    case "ceil":
    case "round":
      calcState.current = String(Math[functionName](Number(calcState.current)));
      updateDisplay();
  }
};
// ===========================================================

// ===========================================================
// Actions section
// ===========================================================
export const calcActions: { [key: string]: Function } = {
  handleNumberInput: (number: number) => {
    if (calcState.current.indexOf(".") > -1 && String(number) === ".") return true;
    calcState.current += number;
    updateDisplay();
  },
  handleSymbolInput: (symbol: string) => {
    if (calcState.current === "" && symbol !== ".") return;
    // do action based on symbol used
    switch (symbol) {
      case "%":
      case "+":
      case "-":
      case "*":
      case "/":
      case "root":
        if (calcState.action === "") {
          calcState.action = symbol;
          calcState.prev = Number(calcState.current);
          calcState.current = "";
          // updateDisplay();
        } else {
          calcState.current = String(calcActions.doCalc());
          calcState.prev = 0;
          calcState.action = symbol;
          updateDisplay();
        }
        break;
      case "=":
      case "==":
        if (calcState.action !== "") {
          calcState.current = String(calcActions.doCalc());
          calcState.prev = 0;
          calcState.action = "";
          updateDisplay();
        }
        break;
      case "C":
        calcState.current = "";
        calcState.prev = 0;
        calcState.action = "";
        updateDisplay();
        break;
      case "M":
        if (calcState.memory !== 0) {
          calcState.memory = Number(calcState.current);
        } else {
          calcState.current = String(calcState.memory);
          calcState.memory = 0;
        }
        calcState.action = "";
        updateDisplay();
        break;
      case "±":
        calcState.current = String(Number(calcState.current) * -1);
        updateDisplay();
        break;
      case "sqr":
        calcState.current = String(Math.sqrt(Number(calcState.current)));
        updateDisplay();
        break;
      case "sin":
      case "cos":
        calcState.action = symbol;
        calcState.current = calcActions.doCalc();
        updateDisplay();
        break;
      default:
        console.log("default", symbol, calcState.action);
        break;
    }
  },
  // Calculation functions based on symbol used
  doCalc: () => {
    let currentCalculation = {
      first: calcState.prev,
      second: Number(calcState.current),
    };
    switch (calcState.action) {
      case "+":
        return currentCalculation.first + currentCalculation.second;
        break;
      case "-":
        return currentCalculation.first - currentCalculation.second;
        break;
      case "*":
        return currentCalculation.first * currentCalculation.second;
        break;
      case "/":
        return currentCalculation.first / currentCalculation.second;
        break;
      case "%":
        return (currentCalculation.second / currentCalculation.first) * 100;
        break;
      case "root":
        return nthroot(currentCalculation.second, currentCalculation.first);
        break;
      case "sin":
        if (calcVariables.units === "rad") {
          return Math.sin(Number(calcState.current));
        } else {
          return Math.sin(Number(calcState.current) / (180 / Math.PI));
        }
        break;
      case "cos":
        if (calcVariables.units === "rad") {
          return Math.cos(Number(calcState.current));
        } else {
          return Math.cos(Number(calcState.current) / (180 / Math.PI));
        }
        break;
      default:
        console.log("default calc", calcState.action);
        break;
    }
  },
  handleToggle: (symbol: string, e: MouseEvent) => {
    const toggleElement: HTMLElement = e.target as HTMLElement;
    const parentElement: HTMLElement = toggleElement.parentElement!;
    parentElement.classList.toggle("toggled");

    let currentValue: number = Number(calcState.current);
    switch (symbol) {
      case "rad/deg":
        // switch global units
        calcVariables.units === "deg" ? (calcVariables.units = "rad") : (calcVariables.units = "deg");

        //convert current value to new units
        calcVariables.units === "rad"
          ? (currentValue *= pi / 180) // degrees to radians
          : (currentValue *= 180 / pi); // radians to degrees
        break;
      default:
        console.log("default toggle", symbol);
        break;
    }

    calcState.current = String(currentValue);
    calcState.action = "";
    updateDisplay();
  },
  handleDropdown: (symbol: string, e: MouseEvent) => {
    let clickElement: HTMLElement;
    let dropdownElement: HTMLElement = e.target as HTMLElement;
    if (dropdownElement.hasAttribute("data")) {
      clickElement = e.target as HTMLElement;
      customFunctions(clickElement.getAttribute("data") as string);
      dropdownElement = clickElement.parentElement!.parentElement!;
    }
    dropdownElement.classList.toggle("toggled");
  },
};
// ===========================================================
