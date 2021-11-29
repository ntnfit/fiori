sap.ui.define([
	"sap/ui/test/Opa5"
], function (Opa5) {
	"use strict";
	var sViewName = "App";
	Opa5.createPageObjects({
		onTheAppPage: {

			actions: {
                iClickOnUserMenu: function() {
                    return this.waitFor({
                        id: "usermenubtn",
                        controlType: "sap.m.Button",
                        viewName: sViewName,
                        success: function(oControl) {
                            oControl.firePress();
                            Opa5.assert.ok(true, "User menu dialog opened");
                        }
                    });
                }
            },

			assertions: {

				iShouldSeeTheApp: function () {
					return this.waitFor({
						id: "app",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The " + sViewName + " view is displayed");
						},
						errorMessage: "Did not find the " + sViewName + " view"
					});
                },
                
                iShouldSeeUserOption: function() {
                    return this.waitFor({
                        controlType: "sap.m.ActionSheet",
                        id: "usermenu",
                        viewName: sViewName,
                        success: function(oControl) {
                            Opa5.assert.ok(true, "The user menu is displayed");
                        }
                    });
                }
			}
		}
	});

});
