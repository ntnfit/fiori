sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
    "com/bosch/sbs/sbsfioritemplate/ui/model/models",
	"sap/f/FlexibleColumnLayoutSemanticHelper",
	'sap/f/IllustrationPool'
], function (UIComponent, Device, models,FlexibleColumnLayoutSemanticHelper, IllustrationPool) {
	"use strict";

	return UIComponent.extend("com.bosch.sbs.sbsfioritemplate.ui.Component", {

		metadata: {
			manifest: "json"
		},
		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			var oTntSet = {
				setFamily: "tnt",
				setURI: sap.ui.require.toUrl("sap/tnt/themes/base/illustrations")
			};

			// register tnt illustration set
			IllustrationPool.registerIllustrationSet(oTntSet, false);
        },


		/**
		 * Returns an instance of the semantic helper
		 * @returns {sap.f.FlexibleColumnLayoutSemanticHelper} An instance of the semantic helper
		 * @param {object} fcl flexible column layout
		 */
		getHelper: function (fcl) {
			////console.log(fcl);
			let oFCL = fcl,
				oParams = jQuery.sap.getUriParameters(),
				oSettings = {
					defaultTwoColumnLayoutType: sap.f.LayoutType.TwoColumnsMidExpanded,
					defaultThreeColumnLayoutType: sap.f.LayoutType.ThreeColumnsMidExpanded,
					mode: oParams.get("mode"),
					initialColumnsCount: oParams.get("initial"),
					maxColumnsCount: oParams.get("max")
				};
			return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
		}
	});
});
