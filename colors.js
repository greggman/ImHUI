import { isDarkMode } from './globalState.js';
const darkColors = {
    lines: 'white',
};
const lightColors = {
    lines: 'black',
};
export function setColors(newLightColors, newDarkColors) {
    Object.assign(lightColors, newLightColors);
    Object.assign(darkColors, newDarkColors || newLightColors);
}
export function getColors() {
    return isDarkMode() ? darkColors : lightColors;
}
//# sourceMappingURL=colors.js.map