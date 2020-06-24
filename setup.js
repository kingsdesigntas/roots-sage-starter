const fs = require("fs").promises;
const path = require("path");

const config = {
  themeName: "Sage Starter Theme",
  themeUri: "https://kingsdesign.com.au",
  description: "Sage is a Wordpress starter theme",
  version: "1.0.0",
  author: "KingsDesign",
  authorUri: "https://www.kingsdesign.com.au",
  devUrl: "http://kingsdesign.info",
  publicPath: "/wp-content/themes/roots-sage-starter",
  proxyUrl: "http://localhost:3000",
};

async function setup() {
  await updateConfigJSONFile();
  await updateStyleCSSFile();
  console.log("Done");
  return null;
}

setup();

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
