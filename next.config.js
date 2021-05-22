const { ESBuildMinifyPlugin, ESBuildPlugin } = require('esbuild-loader');

module.exports = {
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new ESBuildPlugin(),
      new webpack.ProvidePlugin({
        React: "react",
      })
    );

    const terserIndex = config.optimization.minimizer.findIndex(
      (minimizer) => minimizer.constructor.name === "TerserPlugin"
    );
    if (terserIndex > -1) {
      config.optimization.minimizer.splice(
        terserIndex,
        1,
        new ESBuildMinifyPlugin()
      );
    }

    const jsLoader = config.module.rules.find(
      (rule) => rule.test && rule.test.test(".tsx")
    );
    if (jsLoader) {
      jsLoader.use.loader = 'esbuild-loader';
      jsLoader.use.options = {
        loader: "tsx",
        target: "es2017",
      };
    }

    return config;
  }
}
