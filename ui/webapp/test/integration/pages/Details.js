sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/TestUtils",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Properties"
], function (Opa5, TestUtils, EnterText, Press, Properties) {
    "use strict";
    var sViewName = "purchaseOrderDetail";
    Opa5.createPageObjects({
        onTheDetailsPage: {

            actions: {
                iSelectCloseButton: function() {
                    return this.waitFor({
                        controlType: "sap.m.OverflowToolbarButton",
                        id: "closeTwoColumnBtn",
                        viewName: sViewName,
                        success: function(oControl) {
                            oControl.firePress();
                            Opa5.assert.ok(true, "Detail view close button is clicked");
                        }
                    })
                }
            },

            assertions: {
                iShouldSeeSelectedPurchaseOrderId: function (orderId) {
					return this.waitFor({
						controlType : "sap.m.Text",
						id : "detailPurchaseOrderTxt",
						success : function (oControl) {
							Opa5.assert.strictEqual(oControl.getText(), orderId);
						},
						viewName : sViewName
					});
                },
                iShouldNotSeeTheDetailView: function() {
                    return this.waitFor({
                        controlType: "sap.f.FlexibleColumnLayout",
                        id: "fcl",
                        viewName: "FlexibleColumnLayout",
                        success: function(oControl) {
                            Opa5.assert.strictEqual(oControl.getLayout(), "OneColumn");
                        }
                    });
                },
                iShouldShowOrderFromPattern: function() {
                    return this.waitFor({
                        controlType: "sap.m.Text",
                        id: "detailPurchaseOrderTxt",
                        viewName: sViewName,
                        success: function(oControl) {
                            var oModel = oControl.getModel("store");
                            if (oControl.getText()) {
                                oModel.setProperty("/detailId", oControl.getText());
                            }
                            Opa5.assert.ok(oControl.getText() !== null, "Purchase Order '" + oControl.getText() + "' is shown");
                        }
                    })
                }
            }
        }
    });

});