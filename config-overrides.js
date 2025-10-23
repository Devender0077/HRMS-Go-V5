module.exports = function override(config, env) {
  // Disable source map loader completely to avoid all source map related errors
  config.module.rules = config.module.rules.filter(
    rule => !(rule.loader && rule.loader.includes('source-map-loader'))
  );

  // Add fallback for Node.js modules that are used in browser
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    path: false,
    crypto: false,
  };

  // Ignore all source map warnings
  config.ignoreWarnings = [/.*/];

  // Ensure proper module resolution for @mui packages
  config.resolve.extensions = [...(config.resolve.extensions || []), '.js', '.jsx', '.json'];

  return config;
};
