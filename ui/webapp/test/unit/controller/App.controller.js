/*global QUnit*/

sap.ui.define([
    "com/bosch/sbs/sbsfioritemplate/ui/controller/App.controller"
], function (Controller) {
	"use strict";

	QUnit.module("App Controller");

	QUnit.test("I should test the App controller onInit()", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
    });
    

    QUnit.test("I should test the App controller getLoginUserInfo()", function (assert) {
		var oAppController = new Controller();
		oAppController.getLoginUserInfo();
		assert.ok(oAppController);
    });

    QUnit.test("I should test the App controller onAfterRendering()", function (assert) {
		var oAppController = new Controller();
		oAppController.onAfterRendering();
		assert.ok(oAppController);
    });
    
    // QUnit.test("I should test the App controller onUserMenuDialogShow()", function (assert) {
	// 	var oAppController = new Controller();
	// 	oAppController.onUserMenuDialogShow();
	// 	assert.ok(oAppController);
    // });

});
