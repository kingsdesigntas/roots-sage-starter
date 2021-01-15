const proxyResponseRewrite = require("./util/proxyResponseRewrite");
const chokidar = require("chokidar");
const getPort = require("get-port");

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

const configureDevServer = async (config) => {
  const [host, _port = 80] = config.proxyUrl.split(":");
  const target = process.env.DEVURL || config.devUrl;

  const port = await getPort({
    port: getPort.makeRange(+_port, +_port + 1000),
  });

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
      publicPath: config.publicPath,
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
              const [host, port = 80] = req.headers.host.split(":");
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
                      `<script src="http://${host}:${port}${config.publicPath}/scripts/hmr-client.js?host=${host}&port=${port}"></script></body>`
                    );

                    // rewrite links
                    const devUrlRegExp = new RegExp(
                      escapeRegExp(config.devUrl).replace(/https?/, "https?"),
                      "g"
                    );

                    body = body.replace(devUrlRegExp, `http://${host}:${port}`);
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
    resolve: {
      fallback: { url: require.resolve("url/") },
    },
  };
};

module.exports = configureDevServer;
