var SockJS = require("sockjs-client");
var url = require("url");

console.log("[HMR] Client ready");

// Connect to WebpackDevServer via a socket.
var connection = new SockJS(
  url.format({
    // Default values - Updated to your own
    protocol: "http",
    hostname: getQueryVariable("host", "localhost"),
    port: getQueryVariable("port", "3000"),
    // Hardcoded in WebpackDevServer
    pathname: "/sockjs-node",
  })
);

var isFirstCompilation = true;
var mostRecentCompilationHash = null;

connection.onmessage = function (e) {
  var message = JSON.parse(e.data);
  switch (message.type) {
    case "hash":
      handleAvailableHash(message.data);
      break;
    case "still-ok":
    case "ok":
    case "content-changed":
      handleSuccess(message.data);
      break;
    default:
    // Do nothing.
  }
};

// Is there a newer version of this code available?
function isUpdateAvailable() {
  /* globals __webpack_hash__ */
  // __webpack_hash__ is the hash of the current compilation.
  // It's a global variable injected by Webpack.
  return mostRecentCompilationHash !== __webpack_hash__;
}

function handleAvailableHash(data) {
  mostRecentCompilationHash = data;
}

function handleSuccess(data) {
  if (data && data === "view") {
    return handleUpdates(true);
  }

  var isHotUpdate = !isFirstCompilation;
  isFirstCompilation = false;

  if (isHotUpdate) {
    handleUpdates();
  }
}

function handleUpdates(force) {
  if (!isUpdateAvailable() && !force) return;
  console.log("%c Reloading assets", "color: #FF00FF");
  window.location.reload();
}

function getQueryVariable(variable, _default = null) {
  var query = document.currentScript.src.split("?");
  if (!query || !query.length) return _default;
  query = query.slice(-1)[0];
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return _default;
}
