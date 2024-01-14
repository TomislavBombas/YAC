/**
 * Creates a single item HTML Element
 * and returns it
 */

// check if button has a double symbol, that means it is a large horisontal button
const doubleSymbol = (simbol: string) => {
  const simbolArray = [...simbol];

  if (simbolArray.length === 1) return false;

  let prevSimbol: string = "";
  let isDouble: boolean = false;
  simbolArray.forEach((element: string) => {
    element === prevSimbol ? (isDouble = true) : (isDouble = false);
    prevSimbol = element;
  });
  return isDouble;
};

// some buttons are special and have a different HTML structure
const createCustomElement = (data: buttonDef) => {
  const name = data.name;
  const type = data.type;
  let element: HTMLElement;
  switch (type) {
    case "toggle":
      element = document.createElement("div");
      element.setAttribute("class", "calc-toggle");
      const options = name.split("/");
      element.innerHTML =
        '<div class="calc-toggle-option">' + options[0] + '</div><div class="calc-toggle-option">' + options[1] + '</div><div class="calc-toggle-cover"></div>';
      break;
    case "dropdown":
      const dropdownOptions: [] = data.value as [];
      element = document.createElement("div");
      element.setAttribute("class", "calc-dropdown");
      let elementHtml = '<div class="calc-dropdown-default">';
      data.icon !== "" ? (elementHtml += '<img src="icons/' + data.icon + '.svg" alt="' + name + '" class="calc-button-icon">') : (elementHtml += name);
      elementHtml += '</div><div class="calc-dropdown-options">';
      dropdownOptions.map((option: string) => {
        elementHtml += '<div class="calc-dropdown-option" data="' + option + '">' + option + " (x)</div>";
      });
      elementHtml += "</div>";
      element.innerHTML = elementHtml;
      break;
    default:
      throw new Error("Button type not found");
  }
  return element;
};

// =====================================================================
// this is the main function that generates a button
// =====================================================================
export const generateButton = (action: Function, operator: number | string, data: buttonDef) => {
  // Generate a unique ID for the button.
  let id: string;
  data.action !== "number" ? (id = "button-" + data.action) : (id = "button-" + data.action + "-" + data.name);

  // Create a button html element.
  let buttonElement: HTMLElement;

  data.type === "button" ? (buttonElement = document.createElement("button")) : (buttonElement = createCustomElement(data));

  buttonElement.setAttribute("id", id);
  buttonElement.setAttribute("class", "calc-" + data.type);
  switch (operator) {
    case "=":
      buttonElement.classList.add("calc-button-equal");
      break;
    case "C":
      buttonElement.classList.add("calc-button-clear");
      break;
    default:
      buttonElement.classList.add("calc-button-operator");
      break;
  }

  let simbol = String(data.name);
  buttonElement.classList.add("calc-button-color-" + data.color);
  if (doubleSymbol(simbol)) {
    buttonElement.classList.add("large");
    simbol = simbol.charAt(0);
  }
  // Set the button's text or icon if defined.
  if (data.type === "button") {
    data.icon === ""
      ? (buttonElement.innerHTML = simbol)
      : (buttonElement.innerHTML = '<img src="icons/' + data.icon + '.svg" alt="' + data.action + '" class="calc-button-icon" />');
  }
  buttonElement.addEventListener("click", (e: MouseEvent) => {
    action(data.name, e);
  });
  if (data.color === "accent") buttonElement.classList.add("calc-button-color-accent");
  //if (data.size) buttonElement.classList.add(data.size);
  // Create a button element.
  const button: calcButton = {
    id: id,
    element: buttonElement,
    action: action,
    type: data.type,
    operator: operator,
    value: data.name,
  };

  return button;
};
// =======================================================
