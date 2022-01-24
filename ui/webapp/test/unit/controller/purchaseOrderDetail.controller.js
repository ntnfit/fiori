sap.ui.define([
    "com/bosch/sbs/gng8hc/ui/controller/purchaseOrderDetail.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (purchaseOrderDetail,JSONModel,Controller) {
     "use strict";

    QUnit.module("PurchaseOrderDetailController");

    QUnit.test("I should test the PurchaseOrderMaster controller onInit()", function (assert) {
		var opurchaseOrderDetail = new purchaseOrderDetail();
		opurchaseOrderDetail.onInit();

		assert.ok(opurchaseOrderDetail);
    });
});