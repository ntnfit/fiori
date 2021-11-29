sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/TestUtils",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Properties"
], function (Opa5, TestUtils, EnterText, Press, Properties) {
    "use strict";
    var sViewName = "FlexibleColumnLayout";
    Opa5.createPageObjects({
        onTheFclPage: {
            actions: {},
            assertions: {
                iShouldSeeFclLayout: function () {
                    return this.waitFor({
                        id: "fcl",
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