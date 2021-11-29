module.exports = function(config) {
	"use strict";

	config.set({
        frameworks: ["ui5"],
		ui5: {
			url: "https://sapui5.hana.ondemand.com"
		},
		preprocessors: {
			"{webapp,webapp/!(test)}/!(mock*).js": ["coverage"]
		},
		coverageReporter: {
			includeAllSources: true,
			reporters: [
				{
					type: "html",
					dir: "coverage"
				},
				{
					type: "text"
				}
			],
			check: {
				each: {
					statements: 75,
					branches: 75,
					functions: 75,
					lines: 75
				}
			}
		},
      	
      	port: 9876,
		browserNoActivityTimeout: 100000,
		browserDisconnectTimeout: 100000,
		reporters: ["progress", "coverage"],

        browsers: ["ChromiumHeadless"],
        
        browserConsoleLogOptions: {
			level: "error"
        },

		singleRun: true
	});
};
