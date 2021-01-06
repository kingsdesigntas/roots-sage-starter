/* eslint-disable */

// const autoprefixer = require("autoprefixer");

// const cssnanoConfig = {
//   preset: ['default', { discardComments: { removeAll: true } }]
// };

// module.exports = ({ file, options }) => {
//   return {
//     parser: options.enabled.optimize ? 'postcss-safe-parser' : undefined,
//     plugins: {
//       autoprefixer: true,
//       cssnano: options.enabled.optimize ? cssnanoConfig : false,
//     },
//   };
// };

module.exports = {
  plugins: [
    require("postcss-preset-env")({
      browsers: "last 2 versions",
    }),
    require("autoprefixer"),
    require("tailwindcss"),
  ],
};
