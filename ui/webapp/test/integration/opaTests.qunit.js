/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/bosch/sbs/gng8hc/ui/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
