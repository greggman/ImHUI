import {
  queueUpdate,
} from './core.js';

const darkMatcher = window.matchMedia("(prefers-color-scheme: dark)");
darkMatcher.addEventListener('change', () => {
  queueUpdate();
});

export function isDarkMode(): boolean {
  return darkMatcher.matches;
}
