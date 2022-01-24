sap.ui.define([
	"sap/ui/test/Opa5"
], function (Opa5) {
	"use strict";
	var sViewName = "Form";
	Opa5.createPageObjects({
		onTheAdminPage: {

			actions: {
            },

			assertions: {

				iShouldSeeTheAdmin: function () {
					return this.waitFor({
						id: "page",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The " + sViewName + " view is displayed");
						},
						errorMessage: "Did not find the " + sViewName + " view"
					});
                }
			}
		}
	});

});
