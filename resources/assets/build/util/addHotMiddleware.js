/**
 * Loop through webpack entry
 * and add the hot middleware
 * @param  {Object} entry webpack entry
 * @return {Object} entry with hot middleware
 */
module.exports = (entry) => {
  const results = {
    ["hmr-client"]: `${__dirname}/../helpers/hmr-client.js`,
  };

  Object.keys(entry).forEach((name) => {
    results[name] = entry[name];
  });

  return results;
};
