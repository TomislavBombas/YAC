import "./scss/style.scss";
import "./components/button";
import { generateButton } from "./components/button";

// ===========================================================
//load caclulator schemes from external json file
// ===========================================================
const getScheme = async (scheme: string) => {
  const calcSchemes = await fetch("/calc-defs.json");
  const calcSchemesJson = await calcSchemes.json();
  const calcScheme = calcSchemesJson[scheme];

  return calcScheme;
};
// ===========================================================

const updateDisplay: Function = () => {
  const displayElement: HTMLSpanElement = document.querySelector(".calc-display") as HTMLSpanElement;
  calcState.current !== "" ? (displayElement.textContent = calcState.current) : (displayElement.textContent = "0");
};

// ===========================================================
// Actions section
// ===========================================================
let calcState: calcState = {
  prev: 0,
  current: "",
  action: "",
};

// what happens if you press a number
const actions: { [key: string]: Function } = {
  handleNumberInput: (number: number) => {
    calcState.current += number;
    updateDisplay();
  },
  handleSymbolInput: (symbol: string) => {
    if (calcState.current === "" && symbol !== ".") return;
    // do action based on symbol used
    switch (symbol) {
      case ".":
        calcState.current += symbol;
        updateDisplay();
        break;
      case "%":
      case "+":
      case "-":
      case "*":
      case "/":
        if (calcState.action === "") {
          calcState.action = symbol;
          calcState.prev = Number(calcState.current);
          calcState.current = "";
          // updateDisplay();
        } else {
          calcState.current = String(actions.doCalc());
          calcState.prev = 0;
          calcState.action = symbol;
          updateDisplay();
        }
        break;
      case "=":
        if (calcState.action !== "") {
          calcState.current = String(actions.doCalc());
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
      default:
        console.log("default");
        break;
    }
  },
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
    }
  },
};
// ===========================================================

// ===========================================================
// Generate keypad section of calculator
// ===========================================================
// insert number buttons into keypad
const createRangeButtons = (range: string, keypad: HTMLDivElement) => {
  if (range === "0-9") {
    for (let index = 0; index < 10; index++) {
      const val = 9 - index; // invert numbers so 9 goes to the top
      const digitButton: buttonDef = {
        value: String(val),
        action: "number",
        size: "small",
        color: "basic",
      };
      const element: calcButton = generateButton(actions["handleNumberInput"], val, digitButton);
      let button: HTMLButtonElement = element.element;
      if (val === 0) element.element.classList.add("calc-button-zero"); // mark a zero button if it needs to be diferent

      keypad.appendChild(button);
    }
  }
};

// generate keypad section wrapper and button
const generateKeypad = (numbers: { [key: string]: string | number | buttonDef }) => {
  let keypad: HTMLDivElement = document.createElement("div");
  keypad.setAttribute("class", "calc-keypad");

  Object.keys(numbers).forEach((key) => {
    switch (key) {
      case "range":
        createRangeButtons(numbers[key] as string, keypad);
        break;
      default:
        const defs: buttonDef = numbers[key] as buttonDef;
        let button: calcButton = generateButton(actions["handleSymbolInput"], defs.value, numbers[key] as buttonDef);
        keypad.appendChild(button.element);
        break;
    }
  });

  return keypad;
};

// generate actions wrapper and button
const generateActions: Function = (actionButtons: { [key: string]: buttonDef }) => {
  let actionsWrapper: HTMLDivElement = document.createElement("div");
  actionsWrapper.setAttribute("class", "calc-actions");

  Object.keys(actionButtons).forEach((key) => {
    const defs: buttonDef = actionButtons[key] as buttonDef;
    let button: calcButton = generateButton(actions["handleSymbolInput"], key, actionButtons[key]);
    actionsWrapper.appendChild(button.element);
  });
  return actionsWrapper;
};

// generate functions wrapper and button
const generateFunctions: Function = (functions: { [key: string]: buttonDef }) => {
  let functionsWrapper: HTMLDivElement = document.createElement("div");
  functionsWrapper.setAttribute("class", "calc-functions");

  Object.keys(functions).forEach((key) => {
    const defs: buttonDef = functions[key] as buttonDef;
    let button: calcButton = generateButton(actions["handleSymbolInput"], key, functions[key]);
    functionsWrapper.appendChild(button.element);
  });
  return functionsWrapper;
};
// ==========================================================

// ==========================================================
// Main function to generate calculator.
// ==========================================================
const generateCalculator = async (calc_type: string): Promise<void> => {
  const schema = await getScheme(calc_type);

  let sections = schema.sections;

  const calcWrapper: HTMLDivElement = document.createElement("div");
  calcWrapper.setAttribute("class", "calc");

  let display: HTMLSpanElement = document.createElement("div");
  display.setAttribute("class", "calc-display");
  calcWrapper.appendChild(display);

  let functions: HTMLDivElement = generateFunctions(sections.functions);
  functions.setAttribute("class", "calc-functions");
  calcWrapper.appendChild(functions);

  let keypad: HTMLDivElement = generateKeypad(sections.numbers);
  // this is to wrap the keypad in a rectangle
  console.log(keypad.childElementCount);
  if (keypad.childElementCount / 3 !== Math.round(keypad.childElementCount / 3)) {
    let zero = keypad.querySelector(".calc-button-zero");
    if (zero) zero.classList.add("large");
  }
  calcWrapper.appendChild(keypad);

  let actionsWrapper: HTMLDivElement = generateActions(sections.actions);
  calcWrapper.appendChild(actionsWrapper);

  App?.appendChild(calcWrapper);

  updateDisplay();
};
// ==========================================================

const App = document.getElementById("app");

generateCalculator("simple");
