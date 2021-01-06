const path = require("path");

module.exports = {
  plugins: [
    require("postcss-preset-env")({
      browsers: "last 2 versions",
    }),
    require("autoprefixer"),
    require("tailwindcss")(
      path.join(__dirname, `../styles/tailwind.config.js`)
    ),
  ],
};
