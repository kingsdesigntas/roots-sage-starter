const plugin = require("tailwindcss/plugin");

const containerPadding = "1rem";

const colors = {
  //Add your theme here
  // EG
  // gray: {
  //   50: "#DADCDE",
  //   100: "#CED1D3",
  //   200: "#BDC1C5",
  //   300: "#A7ACB1",
  //   400: "#8A9197",
  //   500: "#656C72",
  //   600: "#575C60",
  //   700: "#4A4F51",
  //   800: "#404345",
  //   900: "#36393A",
  // },
};

module.exports = {
  purge: [
 "./resources/**/*.php",
 "./resources/assets/styles/**/*.scss",
 "./app/**/*.php",
 ],
  mode: 'jit',
  theme: {
    container: {
      center: true,
      padding: containerPadding,
    },
    extend: {
      colors,
    },
  },
  variants: {
    margin: ["responsive", "last"],
  },
  plugins: [
    plugin(({ addUtilities, theme }) => {
      const breakpoints = theme("screens", {});

      const containerMargins = {
        ".ml-container": {
          ...Object.keys(breakpoints).reduce((obj, key) => {
            obj[`@screen ${key}`] = {
              marginLeft: `calc(((100vw - ${breakpoints[key]}) / 2) + ${containerPadding})`,
            };
            return obj;
          }, {}),
        },
        ".mr-container": {
          ...Object.keys(breakpoints).reduce((obj, key) => {
            obj[`@screen ${key}`] = {
              marginRight: `calc(((100vw - ${breakpoints[key]}) / 2) + ${containerPadding})`,
            };
            return obj;
          }, {}),
        },
      };

      addUtilities(containerMargins, {
        variants: ["responsive"],
      });
    }),
    plugin(({ addUtilities, theme }) => {
      const adminBar = {
        ".top-admin": {
          top: "32px",
        },
      };

      addUtilities(adminBar, {
        variants: ["adminbar", "responsive"],
      });
    }),
    plugin(({ addVariant, e }) => {
      addVariant("adminbar", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `body.admin-bar .${e(`admin-bar${separator}${className}`)}`;
        });
      });
    }),
    plugin(function ({ addComponents, addUtilities, theme }) {
      const stack = {
        ".stack": {
          display: "flex",
          flexDirection: "column",
          "&>*:first-child": {
            marginTop: 0,
          },
          "&>*:last-child": {
            marginBottom: 0,
          },
        },
        ".is-inline": {
          flexDirection: "row",
          "&>*:first-child": {
            marginLeft: 0,
          },
          "&>*:last-child": {
            marginRight: 0,
          },
        },
      };

      addComponents(stack, {
        variants: ["responsive"],
      });
    }),
  ],
};
