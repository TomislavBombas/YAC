/// <reference types="vite/client" />

declare interface calcButton {
  id: string;
  element: hTMLButtonElement;
  action: Function;
  operator: number | string;
  value: number | string;
}

declare interface calcState {
  prev: number;
  current: string;
  action: string;
}

declare interface buttonDef {
  value: string;
  action: string;
  color: string;
}

declare interface calcButtonsDefList {
  [key: string]: buttonDef;
}
