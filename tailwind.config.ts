import type { Config } from "tailwindcss";

const svgToDataUri = require("mini-svg-data-uri");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme('colors'));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, value]) => [`--${key}`, value])
  );

  addBase({
    ':root': newVars,
  });
}

function addSvgPatterns({ matchUtilities, theme }: any) {
  matchUtilities(
    {
      'bg-grid': (value: any) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
        )}")`,
      }),
      'bg-grid-small': (value: any) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
        )}")`,
      }),
      'bg-dot': (value: any) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
        )}")`,
      }),
    },
    { values: flattenColorPalette(theme('backgroundColor')), type: 'color' }
  );
}


const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
        // scroll: "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
        bannermove: 'bannermove 10s linear infinite',
      },
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'], // Add Rubik font family
      },
      backgroundImage: {
        'explore': 'url(/redesign/explore.svg)',
        'blur-hero': 'url(/redesign/Hero.png)',
        'portfolio': 'url(/redesign/Cubic.png)',
        'choose-us': 'url(/redesign/Sphere.png)',
        'borrow': 'url(/redesign/Helix.png)',
        'trade': 'url(/redesign/Trade.png)',
        'faucet': 'url(/redesign/Faucet.png)',
        'presale': 'url(/redesign/Presale.png)',
        'stake': 'url(/redesign/Stake.png)',
        'custom': 'url(/redesign/Custom.png)',
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'custom-linier-gradient-purple': 'radial-gradient(100% 173% at 0 0, rgba(250,178,239,.45) 0%, rgba(235,38,235,.36) 18%, rgba(178,38,155,.16) 40%, rgba(22,15,56,0) 60%), linear-gradient(188deg, #140f34, #140f3400)',
        'custom-radial-gradient': 'radial-gradient(102.12% 96.05% at 90.28% 96.15%, rgba(25, 42, 86,1.0) 0%, rgba(15,9,45,0) 100%)',
        'custom-linear-gradient': 'linear-gradient(122.29deg, rgba(0, 0, 0, 1) 0%, rgba(25, 42, 86,1.0) 45.53%, rgba(101, 101, 101, 0) 100%)',
      },
      keyframes: {
        spotlight: {
          '0%': { opacity: '0', transform: 'translate(-70%, -60%) scale(0.5)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -10%) scale(1)' },
        },
        bannermove: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(-40%, 0)' },
        }
      }
    },
  },
  plugins: [addVariablesForColors, addSvgPatterns, require('daisyui'),],
};
export default config;
