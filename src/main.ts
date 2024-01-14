import "./scss/style.scss";
import { generateButton } from "./components/button";
import { calcActions, updateDisplay } from "./components/calculations";

// ===========================================================
// load caclulator schemes from external json file
// ===========================================================
const getScheme = async (scheme: string) => {
  const calcSchemes = await fetch("/calc-defs.json");
  const calcSchemesJson = await calcSchemes.json();
  const calcScheme = calcSchemesJson[scheme];
  calcScheme.actions = calcSchemesJson.actions;

  return calcScheme;
};
// ===========================================================

// ===========================================================
// Actions section
// ===========================================================
// all actions are pulled from ./components/calculations.ts
const actions = calcActions;
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

      // -----------------------------------------
      // create buttons
      // check if it is simple input 0-9 and . or it is a symbol representing a function
      // -----------------------------------------
      if (Number(simbol) == simbol || simbol === ".") {
        // if simbol is number add the button with simple input
        let button: calcButton = generateButton(actions["handleNumberInput"], simbol, {
          name: simbol,
          value: "",
          action: "number",
          type: "button",
          icon: "",
          color: "basic",
        });
        if (lastLine) button.element.classList.add("last");
        buttonsWrapper.appendChild(button.element);
        // -----------------------------------------
      } else {
        // -----------------------------------------
        // if simbol is not number or a dot add a button with action
        // go through all actions and check if the action is the same as the simbol
        Object.keys(actionsList).forEach((key: string) => {
          // get the button definition from actions list
          const buttonDefinition = actionsList[key];
          const val: string = buttonDefinition.name;
          // if the action is the same as the simbol generate the button
          if (val === simbol) {
            let button: calcButton;
            switch (buttonDefinition.type) {
              case "button":
                button = generateButton(actions["handleSymbolInput"], simbol, buttonDefinition);
                if (lastLine) button.element.classList.add("last");
                buttonsWrapper.appendChild(button.element);
                break;
              case "toggle":
                button = generateButton(actions["handleToggle"], simbol, buttonDefinition);
                if (lastLine) button.element.classList.add("last");
                buttonsWrapper.appendChild(button.element);
                break;
              case "dropdown":
                button = generateButton(actions["handleDropdown"], simbol, buttonDefinition);
                if (lastLine) button.element.classList.add("last");
                buttonsWrapper.appendChild(button.element);
                break;

              default:
                break;
            }
          }
        });
        // -----------------------------------------
      }
    });
  });
  return buttonsWrapper;
};

// ==========================================================

// ==========================================================
// Main function to generate calculator.
// ==========================================================
const generateCalculator = async (calc_type: string): Promise<void> => {
  // load calculator definition from external json file
  const schema = await getScheme(calc_type);

  // create DOM element to hold calculator
  const calcWrapper: HTMLDivElement = document.createElement("div");
  calcWrapper.classList.add("calc", "calc-width-" + schema.structure[0].length);

  // create DOM element to display calculations, basically calculator screen display
  let display: HTMLDivElement = document.createElement("div");
  display.setAttribute("class", "calc-display");
  calcWrapper.appendChild(display);

  // create DOM element to hold buttons
  let buttonsWrapper: HTMLDivElement = generateButtons(schema);
  buttonsWrapper.setAttribute("class", "calc-buttons");
  calcWrapper.appendChild(buttonsWrapper);

  // add calculator to DOM
  App?.appendChild(calcWrapper);

  updateDisplay();
};
// ==========================================================

const App = document.getElementById("app");

generateCalculator("simple");
//generateCalculator("scientific");
