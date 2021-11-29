sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/TestUtils",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/actions/Press",
	"sap/ui/test/matchers/Properties"
], function (Opa5, TestUtils, EnterText, Press, Properties) {
	"use strict";
	var sViewName = "purchaseOrderMaster";
	Opa5.createPageObjects({
		onTheMasterPage: {

			actions: {
                iSelectPurchaseOrder: function(iRow) {
                    return this.waitFor({
						controlType : "sap.ui.table.Table",
                        id : "tableMaster",
						success : function (oControl) {
                            var oRow = oControl.getRows()[iRow];
                            var oCell = oRow.getCells()[0];
                            oCell.firePress();
							Opa5.assert.ok(true, "Item selected: " + oCell.getText());
						},
						viewName : sViewName
					});
                },
                iDoNotFindPurchaseOrder: function() {
                    return this.waitFor({
                        controlType: "sap.ui.table.Table",
                        id: "tableMaster",
                        viewName: sViewName,
                        success: function(oTable) {
                            var oRow = oTable.getRows()[1];
                            var oCell = oRow.getCells()[0];
                            oCell.firePress();
                            var oModel = oTable.getModel("store");
                            oModel.setProperty("/detailId", null);
                            Opa5.assert.ok(true, "Detail ID is set to null");
                        }
                    })
                }
            },

			assertions: {
                iShouldSeeTheMaster: function () {
					return this.waitFor({
                        id: "dynamicPage_purchaseOrder",
                        controlType: "sap.f.DynamicPage",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The " + sViewName + " view is displayed");
						},
						errorMessage: "Did not find the " + sViewName + " view"
					});
                },
                iShouldSeePurchaseOrderTableWithCount: function (iCount) {
					return this.waitFor({
						controlType : "sap.ui.table.Table",
						id : "tableMaster",
						success : function (oControl) {
							Opa5.assert.strictEqual(oControl.getRows().length, iCount);
						},
						viewName : sViewName
					});
                }
			}
		}
	});

});