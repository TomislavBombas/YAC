/// <reference types="vite/client" />

declare interface calcButton {
  id: string;
  element: hTMLButtonElement;
  action: Function;
  type: string;
  operator: number | string;
  value: number | string;
}

declare interface calcState {
  prev: number;
  current: string;
  action: string;
  memory: number;
}

declare interface buttonDef {
  name: string;
  value: [] | string;
  action: string;
  type: string;
  color: string;
  icon: string;
}

declare interface calcButtonsDefList {
  [key: string]: buttonDef;
}
