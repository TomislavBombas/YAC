import "./scss/style.scss";
import "./components/button";
import { generateButton } from "./components/button";

// ===========================================================
// load caclulator schemes from external json file
// ===========================================================
const getScheme = async (scheme: string) => {
  const calcSchemes = await fetch("/calc-defs.json");
  const calcSchemesJson = await calcSchemes.json();
  const calcScheme = calcSchemesJson[scheme];

  return calcScheme;
};
// ===========================================================

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

const updateDisplay: Function = () => {
  if (calcState.current.length > 14) roundNumberToFitDisplay();
  const displayElement: HTMLSpanElement = document.querySelector(".calc-display") as HTMLSpanElement;
  calcState.current !== "" ? (displayElement.textContent = calcState.current) : (displayElement.textContent = "0");
};
// ===========================================================

// ===========================================================
// Actions section
// ===========================================================
let calcState: calcState = {
  prev: 0,
  current: "",
  action: "",
  memory: 0,
};

// what happens if you press a number
const actions: { [key: string]: Function } = {
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
      default:
        console.log("default");
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
    }
  },
};
// ===========================================================

// ===========================================================
// Generate keypad section of calculator
// ===========================================================

// generate actions wrapper and button
const generateButtons: Function = (scheme: { [key: string]: Array<[]> | calcButtonsDefList }) => {
  // create DOM element to hold buttons
  const buttonsWrapper: HTMLDivElement = document.createElement("div");
  buttonsWrapper.setAttribute("class", "calc-actions");

  // get the calculator structure to be used in generation of buttons
  const structure = scheme.structure as Array<[]>;

  // get the actions to be used to add functions to buttons
  const actionsList: calcButtonsDefList = scheme.actions as calcButtonsDefList;

  // generate buttons based on structure
  structure.forEach((line: Array<string[]>) => {
    let prevSimbol: string;
    //go through each line defined in JSON file
    line.forEach((simbol: any, index: number) => {
      // check for last button in row
      let lastLine = false;
      if (index === line.length - 1) lastLine = true;

      // create buttons
      if (Number(simbol) == simbol || simbol === ".") {
        // if simbol is number add the button with simple input
        let button: calcButton = generateButton(actions["handleNumberInput"], simbol, {
          value: simbol,
          action: "number",
          type: "button",
          icon: "",
          color: "basic",
        });
        if (lastLine) button.element.classList.add("last");
        buttonsWrapper.appendChild(button.element);
      } else {
        // if simbol is not number add a button with action
        Object.keys(actionsList).forEach((key: string) => {
          const buttonDefinition = actionsList[key];
          const val: string = buttonDefinition["value"];
          if (val === simbol.charAt(0)) {
            let button: calcButton = generateButton(actions["handleSymbolInput"], simbol, buttonDefinition);
            if (doubleSymbol(simbol)) {
              button.element.classList.add("large");
              button.element.innerHTML = simbol.charAt(0);
            }
            if (lastLine) button.element.classList.add("last");
            buttonsWrapper.appendChild(button.element);
          }
        });
      }
    });
  });
  return buttonsWrapper;
};

// chek if button has a double symbol, that means it is a large horisontal button
const doubleSymbol = (simbol: string) => {
  const simbolArray = [...simbol];

  if (simbolArray.length === 1) return false;

  let prevSimbol: string = "";
  let isDouble: boolean | void = false;
  simbolArray.forEach((element: string) => {
    if (element === prevSimbol) isDouble = true;
    prevSimbol = element;
  });
  return isDouble;
};

// ==========================================================

// ==========================================================
// Main function to generate calculator.
// ==========================================================
const generateCalculator = async (calc_type: string): Promise<void> => {
  const schema = await getScheme(calc_type);

  const calcWrapper: HTMLDivElement = document.createElement("div");
  calcWrapper.classList.add("calc", "calc-width-" + schema.structure[0].length);

  let display: HTMLDivElement = document.createElement("div");
  display.setAttribute("class", "calc-display");
  calcWrapper.appendChild(display);

  let buttonsWrapper: HTMLDivElement = generateButtons(schema);
  buttonsWrapper.setAttribute("class", "calc-buttons");
  calcWrapper.appendChild(buttonsWrapper);

  App?.appendChild(calcWrapper);

  updateDisplay();
};
// ==========================================================

const App = document.getElementById("app");

generateCalculator("scientific");
