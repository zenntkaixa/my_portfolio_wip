import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

// Neutral's restrained greys with the portfolio's cobalt accent (the --accent / --accent-soft /
// --accent-ink values in app/globals.css). Neutral sets no `color` seed, so the accent family is
// overridden token by token; everything else is inherited. [light, dark] pairs.
export const cobaltTheme = defineTheme({
  name: 'cobalt',
  extends: neutralTheme,
  tokens: {
    '--color-accent': ['#2b57e0', '#7e9cff'],
    '--color-accent-muted': ['#e3eafd', '#22325c'],
    '--color-text-accent': ['#2b57e0', '#7e9cff'],
    '--color-icon-accent': ['#2b57e0', '#7e9cff'],
    '--color-on-accent': ['#ffffff', '#0d1424'],
  },
});
