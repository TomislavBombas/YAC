export const generateButton = (action: Function, operator: number | string, data: buttonDef) => {
  // Generate a unique ID for the button.
  let id: string;
  data.action !== "number" ? (id = "button-" + data.action) : (id = "button-" + data.action + "-" + data.value);

  // Create a button html element.
  let buttonElement: HTMLButtonElement;
  buttonElement = document.createElement("button");
  switch (data.type) {
    case "button":
      break;

    default:
      throw new Error("Error: Button type not defined.");
      break;
  }
  buttonElement.setAttribute("id", id);
  buttonElement.setAttribute("class", "calc-button");
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

  // Set the button's text or icon if defined.
  data.icon === ""
    ? (buttonElement.innerHTML = String(data.value))
    : (buttonElement.innerHTML = '<img src="icons/' + data.icon + '.svg" alt="' + data.action + '" class="calc-button-icon" />');
  buttonElement.addEventListener("click", () => {
    action(data.value);
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
    value: data.value,
  };

  return button;
};
