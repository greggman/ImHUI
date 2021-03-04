import {isDarkMode} from './globalState.js';

const darkColors: Record<string, string> = {
  lines: 'white',
}
const lightColors: Record<string, string> = {
  lines: 'black',
};

export function setColors(
    newLightColors: Record<string, string>,
    newDarkColors?: Record<string, string>) {
  Object.assign(lightColors, newLightColors);
  Object.assign(darkColors, newDarkColors || newLightColors);
}

export function getColors(): Record<string, string> {
  return isDarkMode() ? darkColors : lightColors;
}
