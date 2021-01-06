const { URL } = require("url");
const webpack = require("webpack");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = (config) => {
  const target = process.env.DEVURL || config.devUrl;

  const [host, port = 80] = config.proxyUrl.split(":");

  /**
   * We do this to enable injection over SSL.
   */
  if (new URL(target).protocol === "https:") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

    config.proxyUrl = config.proxyUrl.replace("http:", "https:");
  }

  return {
    output: {
      pathinfo: true,
      publicPath: config.proxyUrl + config.publicPath,
    },
    devtool: "cheap-module-source-map",
    stats: false,
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new BrowserSyncPlugin({
        open: config.open,
        files: config.watch,
        reloadDelay: 500,
        ui: false,
        proxy: target,
        host,
        port,
      }),
    ],
  };
};
