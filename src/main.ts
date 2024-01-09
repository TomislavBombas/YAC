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
      case String([0 - 9]):
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

// generate actions wrapper and button
const generateButtons: Function = (scheme: { [key: string]: Array<[]> | calcButtonsDefList }) => {
  let actionsWrapper: HTMLDivElement = document.createElement("div");
  actionsWrapper.setAttribute("class", "calc-actions");
  let structure = scheme.structure as Array<[]>;
  let actionsList: calcButtonsDefList = scheme.actions as calcButtonsDefList;
  console.log("structure", structure);
  console.log("actionsList", actionsList);
  structure.forEach((line: Array<string[]>) => {
    console.log(line);
    let prevSimbol: string;
    line.forEach((simbol: any) => {
      simbol = String(simbol);
      if (!Number.isNaN(simbol)) {
        let button: calcButton = generateButton(actions["handleSymbolInput"], simbol, { value: simbol, action: "number", color: "basic" });
        actionsWrapper.appendChild(button.element);
      } else {
        Object.keys(actionsList).forEach((key: string) => {
          const action = actionsList[key];
          const val: string = action["value"];
          if (val === simbol) {
            let button: calcButton = generateButton(actions["handleSymbolInput"], simbol, action);
            actionsWrapper.appendChild(button.element);
          }
        });
      }
    });
  });
  return actionsWrapper;
};

// ==========================================================

// ==========================================================
// Main function to generate calculator.
// ==========================================================
const generateCalculator = async (calc_type: string): Promise<void> => {
  const schema = await getScheme(calc_type);

  const calcWrapper: HTMLDivElement = document.createElement("div");
  calcWrapper.setAttribute("class", "calc");

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

generateCalculator("simple");
