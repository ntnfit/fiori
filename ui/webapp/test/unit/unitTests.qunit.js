/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/bosch/sbs/gan9hc/ui/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
