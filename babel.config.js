module.exports = function (api) {
	api.cache(true);
	const presets = [
		[
			"@babel/preset-env",
			{
				corejs: {
					version: "3",
					proposals: true,
				},
				useBuiltIns: "entry",
				targets: {
					browsers: ["firefox 48"],
				},
			},
		],
	];

	return {
		presets,
	};
};
