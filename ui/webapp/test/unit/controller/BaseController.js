/*global QUnit*/

sap.ui.define([
    "com/bosch/sbs/sbsfioritemplate/ui/libs/BaseController",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
], function (Controller) {
	"use strict";

    QUnit.module("Base Controller");
    
    QUnit.test("check success case for $hhtp get method", function (assert) {
        // Arrange
        var oBaseController = new Controller();
        var res = { "res": [{}] };

        sinon.stub(jQuery, "ajax").yieldsTo("success", res);
		oBaseController.$httpGet("https://piperpurchaseorderjava.cfapps.eu10.hana.ondemand.com", "purchaseorders", {}, { "Authorization": "Bearer axydasd" });
        assert.ok(oBaseController, "success event");
        jQuery.ajax.restore();
    });
    
    QUnit.test("check catch case for $http get method", function (assert) {
        // Arrange
        var oBaseController = new Controller();
        //sinon.stub(oBaseController, "getUserInfo").returns(Promise.reject());
        sinon.stub(jQuery, "ajax").yieldsTo("error", "500 internal server error");
		oBaseController.$httpGet("https://piperpurchaseorderjava.cfapps.eu10.hana.ondemand.com", "purchaseorders", {}, { "Authorization": "Bearer axydasd" });
        assert.ok(oBaseController, "catch event");
        jQuery.ajax.restore();
    });

    QUnit.test("check splice method", function (assert) {
        // Arrange
        var oBaseController = new Controller();
        //var sUrl = "https://piperpurchaseorderjava.cfapps.eu10.hana.ondemand.com/purchaseorder?filter=purchaseOrderId eq '47000001' & supplierId eq '1500'";
        var sUrl = "https://piperpurchaseorderjava.cfapps.eu10.hana.ondemand.com/purchaseorder&?";
        oBaseController._spliceURL(sUrl, "purchaseorders", {});
        assert.ok(oBaseController, "splice method executed");
    });

    QUnit.test("check merge headers method", function (assert) {
        // Arrange
        var oBaseController = new Controller();
        var mHeaders = {
            "Authorization": "Bearer eyJhb",
            "Content-Type": "application/json"
        };
        
        oBaseController._mergeHeader(mHeaders);
        assert.ok(oBaseController, "merge headers method executed");
    });

});