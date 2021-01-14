// DON'T EDIT HERE
const fs = require("fs").promises;
const path = require("path");
//
//

// ==============
//
//  EDIT THIS CONFIG
//
// ==============

/**
 * Replace any config values with {value} to your settings
 * You should have created a blank/vanilla install on the dev server
 * and configured a DNS rule in Cloudflare for {dev-subdomain}.kingsdesign.info
 * to point to that install
 */

const config = {
  themeName: "{Your Theme Name}",
  themeUri: "https://{clientdomain.com.au}",
  description: "Theme for {Client Name}",
  version: "1.0.0",
  author: "KingsDesign",
  authorUri: "https://www.kingsdesign.com.au",
  devUrl: "https://{dev-subdomain}.kingsdesign.info",
  publicPath: "/wp-content/themes/{theme-name}",
  proxyUrl: "localhost:3000",
};

// ==============
//
//  DONE EDITING, STOP HERE
//
// ==============
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

async function setup() {
  validateConfigHash();
  await updateConfigJSONFile();
  await updateStyleCSSFile();
  console.log("Done");
  return null;
}

setup();

function validateConfigHash() {
  Object.keys(config).map((configKey) => {
    if (config[configKey].match(/{(.*?)}/)) {
      console.error(`Please update your setup.js file, key: ${configKey}`);
      process.exitCode = 1;
      process.exit;
    }
  });
}

async function updateConfigJSONFile() {
  const configFilePath = path.join(
    process.cwd(),
    "resources/assets/config.json"
  );

  try {
    //Read the config file
    const configFileContent = await fs.readFile(configFilePath, "utf-8");
    //Parse it to JSON
    const configFileJSON = JSON.parse(configFileContent);

    //Update the config keys
    Object.keys(configFileJSON).map((configKey) => {
      if (typeof config[configKey] !== `undefined`) {
        configFileJSON[configKey] = config[configKey];
      }
    });

    //Write the file back out
    await fs.writeFile(
      configFilePath,
      JSON.stringify(configFileJSON, null, 2),
      "utf-8"
    );
    return true;
  } catch (e) {
    console.error("Failed to update config.json", e);
    process.exitCode = 1;
    process.exit;
    return false;
  }
}

async function updateStyleCSSFile() {
  const styleCSSFilePath = path.join(process.cwd(), "resources/style.css");
  await updateCSSMeta(styleCSSFilePath, config);
}

/**
 * Read a css file and parse and update the meta at the top
 * @param {*} filePath
 */
async function updateCSSMeta(filePath, config) {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const lines = fileContent.split("\n");
    let lineIndex = 0;
    let startMatched = false;
    let isReading = true;
    while (lineIndex < lines.length - 1 && isReading) {
      const line = lines[lineIndex];
      const currentLineIndex = lineIndex;
      lineIndex++;

      //Watch for the start
      if (!startMatched) {
        if (line.match(/^\s*\/\*\s*/)) {
          startMatched = true;
        }
        continue;
      }

      //Watch for the end
      if (line.match(/^\s*\*\/\s*/)) {
        isReading = false;
        continue;
      }

      //Parse the line
      if (!line.length || typeof line.split !== `function`) continue;
      const parts = line.split(":");
      if (parts.length < 2) continue;

      const wordKey = parts[0];
      const key = camelCaseFromWords(wordKey.trim());
      //const value = parts.slice(1).join(":").trim();

      //Finally, maybe update the line
      if (typeof config[key] !== `undefined`) {
        lines[currentLineIndex] = `${wordKey}: ${config[key]}`;
      }
    }

    //Write the lines back to the file
    const newFileContent = lines.join("\n");
    await fs.writeFile(filePath, newFileContent, "utf-8");
  } catch (e) {
    console.error(`Failed to read CSS file ${filePath}.`, e);
    process.exitCode = 1;
    process.exit;
    return false;
  }
}

/**
 * Convert a key such as 'Theme Name' to themeName
 * @param {String} key
 */
function camelCaseFromWords(key) {
  key = key.split(" ");
  key = key.map((k) => k.charAt(0).toUpperCase() + k.substr(1).toLowerCase());
  return key[0].toLowerCase() + key.slice(1).join();
}
