const path = require("path");

module.exports = {
	mode: "production",
	entry: ["core-js/stable", "./docs/js/index.js"],
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /@babel(?:\/|\\{1,2})runtime|core-js/,
				use: {
					loader: "babel-loader",
					options: {
						babelrc: false,
						configFile: path.resolve(__dirname, "babel.config.js"),
						compact: false,
						cacheDirectory: false,
						sourceMaps: false,
					},
				},
			},
		],
	},
	devtool: false,
	output: {
		path: path.resolve(__dirname, "./docs/js/"),
		filename: "bundle.js",
	},
};
