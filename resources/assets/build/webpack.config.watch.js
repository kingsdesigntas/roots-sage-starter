const proxyResponseRewrite = require("./util/proxyResponseRewrite");
const chokidar = require("chokidar");

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

const configureDevServer = (config) => {
  const [host, port = 80] = config.proxyUrl.split(":");
  const target = process.env.DEVURL || config.devUrl;

  return {
    devtool: "cheap-module-source-map",
    output: {
      publicPath: host + ":" + port + config.publicPath,
    },
    devServer: {
      injectHot: true,
      inline: true,
      before(app, server, compiler) {
        chokidar.watch(["./resources/views/**/*.php"]).on("all", function () {
          server.sockWrite(server.sockets, "content-changed", "view");
        });
      },
      host,
      hot: true,
      // open: true,
      overlay: true,
      port,
      publicPath: host + ":" + port + config.publicPath,
      proxy: {
        "*": {
          changeOrigin: true,
          secure: false,
          followRedirects: true,
          target,
          onProxyRes(proxyRes, req, res) {
            if (
              proxyRes.headers["content-type"] &&
              proxyRes.headers["content-type"].match(/^text\/html/)
            ) {
              proxyResponseRewrite(
                res,
                proxyRes.headers["content-encoding"],
                function (body) {
                  //Ensures the script is added only once
                  if (body && !res.hasHeader("x-webpack-embed")) {
                    res.setHeader("x-webpack-embed", "true");
                    // Add hmr-client
                    body = body.replace(
                      /<\/body>/,
                      `<script src="http://${config.proxyUrl}/wp-content/themes/quescreen/dist/scripts/hmr-client.js?host=${host}&port=${port}"></script></body>`
                    );

                    // rewrite links
                    const devUrlRegExp = new RegExp(
                      escapeRegExp(config.devUrl),
                      "g"
                    );

                    body = body.replace(
                      devUrlRegExp,
                      "http://" + config.proxyUrl
                    );
                  }

                  return body;
                }
              );
            }
          },
        },
      },
      // Allow access to WDS data from anywhere, including the standard non-proxied site URL
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
    },
  };
};

module.exports = configureDevServer;
